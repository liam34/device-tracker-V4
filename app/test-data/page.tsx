import { addTestDevice } from "../actions/test-data"
import { redirect } from 'next/navigation'

interface TestResult {
  success: boolean
  message: string
  error?: Error | string
}

export default async function TestDataPage() {
  const result = await addTestDevice() as TestResult

  // If successful, redirect to the devices page
  if (result.success) {
    redirect('/devices')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Add Test Device</h1>
        
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

        {!result.success && (
          <div className="mt-6">
            <a 
              href="/setup" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Setup
            </a>
          </div>
        )}
      </div>
    </div>
  )
} 