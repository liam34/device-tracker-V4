// "use server"

// import { neon } from "@neondatabase/serverless"

// export async function setupDatabase() {
//   try {
//     const sql = neon(process.env.DATABASE_URL!)
    
//     // Create users table
//     await sql`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         username VARCHAR(255) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//       )
//     `

//     // Create index on username
//     await sql`
//       CREATE INDEX IF NOT EXISTS idx_username ON users(username)
//     `

//     // Create devices table
//     await sql`
//       CREATE TABLE IF NOT EXISTS devices (
//         id SERIAL PRIMARY KEY,
//         device_id VARCHAR(255) NOT NULL UNIQUE,
//         device_type VARCHAR(255) NOT NULL,
//         building VARCHAR(255) NOT NULL,
//         area VARCHAR(255) NOT NULL,
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//       )
//     `

//     // Create index on device_id
//     await sql`
//       CREATE INDEX IF NOT EXISTS idx_device_id ON devices(device_id)
//     `

//     // Check if admin user exists
//     const adminExists = await sql`
//       SELECT EXISTS (
//         SELECT 1 FROM users WHERE username = 'admin'
//       )
//     `

//     // If admin doesn't exist, create admin user
//     if (!adminExists[0].exists) {
//       await sql`
//         INSERT INTO users (username, password, role)
//         VALUES ('admin', 'admin123', 'admin')
//       `
//     }

//     // Check if regular user exists
//     const userExists = await sql`
//       SELECT EXISTS (
//         SELECT 1 FROM users WHERE username = 'user'
//       )
//     `

//     // If regular user doesn't exist, create one
//     if (!userExists[0].exists) {
//       await sql`
//         INSERT INTO users (username, password, role)
//         VALUES ('user', 'user123', 'user')
//       `
//     }

//     return { 
//       success: true, 
//       message: "Database setup completed successfully"
//     }
//   } catch (error) {
//     return { 
//       success: false, 
//       message: error instanceof Error ? error.message : "Failed to setup database",
//       error: error
//     }
//   }
// } 