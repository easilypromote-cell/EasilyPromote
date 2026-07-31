"use client";

import { useState } from "react";
import type { MarketplaceCampaign } from "./types";

interface CampaignMarketplaceProps {
  campaigns: MarketplaceCampaign[];
  meta: { activeSlots: number; maxSlots: number; canClaim: boolean };
  onClaimSlot: (campaignId: string) => void;
}

export function CampaignMarketplace({ campaigns, meta, onClaimSlot }: CampaignMarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showLimitBanner, setShowLimitBanner] = useState(true);

  const categories = ["All", "Music", "Lifestyle", "Fashion", "Beauty", "Tech", "Food", "Fitness", "Travel"];

  const filtered = activeCategory === "All"
    ? campaigns
    : campaigns.filter((c) => c.category === activeCategory);

  const isAtLimit = !meta.canClaim;

  return (
    <div className="w-full flex flex-col font-rethink">
      
      {/* Category Tabs and Sort Selector Row */}
      <div className="flex justify-between items-center w-full mb-8 border-b border-stone-200 pb-5">
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-100 hover:bg-stone-200/70 text-stone-500 hover:text-stone-850"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 hover:border-stone-300 bg-white text-stone-700 font-semibold text-xs rounded-full shadow-sm transition-colors">
          <span>⇅ Sort</span>
          <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Empty State View */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-6">
          <div className="w-64 h-64 mb-6 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FEB604]/60 animate-spin-slow"></div>
            
            <svg className="w-48 h-48 text-stone-800" viewBox="0 0 100 100" fill="none">
              <path 
                d="M30 75C30 75 35 60 50 60C65 60 70 75 70 75M50 60V38M50 38C52.5 38 54 36.5 54 34C54 31.5 52.5 30 50 30C47.5 30 46 31.5 46 34C46 36.5 47.5 38 50 38Z" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <circle cx="50" cy="27" r="2.5" fill="#FEB604" />
              <path 
                d="M36 50C38 48 42 48 44 51M64 50C62 48 58 48 56 51M25 70C20 68 20 62 26 56C32 50 36 50 36 50M75 70C80 68 80 62 74 56C68 50 64 50 64 50" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <circle cx="27" cy="56" r="1.5" fill="#FEB604" />
              <circle cx="73" cy="56" r="1.5" fill="#FEB604" />
            </svg>
          </div>

          <h3 className="font-rethink font-bold text-[22px] text-stone-900 mb-2">
            Nothing right now :(
          </h3>
          <p className="text-xs text-stone-500 font-medium max-w-xs leading-relaxed">
            New campaigns are added often — check back soon
          </p>
        </div>
      ) : (
        <div className="space-y-6 w-full">
          
          {/* Active Limit Warning Banner */}
          {isAtLimit && showLimitBanner && (
            <div className="bg-[#EBF3FF]/40 border border-[#BFDBFE] border-dashed rounded-3xl p-5 flex items-center justify-between gap-4 text-left shadow-sm">
              <div className="flex gap-4 items-center">
                <div className="w-11 h-11 rounded-full bg-white border border-blue-200 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[#2563EB] text-xl font-bold">📋</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-stone-900 leading-snug">
                    You&apos;re at your active slot limit ({meta.activeSlots}/{meta.maxSlots}). Complete or deliver a slot to claim something new.
                  </h4>
                </div>
              </div>
              <button 
                onClick={() => setShowLimitBanner(false)}
                className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-50 flex items-center justify-center shrink-0 text-stone-400 hover:text-stone-700 transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* Available Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filtered.map((camp) => (
              <div 
                key={camp.id} 
                onClick={() => {
                  if (isAtLimit) {
                    alert("You're at your active slot limit. Complete a campaign first!");
                  } else {
                    onClaimSlot(camp.id);
                  }
                }}
                className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-stone-300 cursor-pointer text-left"
              >
                {/* Platform Icon */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center border border-purple-200">
                    <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                    </svg>
                  </div>
                </div>

                {/* Campaign Title & Platform Tags */}
                <div className="flex-1 text-left">
                  <h3 className="font-rethink font-semibold text-[16px] text-stone-900 leading-snug mb-4">
                    {camp.title}
                  </h3>
                  <div className="flex gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3FF] text-[#2563EB] font-bold text-[10px] tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
                      {camp.category}
                    </span>
                    {camp.platforms.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-500 font-semibold text-[10px]">
                        {camp.platforms.join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer slots left & reward info */}
                <div className="mt-auto border-t border-stone-100 pt-4 flex justify-between items-center text-xs font-semibold">
                  <span className="text-stone-400 font-medium">
                    {camp.slotsLeft} slots left - {camp.daysLeft} days left
                  </span>
                  <span className="text-stone-900 font-bold">
                    Reward: ₦{camp.reward.toLocaleString()}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
