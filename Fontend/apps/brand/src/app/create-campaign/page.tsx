"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CampaignWizard } from "../../components/campaign-wizard";
import { NavBar } from "@ep/ui/components/nav-bar";
import { Drawer, DrawerContent } from "../../components/ui/drawer";
import { getUser, isAuthenticated } from "../../lib/api";

function CreateCampaignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("id") || undefined;
  const paymentSuccess = searchParams.get("payment") === "success";
  const reference = searchParams.get("reference");
  const campaignId = searchParams.get("campaignId");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (paymentSuccess && reference) {
      router.replace(`/?payment=success&reference=${reference}${campaignId ? `&campaignId=${campaignId}` : ""}`);
      return;
    }

    const user = getUser();
    if (user?.name) setUserName(user.name);
  }, []);

  const handleClose = () => router.push("/");
  const handleSuccess = () => router.push("/");

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-rethink">
      <NavBar activeTab="home" onTabChange={() => router.push("/")} userName={userName} />
      <Drawer open={true} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DrawerContent className="overflow-hidden">
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
