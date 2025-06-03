'use client'

import { Device, updateDevice } from '../actions/device-actions'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface FormState {
  success?: boolean
  message?: string
  error?: string
}

interface EditDeviceFormProps {
  device: {
    device_id: string
    device_type: string
    building: string
    area: string
    status: string
    assigned_to?: string
    notes?: string
  }
}

const initialState: FormState = {
  success: false,
  message: undefined,
  error: undefined
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg sm:rounded-xl text-sm sm:text-base"
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}

export default function EditDeviceForm({ device }: EditDeviceFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(updateDevice, initialState)

  useEffect(() => {
    if (state.error) {
      toast.error(state.error)
    } else if (state.success) {
      toast.success(state.message || 'Device updated successfully')
      router.push('/')
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-4 sm:space-y-6">
      <input type="hidden" name="old_device_id" value={device.device_id} />
      
      <div className="space-y-2">
        <Label htmlFor="device_id" className="text-sm font-medium text-gray-700">Device ID</Label>
        <Input
          id="device_id"
          name="device_id"
          required
          defaultValue={device.device_id}
          placeholder="Enter device ID"
          className="h-10 sm:h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="device_type" className="text-sm font-medium text-gray-700">Device Type</Label>
        <Input
          id="device_type"
          name="device_type"
          required
          defaultValue={device.device_type}
          placeholder="e.g., Laptop, Monitor, Printer"
          className="h-10 sm:h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="building" className="text-sm font-medium text-gray-700">Building</Label>
        <Input
          id="building"
          name="building"
          required
          defaultValue={device.building}
          placeholder="e.g., Main Building, North Wing"
          className="h-10 sm:h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="area" className="text-sm font-medium text-gray-700">Area</Label>
        <Input
          id="area"
          name="area"
          required
          defaultValue={device.area}
          placeholder="e.g., IT Department, Floor 2"
          className="h-10 sm:h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
        <Select name="status" defaultValue={device.status}>
          <SelectTrigger className="h-10 sm:h-12 text-base">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Offline">Offline</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigned_to" className="text-sm font-medium text-gray-700">Assigned To</Label>
        <Input
          id="assigned_to"
          name="assigned_to"
          defaultValue={device.assigned_to}
          placeholder="e.g., John Doe"
          className="h-10 sm:h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={device.notes}
          placeholder="Add any additional notes about the device"
          rows={4}
          className="text-base resize-none"
        />
      </div>

      <div className="pt-4 border-t">
        <SubmitButton />
      </div>
    </form>
  )
} 