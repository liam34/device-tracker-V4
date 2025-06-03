"use client"

import { useState, useMemo } from "react"
import type { Device } from "../actions/device-actions"
import type { AuthUser } from "../actions/auth-actions"
import DeviceList from "./device-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import Link from "next/link"

interface DeviceSearchProps {
  devices: Device[]
  user: AuthUser
}

export default function DeviceSearch({ devices, user }: DeviceSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDevices = useMemo(() => {
    if (!searchQuery.trim()) {
      return devices
    }

    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/)

    return devices.filter((device) => {
      // Create a string containing all searchable fields
      const searchableText = [
        device.device_id,
        device.device_type,
        device.building,
        device.area,
        device.status,
        device.assigned_to || '',
        device.notes || ''
      ].join(' ').toLowerCase()

      // Check if all search terms are found in any of the fields
      return searchTerms.every(term => searchableText.includes(term))
    })
  }, [devices, searchQuery])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search and Add Button Row */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="text"
              placeholder="Search by any combination of words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg sm:rounded-xl"
            />
          </div>
          {user.role === "admin" && (
            <Link href="/add" className="w-full sm:w-auto">
              <Button className="flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap h-10 sm:h-12 px-4 sm:px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                Add Device
              </Button>
            </Link>
          )}
        </div>

        {/* Search Results Info */}
        {searchQuery.trim() && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">
            <span className="break-words">
              {filteredDevices.length === 0
                ? "No devices found"
                : `Found ${filteredDevices.length} device${filteredDevices.length === 1 ? "" : "s"}`}
              {searchQuery.trim() && (
                <span className="ml-1">
                  for "<span className="font-medium text-slate-800 break-all">{searchQuery}</span>"
                </span>
              )}
            </span>
            {searchQuery.trim() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs sm:text-sm self-start sm:self-auto"
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Device List */}
      <DeviceList devices={filteredDevices} searchQuery={searchQuery} user={user} />
    </div>
  )
}
