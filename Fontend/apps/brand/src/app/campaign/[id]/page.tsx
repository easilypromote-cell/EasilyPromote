"use client";

import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@ep/ui/components/nav-bar";
import { Drawer, DrawerContent } from "../../../components/ui/drawer";
import { CampaignDetails } from "../../../components/campaign-details";

export default function CampaignDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const handleClose = () => {
    router.push("/?state=active");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-stone-900 flex flex-col font-rethink">
      {/* Background Page Layout (NavBar shown blurred underneath) */}
      <NavBar activeTab="home" onTabChange={(tab) => router.push("/")} userName="Acme Inc." />

      {/* Campaign Details Drawer Modal (Right-sliding, w-1221px, 24px border-radius) */}
      <Drawer open={true} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DrawerContent className="overflow-hidden">
          <CampaignDetails onClose={handleClose} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
