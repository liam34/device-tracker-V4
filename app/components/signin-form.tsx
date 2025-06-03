"use client"

import { signIn } from "../actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { LogIn } from "lucide-react"

export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(signIn, null)

  return (
    <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl">
      <CardHeader className="text-center pb-4 sm:pb-6 p-4 sm:p-6">
        <CardTitle className="flex items-center justify-center gap-2 text-slate-800 text-lg sm:text-xl">
          <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          Welcome Back
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <form action={formAction} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-700 font-medium text-sm sm:text-base">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              required
              className="h-10 sm:h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg sm:rounded-xl text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium text-sm sm:text-base">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="h-10 sm:h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg sm:rounded-xl text-sm sm:text-base"
            />
          </div>

          {state?.error && (
            <div className="text-red-700 text-xs sm:text-sm bg-red-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-red-200 break-words">
              {state.error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium text-sm sm:text-base"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
