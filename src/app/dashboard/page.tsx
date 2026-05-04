'use client';

import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    // Not signed in, redirect to login
    // In a real app, you might use useRouter to redirect
    return <div>Please <a href="/login">sign in</a> to access the dashboard.</div>;
  }

  const role = session.user?.role ?? null;

  // Role-based rendering
  if (role === 'admin') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome, admin! Here you can manage smartphones, mobile repair parts, and accessories.</p>
        {/* Admin-specific content goes here */}
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h2 className="font-semibold mb-2">Admin Actions</h2>
          <ul className="list-disc list-inside">
            <li>Inventory Management</li>
            <li>Order Processing</li>
            <li>User Management</li>
            <li>Reports & Analytics</li>
          </ul>
        </div>
      </div>
    );
  }

  // Regular user
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <p>Welcome, {session.user?.name}! Here you can submit repair requests and check their status.</p>
      {/* User-specific content goes here */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h2 className="font-semibold mb-2">User Actions</h2>
        <ul className="list-disc list-inside">
          <li>Submit a Repair Request</li>
          <li>View My Requests</li>
          <li>Check Part Availability</li>
          <li>Contact Support</li>
        </ul>
      </div>
    </div>
  );
}