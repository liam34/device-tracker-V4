const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testPrismaConnection() {
  try {
    console.log('Testing Prisma connection to AWS RDS...')
    
    // Test the connection by querying the database version
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('\nConnection successful!')
    console.log('PostgreSQL Version:', result[0].version)

    // Test creating a device
    console.log('\nTesting device creation...')
    const device = await prisma.device.create({
      data: {
        deviceId: 'TEST-' + Date.now(),
        deviceType: 'Test Device',
        building: 'Test Building',
        area: 'Test Area',
        status: 'Available',
        notes: 'Test device created by Prisma'
      }
    })
    console.log('Successfully created test device:', device)

    // Clean up test device
    await prisma.device.delete({
      where: {
        deviceId: device.deviceId
      }
    })
    console.log('\nTest device cleaned up successfully')

  } catch (error) {
    console.error('\nError:', error.message)
    if (error.code) {
      console.error('Error code:', error.code)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testPrismaConnection() 