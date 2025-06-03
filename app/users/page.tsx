import { getAllUsers } from '../actions/auth-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireAuth } from '../actions/auth-actions'
import Header from '../components/header'

export default async function UsersPage() {
  const user = await requireAuth()
  const users = await getAllUsers()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header user={user} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">User Management</h1>
          <p className="text-slate-600 text-base sm:text-lg">View all system users</p>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-slate-800">{user.username}</span>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {user.role}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>ID: {user.id}</p>
                  <p>Password: {user.password}</p>
                  <p>Created: {new Date(user.created_at).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 