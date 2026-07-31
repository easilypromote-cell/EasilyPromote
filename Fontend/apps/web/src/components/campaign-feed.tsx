"use client";

import type { CampaignItem, CreatorProfile } from "./types";
import { CampaignCard } from "./campaign-card";

interface CampaignFeedProps {
  profile: CreatorProfile;
  campaigns: CampaignItem[];
  filter: string;
  onFilterChange: (filter: string) => void;
  onSubmitContent: (id: string) => void;
  onUpdateContent: (id: string) => void;
  onSubmitPostUrl: (id: string) => void;
  postUrls: Record<string, string>;
  onPostUrlChange: (id: string, url: string) => void;
  onSelectCampaign: (campaign: CampaignItem) => void;
  onBrowseCampaign?: () => void;
}

export function CampaignFeed({
  profile,
  campaigns,
  filter,
  onFilterChange,
  onSubmitContent,
  onUpdateContent,
  onSubmitPostUrl,
  postUrls,
  onPostUrlChange,
  onSelectCampaign,
  onBrowseCampaign,
}: CampaignFeedProps) {
  return (
    <div className="w-full flex flex-col">
      {/* Header Welcome and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 w-full border-b border-stone-200 pb-5">
        <h2 className="font-motterdam text-[42px] leading-tight text-stone-900">
          Welcome, {profile.displayName.split(" ")[0]}
        </h2>

        {/* Filter select menu */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">Filter:</span>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="appearance-none bg-white border border-stone-200 rounded-full pl-4 pr-10 py-2 text-xs font-semibold text-stone-900 hover:border-stone-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Campaigns</option>
              <option value="needs_content">Needs Your Content</option>
              <option value="changes_requested">Changes Requested</option>
              <option value="under_review">Review In Progress</option>
              <option value="approved_post">Approved - Ready to Post</option>
              <option value="live_tracking">Live · tracking views</option>
              <option value="delivered">Delivered</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {campaigns.map((camp) => (
          <CampaignCard
            key={camp.id}
            campaign={camp}
            onSubmitContent={onSubmitContent}
            onUpdateContent={onUpdateContent}
            onSubmitPostUrl={onSubmitPostUrl}
            postUrl={postUrls[camp.id] || ""}
            onPostUrlChange={(url) => onPostUrlChange(camp.id, url)}
            onClick={() => onSelectCampaign(camp)}
          />
        ))}

        {/* Browse campaign block */}
        <div className="bg-[#F5F5F4]/40 border-2 border-stone-200 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="mb-4">
            <svg className="w-12 h-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <button
            onClick={() => onBrowseCampaign?.()}
            className="px-6 py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-900 rounded-full font-semibold text-xs shadow-sm transition-colors"
          >
            Browse campaign
          </button>
        </div>
      </div>
    </div>
  );
}
