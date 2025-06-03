"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { query, queryOne } from "../lib/db"

export type User = {
  id: number
  username: string
  password: string
  role: "admin" | "user"
  created_at: string
}

export type AuthUser = {
  id: number
  username: string
  role: "admin" | "user"
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")
  if (!session) return null

  const user = await queryOne(
    `SELECT id, username, role FROM users WHERE id = $1`,
    [session.value]
  )
  return user as AuthUser || null
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/signin")
  }
  return user
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth()
  if (user.role !== "admin") {
    redirect("/")
  }
  return user
}

export async function signIn(prevState: any, formData: FormData) {
  const username = formData.get("username")
  const password = formData.get("password")

  if (!username || !password) {
    return {
      error: "Username and password are required",
    }
  }

  const user = await queryOne(
    `SELECT * FROM users WHERE username = $1 AND password = $2`,
    [username.toString(), password.toString()]
  )

  if (!user) {
    return {
      error: "Invalid username or password",
    }
  }

  const cookieStore = await cookies()
  cookieStore.set("session", user.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  redirect("/")
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/signin")
}

export async function getAllUsers(): Promise<User[]> {
  const users = await query(
    `SELECT * FROM users ORDER BY id`
  )
  return users as User[]
}

export async function updateUserPassword(username: string, newPassword: string) {
  try {
    const result = await query(
      `UPDATE users SET password = $1 WHERE username = $2 RETURNING username`,
      [newPassword, username]
    )
    
    if (result.length === 0) {
      return {
        success: false,
        error: "User not found"
      }
    }

    return {
      success: true,
      message: "Password updated successfully"
    }
  } catch (error) {
    console.error("Error updating password:", error)
    return {
      success: false,
      error: "Failed to update password"
    }
  }
}
