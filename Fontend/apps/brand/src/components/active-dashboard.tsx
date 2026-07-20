import * as React from "react";
import { useRouter } from "next/navigation";
import { Filter, ChevronDown } from "lucide-react";
import { CampaignCard } from "@ep/ui/components/campaign-card";
import { TYPOGRAPHY } from "@ep/ui/lib/constants";
import { DraftAlertBanner } from "./draft-alert-banner";

interface ActiveDashboardProps {
  onCreateCampaign: () => void;
  showAlert: boolean;
  onCloseAlert: () => void;
}

export function ActiveDashboard({
  onCreateCampaign,
  showAlert,
  onCloseAlert,
}: ActiveDashboardProps) {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    router.push(`/campaign/${id}`);
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 z-10">
      {/* Drafts Alert Banner */}
      {showAlert && <DraftAlertBanner onClose={onCloseAlert} />}

      {/* Header section with Page Title and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className={TYPOGRAPHY.welcomeHeader}>
          Welcome, Acme Inc.
        </h2>

        <div className="flex items-center gap-3">
          {/* All Campaigns Filter Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-2.5 cursor-pointer hover:bg-stone-50 transition-colors">
            <Filter className="w-4 h-4 text-stone-500" />
            <span className="text-sm font-semibold text-stone-700">All Campaigns</span>
            <ChevronDown className="w-4 h-4 text-stone-400" />
          </div>

          {/* Create Campaign Button */}
          <button
            onClick={onCreateCampaign}
            className="px-6 py-2.5 bg-[#FEB604] hover:bg-[#FEB604]/95 text-[#1C1917] font-rethink font-semibold text-sm rounded-full shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Under Review (Newly Added to match image1.png!) */}
        <CampaignCard
          title="Launch my new Afrobeats single"
          status="under_review"
          progress={0}
          currentViews="0"
          targetViews="250,000"
          onClick={() => handleCardClick("afrobeats-single")}
        />

        {/* Card 2: Review Needed / Live */}
        <CampaignCard
          title="Launch my new Afrobeats single"
          status="review_needed"
          progress={68}
          currentViews="170,000"
          targetViews="250,000"
          onClick={() => handleCardClick("afrobeats-single")}
        />

        {/* Card 3: Draft */}
        <CampaignCard
          title="Launch my new Afrobeats single"
          status="draft"
          onResume={onCreateCampaign}
        />

        {/* Card 4: Paused */}
        <CampaignCard
          title="Launch my new Afrobeats single"
          status="paused"
          progress={68}
          currentViews="170,000"
          targetViews="250,000"
          onClick={() => handleCardClick("afrobeats-single")}
        />
      </div>
    </main>
  );
}
