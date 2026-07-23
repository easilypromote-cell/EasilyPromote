import * as React from "react";
import { useRouter } from "next/navigation";
import { Filter, ChevronDown } from "lucide-react";
import { CampaignCard } from "@ep/ui/components/campaign-card";
import { cn } from "@ep/ui/lib/utils";
import { useReveal } from "../hooks/use-reveal";

interface ActiveDashboardProps {
  onCreateCampaign: () => void;
}

const FILTER_OPTIONS = ["All Campaigns", "Live", "Draft", "Paused"] as const;

export function ActiveDashboard({
  onCreateCampaign,
}: ActiveDashboardProps) {
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

  const handleCardClick = (id: string) => {
    router.push(`/campaign/${id}`);
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 z-10">
      {/* Header section */}
      <div data-reveal className="grid grid-cols-[1fr_auto] items-center gap-4 mb-16">
        <h2 className="font-motterdam font-normal text-[23px] leading-[28px] text-stone-900 m-0">
          Welcome, Acme Inc.
        </h2>

        <div className="flex items-center gap-3">
          {/* All Campaigns Filter Dropdown */}
          <div ref={filterRef} className="relative z-[100]">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-2.5 cursor-pointer"
            >
              <Filter className="w-4 h-4 text-stone-500" />
              <span className="text-sm font-medium text-stone-900">{selectedFilter}</span>
              <ChevronDown className="w-4 h-4 text-stone-400" />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl py-1 z-50">
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

          {/* Create Campaign Button */}
          <button
            onClick={onCreateCampaign}
            className="px-6 py-2.5 bg-[#FEB604] text-[#1C1917] font-rethink font-bold text-sm rounded-full border border-stone-100"
          >
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div data-reveal>
          <CampaignCard
            title="Launch my new Afrobeats single"
            status="under_review"
            progress={0}
            currentViews="0"
            targetViews="250,000"
            onClick={() => handleCardClick("afrobeats-single")}
          />
        </div>

        <div data-reveal>
          <CampaignCard
            title="Launch my new Afrobeats single"
            status="review_needed"
            progress={68}
            currentViews="170,000"
            targetViews="250,000"
            onClick={() => handleCardClick("afrobeats-single")}
          />
        </div>

        <div data-reveal>
          <CampaignCard
            title="Launch my new Afrobeats single"
            status="draft"
            onResume={onCreateCampaign}
          />
        </div>

        <div data-reveal>
          <CampaignCard
            title="Launch my new Afrobeats single"
            status="paused"
            progress={68}
            currentViews="170,000"
            targetViews="250,000"
            onClick={() => handleCardClick("afrobeats-single")}
          />
        </div>
      </div>
    </main>
  );
}
