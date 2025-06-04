import { getDevices } from '../actions/device-actions'
import DeviceList from '../components/device-list'
import { getCurrentUser } from '../actions/auth-actions'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Card, CardContent } from "@/components/ui/card"

// Mark this page as dynamic to prevent prerendering issues
export const dynamic = 'force-dynamic'

export default async function DevicesPage() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      redirect('/login')
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Devices</h1>
        <Suspense fallback={
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-600">Loading devices...</p>
            </CardContent>
          </Card>
        }>
          <DevicesList user={user} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error in DevicesPage:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Devices</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading devices. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}

async function DevicesList({ user }: { user: any }) {
  try {
    const devices = await getDevices()
    return <DeviceList devices={devices} user={user} />
  } catch (error) {
    console.error('Error loading devices:', error)
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Error loading devices. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }
} 