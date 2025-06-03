import { requireAdmin } from '@/app/actions/auth-actions'
import AddDeviceForm from '@/app/components/add-device-form'
import Header from "@/app/components/header"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AddDevicePage() {
  const user = await requireAdmin()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header user={user} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <Link href="/">
            <Button variant="default" className="mb-4 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Devices
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Add New Device</h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">Fill in the details below to add a new device</p>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl sm:rounded-2xl">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">Add Device Details</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <AddDeviceForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
