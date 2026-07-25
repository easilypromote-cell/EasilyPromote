"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavBar } from "@ep/ui/components/nav-bar";
import { EmptyState } from "../components/empty-state";
import { ActiveDashboard, type BrandCampaign } from "../components/active-dashboard";
import { DraftAlertBanner } from "../components/draft-alert-banner";
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
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-rethink">
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} userName={userName} onLogout={handleLogout} />

      {showAlert && activeTab === "home" && draftCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <DraftAlertBanner draftCount={draftCount} onClose={() => setShowAlert(false)} />
        </div>
      )}

      {activeTab === "home" ? (
        loading ? (
          <main className="flex-1 flex items-center justify-center">
            <span className="text-sm font-semibold text-stone-500">Loading campaigns...</span>
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
            <h2 className="text-2xl font-bold mb-3">Wallet & Billing</h2>
            <p className="text-stone-500 mb-6">Manage your escrow transactions, campaign budgets, and wallet status.</p>
            <div className="text-3xl font-bold text-stone-900 mb-2">₦0.00</div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 rounded-full text-stone-600">Balance Locked</span>
          </div>
        </main>
      )}
    </div>
  );
}

export default function BrandDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center font-rethink text-stone-500">Loading Dashboard...</div>}>
      <BrandDashboardContent />
    </Suspense>
  );
}
