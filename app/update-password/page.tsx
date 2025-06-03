"use client"

import { updateUserPassword } from "../actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [adminPassword, setAdminPassword] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [status, setStatus] = useState<{ type: "success" | "error", message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)

    try {
      // Update admin password
      const adminResult = await updateUserPassword("admin", adminPassword)
      if (!adminResult.success) {
        throw new Error(adminResult.error)
      }

      // Update user password
      const userResult = await updateUserPassword("user", userPassword)
      if (!userResult.success) {
        throw new Error(userResult.error)
      }

      setStatus({
        type: "success",
        message: "Passwords updated successfully!"
      })

      // Clear form
      setAdminPassword("")
      setUserPassword("")
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update passwords"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">Update Passwords</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Admin Password</Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter new admin password"
                required
                minLength={8}
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                title="Password must be at least 8 characters long and contain both letters and numbers"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userPassword">User Password</Label>
              <Input
                id="userPassword"
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Enter new user password"
                required
                minLength={8}
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                title="Password must be at least 8 characters long and contain both letters and numbers"
              />
            </div>

            {status && (
              <div className={`p-3 rounded-lg ${
                status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {status.message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Passwords"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 