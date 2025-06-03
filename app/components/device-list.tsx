"use client"

import { type Device, deleteDevice } from "../actions/device-actions"
import type { AuthUser } from "../actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Monitor, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState } from "react"

interface DeviceListProps {
  devices: Device[]
  searchQuery?: string
  user: AuthUser
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 px-1 rounded text-yellow-900">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export default function DeviceList({ devices, searchQuery = "", user }: DeviceListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (deviceId: string) => {
    if (confirm("Are you sure you want to delete this device?")) {
      setDeletingId(deviceId)
      try {
        await deleteDevice(deviceId)
      } catch (error) {
        console.error("Failed to delete device:", error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (devices.length === 0) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
          </div>
          {searchQuery.trim() ? (
            <>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 text-center">No devices found</h3>
              <p className="text-slate-600 mb-4 sm:mb-6 text-center max-w-md text-sm sm:text-base">
                No devices match your search criteria. Try adjusting your search terms.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 text-center">No devices found</h3>
              <p className="text-slate-600 mb-4 sm:mb-6 text-center max-w-md text-sm sm:text-base">
                {user.role === "admin" ? "Get started by adding your first device." : "No devices available to view."}
              </p>
              {user.role === "admin" && (
                <Link href="/add">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg sm:rounded-xl">
                    Add Device
                  </Button>
                </Link>
              )}
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 shadow-sm rounded-xl sm:rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl text-slate-800">Devices ({devices.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile View - Stacked Cards */}
        <div className="block sm:hidden">
          {devices.map((device) => (
            <div key={device.device_id} className="border-b border-slate-100 last:border-b-0 p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 text-sm break-words">
                    {highlightText(device.device_id, searchQuery)}
                  </h3>
                  <Badge className="mt-1 bg-gradient-to-r from-emerald-100 to-blue-100 text-slate-700 border-0 text-xs font-bold">
                    {highlightText(device.device_type, searchQuery)}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.role === "admin" ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href={`/edit/${device.device_id}`} className="flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(device.device_id)}
                          disabled={deletingId === device.device_id}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deletingId === device.device_id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link href={`/view/${device.device_id}`} className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div>
                  <span className="font-medium">Building:</span>{" "}
                  <span className="font-bold">{highlightText(device.building, searchQuery)}</span>
                </div>
                <div>
                  <span className="font-medium">Area:</span>{" "}
                  <span className="font-bold">{highlightText(device.area, searchQuery)}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge className={`ml-1 border-0 text-xs font-bold ${
                    device.status === "Active" 
                      ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700"
                      : device.status === "Offline"
                      ? "bg-gradient-to-r from-red-100 to-rose-100 text-red-700"
                      : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700"
                  }`}>
                    {highlightText(device.status, searchQuery)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700 text-sm">Device ID</th>
                <th className="text-left p-4 font-semibold text-slate-700 text-sm">Type</th>
                <th className="text-left p-4 font-semibold text-slate-700 text-sm">Building</th>
                <th className="text-left p-4 font-semibold text-slate-700 text-sm">Area</th>
                <th className="text-left p-4 font-semibold text-slate-700 text-sm">Status</th>
                <th className="text-right p-4 font-semibold text-slate-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr
                  key={device.device_id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-25"
                  }`}
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-800 break-words">
                      {highlightText(device.device_id, searchQuery)}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className="bg-gradient-to-r from-emerald-100 to-blue-100 text-slate-700 border-0 text-xs font-bold">
                      {highlightText(device.device_type, searchQuery)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-600 break-words font-bold">
                      {highlightText(device.building, searchQuery)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-600 break-words font-bold">
                      {highlightText(device.area, searchQuery)}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge className={`border-0 text-xs font-bold ${
                      device.status === "Active" 
                        ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700"
                        : device.status === "Offline"
                        ? "bg-gradient-to-r from-red-100 to-rose-100 text-red-700"
                        : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700"
                    }`}>
                      {highlightText(device.status, searchQuery)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {user.role === "admin" ? (
                        <>
                          <Link href={`/edit/${device.device_id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-lg text-xs"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(device.device_id)}
                            disabled={deletingId === device.device_id}
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 rounded-lg text-xs"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {deletingId === device.device_id ? "..." : "Delete"}
                          </Button>
                        </>
                      ) : (
                        <Link href={`/view/${device.device_id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-lg text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
