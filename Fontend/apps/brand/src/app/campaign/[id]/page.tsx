"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@ep/ui/components/nav-bar";
import { Drawer, DrawerContent } from "../../../components/ui/drawer";
import { CampaignDetails } from "../../../components/campaign-details";
import { getUser, isAuthenticated } from "../../../lib/api";

export default function CampaignDetailsPage() {
  const router = useRouter();
  const params = useParams();
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

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-stone-900 flex flex-col font-rethink">
      <NavBar activeTab="home" onTabChange={() => router.push("/")} userName={userName} />

      {/* Campaign Details Drawer Modal (Right-sliding, w-1221px, 24px border-radius) */}
      <Drawer open={true} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DrawerContent className="overflow-hidden">
          <CampaignDetails campaignId={params.id as string} onClose={handleClose} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
