"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NavBar } from "@ep/ui/components/nav-bar";
import { EmptyState } from "../components/empty-state";
import { ActiveDashboard } from "../components/active-dashboard";
import { DraftAlertBanner } from "../components/draft-alert-banner";
import { getUser, clearAuth } from "../lib/auth";
import { useReveal } from "../hooks/use-reveal";

function BrandDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stateParam = searchParams.get("state");

  const [activeTab, setActiveTab] = useState<"home" | "wallet">("home");
  const [dashboardState, setDashboardState] = useState<"empty" | "active">("empty");
  const [showAlert, setShowAlert] = useState(true);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = getUser();
    if (user?.name) setUserName(user.name);
  }, []);

  // Sync dashboard state with query parameters
  useEffect(() => {
    if (stateParam === "active") {
      setDashboardState("active");
    }
  }, [stateParam]);

  const handleCreateCampaign = () => {
    router.push("/create-campaign");
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <div className="h-screen bg-[#F5F5F4] text-stone-900 flex flex-col font-rethink">
      {/* Floating State Switcher for review */}
      <div className="fixed bottom-6 left-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-3 text-xs font-semibold border border-stone-800">
        <span>State: {dashboardState === "empty" ? "Empty State" : "Active Dashboard"}</span>
        <button
          onClick={() => setDashboardState(prev => (prev === "empty" ? "active" : "empty"))}
          className="bg-[#FEB604] text-stone-900 px-3 py-1 rounded-full hover:bg-[#FEB604]/90 transition-colors"
        >
          Toggle Screen
        </button>
      </div>

      {/* Navigation Bar */}
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} userName={userName} onLogout={handleLogout} />

      {/* Draft Alert Banner - Fixed bottom right */}
      {showAlert && activeTab === "home" && dashboardState === "active" && (
        <div className="fixed bottom-6 right-6 z-50">
          <DraftAlertBanner onClose={() => setShowAlert(false)} />
        </div>
      )}

      {activeTab === "home" ? (
        dashboardState === "empty" ? (
          <EmptyState onCreateCampaign={handleCreateCampaign} />
        ) : (
          <ActiveDashboard
            onCreateCampaign={handleCreateCampaign}
          />
        )
      ) : (
        /* Wallet Tab Placeholder View */
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
