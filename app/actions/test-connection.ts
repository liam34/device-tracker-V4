"use server"

import { pool } from "../lib/db"

export async function testConnection() {
  try {
    // Get client from pool
    const client = await pool.connect()
    
    try {
      // Test the connection by running a simple query
      const result = await client.query('SELECT current_timestamp, version()')
      
      return { 
        success: true, 
        message: "Database connection successful",
        timestamp: result.rows[0].current_timestamp,
        version: result.rows[0].version,
        connectionInfo: {
          host: pool.options.host,
          port: pool.options.port,
          database: pool.options.database,
          user: pool.options.user
        }
      }
    } finally {
      // Release the client back to the pool
      client.release()
    }
  } catch (error) {
    console.error('Database connection error:', error)
    return { 
      success: false, 
      message: "Database connection failed",
      error: error instanceof Error ? error.message : String(error),
      connectionInfo: {
        host: pool.options.host,
        port: pool.options.port,
        database: pool.options.database,
        user: pool.options.user
      }
    }
  }
} 