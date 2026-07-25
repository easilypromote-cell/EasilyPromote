"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Filter, ChevronDown, Plus } from "lucide-react";
import { CampaignCard } from "@ep/ui/components/campaign-card";
import { cn } from "@ep/ui/lib/utils";
import { useReveal } from "../hooks/use-reveal";

export interface BrandCampaign {
  id: string;
  name: string;
  category: string;
  status: string;
  targetViews: number;
  viewsDelivered: number;
  budget: number;
  progressPercent: number;
  coverImageUrl?: string;
  contentBrief?: string;
}

interface ActiveDashboardProps {
  campaigns: BrandCampaign[];
  onCreateCampaign: () => void;
  userName: string;
}

const FILTER_OPTIONS = ["All Campaigns", "Live", "Draft", "Paused", "Completed"] as const;

function mapStatus(s: string): "review_needed" | "live" | "draft" | "paused" | "under_review" | "completed" | "cancelled" | "pending_payment" {
  switch (s) {
    case "live": return "live";
    case "draft": return "draft";
    case "paused": return "paused";
    case "completed": return "completed";
    case "cancelled": return "cancelled";
    case "under_review": return "under_review";
    case "pending_payment": return "pending_payment";
    default: return "draft";
  }
}

export function ActiveDashboard({ campaigns, onCreateCampaign, userName }: ActiveDashboardProps) {
  const router = useRouter();
  useReveal();

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("All Campaigns");
  const filterRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = (id: string, status: string) => {
    if (status === "draft") {
      router.push(`/create-campaign?id=${id}`);
    } else {
      router.push(`/campaign/${id}`);
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (selectedFilter === "All Campaigns") return true;
    return c.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 z-10">
      <div data-reveal className="grid grid-cols-[1fr_auto] items-center gap-4 mb-16">
        <h2 className="font-motterdam font-normal text-[23px] leading-[28px] text-stone-900 m-0">
          Welcome, {userName.split(" ")[0]}
        </h2>

        <div className="flex items-center gap-3">
          <div ref={filterRef} className="relative z-[100]">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-2 bg-white border border-stone-200 rounded-full p-3 md:px-4 md:py-2.5 cursor-pointer"
            >
              <Filter className="w-5 h-5 md:w-4 md:h-4 text-stone-500" />
              <span className="hidden md:inline text-sm font-medium text-stone-900">{selectedFilter}</span>
              <ChevronDown className="w-4 h-4 hidden md:block text-stone-400" />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl py-1 z-50 shadow-lg">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "flex items-center w-full px-4 py-2.5 text-sm text-left",
                      selectedFilter === option ? "font-semibold text-stone-900" : "font-medium text-stone-700"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onCreateCampaign}
            className="flex items-center justify-center gap-2 p-3 md:px-6 md:py-2.5 bg-[#FEB604] text-[#1C1917] font-rethink font-semibold text-sm rounded-full border border-stone-100"
          >
            <Plus className="w-5 h-5 md:hidden" />
            <span className="hidden md:inline">Create Campaign</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((camp) => (
          <div data-reveal key={camp.id}>
            <CampaignCard
              title={camp.name}
              status={mapStatus(camp.status)}
              category={camp.category}
              imageSrc={camp.coverImageUrl}
              contentBrief={camp.contentBrief}
              progress={camp.progressPercent}
              currentViews={camp.viewsDelivered.toLocaleString()}
              targetViews={camp.targetViews.toLocaleString()}
              delivery=""
              onClick={() => handleCardClick(camp.id, camp.status)}
              onResume={() => handleCardClick(camp.id, camp.status)}
            />
          </div>
        ))}

        {filteredCampaigns.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-stone-500 text-sm font-medium">No campaigns found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
