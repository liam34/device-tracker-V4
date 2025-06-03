import { getCurrentUser } from "../actions/auth-actions"
import SignInForm from "../components/signin-form"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg sm:text-xl">DT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Device Tracker</h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">Sign in to manage your devices</p>
        </div>

        <SignInForm />
      </div>
    </div>
  )
}
