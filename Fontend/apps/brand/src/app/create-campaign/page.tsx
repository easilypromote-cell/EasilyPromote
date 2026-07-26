"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CampaignWizard } from "../../components/campaign-wizard";
import { NavBar } from "@ep/ui/components/nav-bar";
import { Drawer, DrawerContent } from "../../components/ui/drawer";
import { getUser, isAuthenticated } from "../../lib/api";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function CreateCampaignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  // Detect Paystack return: ?payment=success&campaignId=xxx
  const paymentSuccess = searchParams.get("payment") === "success";
  const paymentCampaignId = searchParams.get("campaignId") || undefined;

  const draftId = paymentCampaignId || searchParams.get("id") || undefined;
  const initialStep: 1 | 2 | 3 | 4 = paymentSuccess ? 4 : 1;

  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    const user = getUser();
    if (user?.name) setUserName(user.name);
  }, []);

  useEffect(() => {
    history.pushState(null, "", location.href);
    const handlePopState = () => router.push("/");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleClose = () => router.push("/");
  const handleSuccess = () => router.push("/");

  if (isMobile) {
    return (
      <div className="h-screen bg-stone-100 text-stone-900 flex flex-col font-rethink">
        <header className="flex items-center justify-center h-14 px-4 border-b border-stone-200 bg-white flex-shrink-0">
          <h3 className="font-rethink font-semibold tracking-tight text-xl text-stone-900">{draftId ? "Edit Draft" : "Create a Campaign"}</h3>
        </header>
        <div className="flex-1 overflow-hidden">
          <CampaignWizard onClose={handleClose} onSuccess={handleSuccess} draftId={draftId} initialStep={initialStep} isMobile />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-rethink">
      <NavBar activeTab="home" onTabChange={() => router.push("/")} userName={userName} />
      <Drawer open={true} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DrawerContent className="overflow-hidden">
          <CampaignWizard onClose={handleClose} onSuccess={handleSuccess} draftId={draftId} initialStep={initialStep} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function CreateCampaignPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center font-rethink text-stone-500">Loading...</div>}>
      <CreateCampaignContent />
    </Suspense>
  );
}
