import Link from "next/link";

export default function MyRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              My Repair Requests
            </h1>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Request History
              </h2>
              <p className="text-gray-600 mb-6">
                Track all your repair requests, view status updates, and communicate with our technicians.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-2">Features coming:</h3>
                <ul className="text-sm text-gray-600 text-left space-y-1">
                  <li>• View all submitted requests</li>
                  <li>• Real-time status updates</li>
                  <li>• Technician notes and updates</li>
                  <li>• Repair cost estimates</li>
                  <li>• Completion notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}