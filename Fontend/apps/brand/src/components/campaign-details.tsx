"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  FolderOpen,
  FolderSync,
  MoreHorizontal,
  Play,
  Plus,
} from "lucide-react";
import { cn } from "@ep/ui/lib/utils";
import { useReveal } from "../hooks/use-reveal";
import { apiRequest, getToken } from "../lib/api";

import illustration1 from "@ep/ui/assets/illustrations/illustration1.svg";
import illustration3 from "@ep/ui/assets/illustrations/illustration3.svg";
import illustration4 from "@ep/ui/assets/illustrations/illustration4.svg";
import illustration7 from "@ep/ui/assets/illustrations/illustration7.svg";

type TabType = "Overview" | "Submission" | "Payouts";

interface CampaignData {
  id: string;
  name: string;
  category: string;
  coverImageUrl?: string;
  targetViews: number;
  budget: number;
  costPerView: number;
  startDate: string;
  endDate: string;
  status: string;
  viewsDelivered: number;
  progressPercent: number;
  contentBrief?: string;
  keyMessageCta?: string;
  whatToAvoid?: string;
  scriptUrl?: string;
  scriptFileName?: string;
  platforms?: string[];
  contentStyle?: string[];
  platformFeePercent?: number;
  platformFee?: number;
  creatorPool?: number;
  submissionsReceived: number;
  submissionsApproved: number;
  submissionsAwaitingReview: number;
}

interface SubmissionData {
  id: string;
  creatorId: string;
  creatorHandle: string;
  videoUrl?: string;
  caption?: string;
  durationSeconds?: number;
  uploadedAt: string;
  status: string;
  rejectionReason?: string;
  postedPlatforms?: { platform: string; postUrl: string; views: number; likes: number; comments: number }[];
  viewsDelivered?: number;
  payoutStatus?: string;
  payoutAmount?: number;
  postedAt?: string;
  reviewedAt?: string;
}

interface SubmissionCounts {
  new: number;
  approved: number;
  awaitingPost: number;
  posted: number;
  rejected: number;
}

interface CampaignDetailsProps {
  campaignId: string;
  onClose?: () => void;
}

function CreatorAvatar({ seed }: { seed: string }) {
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-200 to-[#FEB604] border border-white flex items-center justify-center text-[10px] font-medium text-stone-950 flex-shrink-0">
      {seed.substring(0, 2).toUpperCase()}
    </div>
  );
}

export function CampaignDetails({ campaignId, onClose }: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");

  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [counts, setCounts] = useState<SubmissionCounts>({ new: 0, approved: 0, awaitingPost: 0, posted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useReveal(activeTab);

  const fetchCampaign = useCallback(async () => {
    try {
      const token = getToken();
      const data = await apiRequest<CampaignData>(`/campaigns/${campaignId}`, { token: token || undefined });
      setCampaign(data);
    } catch (err: any) {
      setError(err.message || "Failed to load campaign");
    }
  }, [campaignId]);

  const fetchSubmissions = useCallback(async () => {
    try {
      const token = getToken();
      const data = await apiRequest<{ counts: SubmissionCounts; submissions: SubmissionData[] }>(
        `/submissions/campaign/${campaignId}`,
        { token: token || undefined }
      );
      setSubmissions(data.submissions || []);
      setCounts(data.counts || { new: 0, approved: 0, awaitingPost: 0, posted: 0, rejected: 0 });
    } catch {
      // submissions may not exist yet
    }
  }, [campaignId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchCampaign(), fetchSubmissions()]);
      setLoading(false);
    };
    load();
  }, [fetchCampaign, fetchSubmissions]);

  const handleDeleteDraft = async () => {
    if (!window.confirm("Are you sure you want to delete this campaign? This cannot be undone.")) return;
    try {
      const token = getToken();
      await apiRequest(`/campaigns/${campaignId}`, { method: "DELETE", token: token || undefined });
      onClose?.();
    } catch (err: any) {
      alert(err.message || "Failed to delete campaign");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-stone-400 font-rethink text-sm">Loading campaign...</span>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <span className="text-stone-500 font-rethink text-sm">{error || "Campaign not found"}</span>
        {onClose && (
          <button onClick={onClose} className="text-sm font-medium text-stone-900 underline">
            Go back
          </button>
        )}
      </div>
    );
  }

  const currentStatus = campaign.status;
  const formattedBudget = `₦${campaign.budget.toLocaleString()}`;
  const formattedTarget = `${campaign.targetViews.toLocaleString()} views`;

  const postedSubmissions = submissions.filter((s) => s.status === "posted");
  const hasItems = postedSubmissions.length > 0;

  const totalEscrowed = campaign.budget;
  const platformFee = campaign.platformFee || Math.round(campaign.budget * (campaign.platformFeePercent || 0.3));
  const creatorPool = campaign.creatorPool || totalEscrowed - platformFee;
  const releasedTotal = submissions.reduce((sum, s) => sum + (s.payoutStatus === "released" ? (s.payoutAmount || 0) : 0), 0);
  const pendingEscrow = creatorPool - releasedTotal;

  return (
    <div className="flex h-full bg-white">
      {/* Left sidebar – tabs */}
      <div className="w-20 border-r border-stone-100 flex flex-col items-center py-16 gap-12 flex-shrink-0">
        <div className="flex flex-col gap-4 items-center">
          {(["Overview", "Submission", "Payouts"] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                  isActive
                    ? "bg-stone-900 text-white"
                    : "text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                )}
              >
                {tab === "Overview" && <FolderSync className="w-4 h-4" />}
                {tab === "Submission" && <FolderOpen className="w-4 h-4" />}
                {tab === "Payouts" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 items-center mt-auto pb-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-200 text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Dashboard Area */}
      <div className="flex-1 p-12 overflow-y-auto h-full" data-lenis-prevent>
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "Overview" && (
          <div className="w-[350px] mx-auto space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center border border-purple-200 flex-shrink-0 overflow-hidden">
                {campaign.coverImageUrl ? (
                  <img src={campaign.coverImageUrl} alt={campaign.name} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-9 h-9 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                )}
              </div>
              <div className="space-y-1.5">
                <h2 className="font-rethink font-semibold text-xl text-stone-900 leading-tight">
                  {campaign.name}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium tracking-tight text-[10px] font-rethink">
                  {campaign.category}
                </span>
              </div>
            </div>

            {/* Campaign Details Key-Value List */}
            <div className="space-y-4 pt-6">
              <div className="flex justify-between items-center font-rethink text-sm font-medium">
                <span className="text-[#78716C]">Target Views</span>
                <span className="text-[#1C1917] font-medium">{formattedTarget}</span>
              </div>
              <div className="flex justify-between items-center font-rethink text-sm font-medium">
                <span className="text-[#78716C]">Budget</span>
                <span className="text-[#1C1917] font-medium">{formattedBudget}</span>
              </div>
              {campaign.platforms && campaign.platforms.length > 0 && (
                <div className="flex justify-between items-center font-rethink text-sm font-medium">
                  <span className="text-[#78716C]">Platforms</span>
                  <span className="text-[#1C1917] font-medium">{campaign.platforms.join(", ")}</span>
                </div>
              )}
              {campaign.contentStyle && campaign.contentStyle.length > 0 && (
                <div className="flex justify-between items-center font-rethink text-sm font-medium">
                  <span className="text-[#78716C]">Content style</span>
                  <span className="text-[#1C1917] font-medium">{Array.isArray(campaign.contentStyle) ? campaign.contentStyle.join(", ") : campaign.contentStyle}</span>
                </div>
              )}
              {campaign.scriptUrl && (
                <div className="flex justify-between items-center font-rethink text-sm font-medium">
                  <span className="text-[#78716C]">Script</span>
                  <a
                    href={campaign.scriptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium underline text-[#1C1917]"
                  >
                    {campaign.scriptFileName || "View document"}
                  </a>
                </div>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-3 pt-2">
              {(currentStatus === "draft" || currentStatus === "pending_payment") ? (
                <button onClick={handleDeleteDraft} className="flex-1 py-3 bg-red-50 text-red-600 font-semibold text-sm rounded-full border border-red-200">
                  Delete campaign
                </button>
              ) : (
                <>
                  <button className="flex-1 py-3 bg-white text-stone-900 font-semibold text-sm rounded-full border border-stone-200">
                    Top up budget
                  </button>
                  <button className="px-3.5 py-3 bg-white text-stone-600 rounded-full border border-stone-200">
                    <MoreHorizontal className="w-5 h-5 text-stone-700" />
                  </button>
                </>
              )}
            </div>

            {/* Status Alert Box */}
            {(currentStatus === "under_review" || currentStatus === "completed" || currentStatus === "cancelled" || currentStatus === "paused") && (
              <div className={cn(
                "flex items-start gap-4 border border-dashed rounded-[20px] p-4 relative overflow-hidden",
                currentStatus === "cancelled" ? "bg-red-50 border-red-200" : "bg-[#EBF3FF] border-blue-200"
              )}>
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <Image src={illustration3} alt="Status" width={48} height={48} />
                </div>
                <div className="space-y-1 mt-0.5">
                  {currentStatus === "under_review" && (
                    <>
                      <h4 className="font-rethink font-medium text-sm text-[#6E330C]">Under review</h4>
                      <p className="font-rethink text-xs text-stone-600 font-medium leading-normal">
                        We&apos;re reviewing your campaign. It&apos;ll go live within 2 hours.
                      </p>
                    </>
                  )}
                  {currentStatus === "completed" && (
                    <>
                      <h4 className="font-rethink font-medium text-sm text-green-800">Completed</h4>
                      <p className="font-rethink text-xs text-stone-600 font-medium leading-normal">
                        Target reached. All funds have been released.
                      </p>
                    </>
                  )}
                  {currentStatus === "paused" && (
                    <>
                      <h4 className="font-rethink font-medium text-sm text-[#92400E]">Paused</h4>
                      <p className="font-rethink text-xs text-stone-600 font-medium leading-normal">
                        This campaign is paused. Resume it when you&apos;re ready.
                      </p>
                    </>
                  )}
                  {currentStatus === "cancelled" && (
                    <>
                      <h4 className="font-rethink font-medium text-sm text-red-800">Cancelled</h4>
                      <p className="font-rethink text-xs text-stone-600 font-medium leading-normal">
                        This campaign was cancelled. Unspent budget has been refunded.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Campaign Progress Card */}
              <div className="bg-stone-100 rounded-[24px] p-4 space-y-4">
                <span className="text-xs font-medium text-stone-500 block">Campaign progress</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold tracking-tight text-stone-900 font-rethink">
                    {campaign.viewsDelivered.toLocaleString()} / {campaign.targetViews.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="14" cy="14" r="11" className="stroke-stone-200" strokeWidth="3.5" fill="transparent" />
                        <circle cx="14" cy="14" r="11" className="stroke-[#FEB604]" strokeWidth="3.5" fill="transparent"
                          strokeDasharray={2 * Math.PI * 11}
                          strokeDashoffset={2 * Math.PI * 11 * (1 - campaign.progressPercent / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold tracking-tight text-stone-700">{campaign.progressPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-stone-100 rounded-[24px] p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] font-medium text-stone-500 block">Submissions</span>
                    <span className="text-base font-medium text-stone-900 mt-1 block">{campaign.submissionsReceived} received</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-stone-500 block">Approved</span>
                    <span className="text-base font-medium text-stone-900 mt-1 block">{campaign.submissionsApproved}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-stone-500 block">Views delivered</span>
                    <span className="text-base font-medium text-stone-900 mt-1 block">{campaign.viewsDelivered.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {hasItems ? (
                <div className="bg-stone-100 rounded-[24px] p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-stone-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-medium text-stone-500 font-rethink">
                        {campaign.submissionsAwaitingReview} submissions are waiting for your review
                      </h5>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("Submission")}
                    className="text-xs font-medium text-stone-900 flex items-center gap-1 font-rethink"
                  >
                    Review now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="border border-stone-200/80 rounded-2xl p-10 text-center space-y-4 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 flex items-center justify-center bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden relative">
                    <Image src={illustration4} alt="No submissions" width={96} height={96} />
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h4 className="font-rethink font-medium text-base text-stone-900">No submissions yet</h4>
                    <p className="font-rethink text-xs text-stone-500 font-medium leading-relaxed">
                      Your campaign just went live — creators are claiming slots. We&apos;ll notify you the moment content starts coming in.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: SUBMISSION ================= */}
        {activeTab === "Submission" && (
          <div className="w-[350px] mx-auto space-y-6 pb-10">
            <h2 className="font-rethink font-semibold text-xl text-stone-900">{campaign.name}</h2>
            <p className="font-rethink text-xs text-stone-500">Posted content from creators. Brand view-only.</p>

            {submissions.filter(s => s.status === "posted").length > 0 ? (
              <div className="space-y-4">
                {submissions.filter(s => s.status === "posted").map((sub) => (
                  <div key={sub.id} className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-rethink font-medium text-sm text-stone-900">@{sub.creatorHandle}</span>
                      <CreatorAvatar seed={sub.creatorHandle} />
                    </div>
                    {sub.caption && <p className="font-rethink text-xs text-stone-500">{sub.caption}</p>}
                    {sub.postedPlatforms && sub.postedPlatforms.length > 0 && (
                      <div className="flex gap-2 text-[10px] text-stone-400">
                        {sub.postedPlatforms.map((p, i) => (
                          <span key={i} className="px-2 py-0.5 bg-stone-100 rounded-full">{p.platform}: {p.views.toLocaleString()} views</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <Image src={illustration7} alt="Nothing yet" width={120} height={120} />
                <p className="font-rethink text-sm text-stone-500">No posted content yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: PAYOUTS ================= */}
        {activeTab === "Payouts" && (
          <div className="w-[350px] mx-auto space-y-10 pb-10">
            <h2 className="font-rethink font-semibold text-xl text-stone-900">{campaign.name}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-stone-100 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Total escrowed</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">₦{totalEscrowed.toLocaleString()}</span>
              </div>
              <div className="bg-white border border-stone-100 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Released</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">₦{releasedTotal.toLocaleString()}</span>
              </div>
            </div>

            {submissions.filter(s => s.payoutStatus).length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-rethink font-semibold text-sm text-stone-900">Transaction ledger</h3>
                <div className="divide-y divide-stone-100">
                  {submissions.filter(s => s.payoutStatus).map((sub) => (
                    <div key={sub.id} className="flex justify-between py-3 text-sm">
                      <span className="text-stone-600">@{sub.creatorHandle}</span>
                      <span className="font-medium text-stone-900">₦{(sub.payoutAmount || 0).toLocaleString()}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded",
                        sub.payoutStatus === "released" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                      )}>
                        {sub.payoutStatus === "released" ? "Released" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-16 pb-12 text-center flex flex-col items-center justify-center">
                <Image src={illustration7} alt="Empty payouts" className="w-32 h-auto mb-6" />
                <h3 className="font-rethink font-medium text-xl text-stone-900 mb-2">Nothing to show yet</h3>
                <p className="text-sm text-stone-500 font-rethink font-medium max-w-sm mx-auto">
                  Your first transaction will appear here once slots start delivering.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
