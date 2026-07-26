"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      const adminRoles = ["admin", "super_admin", "finance_admin", "support"];
      if (!adminRoles.includes(data.user.role)) {
        throw new Error("Access denied — admin only");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-stone-950 flex items-center justify-center mb-4">
            <div className="w-6 h-6 rounded-full bg-[#FEB604] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-stone-950">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          </div>
          <h1 className="font-rethink font-semibold text-xl text-stone-900 tracking-tight">Admin Console</h1>
          <p className="text-sm text-stone-400 font-rethink mt-1">EasilyPromote · Internal access only</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl p-3 mb-5 font-rethink">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 font-rethink mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@easilypromote.com"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-rethink focus:outline-none focus:ring-2 focus:ring-stone-300 placeholder:text-stone-300 bg-stone-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 font-rethink mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-rethink focus:outline-none focus:ring-2 focus:ring-stone-300 placeholder:text-stone-300 bg-stone-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-950 text-white py-3 rounded-xl text-sm font-semibold font-rethink hover:bg-stone-800 disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
