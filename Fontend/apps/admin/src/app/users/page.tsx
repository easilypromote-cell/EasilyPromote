"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/sidebar";
import { apiRequest, isAuthenticated, getToken } from "../../lib/api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  campaignCount: number;
  submissionCount: number;
}

const ROLE_TABS = [
  { label: "All", value: "all" },
  { label: "Brands", value: "business" },
  { label: "Creators", value: "creator" },
  { label: "Admins", value: "admin" },
];

export default function UsersPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState("all");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (activeRole !== "all") qs.set("role", activeRole);
      if (search) qs.set("q", search);
      const data = await apiRequest<{ users: AdminUser[]; total: number }>(
        `/admin/users?${qs}`,
        { token: getToken() }
      );
      setUsers(data.users);
      setTotal(data.total);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [activeRole, search, router]);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    fetchUsers();
  }, [fetchUsers, router]);

  const toggleStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      await apiRequest(`/admin/users/${userId}/status`, {
        method: "PATCH",
        body: { isActive: !currentStatus },
        token: getToken(),
      });
      await fetchUsers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5F4] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-rethink font-semibold text-2xl text-stone-900 tracking-tight">Users</h1>
              <p className="text-sm text-stone-400 font-rethink mt-1">{total} total users</p>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-64 px-4 py-2 text-sm bg-white border border-stone-200 rounded-full font-rethink focus:outline-none focus:ring-2 focus:ring-stone-300 placeholder:text-stone-400"
            />
          </div>

          {/* Role tabs */}
          <div className="flex gap-1 mb-6 bg-white border border-stone-100 rounded-2xl p-1.5 w-fit">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveRole(tab.value)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold font-rethink transition-all ${
                  activeRole === tab.value
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-50">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Activity</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Joined</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-stone-400 font-rethink">Loading…</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-stone-400 font-rethink">No users found.</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/50 transition-colors">
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-200 to-[#FEB604] flex items-center justify-center text-xs font-semibold text-stone-950 flex-shrink-0">
                          {u.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-rethink font-medium text-sm text-stone-900">{u.name}</p>
                          <p className="font-rethink text-[11px] text-stone-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className="text-[11px] font-semibold font-rethink px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 capitalize">{u.role}</span>
                    </td>
                    {/* Activity */}
                    <td className="px-5 py-4">
                      {u.role === "business" ? (
                        <p className="text-xs text-stone-500 font-rethink">{u.campaignCount} campaign{u.campaignCount !== 1 ? "s" : ""}</p>
                      ) : u.role === "creator" ? (
                        <p className="text-xs text-stone-500 font-rethink">{u.submissionCount} submission{u.submissionCount !== 1 ? "s" : ""}</p>
                      ) : (
                        <span className="text-stone-300 text-xs font-rethink">—</span>
                      )}
                    </td>
                    {/* Joined */}
                    <td className="px-5 py-4 font-rethink text-sm text-stone-400">
                      {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-green-500" : "bg-red-400"}`} />
                        <span className={`text-xs font-semibold font-rethink ${u.isActive ? "text-green-700" : "text-red-600"}`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                        {!u.emailVerified && (
                          <span className="ml-1 text-[10px] font-rethink px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full">Unverified</span>
                        )}
                      </div>
                    </td>
                    {/* Action */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(u.id, u.isActive)}
                        disabled={actionLoading === u.id}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold font-rethink border transition-colors disabled:opacity-40 ${
                          u.isActive
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-green-200 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {actionLoading === u.id ? "…" : u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
