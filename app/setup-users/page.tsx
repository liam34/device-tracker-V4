import { setupUsers } from '../actions/setup-users'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function SetupUsersPage() {
  const result = await setupUsers()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Setup Users</CardTitle>
        </CardHeader>
        <CardContent>
          {result.success ? (
            <div className="space-y-4">
              <p className="text-green-600">Users setup completed successfully!</p>
              <p className="text-sm text-gray-600">The following users have been created:</p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Admin: username: admin, password: Jlladmin2022</li>
                <li>User 1: username: user1, password: Jll1user2022</li>
                <li>User 2: username: user2, password: Jll2user2022</li>
              </ul>
              <Button asChild className="w-full">
                <a href="/signin">Go to Sign In</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-600">Failed to set up users</p>
              <p className="text-sm text-gray-600">{result.error}</p>
              <Button asChild className="w-full">
                <a href="/setup-users">Try Again</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 