import * as React from "react";
import Image from "next/image";
import { TYPOGRAPHY } from "@ep/ui/lib/constants";
import emptyHomeImg from "@ep/ui/assets/empty_home.png";
import footerImg from "@ep/ui/assets/Fotter compressed.webp";

interface EmptyStateProps {
  onCreateCampaign: () => void;
}

export function EmptyState({ onCreateCampaign }: EmptyStateProps) {
  return (
    <main className="flex-1 flex flex-col justify-between items-center max-w-7xl w-full mx-auto px-6 pt-12 pb-0 relative overflow-hidden">
      {/* Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto z-10">
        {/* Polaroid Illustration */}
        <div className="mb-6 transform -rotate-1 hover:rotate-0 transition-transform">
          <Image
            src={emptyHomeImg}
            alt="Campaign Illustration"
            width={280}
            height={280}
            className="drop-shadow-md"
            priority
          />
        </div>

        {/* Welcome Script Header */}
        <h2 className={`${TYPOGRAPHY.welcomeHeader} mb-3`}>
          Welcome, Acme Inc.
        </h2>

        {/* Subtitle */}
        <p className={`${TYPOGRAPHY.welcomeSubtitle} mb-8`}>
          Let's create a campaign that gets real results.
        </p>

        {/* Yellow Create Campaign Button */}
        <button
          onClick={onCreateCampaign}
          className="px-10 py-3.5 bg-[#FEB604] hover:bg-[#FEB604]/95 text-[#1C1917] font-rethink font-semibold text-sm rounded-full shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          Create Campaign
        </button>
      </div>

      {/* Bottom Polaroid Collage Image */}
      <div className="w-full mt-12 flex justify-center translate-y-6">
        <Image
          src={footerImg}
          alt="Creator Showcase"
          className="max-h-[260px] w-auto object-contain opacity-95"
          priority
        />
      </div>
    </main>
  );
}
