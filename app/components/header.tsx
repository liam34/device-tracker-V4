"use client"

import { signOut, type AuthUser } from "../actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Shield, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface HeaderProps {
  user: AuthUser
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      try {
        await signOut()
        router.push("/signin")
      } catch (error) {
        console.error("Sign out error:", error)
        router.push("/signin")
      }
    }
  }

  return (
    <header className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DT</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Device Tracker</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
              {user.role === "admin" ? (
                <Shield className="h-4 w-4 text-emerald-600" />
              ) : (
                <User className="h-4 w-4 text-slate-600" />
              )}
              <span className="text-sm font-medium text-slate-700">{user.username}</span>
              <Badge
                variant={user.role === "admin" ? "default" : "secondary"}
                className={
                  user.role === "admin"
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-700"
                }
              >
                {user.role}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-white hover:bg-red-50 border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">DT</span>
              </div>
              <h1 className="text-lg font-bold text-slate-800">Device Tracker</h1>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mt-4 p-4 bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                {user.role === "admin" ? (
                  <Shield className="h-4 w-4 text-emerald-600" />
                ) : (
                  <User className="h-4 w-4 text-slate-600" />
                )}
                <span className="text-sm font-medium text-slate-700">{user.username}</span>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={user.role === "admin" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}
                >
                  {user.role}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
