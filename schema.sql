-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(50) PRIMARY KEY CHECK (device_id ~ '^[A-Za-z0-9-]+$'), -- Allows letters, numbers, and hyphens
    device_type VARCHAR(50) NOT NULL,
    building VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_to VARCHAR(100),
    notes TEXT
);

-- Add comment to explain device_id format
COMMENT ON COLUMN devices.device_id IS 'Device ID can contain letters, numbers, and hyphens (e.g., ABC-123, DEV-456)';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_device_id ON devices(device_id);
CREATE INDEX IF NOT EXISTS idx_device_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_device_assigned_to ON devices(assigned_to); 