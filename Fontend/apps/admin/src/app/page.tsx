"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/sidebar";
import { apiRequest, isAuthenticated, getToken } from "../lib/api";

interface Stats {
  brands: number;
  creators: number;
  campaigns: {
    total: number;
    under_review: number;
    live: number;
    draft: number;
    paused: number;
    completed: number;
    cancelled: number;
    pending_payment: number;
  };
  totalEscrowed: number;
  recentUsers: { _id: string; name: string; email: string; role: string; createdAt: string }[];
}

interface Campaign {
  id: string;
  name: string;
  category: string;
  status: string;
  budget: number;
  targetViews: number;
  coverImageUrl?: string;
  contentBrief?: string;
  platforms?: string[];
  createdAt: string;
  brand: { id: string; name: string; email: string } | null;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    under_review: "bg-amber-100 text-amber-800",
    live: "bg-green-100 text-green-800",
    draft: "bg-stone-100 text-stone-600",
    paused: "bg-orange-100 text-orange-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-700",
    pending_payment: "bg-amber-50 text-amber-700",
  };
  const label: Record<string, string> = {
    under_review: "Under Review",
    live: "Live",
    draft: "Draft",
    paused: "Paused",
    completed: "Completed",
    cancelled: "Cancelled",
    pending_payment: "Pending Payment",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold font-rethink ${map[status] || "bg-stone-100 text-stone-600"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label[status] || status}
    </span>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6">
      <p className="text-xs font-medium text-stone-400 font-rethink mb-2">{label}</p>
      <p className="text-3xl font-semibold text-stone-900 font-rethink tracking-tight">{value}</p>
      {sub && <p className="text-xs text-stone-400 font-rethink mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [reviewQueue, setReviewQueue] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const token = getToken();
      const [statsData, campaignsData] = await Promise.all([
        apiRequest<Stats>("/admin/stats", { token }),
        apiRequest<{ campaigns: Campaign[] }>("/admin/campaigns?status=under_review&limit=10", { token }),
      ]);
      setStats(statsData);
      setReviewQueue(campaignsData.campaigns);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    fetchData();
  }, [fetchData, router]);

  const handleAction = async (campaignId: string, status: "live" | "cancelled") => {
    setActionLoading(campaignId + status);
    try {
      await apiRequest(`/admin/campaigns/${campaignId}/status`, {
        method: "PATCH",
        body: { status },
        token: getToken(),
      });
      await fetchData();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F5F5F4]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <span className="text-sm text-stone-400 font-rethink">Loading...</span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F5F4] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-rethink font-semibold text-2xl text-stone-900 tracking-tight">Overview</h1>
            <p className="text-sm text-stone-400 font-rethink mt-1">Platform health at a glance</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Brands" value={stats?.brands ?? 0} />
            <StatCard label="Creators" value={stats?.creators ?? 0} />
            <StatCard label="Live Campaigns" value={stats?.campaigns.live ?? 0} sub={`${stats?.campaigns.under_review ?? 0} under review`} />
            <StatCard
              label="Total Escrowed"
              value={`₦${(stats?.totalEscrowed ?? 0).toLocaleString()}`}
            />
          </div>

          {/* Campaign status breakdown */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-8">
            <h2 className="text-sm font-semibold text-stone-900 font-rethink mb-4">Campaign Breakdown</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {[
                { label: "Draft", key: "draft" },
                { label: "Pending Pay", key: "pending_payment" },
                { label: "Under Review", key: "under_review" },
                { label: "Live", key: "live" },
                { label: "Paused", key: "paused" },
                { label: "Completed", key: "completed" },
              ].map(({ label, key }) => (
                <div key={key} className="text-center">
                  <p className="text-2xl font-semibold text-stone-900 font-rethink">
                    {stats?.campaigns[key as keyof typeof stats.campaigns] ?? 0}
                  </p>
                  <p className="text-[11px] text-stone-400 font-rethink mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Review Queue */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-stone-900 font-rethink">
                Review Queue
                {reviewQueue.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[11px]">
                    {reviewQueue.length}
                  </span>
                )}
              </h2>
              <button onClick={() => router.push("/campaigns?status=under_review")} className="text-xs font-medium text-stone-500 hover:text-stone-900 font-rethink transition-colors">
                View all →
              </button>
            </div>

            {reviewQueue.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <p className="text-sm text-stone-400 font-rethink">No campaigns pending review 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewQueue.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl border border-stone-100 p-5 flex items-start gap-4">
                    {/* Cover */}
                    <div className="w-12 h-12 rounded-xl bg-stone-100 flex-shrink-0 overflow-hidden border border-stone-200">
                      {c.coverImageUrl
                        ? <img src={c.coverImageUrl} alt={c.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-stone-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                            </svg>
                          </div>
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-rethink font-semibold text-sm text-stone-900 truncate">{c.name}</h3>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-xs text-stone-400 font-rethink mb-2">
                        by <span className="text-stone-600">{c.brand?.name}</span> · {c.category} · ₦{c.budget.toLocaleString()}
                      </p>
                      {c.contentBrief && (
                        <p className="text-xs text-stone-400 font-rethink line-clamp-1">{c.contentBrief}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAction(c.id, "cancelled")}
                        disabled={!!actionLoading}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold font-rethink border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
                      >
                        {actionLoading === c.id + "cancelled" ? "…" : "Reject"}
                      </button>
                      <button
                        onClick={() => handleAction(c.id, "live")}
                        disabled={!!actionLoading}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold font-rethink bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 transition-colors"
                      >
                        {actionLoading === c.id + "live" ? "…" : "Approve"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent users */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-stone-900 font-rethink">Recent Sign-ups</h2>
              <button onClick={() => router.push("/users")} className="text-xs font-medium text-stone-500 hover:text-stone-900 font-rethink transition-colors">
                View all →
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-50">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Email</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Role</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentUsers || []).map((u) => (
                    <tr key={u._id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-3.5 font-rethink font-medium text-stone-900 text-sm">{u.name}</td>
                      <td className="px-5 py-3.5 font-rethink text-stone-500 text-sm">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-semibold font-rethink px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 capitalize">{u.role}</span>
                      </td>
                      <td className="px-5 py-3.5 font-rethink text-stone-400 text-sm">
                        {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                  {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-stone-400 font-rethink">No users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
