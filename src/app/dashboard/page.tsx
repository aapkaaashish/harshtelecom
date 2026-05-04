'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
              Manage smartphones, mobile repair parts, and accessories inventory
            </p>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Inventory Management Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Inventory Management</h3>
                      <p className="text-sm text-gray-600">
                        Track and manage smartphones, parts, and accessories stock levels
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Processing Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 10c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
                      <p className="text-sm text-gray-600">
                        Process repair orders and track their completion status
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* User Management Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 008 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
                      <p className="text-sm text-gray-600">
                        Manage technician and customer accounts and permissions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reports Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M9 5h7a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2zm0 0v2a2 2 0 00-2 2h-.092c-.386.09-.76.185-1.11.28a9.868 9.868 0 00-2.89.824A9.898 9.898 0 003 19.242a9.868 9.868 0 001.473 3.411l.23.084a9.904 9.904 0 002.44-.05 9.893 9.893 0 004.93-1.418 9.891 9.891 0 002.174-.693V7a2 2 0 012-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Reports & Analytics</h3>
                      <p className="text-sm text-gray-600">
                        View sales, repair trends, and performance metrics
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Parts Catalog Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M9 12l2 2 4-4M7.5 21h9a2.5 2.5 0 002.5-2.5V12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Parts Catalog</h3>
                      <p className="text-sm text-gray-600">
                        Browse and manage mobile repair parts and accessories inventory
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Settings Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M10.325 9.325c.447-1.377 1.946-2.272 3.34-2.077 1.395.194 2.433 1.284 2.286 2.68a11.018 11.018 0 01-2.333 1.816c-.646-.036-1.271-.157-1.865-.337zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">System Settings</h3>
                      <p className="text-sm text-gray-600">
                        Configure application preferences and integrations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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