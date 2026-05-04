'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePartsRequests } from '../../contexts/parts-requests-context';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { requests, updateRequestStatus, getPendingCount, clearAllRequests } = usePartsRequests();

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz beep
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Web Audio API not supported or failed:', error);
    }
  };

  // Check for new pending requests and trigger notifications
  useEffect(() => {
    const newCount = getPendingCount();

    if (newCount > 0 && !hasPlayedSound) {
      // Play notification sound
      playNotificationSound();

      // Show alert dialog for new requests
      setShowAlertDialog(true);
      setHasPlayedSound(true);
    }

    setNewRequestsCount(newCount);
  }, [requests, hasPlayedSound, getPendingCount]);

  const handleApproveRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'approved', adminNotes || 'Approved - Available for pickup');
    setSelectedRequest(null);
    setAdminNotes('');
  };

  const handleRejectRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'rejected', adminNotes || 'Request rejected by admin');
    setSelectedRequest(null);
    setAdminNotes('');
  };

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    // Not signed in, redirect to login
    router.push('/login');
    return null;
  }

  const role = session.user?.role ?? null;

  // Role-based rendering
  if (role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-3">
                {newRequestsCount > 0 && (
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                    {newRequestsCount} New Request{newRequestsCount > 1 ? 's' : ''}
                  </span>
                )}
                <span className="text-sm text-gray-600">
                  Welcome, {session.user?.name}
                </span>
                <button
                  onClick={() => router.push('/api/auth/signout')}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-lg text-gray-700 mb-4">
                Manage parts requests from technicians
              </p>
            </div>

            {/* Parts Requests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Parts Requests</h2>
                <p className="text-sm text-gray-600">Review and manage technician parts requests</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Technician
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Part
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Urgency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.technicianName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.technicianEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getPartDisplayName(request.partType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.quantity} pcs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.requestTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            View
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => setSelectedRequest(request)}
                                className="text-green-600 hover:text-green-900 transition-colors"
                              >
                                Review
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Debug Panel */}
            <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Panel</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Current Data Status</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Total Requests:</strong> {requests.length}</p>
                    <p><strong>Pending:</strong> {requests.filter(r => r.status === 'pending').length}</p>
                    <p><strong>Approved:</strong> {requests.filter(r => r.status === 'approved').length}</p>
                    <p><strong>Rejected:</strong> {requests.filter(r => r.status === 'rejected').length}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        console.log('Current requests:', requests);
                        alert(`Current requests: ${JSON.stringify(requests, null, 2)}`);
                      }}
                      className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Log Current Data
                    </button>
                    <button
                      onClick={clearAllRequests}
                      className="w-full px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Clear All Requests
                    </button>
                  </div>
                </div>
              </div>

              {requests.length === 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>No requests yet.</strong> User submissions will appear here automatically.
                    Try submitting a parts request as a technician to see it appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alert Dialog for New Requests */}
        {showAlertDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12.21-8.164 8.09-14.827l-.162-.303m0 0l.162.303a17.926 17.926 0 01-1.417 2.684M4.868 12.683L12 3l7.132 9.683M12 3v18" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">New Parts Request</h3>
                    <p className="text-sm text-gray-500">
                      You have {newRequestsCount} pending request{newRequestsCount > 1 ? 's' : ''} to review
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAlertDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => setShowAlertDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Review Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Request Details - {selectedRequest.id}
                  </h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Technician</label>
                      <p className="text-sm text-gray-900">{selectedRequest.technicianName}</p>
                      <p className="text-sm text-gray-500">{selectedRequest.technicianEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Request Time</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedRequest.requestTime).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part Type</label>
                      <p className="text-sm text-gray-900">{getPartDisplayName(selectedRequest.partType)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <p className="text-sm text-gray-900">{selectedRequest.quantity} pieces</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Urgency</label>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(selectedRequest.urgency) === 'text-red-600 font-semibold' ? 'bg-red-100 text-red-800' : getUrgencyColor(selectedRequest.urgency) === 'text-blue-600' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {selectedRequest.urgency.charAt(0).toUpperCase() + selectedRequest.urgency.slice(1)}
                    </span>
                  </div>

                  {selectedRequest.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Technician Notes</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.notes}</p>
                    </div>
                  )}

                  {selectedRequest.adminNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                      <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        {selectedRequest.adminNotes}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  {selectedRequest.status === 'pending' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Notes (Optional)
                        </label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add notes for approval/rejection (e.g., pricing, availability, reasons)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleRejectRequest(selectedRequest.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                          Reject Request
                        </button>
                        <button
                          onClick={() => handleApproveRequest(selectedRequest.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        >
                          Approve Request
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular user dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              User Dashboard
            </h1>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name}
              </span>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          <p className="mb-6 text-lg text-gray-700">
            Submit repair requests and check their status
          </p>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Submit Repair Request Card */}
            <Link href="/submit-repair">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 10c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Submit Repair Request</h3>
                      <p className="text-sm text-gray-600">
                        Report a smartphone issue and get a repair estimate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* My Requests Card */}
            <Link href="/my-requests">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h5a2 2 0 002-2M9 5a2 2 0 012-2h5a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">My Requests</h3>
                      <p className="text-sm text-gray-600">
                        Track the status of your repair requests
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Check Parts Availability Card */}
            <Link href="/check-parts">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 12l2 2 4-4M7.5 21h9a2.5 2.5 0 002.5-2.5V12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Check Parts</h3>
                      <p className="text-sm text-gray-600">
                        Verify availability of repair parts before submission
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Contact Support Card */}
            <Link href="/contact-support">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M20.844 6.15a.924.924 0 00-.268-.41l-.28-1.028a1.14 1.14 0 00-1.018-.88H6.832a1.14 1.14 0 00-1.018.88l-.28 1.028a.924.924 0 00-.268.41M12 14l9-5-9-5-9 5 9 5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                      <p className="text-sm text-gray-600">
                        Get help with your repair requests or account issues
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}