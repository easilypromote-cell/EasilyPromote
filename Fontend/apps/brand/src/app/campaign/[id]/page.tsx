"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@ep/ui/components/nav-bar";
import { useIsMobile } from "@ep/ui/hooks/use-is-mobile";
import { Drawer, DrawerContent } from "../../../components/ui/drawer";
import { CampaignDetails } from "../../../components/campaign-details";
import { getUser, isAuthenticated } from "../../../lib/api";

export default function CampaignDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const isMobile = useIsMobile();
  const [userName, setUserName] = useState("User");

  const campaignId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    const user = getUser();
    if (user?.name) setUserName(user.name);
  }, [router]);

  useEffect(() => {
    history.pushState(null, "", location.href);
    const handlePopState = () => router.push("/");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  const handleClose = () => router.push("/");

  if (!campaignId) {
    return (
      <div className="h-screen bg-stone-100 flex items-center justify-center font-rethink text-stone-500">
        Invalid campaign
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="h-screen bg-stone-100 text-stone-900 flex flex-col font-rethink">
        <CampaignDetails campaignId={campaignId} onClose={handleClose} isMobile />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-rethink">
      <NavBar activeTab="home" onTabChange={() => router.push("/")} userName={userName} />

      {/* Campaign Details Drawer Modal (Right-sliding, w-1221px, 24px border-radius) */}
      <Drawer open={true} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DrawerContent className="overflow-hidden">
          <CampaignDetails campaignId={campaignId} onClose={handleClose} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
