import { getDeviceById } from "../../actions/device-actions"
import { requireAuth } from "../../actions/auth-actions"
import Header from "../../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Monitor, Building, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

interface ViewDevicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ViewDevicePage({ params }: ViewDevicePageProps) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params
    
    // Ensure id is available and properly decoded
    const deviceId = decodeURIComponent(id || '')
    if (!deviceId) {
      notFound()
    }

    const user = await requireAuth()
    const device = await getDeviceById(deviceId)

    if (!device) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header user={user} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-2xl">
          <div className="mb-6 sm:mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4 text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Devices
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Device Details</h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">View device information</p>
          </div>

          <Card className="border-slate-200 shadow-sm rounded-xl sm:rounded-2xl">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <CardTitle className="text-xl sm:text-2xl break-words min-w-0">{device.device_id}</CardTitle>
                <Badge variant="secondary" className="text-sm self-start sm:self-auto shrink-0">
                  {device.device_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              <div className="grid gap-3 sm:gap-4">
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Device Type</p>
                    <p className="text-base sm:text-lg break-words">{device.device_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Building className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Building</p>
                    <p className="text-base sm:text-lg break-words">{device.building}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Area</p>
                    <p className="text-base sm:text-lg break-words">{device.area}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Last Updated</p>
                    <p className="text-base sm:text-lg">{new Date(device.last_updated).toLocaleString()}</p>
                  </div>
                </div>

                {device.assigned_to && (
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Assigned To</p>
                      <p className="text-base sm:text-lg break-words">{device.assigned_to}</p>
                    </div>
                  </div>
                )}

                {device.notes && (
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Notes</p>
                      <p className="text-base sm:text-lg break-words">{device.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {user.role === "admin" && (
                <div className="flex gap-4 pt-4 border-t">
                  <Link href={`/edit/${device.device_id}`} className="flex-1">
                    <Button className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg sm:rounded-xl text-sm sm:text-base">
                      Edit Device
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in ViewDevicePage:', error)
    notFound()
  }
}
