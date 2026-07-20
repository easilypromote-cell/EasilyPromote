import * as React from "react";
import { Music, Clock } from "lucide-react";
import { cn } from "../lib/utils";
import { TYPOGRAPHY } from "../lib/constants";

export interface CampaignCardProps {
  title: string;
  status: "review_needed" | "live" | "draft" | "paused" | "under_review" | "completed" | "cancelled";
  imageSrc?: string;
  category?: string;
  delivery?: string;
  progress?: number;
  currentViews?: string;
  targetViews?: string;
  onResume?: () => void;
  onClick?: () => void;
  className?: string;
}

export function CampaignCard({
  title,
  status,
  imageSrc,
  category = "Music",
  delivery = "7 Day Delivery",
  progress = 68,
  currentViews = "170,000",
  targetViews = "250,000",
  onResume,
  onClick,
  className,
}: CampaignCardProps) {
  // Determine badge colors and labels
  const getBadges = () => {
    switch (status) {
      case "review_needed":
        return (
          <div className="flex gap-2">
            <span className={cn("px-2.5 py-0.5 rounded-full bg-amber-100 flex items-center gap-1", TYPOGRAPHY.newBadge)}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E330C]" /> Review Needed
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium text-[11px] leading-[12px] font-inter flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> Live Campaigns
            </span>
          </div>
        );
      case "live":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium text-[11px] leading-[12px] font-inter flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> Live Campaigns
          </span>
        );
      case "draft":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium text-[11px] leading-[12px] font-inter flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" /> Draft
          </span>
        );
      case "paused":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-medium text-[11px] leading-[12px] font-inter flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600" /> Campaign Paused
          </span>
        );
      case "under_review":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#6E330C] font-semibold text-[11px] leading-[12px] font-inter flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6E330C]" /> Under Review
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold text-[11px] leading-[12px] font-inter flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold text-[11px] leading-[12px] font-inter flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-stone-50 rounded-2xl border border-stone-200 p-6 flex flex-col justify-between min-h-[300px] shadow-sm relative overflow-hidden transition-all hover:shadow-md",
        onClick && "cursor-pointer hover:border-stone-300 hover:scale-[1.01]",
        className
      )}
    >
      <div>
        {/* Top Section: Thumbnail and Badges */}
        <div className="flex items-start justify-between mb-6">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title}
              className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center border border-purple-200">
              {/* Twitch Mock Icon */}
              <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
            </div>
          )}
          {getBadges()}
        </div>

        {/* Campaign Title */}
        <h3 className="font-rethink font-semibold text-lg text-stone-900 mb-4 line-clamp-2">
          {title}
        </h3>
      </div>

      {status === "draft" ? (
        /* Center Resume Button for Drafts */
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onResume) onResume();
          }}
          className="w-full mt-2 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-900 rounded-full font-rethink font-semibold text-sm transition-colors"
        >
          Resume
        </button>
      ) : (
        /* Category, Duration, and Progress for Active/Paused */
        <div className="mt-auto">
          <div className="flex gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3FF] text-[#3B82F6] font-medium text-xs">
              <Music className="w-3.5 h-3.5" />
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 font-medium text-xs">
              <Clock className="w-3.5 h-3.5" />
              {delivery}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-stone-500 font-medium font-rethink">
              <span>{progress}%</span>
              <span>{currentViews} / {targetViews} views</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  status === "paused" ? "bg-orange-500" : "bg-blue-600"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
