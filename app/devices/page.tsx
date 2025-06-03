import { getDevices } from '../actions/device-actions'
import DeviceList from '../components/device-list'
import { getCurrentUser } from '../actions/auth-actions'
import { redirect } from 'next/navigation'

export default async function DevicesPage() {
  const devices = await getDevices()
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Devices</h1>
      <DeviceList devices={devices} user={user} />
    </div>
  )
} 