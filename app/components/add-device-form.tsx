'use client'

import { createDevice } from '../actions/device-actions'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getDeviceById } from '../actions/device-actions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface FormState {
  success?: boolean
  message?: string
  error?: string
}

const initialState: FormState = {
  success: false,
  message: undefined,
  error: undefined
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Adding...' : 'Add Device'}
    </Button>
  )
}

export default function AddDeviceForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(createDevice, initialState)
  const [deviceId, setDeviceId] = useState('')
  const [deviceIdError, setDeviceIdError] = useState('')
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (state.error) {
      toast.error(state.error)
    } else if (state.success) {
      toast.success(state.message || 'Device added successfully')
      router.push('/')
    }
  }, [state, router])

  const checkDeviceId = async (id: string) => {
    if (!id) {
      setDeviceIdError('')
      return
    }

    setIsChecking(true)
    try {
      const device = await getDeviceById(id)
      if (device) {
        setDeviceIdError('Device ID already exists')
      } else {
        setDeviceIdError('')
      }
    } catch (error) {
      console.error('Error checking device ID:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleDeviceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDeviceId(value)
    checkDeviceId(value)
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="device_id">Device ID</Label>
        <Input
          id="device_id"
          name="device_id"
          required
          placeholder="Enter a unique device ID"
          value={deviceId}
          onChange={handleDeviceIdChange}
          className={deviceIdError ? 'border-red-500' : ''}
        />
        {isChecking && (
          <p className="text-sm text-gray-500">Checking availability...</p>
        )}
        {deviceIdError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{deviceIdError}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="device_type">Device Type</Label>
        <Input
          id="device_type"
          name="device_type"
          required
          placeholder="e.g., Laptop, Monitor, Printer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="building">Building</Label>
        <Input
          id="building"
          name="building"
          required
          placeholder="e.g., Main Building, North Wing"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Area</Label>
        <Input
          id="area"
          name="area"
          required
          placeholder="e.g., IT Department, Floor 2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue="Active">
          <SelectTrigger>
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
        <Label htmlFor="assigned_to">Assigned To</Label>
        <Input
          id="assigned_to"
          name="assigned_to"
          placeholder="e.g., John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Add any additional notes about the device"
          rows={4}
        />
      </div>

      <SubmitButton />
    </form>
  )
} 