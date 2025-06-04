"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "./auth-actions"
import { query, queryOne } from "../lib/db"

export interface Device {
  device_id: string
  device_type: string
  building: string
  area: string
  status: string
  last_updated: string
  assigned_to?: string
  notes?: string
}

export async function getDevices(): Promise<Device[]> {
  const devices = await query(
    `SELECT * FROM devices ORDER BY last_updated DESC`
  )
  return devices as Device[]
}

export async function getDeviceById(deviceId: string): Promise<Device | null> {
  try {
    if (!deviceId) {
      return null
    }

    const device = await queryOne(
      `SELECT * FROM devices WHERE device_id = $1`,
      [deviceId.trim()]
    )
    return device as Device || null
  } catch (error) {
    console.error('Error getting device by ID:', error)
    return null
  }
}

interface FormState {
  success?: boolean
  message?: string
  error?: string
}

export async function createDevice(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin()
    
    const deviceId = formData.get('device_id')
    const deviceType = formData.get('device_type')
    const building = formData.get('building')
    const area = formData.get('area')
    const status = formData.get('status') || 'Available'
    const assignedTo = formData.get('assigned_to')
    const notes = formData.get('notes')

    if (!deviceId || !deviceType || !building || !area) {
      return { 
        success: false,
        error: 'All fields are required' 
      }
    }

    // Check if device ID already exists
    const existingDevice = await queryOne(
      `SELECT device_id FROM devices WHERE device_id = $1`,
      [deviceId.toString()]
    )

    if (existingDevice) {
      return { 
        success: false,
        error: 'A device with this ID already exists. Please use a different device ID.'
      }
    }

    await query(
      `INSERT INTO devices (
        device_id,
        device_type,
        building,
        area,
        status,
        assigned_to,
        notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        deviceId.toString(),
        deviceType.toString(),
        building.toString(),
        area.toString(),
        status.toString(),
        assignedTo?.toString() || null,
        notes?.toString() || null
      ]
    )

    revalidatePath('/')
    return { 
      success: true, 
      message: 'Device created successfully' 
    }
  } catch (error) {
    console.error('Error creating device:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create device'
    }
  }
}

export async function updateDevice(prevState: any, formData: FormData) {
  try {
    await requireAdmin()
    
    const newDeviceId = formData.get('device_id')
    const deviceType = formData.get('device_type')
    const building = formData.get('building')
    const area = formData.get('area')
    const status = formData.get('status')
    const assignedTo = formData.get('assigned_to')
    const notes = formData.get('notes')
    const oldDeviceId = formData.get('old_device_id')

    if (!newDeviceId || !deviceType || !building || !area || !oldDeviceId) {
      return { 
        success: false,
        error: 'All fields are required' 
      }
    }

    // If device ID is being changed, check if the new ID already exists
    if (newDeviceId.toString() !== oldDeviceId.toString()) {
      const existingDevice = await queryOne(
        `SELECT device_id FROM devices WHERE device_id = $1`,
        [newDeviceId.toString()]
      )

      if (existingDevice) {
        return { 
          success: false,
          error: 'A device with this ID already exists. Please use a different device ID.'
        }
      }
    }

    // Update the device
    await query(
      `UPDATE devices 
      SET 
        device_id = $1,
        device_type = $2,
        building = $3,
        area = $4,
        status = $5,
        assigned_to = $6,
        notes = $7,
        last_updated = NOW()
      WHERE device_id = $8`,
      [
        newDeviceId.toString(),
        deviceType.toString(),
        building.toString(),
        area.toString(),
        status?.toString() || 'Available',
        assignedTo?.toString() || null,
        notes?.toString() || null,
        oldDeviceId.toString()
      ]
    )

    revalidatePath('/')
    return { success: true, message: 'Device updated successfully' }
  } catch (error) {
    console.error('Error updating device:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update device'
    }
  }
}

export async function deleteDevice(deviceId: string) {
  try {
    await requireAdmin()
    
    await query(
      `DELETE FROM devices WHERE device_id = $1`,
      [deviceId]
    )
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting device:', error)
    return { success: false, error: String(error) }
  }
}

export async function updateDeviceStatus(deviceId: string, status: string) {
  try {
    await requireAdmin()
    
    await query(
      `UPDATE devices
      SET status = $1,
          last_updated = NOW()
      WHERE device_id = $2`,
      [status, deviceId]
    )
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error updating device status:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update device status'
    }
  }
}

export async function assignDevice(deviceId: string, assignedTo: string) {
  try {
    await requireAdmin()
    
    await query(
      `UPDATE devices
      SET assigned_to = $1,
          status = 'Assigned',
          last_updated = NOW()
      WHERE device_id = $2`,
      [assignedTo, deviceId]
    )
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error assigning device:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to assign device'
    }
  }
}

export async function unassignDevice(deviceId: string) {
  try {
    await requireAdmin()
    
    await query(
      `UPDATE devices
      SET assigned_to = NULL,
          status = 'Available',
          last_updated = NOW()
      WHERE device_id = $1`,
      [deviceId]
    )
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error unassigning device:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to unassign device'
    }
  }
}
