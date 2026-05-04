'use client';

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePartsRequests } from "../../contexts/parts-requests-context";

export default function SubmitRepairPage() {
  const { data: session } = useSession();
  const { addRequest } = usePartsRequests();
  const [formData, setFormData] = useState({
    partType: '',
    quantity: 1,
    urgency: 'normal',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add request to global state
      const newRequest = {
        technicianName: session?.user?.name || 'Unknown',
        technicianEmail: session?.user?.email || '',
        partType: formData.partType,
        quantity: formData.quantity,
        urgency: formData.urgency as 'low' | 'normal' | 'urgent',
        notes: formData.notes,
      };

      addRequest(newRequest);

      // Generate request ID for confirmation
      const id = 'PRT-' + Date.now().toString().slice(-8);
      setRequestId(id);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="px-4 py-8 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Parts Request Submitted!
                </h2>
                <p className="text-gray-600 mb-4">
                  Your parts request has been sent to admin for approval.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>Request ID:</strong> <span className="font-mono text-blue-600">{requestId}</span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Status:</strong> <span className="text-orange-600 font-medium">Pending Admin Approval</span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Estimated Response:</strong> Within 2-4 hours
                  </p>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/my-requests"
                    className="block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    View My Requests
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="px-4 py-8 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Request Parts
            </h1>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Technician Info */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Requesting Technician: {session?.user?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Part Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🔧</span>
                Part Selection
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="partType" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Part *
                  </label>
                  <select
                    id="partType"
                    name="partType"
                    required
                    value={formData.partType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Choose a part...</option>
                    <optgroup label="Display & Screen">
                      <option value="screen-iphone">iPhone Screen Assembly</option>
                      <option value="screen-samsung">Samsung Screen Assembly</option>
                      <option value="screen-google">Google Pixel Screen</option>
                      <option value="digitizer">Digitizer/Touch Panel</option>
                    </optgroup>
                    <optgroup label="Housing & Frames">
                      <option value="backpanel-iphone">iPhone Back Panel/Frame</option>
                      <option value="backpanel-samsung">Samsung Back Panel</option>
                      <option value="midframe">Mid Frame/Chassis</option>
                      <option value="front-glass">Front Glass Only</option>
                    </optgroup>
                    <optgroup label="Components">
                      <option value="battery">Battery</option>
                      <option value="charging-port">Charging Port Assembly</option>
                      <option value="speaker">Speaker Assembly</option>
                      <option value="camera">Camera Module</option>
                      <option value="motherboard">Motherboard</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option value="adhesive">Display Adhesive</option>
                      <option value="tools">Special Tools</option>
                      <option value="cables">Ribbon Cables</option>
                      <option value="other">Other (specify in notes)</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      required
                      min="1"
                      max="50"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400 text-sm">pcs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgency Level */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Urgency Level
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  formData.urgency === 'low'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="urgency"
                    value="low"
                    checked={formData.urgency === 'low'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">🟢</div>
                    <div className="font-medium text-gray-900">Low</div>
                    <div className="text-sm text-gray-600">Next order cycle</div>
                  </div>
                </label>

                <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  formData.urgency === 'normal'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="urgency"
                    value="normal"
                    checked={formData.urgency === 'normal'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔵</div>
                    <div className="font-medium text-gray-900">Normal</div>
                    <div className="text-sm text-gray-600">Standard delivery</div>
                  </div>
                </label>

                <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  formData.urgency === 'urgent'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="urgency"
                    value="urgent"
                    checked={formData.urgency === 'urgent'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔴</div>
                    <div className="font-medium text-gray-900">Urgent</div>
                    <div className="text-sm text-gray-600">Expedited delivery</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📝</span>
                Additional Notes
              </h2>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Any specific requirements, model compatibility, or additional information for the admin..."
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Request...
                  </span>
                ) : (
                  'Submit Parts Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}