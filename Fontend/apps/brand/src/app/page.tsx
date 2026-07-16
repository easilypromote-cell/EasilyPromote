"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function BrandDashboard() {
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
            <h1 className="text-xl font-bold text-gray-900">EasilyPromote</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.name || "Brand User"}</span>
              <a href="/login" className="text-sm text-blue-600 hover:underline">Login</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Brand Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">Active Campaigns</p>
            <p className="text-3xl font-bold mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-3xl font-bold mt-1">₦0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">Total Views</p>
            <p className="text-3xl font-bold mt-1">0</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Campaigns</h3>
          <p className="text-gray-500">No campaigns yet. Create your first campaign to get started.</p>
        </div>
      </main>
    </div>
  );
}
