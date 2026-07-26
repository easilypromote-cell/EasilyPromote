"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "../../components/sidebar";
import { apiRequest, isAuthenticated, getToken } from "../../lib/api";

interface Campaign {
  id: string;
  name: string;
  category: string;
  status: string;
  budget: number;
  targetViews: number;
  viewsDelivered: number;
  progressPercent: number;
  coverImageUrl?: string;
  contentBrief?: string;
  platforms?: string[];
  createdAt: string;
  brand: { id: string; name: string; email: string } | null;
}

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Under Review", value: "under_review" },
  { label: "Live", value: "live" },
  { label: "Paused", value: "paused" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_STYLE: Record<string, string> = {
  under_review: "bg-amber-100 text-amber-800",
  live: "bg-green-100 text-green-800",
  draft: "bg-stone-100 text-stone-600",
  paused: "bg-orange-100 text-orange-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-700",
  pending_payment: "bg-amber-50 text-amber-700",
};

const STATUS_LABEL: Record<string, string> = {
  under_review: "Under Review", live: "Live", draft: "Draft",
  paused: "Paused", completed: "Completed", cancelled: "Cancelled",
  pending_payment: "Pending Pay",
};

function CampaignsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [activeStatus, setActiveStatus] = useState(initialStatus);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (activeStatus !== "all") qs.set("status", activeStatus);
      if (search) qs.set("q", search);
      const data = await apiRequest<{ campaigns: Campaign[]; total: number }>(
        `/admin/campaigns?${qs}`,
        { token: getToken() }
      );
      setCampaigns(data.campaigns);
      setTotal(data.total);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [activeStatus, search, router]);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    fetchCampaigns();
  }, [fetchCampaigns, router]);

  const handleAction = async (id: string, status: "live" | "cancelled" | "paused") => {
    setActionLoading(id + status);
    try {
      await apiRequest(`/admin/campaigns/${id}/status`, {
        method: "PATCH", body: { status }, token: getToken(),
      });
      await fetchCampaigns();
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
              <h1 className="font-rethink font-semibold text-2xl text-stone-900 tracking-tight">Campaigns</h1>
              <p className="text-sm text-stone-400 font-rethink mt-1">{total} total campaigns</p>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-56 px-4 py-2 text-sm bg-white border border-stone-200 rounded-full font-rethink focus:outline-none focus:ring-2 focus:ring-stone-300 placeholder:text-stone-400"
            />
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 mb-6 bg-white border border-stone-100 rounded-2xl p-1.5 w-fit">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveStatus(tab.value)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold font-rethink transition-all ${
                  activeStatus === tab.value
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
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Campaign</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Brand</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Budget</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Progress</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 font-rethink uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-stone-400 font-rethink">Loading…</td></tr>
                ) : campaigns.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-stone-400 font-rethink">No campaigns found.</td></tr>
                ) : campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/50 transition-colors">
                    {/* Campaign */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex-shrink-0 overflow-hidden border border-stone-200">
                          {c.coverImageUrl
                            ? <img src={c.coverImageUrl} alt={c.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                                </svg>
                              </div>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="font-rethink font-medium text-sm text-stone-900 truncate max-w-[180px]">{c.name}</p>
                          <p className="font-rethink text-[11px] text-stone-400">{c.category}</p>
                        </div>
                      </div>
                    </td>
                    {/* Brand */}
                    <td className="px-5 py-4">
                      <p className="font-rethink text-sm text-stone-700 font-medium">{c.brand?.name || "—"}</p>
                      <p className="font-rethink text-[11px] text-stone-400">{c.brand?.email}</p>
                    </td>
                    {/* Budget */}
                    <td className="px-5 py-4 font-rethink text-sm text-stone-900 font-medium">₦{c.budget.toLocaleString()}</td>
                    {/* Progress */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.progressPercent}%` }} />
                        </div>
                        <span className="text-xs text-stone-400 font-rethink">{c.progressPercent}%</span>
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold font-rethink ${STATUS_STYLE[c.status] || "bg-stone-100 text-stone-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {STATUS_LABEL[c.status] || c.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {c.status === "under_review" && (
                          <>
                            <button
                              onClick={() => handleAction(c.id, "cancelled")}
                              disabled={!!actionLoading}
                              className="px-3 py-1 rounded-full text-[11px] font-semibold font-rethink border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
                            >
                              {actionLoading === c.id + "cancelled" ? "…" : "Reject"}
                            </button>
                            <button
                              onClick={() => handleAction(c.id, "live")}
                              disabled={!!actionLoading}
                              className="px-3 py-1 rounded-full text-[11px] font-semibold font-rethink bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 transition-colors"
                            >
                              {actionLoading === c.id + "live" ? "…" : "Approve"}
                            </button>
                          </>
                        )}
                        {c.status === "live" && (
                          <button
                            onClick={() => handleAction(c.id, "paused")}
                            disabled={!!actionLoading}
                            className="px-3 py-1 rounded-full text-[11px] font-semibold font-rethink border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors"
                          >
                            {actionLoading === c.id + "paused" ? "…" : "Pause"}
                          </button>
                        )}
                        {c.status === "paused" && (
                          <button
                            onClick={() => handleAction(c.id, "live")}
                            disabled={!!actionLoading}
                            className="px-3 py-1 rounded-full text-[11px] font-semibold font-rethink bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-40 transition-colors"
                          >
                            {actionLoading === c.id + "live" ? "…" : "Resume"}
                          </button>
                        )}
                        {(c.status === "draft" || c.status === "pending_payment" || c.status === "completed" || c.status === "cancelled") && (
                          <span className="text-[11px] text-stone-300 font-rethink">—</span>
                        )}
                      </div>
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

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen bg-[#F5F5F4] items-center justify-center text-sm text-stone-400 font-rethink">Loading…</div>}>
      <CampaignsContent />
    </Suspense>
  );
}
