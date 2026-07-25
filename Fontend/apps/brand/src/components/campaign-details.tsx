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
  payoutAmount?: number;
  payoutStatus?: string;
  submittedAt: string;
  reviewedAt?: string;
  postedAt?: string;
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

function VideoThumbnail() {
  return (
    <div className="w-24 h-32 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 border border-stone-200 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-stone-900/5" />
      <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-[1px] absolute bottom-[-10px] left-1/2 -translate-x-1/2" />
      <div className="w-5 h-5 rounded-full bg-white/50 absolute top-4 left-4" />
      <div className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center z-10 cursor-pointer">
        <Play className="w-3.5 h-3.5 text-stone-900 fill-stone-900 translate-x-[1px]" />
      </div>
    </div>
  );
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

  const handleDeleteDraft = async () => {
    if (!window.confirm("Are you sure you want to delete this campaign? This cannot be undone.")) return;
    try {
      const token = getToken();
      await apiRequest(`/campaigns/${campaignId}`, { method: "DELETE", token: token || undefined });
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to delete campaign");
    }
  };

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

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

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
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium tracking-tight text-[10px] font-rethink">
                    {campaign.category}
                  </span>
                </div>
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
                      <h4 className="font-rethink font-medium text-sm text-[#065F46]">Completed</h4>
                      <p className="font-rethink text-xs text-stone-600 font-medium leading-normal">
                        Target reached — nice work. Here&apos;s how it went.
                      </p>
                    </>
                  )}
                  {currentStatus === "cancelled" && (
                    <>
                      <h4 className="font-rethink font-medium text-sm text-[#991B1B]">Cancelled</h4>
                      <p className="font-rethink text-xs text-stone-600 font-medium leading-normal">
                        This campaign was cancelled.
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
                        <circle
                          cx="14"
                          cy="14"
                          r="11"
                          className="stroke-stone-200"
                          strokeWidth="3.5"
                          fill="transparent"
                        />
                        <circle
                          cx="14"
                          cy="14"
                          r="11"
                          className="stroke-[#FEB604]"
                          strokeWidth="3.5"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 11}
                          strokeDashoffset={2 * Math.PI * 11 * (1 - campaign.progressPercent / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold tracking-tight text-stone-700">
                      {campaign.progressPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Submissions Box */}
              {hasItems ? (
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

                  {counts.new > 0 && (
                    <div className="bg-white border border-stone-200/60 rounded-[16px] p-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500">
                          <FolderOpen className="w-5 h-5 text-stone-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-xs font-medium text-stone-500 font-rethink">
                            {counts.new} submission{counts.new !== 1 ? "s" : ""} waiting for your review
                          </h5>
                        </div>
                      </div>
                    <button
                      onClick={() => setActiveTab("Submission")}
                      className="text-xs font-medium text-stone-900 flex items-center gap-1 font-rethink mt-2"
                    >
                        Review now <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-stone-200/80 rounded-2xl p-10 text-center space-y-4 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 flex items-center justify-center bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden relative">
                    <Image src={illustration4} alt="No submissions" width={96} height={96} />
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h4 className="font-rethink font-semibold text-base text-stone-900">No submissions yet</h4>
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
          <div className="w-[350px] mx-auto space-y-8 pb-10">
            <div className="text-center mb-6">
              <h2 className="font-rethink font-semibold text-xl text-stone-900">{campaign.name}</h2>
              <p className="text-xs text-stone-500 font-rethink font-medium mt-1">Posted content from creators</p>
            </div>

            {postedSubmissions.length > 0 ? (
              <div className="space-y-6">
                {postedSubmissions.map((sub) => (
                  <div key={sub.id} className="bg-white border border-stone-200 rounded-2xl p-6 flex gap-6">
                    <VideoThumbnail />
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-rethink font-medium text-sm text-stone-900">@{sub.creatorHandle}</span>
                          <CreatorAvatar seed={sub.creatorHandle} />
                        </div>
                        <p className="font-rethink text-xs text-stone-500 font-medium leading-relaxed pr-8">
                          {sub.caption || "No caption provided"}
                        </p>
                        {sub.durationSeconds && (
                          <span className="text-[11px] font-medium text-stone-400 block pt-1">
                            {sub.durationSeconds}s
                          </span>
                        )}
                      </div>

                      {sub.postedPlatforms && sub.postedPlatforms.length > 0 && (
                        <div className="pt-2">
                          <div className="flex border-b border-stone-100 pb-2">
                            {sub.postedPlatforms.map((pp) => (
                              <span
                                key={pp.platform}
                                className="text-xs font-medium font-rethink mr-6 pb-2 border-b-2 border-stone-900 text-stone-900 font-semibold"
                              >
                                {pp.platform}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-3">
                            <div className="flex items-center gap-6">
                              {sub.postedPlatforms.map((pp) => (
                                <React.Fragment key={pp.platform}>
                                  <div>
                                    <span className="text-[10px] font-medium text-stone-500 block">Views</span>
                                    <span className="text-xs font-medium text-stone-800 mt-0.5 block">{pp.views.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-medium text-stone-500 block">Likes</span>
                                    <span className="text-xs font-medium text-stone-800 mt-0.5 block">{pp.likes.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-medium text-stone-500 block">Comments</span>
                                    <span className="text-xs font-medium text-stone-800 mt-0.5 block">{pp.comments.toLocaleString()}</span>
                                  </div>
                                </React.Fragment>
                              ))}
                            </div>
                            {sub.postedPlatforms[0]?.postUrl && (
                              <a
                                href={sub.postedPlatforms[0].postUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-blue-600 flex items-center gap-1"
                              >
                                View post <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-6 flex flex-col items-center justify-center">
                <div className="w-48 h-48 flex items-center justify-center">
                  <Image src={illustration1} alt="No posted content" width={160} height={160} />
                </div>
                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className="font-rethink font-semibold text-lg text-stone-900">No posted content yet</h3>
                  <p className="font-rethink text-xs text-stone-500 font-medium leading-relaxed">
                    Once creators post approved content, it will appear here with performance stats.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
                  </div>
                  <div className="space-y-2 max-w-sm mx-auto">
        {/* ================= TAB 3: PAYOUTS ================= */}
        {activeTab === "Payouts" && (
          <div className="w-[350px] mx-auto space-y-10 pb-10">
            <div className="text-center">
              <h2 className="font-rethink font-semibold text-xl text-stone-900">{campaign.name}</h2>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div className="bg-white border border-stone-100 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Total escrowed</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">
                  {hasItems ? `₦${totalEscrowed.toLocaleString()}` : "₦0"}
                </span>
              </div>
              <div className="bg-white border border-stone-100 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Creator pool</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">
                  {hasItems ? `₦${creatorPool.toLocaleString()}` : "₦0"}
                </span>
              </div>
              <div className="bg-white border border-stone-100 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Released</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">
                  {hasItems ? `₦${releasedTotal.toLocaleString()}` : "₦0"}
                </span>
              </div>
              <div className="bg-white border border-stone-100 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Pending in escrow</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">
                  {hasItems ? `₦${Math.max(pendingEscrow, 0).toLocaleString()}` : "₦0"}
                </span>
              </div>
              <div className="bg-white border border-stone-100 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Refundable</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">₦0</span>
              </div>
            </div>

            {hasItems ? (
              <div className="space-y-6">
                <p className="text-xs text-stone-500 font-rethink font-medium">
                  Platform fee {((campaign.platformFeePercent || 0.3) * 100).toFixed(0)}% of funded budget (₦{platformFee.toLocaleString()}), already deducted from your total.
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                  <h3 className="font-rethink font-semibold text-lg text-stone-900">Transaction ledger</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-semibold text-stone-700 border border-stone-200">
                    <FolderOpen className="w-4 h-4 text-stone-500" />
                    Download statement
                  </button>
                </div>

                <div className="w-full text-left">
                  <div className="grid grid-cols-5 py-3 border-b border-stone-100 text-[11px] font-medium text-stone-500">
                    <div>Date</div>
                    <div>Creator</div>
                    <div>Views</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {submissions
                      .filter((s) => s.status === "posted" || s.status === "awaiting_post")
                      .map((sub) => (
                        <div key={sub.id} className="grid grid-cols-5 py-4 text-sm items-center">
                          <div className="text-stone-600">
                            {sub.postedAt || sub.reviewedAt
                              ? new Date(sub.postedAt || sub.reviewedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                              : "-"}
                          </div>
                          <div className="text-stone-900 font-medium">@{sub.creatorHandle}</div>
                          <div className="text-stone-600">{(sub.viewsDelivered || 0).toLocaleString()}</div>
                          <div className="text-stone-900 font-medium">₦{(sub.payoutAmount || 0).toLocaleString()}</div>
                          <div>
                            <span className={cn(
                              "inline-flex px-2 py-0.5 rounded text-[10px] font-medium",
                              sub.payoutStatus === "released"
                                ? "bg-[#D1FAE5] text-[#059669]"
                                : "bg-stone-100 text-stone-500"
                            )}>
                              {sub.payoutStatus === "released" ? "Released" : "Pending"}
                            </span>
                          </div>
                        </div>
                      ))}
                    <div className="grid grid-cols-5 py-4 text-sm items-center">
                      <div className="text-stone-600">
                        {campaign.startDate
                          ? new Date(campaign.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          : "-"}
                      </div>
                      <div className="text-stone-400 font-medium">-</div>
                      <div className="text-stone-400">-</div>
                      <div className="text-stone-900 font-medium">₦{totalEscrowed.toLocaleString()}</div>
                      <div>
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-500">Escrow Deposit</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-16 pb-12 text-center flex flex-col items-center justify-center">
                <Image src={illustration7} alt="Empty payouts" className="w-32 h-auto mb-6" />
                <h3 className="font-rethink font-semibold text-xl text-stone-900 mb-2">Nothing to show yet</h3>
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
