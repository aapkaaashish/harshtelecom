'use client';

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function SubmitRepairPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    deviceBrand: '',
    deviceModel: '',
    issueType: '',
    issueDescription: '',
    priority: 'normal',
    customerName: '',
    customerPhone: '',
    customerEmail: session?.user?.email || '',
    photos: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, photos: Array.from(e.target.files!) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate a mock request ID
    const id = 'REQ-' + Date.now().toString().slice(-8);
    setRequestId(id);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Repair Request Submitted!
                </h2>
                <p className="text-gray-600 mb-4">
                  Your repair request has been successfully submitted.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    <strong>Request ID:</strong> {requestId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Estimated Response:</strong> Within 24 hours
                  </p>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/my-requests"
                    className="block w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/80 transition-colors"
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
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Submit Repair Request
            </h1>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Device Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Device Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="deviceBrand" className="block text-sm font-medium text-gray-700 mb-2">
                    Device Brand *
                  </label>
                  <select
                    id="deviceBrand"
                    name="deviceBrand"
                    required
                    value={formData.deviceBrand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Brand</option>
                    <option value="apple">Apple</option>
                    <option value="samsung">Samsung</option>
                    <option value="google">Google</option>
                    <option value="huawei">Huawei</option>
                    <option value="xiaomi">Xiaomi</option>
                    <option value="oneplus">OnePlus</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="deviceModel" className="block text-sm font-medium text-gray-700 mb-2">
                    Device Model *
                  </label>
                  <input
                    type="text"
                    id="deviceModel"
                    name="deviceModel"
                    required
                    placeholder="e.g., iPhone 14 Pro, Galaxy S23"
                    value={formData.deviceModel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Issue Details</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type *
                  </label>
                  <select
                    id="issueType"
                    name="issueType"
                    required
                    value={formData.issueType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Issue Type</option>
                    <option value="screen-cracked">Cracked Screen</option>
                    <option value="battery">Battery Issue</option>
                    <option value="charging">Charging Problem</option>
                    <option value="camera">Camera Not Working</option>
                    <option value="speaker">Speaker/Audio Issue</option>
                    <option value="water-damage">Water Damage</option>
                    <option value="software">Software Problem</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Description *
                  </label>
                  <textarea
                    id="issueDescription"
                    name="issueDescription"
                    required
                    rows={4}
                    placeholder="Please describe the issue in detail. Include when it started, what happens, and any error messages."
                    value={formData.issueDescription}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-2">
                    Photos (Optional)
                  </label>
                  <input
                    type="file"
                    id="photos"
                    name="photos"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload photos of the issue (max 5 files, 10MB each)
                  </p>
                  {formData.photos.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.photos.length} file{formData.photos.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Priority Level */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Priority Level</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="low"
                    name="priority"
                    value="low"
                    checked={formData.priority === 'low'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label htmlFor="low" className="ml-3 block text-sm font-medium text-gray-700">
                    Low - Non-urgent repair
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="normal"
                    name="priority"
                    value="normal"
                    checked={formData.priority === 'normal'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label htmlFor="normal" className="ml-3 block text-sm font-medium text-gray-700">
                    Normal - Standard repair timeline
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="urgent"
                    name="priority"
                    value="urgent"
                    checked={formData.priority === 'urgent'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label htmlFor="urgent" className="ml-3 block text-sm font-medium text-gray-700">
                    Urgent - Need it fixed quickly (+20% cost)
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    required
                    placeholder="(555) 123-4567"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    required
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Repair Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}