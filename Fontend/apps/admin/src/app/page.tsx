"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">EasilyPromote Admin</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.name || "Admin"}</span>
              <Link href="/login" className="text-sm text-blue-600 hover:underline">Login</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">Active Campaigns</p>
            <p className="text-3xl font-bold mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">Pending Verifications</p>
            <p className="text-3xl font-bold mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">Open Fraud Cases</p>
            <p className="text-3xl font-bold mt-1">0</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <p className="text-gray-500">No recent activity to display.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Pending Appeals</h3>
            <p className="text-gray-500">No open appeals.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
