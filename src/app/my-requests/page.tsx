'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePartsRequests } from "../../contexts/parts-requests-context";

export default function MyRequestsPage() {
  const { data: session } = useSession();
  const { requests } = usePartsRequests();

  // Filter requests for current user
  const userRequests = requests.filter(
    request => request.technicianEmail === session?.user?.email
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 font-semibold';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getPartDisplayName = (partType: string) => {
    const parts: { [key: string]: string } = {
      'screen-iphone': 'iPhone Screen Assembly',
      'screen-samsung': 'Samsung Screen Assembly',
      'screen-google': 'Google Pixel Screen',
      'backpanel-iphone': 'iPhone Back Panel/Frame',
      'backpanel-samsung': 'Samsung Back Panel',
      'battery': 'Battery',
      'charging-port': 'Charging Port Assembly',
      'speaker': 'Speaker Assembly',
      'camera': 'Camera Module',
      'motherboard': 'Motherboard',
      'other': 'Other Parts',
    };
    return parts[partType] || partType;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Harsh Telecom - My Parts Requests
            </h1>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {userRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No Parts Requests Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  You haven&apos;t submitted any parts requests yet. Start by requesting parts for your repairs at Harsh Telecom.
                </p>
                <Link
                  href="/submit-repair"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Parts Request
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Parts Requests ({userRequests.length})
                  </h2>
                  <Link
                    href="/submit-repair"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + New Request
                  </Link>
                </div>

                <div className="space-y-4">
                  {userRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {getPartDisplayName(request.partType)}
                            </h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Quantity: {request.quantity} pcs • Urgency: <span className={getUrgencyColor(request.urgency)}>{request.urgency}</span>
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(request.requestTime).toLocaleString()}
                        </div>
                      </div>

                      {request.notes && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-700">
                            <strong>Your notes:</strong> {request.notes}
                          </p>
                        </div>
                      )}

                      {request.adminNotes && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Admin response:</strong> {request.adminNotes}
                          </p>
                          {request.approvedTime && (
                            <p className="text-xs text-blue-600 mt-1">
                              Responded on {new Date(request.approvedTime).toLocaleString()}
                            </p>
                          )}
                          {request.rejectedTime && (
                            <p className="text-xs text-red-600 mt-1">
                              Rejected on {new Date(request.rejectedTime).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 font-mono">
                        Request ID: {request.id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Legend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Request Status Guide</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>
                    <span>Pending - Awaiting admin review</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
                    <span>Approved - Ready for pickup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 bg-red-400 rounded-full"></span>
                    <span>Rejected - See admin notes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 bg-blue-400 rounded-full"></span>
                    <span>Delivered - Request completed</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}