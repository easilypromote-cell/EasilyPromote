"use client";

import type { CreatorProfile } from "./types";

interface OnboardingCompleteProps {
  profile: CreatorProfile;
  onBrowseCampaigns: () => void;
}

export function OnboardingComplete({ profile, onBrowseCampaigns }: OnboardingCompleteProps) {
  return (
    <div className="w-full flex flex-col items-center max-w-xl text-center">
      {/* Polaroid Illustration */}
      <div className="mb-6 border border-stone-200 bg-white rounded-3xl p-6 shadow-md max-w-xs mx-auto transform -rotate-1">
        <div className="w-full aspect-square bg-[#F5F5F4] rounded-2xl flex items-center justify-center border border-stone-200 overflow-hidden relative">
          <svg className="w-[120px] h-[120px] text-stone-700" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="40" r="16" fill="white" stroke="#1C1917" strokeWidth="2" />
            <path d="M25 80c0-12 10-22 25-22s25 10 25 22H25z" fill="#FEB604" stroke="#1C1917" strokeWidth="2" />
            <path d="m15 25 2 2 3-3-3-3z" fill="#1C1917" />
            <path d="m85 35 2 2 3-3-3-3z" fill="#1C1917" />
          </svg>
        </div>
        <div className="pt-4 text-left">
          <span className="font-motterdam text-lg text-stone-900">Love, {profile.displayName.split(" ")[0]}</span>
        </div>
      </div>

      <h2 className="font-rethink font-bold text-2xl text-stone-900 mb-2">
        You&apos;re all set — no campaigns yet.
      </h2>
      <p className="text-sm text-stone-500 mb-8 font-medium">
        We&apos;ve matched campaigns to your niches: {profile.niches.join(", ") || "Music, Lifestyle"}
      </p>

      <button
        onClick={onBrowseCampaigns}
        className="px-10 py-3.5 bg-[#FEB604] hover:bg-[#FEB604]/90 text-stone-950 font-rethink font-semibold text-sm rounded-full shadow-md transition-all hover:scale-105"
      >
        Browse campaigns
      </button>
    </div>
  );
}
