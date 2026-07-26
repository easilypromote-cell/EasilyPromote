"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavBar } from "@ep/ui/components/nav-bar";
import { EmptyState } from "../components/empty-state";
import { ActiveDashboard, type BrandCampaign } from "../components/active-dashboard";
import { DraftAlertBanner } from "../components/draft-alert-banner";
import { Skeleton } from "../components/ui/skeleton";
import { apiRequest, getUser, clearAuth, isAuthenticated, getToken } from "../lib/api";
import { useSocket } from "../lib/socket";
import { useReveal } from "../hooks/use-reveal";

function BrandDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"home" | "wallet">("home");
  const [dashboardState, setDashboardState] = useState<"empty" | "active">("empty");
  const [showAlert, setShowAlert] = useState(true);
  const [userName, setUserName] = useState("User");
  const [campaigns, setCampaigns] = useState<BrandCampaign[]>([]);
  const [draftCount, setDraftCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    try {
      const data = await apiRequest<{ campaigns: BrandCampaign[]; draftCount: number }>("/campaigns", {
        method: "GET",
        token: getToken() || undefined,
      });

      const list = data.campaigns || [];
      setDraftCount(data.draftCount || 0);

      const pending = list.filter(c => c.status === "pending_payment");
      await Promise.allSettled(
        pending.map(c =>
          apiRequest(`/campaigns/${c.id}/payment-status`, { token: getToken() || undefined })
        )
      );

      const refreshed = await apiRequest<{ campaigns: BrandCampaign[]; draftCount: number }>("/campaigns", {
        method: "GET",
        token: getToken() || undefined,
      });

      const finalList = refreshed.campaigns || list;
      setDraftCount(refreshed.draftCount || 0);
      setCampaigns(finalList);
      setDashboardState(finalList.length > 0 ? "active" : "empty");
    } catch {
      console.log("Could not load campaigns");
      setDashboardState("empty");
    } finally {
      setLoading(false);
    }
  }, []);

  useSocket((data) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === data.campaignId ? { ...c, status: data.status } : c
      )
    );
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const reference = searchParams.get("reference") || searchParams.get("trxref");
    const payment = searchParams.get("payment");
    if (reference || payment === "success") {
      router.replace("/");
      return;
    }

    const user = getUser();
    if (user?.name) setUserName(user.name);

    apiRequest<{ emailVerified: boolean }>("/auth/me", { token: getToken() || undefined })
      .then((me) => {
        if (!me.emailVerified) {
          router.push("/login");
          return;
        }
        const freshUser = getUser();
        if (freshUser) {
          freshUser.emailVerified = me.emailVerified;
          localStorage.setItem("user", JSON.stringify(freshUser));
        }
        fetchCampaigns();
      })
      .catch(() => {
        router.push("/login");
      });
  }, [searchParams, router, fetchCampaigns]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && isAuthenticated()) {
        fetchCampaigns();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchCampaigns]);

  const handleCreateCampaign = useCallback(() => {
    router.push("/create-campaign");
  }, [router]);

  const handleLogout = useCallback(() => {
    clearAuth();
    router.push("/login");
  }, [router]);

  return (
    <div className="h-screen bg-[#F5F5F4] text-stone-900 flex flex-col font-rethink">
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} userName={userName} onLogout={handleLogout} />

      {showAlert && activeTab === "home" && draftCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <DraftAlertBanner draftCount={draftCount} onClose={() => setShowAlert(false)} />
        </div>
      )}

      {activeTab === "home" ? (
        loading ? (
          <main className="flex-1 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        ) : dashboardState === "empty" ? (
          <EmptyState onCreateCampaign={handleCreateCampaign} userName={userName} />
        ) : (
          <ActiveDashboard
            campaigns={campaigns}
            onCreateCampaign={handleCreateCampaign}
            userName={userName}
          />
        )
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center max-w-7xl w-full mx-auto px-6 py-12">
          <div className="text-center max-w-md bg-white border border-stone-200 rounded-2xl p-8">
            <h2 className="text-2xl font-medium mb-3">Wallet & Billing</h2>
            <p className="text-stone-500 mb-6">Manage your escrow transactions, campaign budgets, and wallet status.</p>
            <div className="text-3xl font-medium text-stone-900 mb-2">₦0.00</div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 rounded-full text-stone-600">Balance Locked</span>
          </div>
        </main>
      )}
    </div>
  );
}

export default function BrandDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center"><Skeleton className="h-6 w-40" /></div>}>
      <BrandDashboardContent />
    </Suspense>
  );
}
