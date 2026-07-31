"use client";

import type { CampaignItem } from "./types";

interface CampaignCardProps {
  campaign: CampaignItem;
  onSubmitContent: (id: string) => void;
  onUpdateContent: (id: string) => void;
  onSubmitPostUrl: (id: string) => void;
  postUrl: string;
  onPostUrlChange: (url: string) => void;
  onClick?: () => void;
}

export function CampaignCard({
  campaign,
  onSubmitContent,
  onUpdateContent,
  onSubmitPostUrl,
  postUrl,
  onPostUrlChange,
  onClick,
}: CampaignCardProps) {
  const camp = campaign;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-stone-300 cursor-pointer"
    >
      {/* Top bar info */}
      <div className="flex items-start justify-between mb-5">
        {/* Platform Icon */}
        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center border border-purple-200">
          <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
          </svg>
        </div>

        {/* Status Badges */}
        <StatusBadge status={camp.status} />
      </div>

      {/* Title and details */}
      <div className="flex-1">
        <h3 className="font-rethink font-semibold text-[16px] text-stone-900 leading-snug mb-4">
          {camp.title}
        </h3>

        {/* Tags */}
        <div className="flex gap-2 mb-5">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EBF3FF] text-[#2563EB] font-bold text-[10px] tracking-wider uppercase font-rethink">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
            {camp.category}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-500 font-semibold text-[10px] font-rethink">
            {camp.delivery}
          </span>
        </div>
      </div>

      {/* Interactive/States Actions */}
      <div className="mt-auto border-t border-stone-100 pt-4">
        {camp.status === "needs_content" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-500">
              {camp.viewTarget && <span>Target: {camp.viewTarget.toLocaleString()} views</span>}
              <span className="text-stone-900 font-bold">Reward: ₦{camp.reward.toLocaleString()}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onSubmitContent(camp.id); }}
              className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-white rounded-full font-semibold text-xs transition-colors shadow-sm"
            >
              Submit Content
            </button>
          </div>
        )}

        {camp.status === "changes_requested" && (
          <div className="space-y-4">
            <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-3 flex gap-2.5">
              <svg
                className="w-4 h-4 text-purple-600 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-[11px] leading-relaxed text-stone-600 font-medium">
                &quot;{camp.comment}&quot;
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onUpdateContent(camp.id); }}
              className="w-full py-2.5 bg-[#FEB604] hover:bg-[#FEB604]/90 text-stone-950 rounded-full font-semibold text-xs transition-colors"
            >
              Update Content
            </button>
          </div>
        )}

        {camp.status === "under_review" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-500">
              {camp.viewTarget && <span>Target: {camp.viewTarget.toLocaleString()} views</span>}
              <span className="text-stone-900 font-bold">Reward: ₦{camp.reward.toLocaleString()}</span>
            </div>
            <button
              disabled
              className="w-full py-2.5 bg-stone-100 text-stone-400 rounded-full font-semibold text-xs border border-stone-200 cursor-not-allowed"
            >
              Awaiting Approval
            </button>
          </div>
        )}

        {camp.status === "approved_post" && (
          <div className="space-y-3.5">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-500">
              <span>Post on Instagram, then paste your link here</span>
              <span className="text-stone-900 font-bold">Reward: ₦{camp.reward.toLocaleString()}</span>
            </div>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder="https://instagram.com/p/..."
                value={postUrl}
                onChange={(e) => onPostUrlChange(e.target.value)}
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-300"
              />
              <button
                onClick={(e) => { e.stopPropagation(); onSubmitPostUrl(camp.id); }}
                className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white rounded-full font-semibold text-xs transition-colors shrink-0 shadow-sm"
              >
                Submit link
              </button>
            </div>
          </div>
        )}

        {camp.status === "live_tracking" && (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-stone-500 font-semibold font-rethink">
              <span>{camp.progress}%</span>
              <span>
                {camp.currentViews?.toLocaleString()} / {camp.targetViews?.toLocaleString()} views
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 border border-stone-200/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${camp.progress}%` }}
              />
            </div>
          </div>
        )}

        {camp.status === "delivered" && (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-teal-600 font-bold font-rethink">
              <span>100% Complete</span>
              <span>
                {camp.currentViews?.toLocaleString()} / {camp.targetViews?.toLocaleString()} views
              </span>
            </div>
            <div className="w-full h-2 bg-teal-50 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-teal-500" style={{ width: "100%" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CampaignItem["status"] }) {
  const badges: Record<CampaignItem["status"], { label: string; classes: string; dotClasses: string }> = {
    needs_content: {
      label: "Needs Your Content",
      classes: "bg-stone-100 text-stone-600",
      dotClasses: "bg-stone-400",
    },
    changes_requested: {
      label: "Changes requested",
      classes: "bg-red-50 text-red-700 border border-red-100",
      dotClasses: "bg-red-500",
    },
    under_review: {
      label: "Review In Progress",
      classes: "bg-amber-50 text-[#6E330C] border border-amber-100",
      dotClasses: "bg-[#FEB604]",
    },
    approved_post: {
      label: "Approved — Ready To Post",
      classes: "bg-green-50 text-green-700 border border-green-100",
      dotClasses: "bg-green-500",
    },
    live_tracking: {
      label: "Live · tracking views",
      classes: "bg-blue-50 text-blue-700 border border-blue-100",
      dotClasses: "bg-blue-500 animate-pulse",
    },
    delivered: {
      label: "Delivered",
      classes: "bg-teal-50 text-teal-700 border border-teal-100",
      dotClasses: "bg-teal-500",
    },
  };

  const badge = badges[status];

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] leading-[12px] font-inter flex items-center gap-1 ${badge.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClasses}`} /> {badge.label}
    </span>
  );
}
