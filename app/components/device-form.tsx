"use client"

import { createDevice, updateDevice, type Device } from "../actions/device-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface DeviceFormProps {
  device?: Device
}

export default function DeviceForm({ device }: DeviceFormProps) {
  const isEditing = !!device
  const router = useRouter()

  const action = isEditing ? updateDevice.bind(null, device.id) : createDevice

  const [state, formAction, isPending] = useActionState(action, null)

  // Handle successful form submission
  useEffect(() => {
    if (state?.success) {
      // Small delay to show success message, then redirect
      const timer = setTimeout(() => {
        router.push("/")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state?.success, router])

  return (
    <Card className="border-slate-200 shadow-sm rounded-xl sm:rounded-2xl">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">{isEditing ? "Edit Device" : "Add New Device"}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <form action={formAction} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="device_id" className="text-sm sm:text-base font-medium">
              Device ID
            </Label>
            <Input
              id="device_id"
              name="device_id"
              placeholder="Enter device ID (e.g., DEV001)"
              defaultValue={device?.device_id || ""}
              required
              disabled={isPending || state?.success}
              className="h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="device_type" className="text-sm sm:text-base font-medium">
              Device Type
            </Label>
            <Input
              id="device_type"
              name="device_type"
              placeholder="Enter device type (e.g., Laptop, Printer)"
              defaultValue={device?.device_type || ""}
              required
              disabled={isPending || state?.success}
              className="h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="building" className="text-sm sm:text-base font-medium">
              Building
            </Label>
            <Input
              id="building"
              name="building"
              placeholder="Enter building (e.g., Building A)"
              defaultValue={device?.building || ""}
              required
              disabled={isPending || state?.success}
              className="h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area" className="text-sm sm:text-base font-medium">
              Area
            </Label>
            <Input
              id="area"
              name="area"
              placeholder="Enter area (e.g., Office 101)"
              defaultValue={device?.area || ""}
              required
              disabled={isPending || state?.success}
              className="h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl"
            />
          </div>

          {state?.error && (
            <div className="text-red-600 text-xs sm:text-sm bg-red-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-red-200 break-words">
              Error: {state.error}
            </div>
          )}

          {state?.success && (
            <div className="text-green-600 text-xs sm:text-sm bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200 break-words">
              {state.message} Redirecting...
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <Button
              type="submit"
              disabled={isPending || state?.success}
              className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg sm:rounded-xl text-sm sm:text-base disabled:opacity-50"
            >
              {state?.success
                ? "Success!"
                : isPending
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                    ? "Update Device"
                    : "Add Device"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
