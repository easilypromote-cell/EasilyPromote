"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CreatorDashboard() {
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
              <span className="text-sm text-gray-600">{user?.name || "Creator"}</span>
              <a href="/login" className="text-sm text-blue-600 hover:underline">Login</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Creator Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">My Rank</p>
            <p className="text-3xl font-bold mt-1">Rank 1</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">Active Slots</p>
            <p className="text-3xl font-bold mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">Earnings</p>
            <p className="text-3xl font-bold mt-1">₦0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-3xl font-bold mt-1">0%</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Available Campaigns</h3>
            <p className="text-gray-500">Browse the marketplace to find campaigns to claim.</p>
            <a href="/marketplace" className="inline-block mt-3 text-sm text-blue-600 hover:underline">
              Go to Marketplace &rarr;
            </a>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">My Submissions</h3>
            <p className="text-gray-500">No submissions yet. Claim a slot to get started.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
