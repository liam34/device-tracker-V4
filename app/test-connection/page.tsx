import { testConnection } from '../actions/test-connection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function TestConnectionPage() {
  const result = await testConnection()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          {result.success ? (
            <div className="space-y-4">
              <p className="text-green-600">Connection successful!</p>
              <p className="text-sm text-gray-600">
                Current database timestamp: {new Date(result.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Your database connection is working properly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-600">Connection failed</p>
              <p className="text-sm text-gray-600">Error: {result.error}</p>
              <p className="text-sm text-gray-600">Please check your DATABASE_URL in the .env file.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 