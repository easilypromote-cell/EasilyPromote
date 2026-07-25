"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CampaignWizard } from "../../components/campaign-wizard";
import { NavBar } from "@ep/ui/components/nav-bar";
import { Drawer, DrawerContent } from "../../components/ui/drawer";
import { getUser, isAuthenticated, apiRequest, getToken } from "../../lib/api";

function CreateCampaignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const rawDraftId = searchParams.get("id");
  const campaignIdParam = searchParams.get("campaignId");
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  
  let refCampaignId: string | undefined;
  if (reference && reference.startsWith("ep_")) {
    const parts = reference.split("_");
    if (parts.length >= 2) refCampaignId = parts[1];
  }

  const effectiveCampaignId = campaignIdParam || refCampaignId || rawDraftId || undefined;
  const isPaymentSuccess = searchParams.get("payment") === "success" || Boolean(reference);

  const [userName, setUserName] = useState("User");
  const [initialStep, setInitialStep] = useState<1 | 2 | 3 | 4>(isPaymentSuccess ? 4 : 1);
  const [verifying, setVerifying] = useState(isPaymentSuccess);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    const user = getUser();
    if (user?.name) setUserName(user.name);

    if (isPaymentSuccess && effectiveCampaignId) {
      apiRequest(`/campaigns/${effectiveCampaignId}/payment-status`, {
        token: getToken() || undefined,
      })
        .then(() => {
          setInitialStep(4);
        })
        .catch((err) => {
          console.error("Payment status verification error:", err);
          setInitialStep(4);
        })
        .finally(() => {
          setVerifying(false);
        });
    } else {
      setVerifying(false);
    }
  }, [isPaymentSuccess, effectiveCampaignId, router]);

  const handleClose = () => router.push("/");
  const handleSuccess = () => router.push("/");

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center font-rethink text-stone-500">
        Verifying payment...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-stone-900 flex flex-col font-rethink">
      <NavBar activeTab="home" onTabChange={() => router.push("/")} userName={userName} />
      <Drawer open={true} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DrawerContent className="overflow-hidden">
          <CampaignWizard
            onClose={handleClose}
            onSuccess={handleSuccess}
            draftId={effectiveCampaignId}
            initialStep={initialStep}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function CreateCampaignPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center font-rethink text-stone-500">Loading...</div>}>
      <CreateCampaignContent />
    </Suspense>
  );
}
