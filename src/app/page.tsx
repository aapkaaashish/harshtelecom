import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
            Harsh Telecom
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Professional mobile repair services with expert technicians and premium quality parts
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-3xl mb-3">🔧</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Repairs</h3>
            <p className="text-gray-600 text-sm">
              Professional smartphone and device repair services by certified technicians
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Parts</h3>
            <p className="text-gray-600 text-sm">
              Genuine and high-quality replacement parts for all major brands
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">
              Dedicated customer support and parts request management system
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
          <p className="text-gray-600 text-sm">
            Technician or Admin? <Link href="/login" className="text-primary hover:underline">Sign in to your account</Link>
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>&copy; 2026 Harsh Telecom. All rights reserved.</p>
          <p className="mt-1">Professional Mobile Repair Services</p>
        </footer>
      </div>
    </main>
  );
}
