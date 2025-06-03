import { testConnection } from "../actions/test-connection"

export default async function TestPage() {
  const result = await testConnection()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Database Connection Test</h1>
        
        <div className={`p-4 rounded-lg ${
          result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <p className="font-medium">{result.message}</p>
          {result.success && result.timestamp && (
            <p className="text-sm mt-2">Timestamp: {result.timestamp.toString()}</p>
          )}
          {!result.success && result.error && (
            <pre className="text-sm mt-2 overflow-auto">
              {JSON.stringify(result.error, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
} 