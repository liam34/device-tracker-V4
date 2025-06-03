import { getDevices } from "./actions/device-actions"
import { requireAuth } from "./actions/auth-actions"
import DeviceSearch from "./components/device-search"
import Header from "./components/header"
import { redirect } from "next/navigation"

export default async function HomePage() {
  try {
    const user = await requireAuth()
    const devices = await getDevices()

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header user={user} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Device Management</h1>
            <p className="text-slate-600 text-base sm:text-lg">Track and manage all your organization's devices</p>
          </div>

          <DeviceSearch devices={devices} user={user} />
        </div>
      </div>
    )
  } catch (error) {
    redirect("/signin")
  }
}
