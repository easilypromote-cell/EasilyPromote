"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CampaignWizard } from "../../components/campaign-wizard";
import { CampaignSuccess } from "../../components/campaign-success";
import { NavBar } from "@ep/ui/components/nav-bar";
import { useIsMobile } from "@ep/ui/hooks/use-is-mobile";
import { Drawer, DrawerContent } from "../../components/ui/drawer";
import { getUser, isAuthenticated } from "../../lib/api";

function CreateCampaignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  // Detect Paystack return: ?payment=success&campaignId=xxx
  const paymentSuccess = searchParams.get("payment") === "success";
  const paymentCampaignId = searchParams.get("campaignId") || undefined;

  const draftId = paymentCampaignId || searchParams.get("id") || undefined;

  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    const user = getUser();
    if (user?.name) setUserName(user.name);
  }, []);

  const handleClose = () => router.push("/");
  const handleSuccess = () => router.push("/");

  // Payment success — show standalone success screen (not part of the wizard)
  if (paymentSuccess) {
    return <CampaignSuccess onClose={handleSuccess} isMobile={isMobile} />;
  }

  // Wizard page — popstate navigates to home

  if (isMobile) {
    return (
      <div className="h-screen bg-stone-100 text-stone-900 flex flex-col font-rethink">
        <div className="flex-1 overflow-y-auto">
          <CampaignWizard onClose={handleClose} onSuccess={handleSuccess} draftId={draftId} isMobile />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-rethink">
      <NavBar activeTab="home" onTabChange={() => router.push("/")} userName={userName} />
      <Drawer open={true} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DrawerContent className="overflow-hidden bg-stone-100">
          <CampaignWizard onClose={handleClose} onSuccess={handleSuccess} draftId={draftId} />
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
