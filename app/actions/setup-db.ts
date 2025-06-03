'use server'

import { query } from '../lib/db'

export async function setupDatabase() {
  try {
    // Drop existing table if it exists
    await query('DROP TABLE IF EXISTS devices')

    // Create devices table
    await query(`
      CREATE TABLE IF NOT EXISTS devices (
        device_id VARCHAR(50) PRIMARY KEY,
        device_type VARCHAR(50) NOT NULL,
        building VARCHAR(100) NOT NULL,
        area VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Available',
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        assigned_to VARCHAR(100),
        notes TEXT
      )
    `)

    // Add device_type column if it doesn't exist
    await query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'devices' 
          AND column_name = 'device_type'
        ) THEN
          ALTER TABLE devices ADD COLUMN device_type VARCHAR(50);
          UPDATE devices SET device_type = type;
          ALTER TABLE devices ALTER COLUMN device_type SET NOT NULL;
          ALTER TABLE devices DROP COLUMN type;
        END IF;
      END $$;
    `)

    // Add test devices
    await query(`
      INSERT INTO devices (
        device_id,
        device_type,
        building,
        area,
        status,
        assigned_to,
        notes
      ) VALUES 
      ($1, $2, $3, $4, $5, $6, $7),
      ($8, $9, $10, $11, $12, $13, $14),
      ($15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (device_id) DO NOTHING
    `, [
      'TEST-001', 'Laptop', 'Main Building', 'IT Department', 'Available', 'John Doe', 'Test device for development',
      'TEST-002', 'Monitor', 'North Wing', 'Design Studio', 'In Use', 'Jane Smith', '24-inch 4K display',
      'TEST-003', 'Printer', 'South Wing', 'Admin Office', 'Maintenance', null, 'Needs toner replacement'
    ])

    return {
      success: true,
      message: 'Database setup completed successfully with test data'
    }
  } catch (error) {
    console.error('Error setting up database:', error)
    return {
      success: false,
      message: 'Failed to set up database',
      error: error instanceof Error ? error : String(error)
    }
  }
} 