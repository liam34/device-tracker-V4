import { notFound } from 'next/navigation'
import { requireAdmin } from '@/app/actions/auth-actions'
import { getDeviceById } from '@/app/actions/device-actions'
import EditDeviceForm from '../../components/edit-device-form'
import Header from "../../components/header"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface EditDevicePageProps {
  params: Promise<{
    id: string
  }>
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function EditDevicePage({ params, searchParams }: EditDevicePageProps) {
  try {
    const { id } = await params
    if (!id) {
      notFound()
    }

    const user = await requireAdmin()
    const device = await getDeviceById(id)

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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Edit Device</h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">Update the device information below</p>
          </div>

          <Card className="border-slate-200 shadow-sm rounded-xl sm:rounded-2xl">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">Edit Device Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <EditDeviceForm device={device || { 
                device_id: id,
                device_type: '',
                building: '',
                area: '',
                status: 'Available',
                assigned_to: '',
                notes: ''
              }} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in EditDevicePage:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-2xl">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              An error occurred while loading the device. Please try again later.
            </AlertDescription>
          </Alert>
          <Link href="/">
            <Button variant="default" className="text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Devices
            </Button>
          </Link>
        </div>
      </div>
    )
  }
}
