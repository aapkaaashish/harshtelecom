import Link from "next/link";

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Contact Support
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
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Get Help & Support
              </h2>
              <p className="text-gray-600 mb-6">
                Need assistance with your repair requests or have questions about our services?
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">📞 Phone Support</h3>
                  <p className="text-sm text-gray-600 mb-2">Call us directly</p>
                  <p className="font-medium text-primary">+1 (555) 123-4567</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">✉️ Email Support</h3>
                  <p className="text-sm text-gray-600 mb-2">Send us an email</p>
                  <p className="font-medium text-primary">support@repairhub.com</p>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                Support hours: Monday - Friday, 9 AM - 6 PM EST
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}