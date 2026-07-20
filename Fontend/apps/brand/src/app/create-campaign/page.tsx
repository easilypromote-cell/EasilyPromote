"use client";

import { useRouter } from "next/navigation";
import { CampaignWizard } from "../../components/campaign-wizard";
import { NavBar } from "@ep/ui/components/nav-bar";
import { Drawer, DrawerContent } from "../../components/ui/drawer";

export default function CreateCampaignPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  const handleSuccess = () => {
    router.push("/?state=active");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-stone-900 flex flex-col font-rethink">
      {/* Background Page Layout (NavBar shown blurred underneath) */}
      <NavBar activeTab="home" onTabChange={(tab) => router.push("/")} userName="Acme Inc." />

      {/* Campaign Wizard Drawer Modal (Right-sliding, w-1221px, 24px border-radius) */}
      <Drawer open={true} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DrawerContent className="overflow-hidden">
          <CampaignWizard onClose={handleClose} onSuccess={handleSuccess} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
