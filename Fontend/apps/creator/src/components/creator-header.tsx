"use client";

import type { ActiveTab, DemoState, CreatorProfile } from "./types";

interface CreatorHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  profile: CreatorProfile;
  demoState: DemoState;
}

export function CreatorHeader({ activeTab, onTabChange, profile, demoState }: CreatorHeaderProps) {
  const isFeed = demoState === "feed";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#FEB604] flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-stone-950">E</span>
          </div>
          <span className="font-raleway font-semibold text-sm leading-[20px] text-[#0A0D14]">
            EasilyPromote
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="bg-stone-100 p-1.5 rounded-full flex gap-1 items-center border border-stone-200">
          <button
            onClick={() => onTabChange("home")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all text-xs font-semibold ${
              activeTab === "home"
                ? "bg-white text-stone-950 shadow-sm border border-stone-200"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              if (isFeed) onTabChange("campaign");
            }}
            disabled={!isFeed}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all text-xs font-semibold ${
              activeTab === "campaign"
                ? "bg-white text-stone-950 shadow-sm border border-stone-200"
                : "text-stone-500 hover:text-stone-900 disabled:opacity-40"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Campaign</span>
          </button>

          <button
            onClick={() => {
              if (isFeed) onTabChange("wallet");
            }}
            disabled={!isFeed}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all text-xs font-semibold ${
              activeTab === "wallet"
                ? "bg-white text-stone-950 shadow-sm border border-stone-200"
                : "text-stone-500 hover:text-stone-900 disabled:opacity-40"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
              <line x1="12" y1="10" x2="12" y2="10" />
            </svg>
            <span>Wallet</span>
          </button>
        </nav>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          {/* Rank badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F3FF] border border-[#DDD6FE] rounded-full">
            <span className="w-2 h-2 bg-[#7C3AED] rounded-full"></span>
            <span className="text-[11px] font-bold font-inter text-[#6D28D9]">{profile.rank}</span>
            <span className="text-[10px] text-stone-500 font-inter">0/10,000 views</span>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-2.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-full pl-2 pr-3 py-1 cursor-pointer transition-colors">
            <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden border border-stone-300">
              <span className="text-xs font-bold text-stone-600">
                {profile.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold leading-tight text-stone-900">
                {profile.displayName}
              </span>
              <span className="text-[9px] text-stone-500 leading-none">@{profile.username}</span>
            </div>
            <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
