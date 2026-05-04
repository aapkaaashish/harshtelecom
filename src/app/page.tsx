import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Mobile Repair Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Manage smartphone repairs, parts inventory, and customer requests all in one place
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-lg font-semibold text-white mb-2">Repair Management</h3>
            <p className="text-gray-300 text-sm">
              Track and manage device repairs from start to finish
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-white mb-2">Parts Inventory</h3>
            <p className="text-gray-300 text-sm">
              Monitor stock levels and manage repair parts catalog
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">Customer Portal</h3>
            <p className="text-gray-300 text-sm">
              Allow customers to submit requests and track progress
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
          <p className="text-gray-400 text-sm">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
