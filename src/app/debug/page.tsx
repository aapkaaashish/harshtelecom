import Link from "next/link";

export default function DebugPage() {
  const envVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '***SET***' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Debug Information
            </h1>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Environment Variables
            </h2>
            <div className="space-y-4">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    value && value !== 'NOT SET'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {value || 'NOT SET'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">NextAuth Configuration</h3>
              <p className="text-sm text-blue-800">
                For authentication to work properly, make sure these environment variables are set in your Kilo deployment:
              </p>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• <code>NEXTAUTH_URL</code> = https://early-meadow-6216.d.kiloapps.io</li>
                <li>• <code>NEXTAUTH_SECRET</code> = A secure random string</li>
              </ul>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Login Again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}