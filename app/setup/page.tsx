import { setupDatabase } from '../actions/setup-db'

export default async function SetupPage() {
  const result = await setupDatabase()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Database Setup</h1>
        
        <div className={`p-4 rounded-lg ${
          result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <p className="font-medium">{result.message}</p>
          {!result.success && result.error && (
            <pre className="text-sm mt-2 overflow-auto">
              {result.error instanceof Error ? result.error.message : result.error}
            </pre>
          )}
        </div>

        {result.success && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold text-blue-800 mb-2">Default Users Created:</h2>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded border border-blue-100">
                  <p className="font-medium text-blue-900">Admin User</p>
                  <p className="text-sm text-blue-700">Username: admin</p>
                  <p className="text-sm text-blue-700">Password: admin123</p>
                </div>
                <div className="bg-white p-3 rounded border border-blue-100">
                  <p className="font-medium text-blue-900">Regular User</p>
                  <p className="text-sm text-blue-700">Username: user</p>
                  <p className="text-sm text-blue-700">Password: user123</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg">
              <h2 className="font-semibold text-emerald-800 mb-2">Database Tables Created:</h2>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded border border-emerald-100">
                  <p className="font-medium text-emerald-900">Users Table</p>
                  <p className="text-sm text-emerald-700">Stores user accounts and authentication</p>
                </div>
                <div className="bg-white p-3 rounded border border-emerald-100">
                  <p className="font-medium text-emerald-900">Devices Table</p>
                  <p className="text-sm text-emerald-700">Stores device information and tracking</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a 
                href="/test-data" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Test Device
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 