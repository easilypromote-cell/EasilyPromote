"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { TiktokIcon, Message01Icon } from "@hugeicons/core-free-icons";
import type { CampaignItem } from "./types";

interface CampaignDetailsDrawerProps {
  campaign: CampaignItem;
  onClose: () => void;
  onSubmitContent: (id: string) => void;
  onUpdateContent: (id: string) => void;
  onSubmitPostUrl: (id: string, urls: { tiktok?: string; instagram?: string; x?: string }) => void;
}

export function CampaignDetailsDrawer({
  campaign,
  onClose,
  onSubmitContent,
  onUpdateContent,
  onSubmitPostUrl,
}: CampaignDetailsDrawerProps) {
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [xUrl, setXUrl] = useState("");

  const handleLinkSubmit = () => {
    onSubmitPostUrl(campaign.id, {
      tiktok: tiktokUrl,
      instagram: instagramUrl,
      x: xUrl,
    });
  };

  const platformLabels: Record<string, string> = {
    tiktok: "TikTok",
    instagram: "Instagram",
    youtube: "YouTube",
    twitter: "X (Twitter)",
  };

  const displayPlatforms = (campaign.platforms || ["tiktok", "instagram"])
    .map((p) => platformLabels[p] || p);

  const renderActivity = () => {
    const items = [];

    const ActivityPostItem = ({
      badgeLabel,
      badgeColorClass,
      badgeDotColorClass,
      timeText,
      commentText,
    }: {
      badgeLabel: string;
      badgeColorClass: string;
      badgeDotColorClass: string;
      timeText: string;
      commentText?: string;
    }) => (
      <div className="space-y-3">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-200 border border-stone-300 relative flex items-center justify-center shrink-0 overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-900 z-10">
              <svg className="w-2.5 h-2.5 translate-x-[1px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-indigo-100 opacity-60"></div>
          </div>

          <div className="flex-1 space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-[10px] text-stone-500 font-medium">
              <span>{timeText}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-medium flex items-center gap-1 ${badgeColorClass}`}>
                <span className={`w-1 h-1 rounded-full ${badgeDotColorClass}`} />
                {badgeLabel}
              </span>
            </div>
          </div>
        </div>

        {commentText && (
          <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-4 ml-18 flex gap-3 text-left">
            <HugeiconsIcon icon={Message01Icon} size={16} className="text-purple-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-stone-600 font-medium">
              &quot;{commentText}&quot;
            </p>
          </div>
        )}
      </div>
    );

    if (campaign.status === "delivered") {
      items.push(
        <div key="activity-delivered" className="space-y-4 border-b border-stone-100 pb-5">
          <ActivityPostItem
            badgeLabel="Delivered"
            badgeColorClass="bg-teal-50 text-teal-700 border border-teal-100"
            badgeDotColorClass="bg-teal-500"
            timeText="Campaign completed"
          />
        </div>
      );
    }

    if (campaign.status === "live_tracking" || campaign.status === "delivered") {
      items.push(
        <div key="activity-live" className="space-y-4 border-b border-stone-100 pb-5">
          <ActivityPostItem
            badgeLabel="Live · tracking views"
            badgeColorClass="bg-blue-50 text-blue-700 border border-blue-100"
            badgeDotColorClass="bg-blue-500"
            timeText="Content posted"
          />
        </div>
      );
    }

    if (campaign.status === "live_tracking" || campaign.status === "delivered" || campaign.status === "approved_post") {
      items.push(
        <div key="activity-approved" className="space-y-4 border-b border-stone-100 pb-5">
          <ActivityPostItem
            badgeLabel="Approved — Ready To Post"
            badgeColorClass="bg-green-50 text-green-700 border border-green-100"
            badgeDotColorClass="bg-green-500"
            timeText="Content approved"
          />
        </div>
      );
    }

    if (campaign.status === "changes_requested") {
      items.push(
        <div key="activity-changes" className="space-y-4 border-b border-stone-100 pb-5">
          <ActivityPostItem
            badgeLabel="Changes requested"
            badgeColorClass="bg-red-50 text-red-700 border border-red-100"
            badgeDotColorClass="bg-red-500"
            timeText="Review feedback"
            commentText={campaign.comment || "Please revise the content"}
          />
        </div>
      );
    }

    if (campaign.status === "under_review" || campaign.status === "approved_post") {
      items.push(
        <div key="activity-review" className="space-y-4">
          <ActivityPostItem
            badgeLabel="Review In Progress"
            badgeColorClass="bg-amber-50 text-[#6E330C] border border-amber-100"
            badgeDotColorClass="bg-[#FEB604]"
            timeText="Awaiting review"
          />
        </div>
      );
    }

    return items;
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        onClick={onClose}
        className="w-1/5 bg-stone-900/10 backdrop-blur-md p-6 flex flex-col justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2 opacity-80">
          <div className="w-5 h-5 rounded-full bg-[#FEB604] flex items-center justify-center">
            <span className="text-[8px] font-semibold text-stone-950">E</span>
          </div>
          <span className="font-raleway font-semibold text-xs leading-[20px] text-[#0A0D14] tracking-wide">EasilyPromote</span>
        </div>
      </div>

      <div className="w-4/5 h-full bg-[#FAFAF9] rounded-l-[32px] border-l border-stone-250 overflow-y-auto p-10 flex flex-col relative animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center w-full mb-10 pb-4 border-b border-stone-200/60">
          <button 
            onClick={onClose}
            className="text-stone-500 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Save and Close
          </button>
          
          <h2 className="font-rethink font-medium text-sm text-stone-900 tracking-wide">
            {campaign.title}
          </h2>
          
          <div className="w-20"></div>
        </div>

        <div className="max-w-xl w-full mx-auto space-y-8 pb-12">
          
          <div className="bg-stone-50 rounded-3xl border border-stone-100 p-4 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-[50px] h-[50px] rounded-2xl bg-purple-100 flex items-center justify-center border border-purple-200 mb-4">
              <HugeiconsIcon icon={TiktokIcon} size={24} className="text-purple-600" />
            </div>

            <h3 className="font-rethink font-medium tracking-tight text-[16px] text-stone-900 line-clamp-2 mb-3">
              {campaign.title}
            </h3>

            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium tracking-tight text-[10px] font-rethink">
                {campaign.category}
              </span>
              <StatusDetailsBadge status={campaign.status} />
            </div>

            <div className="w-full border-t border-stone-100 pt-6">
              
              {campaign.status === "needs_content" && (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => onSubmitContent(campaign.id)}
                    className="flex-1 py-4 bg-[#FEB604] text-stone-900 rounded-full font-semibold text-xs font-rethink"
                  >
                    Upload content
                  </button>
                </div>
              )}

              {campaign.status === "under_review" && (
                <div className="space-y-5 w-full">
                  <div className="bg-[#EBF3FF]/40 border border-[#BFDBFE] border-dashed rounded-2xl p-4 flex gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-white/90 border border-amber-250 flex items-center justify-center shrink-0">
                      <span className="text-[#FEB604] text-lg font-medium">⌛</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-stone-900">Waiting on brand review</h4>
                      <p className="text-[11px] leading-relaxed text-stone-500 font-medium">
                        Submitted recently. Most reviews are completed within 24 hours.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      disabled
                      className="flex-1 py-4 bg-stone-100 text-stone-400 rounded-full font-medium text-xs border border-stone-200 cursor-not-allowed font-rethink"
                    >
                      Upload content
                    </button>
                  </div>
                </div>
              )}

              {campaign.status === "changes_requested" && (
                <div className="space-y-5 w-full">
                  <div className="bg-[#EBF3FF]/40 border border-[#BFDBFE] border-dashed rounded-2xl p-4 flex gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-white/90 border border-red-200 flex items-center justify-center shrink-0">
                      <span className="text-red-500 text-base">⚠️</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-stone-900">
                        {campaign.comment || "Please revise the content"}
                      </h4>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateContent(campaign.id)}
                      className="flex-1 py-4 bg-[#FEB604] text-stone-900 rounded-full font-semibold text-xs font-rethink"
                    >
                      Upload new content
                    </button>
                  </div>
                </div>
              )}

              {campaign.status === "approved_post" && (
                <div className="space-y-5 w-full">
                  <div className="bg-[#EBF3FF]/40 border border-[#BFDBFE] border-dashed rounded-2xl p-4 flex gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-white/90 border border-green-200 flex items-center justify-center shrink-0">
                      <span className="text-green-500 text-base">📢</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-stone-900 leading-snug">
                        Post this on {displayPlatforms.join(", ")}, then paste the link below so we can start tracking your views.
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      placeholder="TikTok Post Link"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-300 font-rethink"
                    />
                    <input
                      type="text"
                      placeholder="Instagram post link"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-300 font-rethink"
                    />
                    <input
                      type="text"
                      placeholder="X post link"
                      value={xUrl}
                      onChange={(e) => setXUrl(e.target.value)}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-300 font-rethink"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleLinkSubmit}
                      className="flex-1 py-4 bg-[#FEB604] text-stone-900 rounded-full font-semibold text-xs font-rethink"
                    >
                      Submit link
                    </button>
                  </div>
                </div>
              )}

              {(campaign.status === "live_tracking" || campaign.status === "delivered") && (
                <div className="space-y-4 w-full">
                  {campaign.status === "delivered" && (
                    <div className="bg-[#EBF3FF]/40 border border-[#BFDBFE] border-dashed rounded-2xl p-4 flex gap-4 text-left">
                      <div className="w-10 h-10 rounded-full bg-white/90 border border-green-200 flex items-center justify-center shrink-0">
                        <span className="text-green-500 text-sm">✓</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-stone-900">Delivered</h4>
                        <p className="text-[11px] leading-relaxed text-stone-500 font-medium">
                          Target reached and verified. ₦{campaign.reward.toLocaleString()} was paid to your wallet
                        </p>
                      </div>
                    </div>
                  )}

                  {campaign.videoUrl && (
                    <div className="flex gap-4 items-start text-left bg-stone-50 border border-stone-200/60 rounded-2xl p-4">
                      <div className="w-12 h-12 rounded-xl bg-stone-200 relative flex items-center justify-center overflow-hidden shrink-0">
                        <div className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-[8px] z-10 font-medium">▶</div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-indigo-100 opacity-60"></div>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <p className="text-xs font-medium text-stone-900 leading-normal truncate">
                          {campaign.videoUrl}
                        </p>
                      </div>
                    </div>
                  )}

                  {campaign.postedPlatforms && campaign.postedPlatforms.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {campaign.postedPlatforms.map((p) => (
                        <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-200 text-stone-700 font-medium text-[10px] rounded-full">
                          {platformLabels[p] || p}
                        </span>
                      ))}
                    </div>
                  )}

                  {(campaign.currentViews !== undefined || campaign.progress !== undefined) && (
                    <div className="space-y-2 border-t border-stone-100 pt-4">
                      <div className="flex justify-between text-xs font-medium font-rethink">
                        <span className={campaign.status === "delivered" ? "text-teal-600 font-medium" : "text-stone-500"}>
                          {campaign.status === "delivered" ? "100% Complete" : `${campaign.progress || 0}%`}
                        </span>
                        <span className="text-stone-500">
                          {(campaign.currentViews || 0).toLocaleString()} / {(campaign.targetViews || 0).toLocaleString()} views
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-stone-100 border border-stone-200/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              campaign.status === "delivered" ? "bg-teal-500" : "bg-blue-600"
                            }`}
                            style={{ width: campaign.status === "delivered" ? "100%" : `${campaign.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-rethink font-medium text-sm text-stone-900 text-left">Slot details</h4>
            <div className="border border-stone-200/80 rounded-2xl bg-white p-5 space-y-3.5 text-xs text-left">
              <div className="flex justify-between">
                <span className="font-medium text-stone-500">Target</span>
                <span className="font-medium text-stone-900">{(campaign.targetViews || 0).toLocaleString()} views</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-500">Reward</span>
                <span className="font-medium text-stone-900">₦{campaign.reward.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-500">Platforms</span>
                <span className="font-medium text-stone-900">{displayPlatforms.join(", ")}</span>
              </div>
              {campaign.viewTarget && (
                <div className="flex justify-between">
                  <span className="font-medium text-stone-500">View Target</span>
                  <span className="font-medium text-stone-900">{campaign.viewTarget.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>

          {(campaign.contentBrief || campaign.keyMessageCta || campaign.whatToAvoid) && (
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 text-left space-y-4">
              <h4 className="font-rethink font-medium text-sm text-stone-900">The brief</h4>
              
              {campaign.contentBrief && (
                <p className="text-xs leading-relaxed text-stone-600 font-medium">
                  {campaign.contentBrief}
                </p>
              )}

              {campaign.keyMessageCta && (
                <div className="text-xs leading-relaxed text-stone-600 font-medium">
                  <strong>Key Message / CTA:</strong> {campaign.keyMessageCta}
                </div>
              )}

              {campaign.whatToAvoid && (
                <div className="text-xs leading-relaxed text-stone-600 font-medium">
                  <strong>What to Avoid:</strong> {campaign.whatToAvoid}
                </div>
              )}

              {campaign.contentStyle && (
                <div className="text-xs leading-relaxed text-stone-600 font-medium">
                  <strong>Content Style:</strong> {campaign.contentStyle}
                </div>
              )}
            </div>
          )}

          <div className="space-y-5">
            <h4 className="font-rethink font-medium text-sm text-stone-900 text-left">Activity</h4>
            <div className="space-y-5 border border-stone-200/80 rounded-2xl bg-white p-5">
              {renderActivity().length > 0 ? (
                <div className="space-y-5">
                  {renderActivity()}
                </div>
              ) : (
                <p className="text-xs text-stone-400 font-medium text-center py-4">No activity yet. Upload content to start review.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatusDetailsBadge({ status }: { status: CampaignItem["status"] }) {
  const badges: Record<
    CampaignItem["status"],
    { label: string; classes: string; dotClasses: string }
  > = {
    needs_content: {
      label: "3 Days Left",
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
      className={`px-2 py-0.5 rounded-full font-medium tracking-tight text-[10px] font-rethink flex items-center gap-1 ${badge.classes}`}
    >
      <span className={`w-1 h-1 rounded-full ${badge.dotClasses}`} /> {badge.label}
    </span>
  );
}
