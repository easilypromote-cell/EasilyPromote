"use client";

import { useRouter } from "next/navigation";
import { CampaignWizard } from "../../components/campaign-wizard";
import { NavBar } from "@ep/ui/components/nav-bar";
import { Drawer, DrawerContent } from "../../components/ui/drawer";
import { useIsMobile } from "@ep/ui/hooks/use-is-mobile";

export default function CreateCampaignPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleClose = () => {
    router.push("/");
  };

  const handleSuccess = () => {
    router.push("/?state=active");
  };

  if (isMobile) {
    return (
      <div className="h-screen bg-stone-50 text-stone-900 flex flex-col font-rethink">
        {/* Mobile: Back button header */}
        <header className="flex items-center justify-center h-14 px-4 border-b border-stone-200 bg-white flex-shrink-0 relative">
          <button onClick={handleClose} className="absolute left-4 text-sm font-semibold text-stone-900 font-rethink">
            ← Back
          </button>
          <h3 className="font-rethink font-semibold tracking-tight text-xl text-stone-900">Create a Campaign</h3>
        </header>
        <div className="flex-1 overflow-hidden">
          <CampaignWizard onClose={handleClose} onSuccess={handleSuccess} isMobile />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-rethink">
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
