"use server"

import { neon } from '@neondatabase/serverless'

export async function addTestDevice() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Check if test device already exists
    const existingDevice = await sql`
      SELECT * FROM devices WHERE device_id = 'TEST-001'
    `

    if (existingDevice.length > 0) {
      return {
        success: true,
        message: 'Test device already exists in the database.'
      }
    }

    // Add test device
    await sql`
      INSERT INTO devices (
        device_id,
        device_type,
        building,
        area,
        status,
        assigned_to,
        notes
      ) VALUES (
        'TEST-001',
        'Laptop',
        'Main Building',
        'IT Department',
        'Available',
        'John Doe',
        'Test device for development'
      )
    `
    
    return {
      success: true,
      message: 'Test device added successfully!'
    }
  } catch (error) {
    console.error('Error adding test device:', error)
    return {
      success: false,
      message: 'Failed to add test device.',
      error: error instanceof Error ? error : String(error)
    }
  }
} 