"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import {
  FolderOpen,
  TrendingUp,
  CreditCard,
  Layout,
  MoreHorizontal,
  ArrowRight,
  Sparkles,
  Check,
  X,
  MessageSquare,
  Play,
  Share2
} from "lucide-react";
import { cn } from "@ep/ui/lib/utils";

// Import illustrations
import illustration1 from "@ep/ui/assets/illustrations/illustration1.svg"; // Yellow Mailbox
import illustration3 from "@ep/ui/assets/illustrations/illustration3.svg"; // Mag glass observer
import illustration4 from "@ep/ui/assets/illustrations/illustration4.svg"; // Creator at desk
import illustration7 from "@ep/ui/assets/illustrations/illustration7.svg"; // Nothing to show yet

interface CampaignDetailsProps {
  onClose: () => void;
}

type TabType = "Overview" | "Submission" | "Payouts";
type SubTabType = "new" | "awaiting" | "posted" | "rejected";
type StatusType = "under_review" | "completed" | "cancelled";
type SubmissionsStateType = "has_items" | "empty";
type PayoutsStateType = "populated" | "empty";
type SocialPlatformType = "Tiktok" | "Instagram" | "X (Twitter)";

// Clean Selfie video component mockup
function VideoThumbnail() {
  return (
    <div className="w-24 h-32 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 border border-stone-200 flex-shrink-0 relative overflow-hidden flex items-center justify-center ">
      <div className="absolute inset-0 bg-stone-900/5" />
      {/* Simulating selfie outline */}
      <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-[1px] absolute bottom-[-10px] left-1/2 -translate-x-1/2" />
      <div className="w-5 h-5 rounded-full bg-white/50 absolute top-4 left-4" />
      
      {/* Center Play Button Overlay */}
      <div className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center z-10 cursor-pointer">
        <Play className="w-3.5 h-3.5 text-stone-900 fill-stone-900 translate-x-[1px]" />
      </div>
    </div>
  );
}

// Avatar helper
function CreatorAvatar({ seed }: { seed: string }) {
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-200 to-[#FEB604] border border-white flex items-center justify-center text-[10px] font-medium text-stone-950  flex-shrink-0">
      {seed.substring(0, 2).toUpperCase()}
    </div>
  );
}

export function CampaignDetails({ onClose }: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  
  // Submissions Sub-tabs state
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("new");
  
  // Interactive prototype preview controls (left sidebar)
  const [currentStatus, setCurrentStatus] = useState<StatusType>("under_review");
  const [submissionsState, setSubmissionsState] = useState<SubmissionsStateType>("has_items");
  const [payoutsState, setPayoutsState] = useState<PayoutsStateType>("populated");
  
  // Platform statistics segmented controls state
  const [selectedPlatform1, setSelectedPlatform1] = useState<SocialPlatformType>("Tiktok");
  const [selectedPlatform2, setSelectedPlatform2] = useState<SocialPlatformType>("Tiktok");

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Left Menu Sidebar */}
      <div className="w-80 border-r border-stone-100 bg-[#FBFBFA] p-8 flex flex-col justify-between h-full">
        <div>
          {/* Header Close Trigger */}
          <button
            onClick={onClose}
            className="text-stone-500 text-xs font-medium font-rethink mb-10 block"
          >
            Save and Close
          </button>

          {/* Menu Items */}
          <div className="space-y-3">
            {[
              { id: "Overview", icon: Layout, label: "Overview" },
              { id: "Submission", icon: FolderOpen, label: "Submission" },
              { id: "Payouts", icon: CreditCard, label: "Payouts" }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-[40px] text-sm font-semibold font-rethink",
                    isActive
                      ? "bg-white border border-stone-200/80 text-stone-900"
                      : "text-stone-500"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-stone-900" : "text-stone-400")} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prototype Switcher Controls (For Reviewer Demo) */}
        <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 space-y-4 ">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-stone-400 tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-[#FEB604]" /> Prototype Options
          </div>
          
          {/* Overview status box control */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-stone-500">Overview Status Alert</label>
            <div className="grid grid-cols-3 gap-1">
              {(["under_review", "completed", "cancelled"] as StatusType[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setCurrentStatus(st)}
                  className={cn(
                    "text-[8px] py-1 border font-semibold rounded-md transition-colors capitalize",
                    currentStatus === st
                      ? "bg-stone-900 border-stone-900 text-white"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  )}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Submission list empty toggle */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-stone-500">New Submissions State</label>
            <div className="grid grid-cols-2 gap-1">
              {(["has_items", "empty"] as SubmissionsStateType[]).map((sb) => (
                <button
                  key={sb}
                  onClick={() => setSubmissionsState(sb)}
                  className={cn(
                    "text-[9px] py-1 border font-semibold rounded-md transition-colors capitalize",
                    submissionsState === sb
                      ? "bg-stone-900 border-stone-900 text-white"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  )}
                >
                  {sb === "has_items" ? "Show List" : "Nothing Waiting"}
                </button>
              ))}
            </div>
          </div>

          {/* Payouts list empty toggle */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-stone-500">Payouts State</label>
            <div className="grid grid-cols-2 gap-1">
              {(["populated", "empty"] as PayoutsStateType[]).map((ps) => (
                <button
                  key={ps}
                  onClick={() => setPayoutsState(ps)}
                  className={cn(
                    "text-[9px] py-1 border font-semibold rounded-md transition-colors capitalize",
                    payoutsState === ps
                      ? "bg-stone-900 border-stone-900 text-white"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  )}
                >
                  {ps === "populated" ? "Populated" : "Empty"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Dashboard Area */}
      <div className="flex-1 p-12 overflow-y-auto h-full" data-lenis-prevent>
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "Overview" && (
          <div className="w-[350px] mx-auto space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center border border-purple-200  flex-shrink-0">
                <svg className="w-9 h-9 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
              </div>
              <div className="space-y-1.5">
                <h2 className="font-rethink font-semibold text-xl text-stone-900 leading-tight">
                  Launch my new Afrobeats single
                </h2>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium tracking-tight text-[10px] font-rethink">
                    Music
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium tracking-tight text-[10px] font-rethink">
                    7 Days Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Details Key-Value List */}
            <div className="space-y-4 pt-6">
              <div className="flex justify-between items-center font-rethink text-sm font-medium">
                <span className="text-[#78716C]">Target Views</span>
                <span className="text-[#1C1917] font-medium">100,000,000 views</span>
              </div>
              <div className="flex justify-between items-center font-rethink text-sm font-medium">
                <span className="text-[#78716C]">Budget</span>
                <span className="text-[#1C1917] font-medium">20,000,000</span>
              </div>
              <div className="flex justify-between items-center font-rethink text-sm font-medium">
                <span className="text-[#78716C]">Duration</span>
                <span className="text-[#1C1917] font-medium">Duration</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-3 pt-2">
              <button className="flex-1 py-3 bg-white text-stone-900 font-semibold text-sm rounded-full">
                Top up budget
              </button>
              <button className="flex-1 py-3 bg-white text-stone-900 font-semibold text-sm rounded-full">
                Extend deadline
              </button>
              <button className="px-3.5 py-3 bg-white text-stone-600 rounded-full">
                <MoreHorizontal className="w-5 h-5 text-stone-700" />
              </button>
            </div>

            {/* Status Alert Box */}
            <div className="flex items-start gap-4 bg-[#EBF3FF] border border-dashed border-blue-200 rounded-[20px] p-4 relative overflow-hidden">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <Image src={illustration3} alt="Status Alert" width={48} height={48} />
              </div>
              <div className="space-y-1 mt-0.5">
                {currentStatus === "under_review" && (
                  <>
                    <h4 className="font-rethink font-medium text-sm text-[#6E330C]">Under review</h4>
                    <p className="font-rethink text-xs text-stone-600 font-medium leading-normal">
                      We're reviewing your campaign. It'll go live within 2 hours.
                    </p>
                  </>
                )}
                {currentStatus === "completed" && (
                  <>
                    <h4 className="font-rethink font-medium text-sm text-[#6E330C]">Completed</h4>
                    <p className="font-rethink text-xs text-stone-600 font-medium leading-normal">
                      Target reached — nice work. Here's how it went.
                    </p>
                  </>
                )}
                {currentStatus === "cancelled" && (
                  <>
                    <h4 className="font-rethink font-medium text-sm text-[#6E330C]">Cancelled</h4>
                    <p className="font-rethink text-xs text-stone-600 font-medium leading-normal">
                      This campaign was cancelled. Unspent budget of ₦6,850,000 was refunded to your wallet.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Campaign Progress Card */}
              <div className="bg-stone-100 rounded-[24px] p-4 space-y-4">
                <span className="text-xs font-medium text-stone-500 block">Campaign progress</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold tracking-tight text-stone-900 font-rethink">
                    {submissionsState === "has_items" ? "170,000 / 250,000" : "0 / 250,000"}
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
                          strokeDashoffset={2 * Math.PI * 11 * (1 - (submissionsState === "has_items" ? 0.68 : 0))}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold tracking-tight text-stone-700">
                      {submissionsState === "has_items" ? "68%" : "0%"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Submissions Box */}
              {submissionsState === "has_items" ? (
                <div className="bg-stone-100 rounded-[24px] p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-[10px] font-medium text-stone-500 block">Submissions</span>
                      <span className="text-base font-medium text-stone-900 mt-1 block">24 received</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-stone-500 block">Approved</span>
                      <span className="text-base font-medium text-stone-900 mt-1 block">16</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-stone-500 block">Views delivered</span>
                      <span className="text-base font-medium text-stone-900 mt-1 block">170k (68)</span>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200/60 rounded-[16px] p-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500">
                        <FolderOpen className="w-5 h-5 text-stone-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xs font-medium text-stone-500 font-rethink">
                          12 submissions are waiting for your review
                        </h5>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab("Submission");
                        setActiveSubTab("new");
                      }}
                      className="text-xs font-medium text-stone-900 flex items-center gap-1 font-rethink mt-2"
                    >
                      Review now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-stone-200/80 rounded-2xl p-10 text-center space-y-4 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 flex items-center justify-center bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden relative ">
                    <Image src={illustration4} alt="No submissions" width={96} height={96} />
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h4 className="font-rethink font-semibold text-base text-stone-900">No submissions yet</h4>
                    <p className="font-rethink text-xs text-stone-500 font-medium leading-relaxed">
                      Your campaign just went live — creators are claiming slots. We'll notify you the moment content starts coming in.
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
            {/* Header Title */}
            <div className="text-center mb-6">
              <h2 className="font-rethink font-semibold text-xl text-stone-900">Launch my new Afrobeats single</h2>
            </div>

            {/* Sub-navigation Pills Row */}
            <div className="flex justify-center border-b border-stone-100 pb-4">
              <div className="flex bg-stone-50 p-1 rounded-full border border-stone-200/50">
                {[
                  { id: "new", label: "New submissions (2)" },
                  { id: "awaiting", label: "Awaiting Post (2)" },
                  { id: "posted", label: "Posted (14)" },
                  { id: "rejected", label: "Rejected" }
                ].map((pill) => {
                  const isActive = activeSubTab === pill.id;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => setActiveSubTab(pill.id as SubTabType)}
                       className={cn(
                        "px-4 py-2 rounded-full text-xs font-medium font-rethink",
                        isActive
                          ? "bg-white border border-stone-200 text-stone-900 font-semibold"
                          : "text-stone-400"
                      )}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUB-TAB 1: NEW SUBMISSIONS */}
            {activeSubTab === "new" && (
              submissionsState === "has_items" ? (
                /* Card List State */
                <div className="space-y-6">
                  {[1, 2].map((id) => (
                    <div
                      key={id}
                      className="bg-white border border-stone-200 rounded-2xl p-6 flex gap-6 relative"
                    >
                      <VideoThumbnail />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-rethink font-medium text-sm text-stone-900">@thesheke_</span>
                            <CreatorAvatar seed={`thesheke_${id}`} />
                          </div>
                          <p className="font-rethink text-xs text-stone-500 font-medium leading-relaxed pr-8">
                            New drop from Musta4a is banging!!! This new jam called Pass am is so good #nusound #viral
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <span className="text-[11px] font-medium text-stone-400">
                            00:34sec <span className="mx-1.5">•</span> Uploaded 1h ago
                          </span>
                          <div className="flex gap-2">
                            <button className="px-5 py-2.5 bg-white text-stone-900 text-xs font-medium rounded-full">
                              Approve
                            </button>
                            <button className="px-5 py-2.5 bg-white text-stone-950 text-xs font-medium rounded-full">
                              Feedback & Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty Mailbox State */
                <div className="text-center py-16 space-y-6 flex flex-col items-center justify-center">
                  <div className="w-48 h-48 flex items-center justify-center">
                    <Image src={illustration1} alt="Nothing waiting" width={160} height={160} />
                  </div>
                  <div className="space-y-2 max-w-sm mx-auto">
                    <h3 className="font-rethink font-semibold text-lg text-stone-900">Nothing waiting on you</h3>
                    <p className="font-rethink text-xs text-stone-500 font-medium leading-relaxed">
                      New content will show up here as creators upload for review.
                    </p>
                  </div>
                </div>
              )
            )}

            {/* SUB-TAB 2: AWAITING POST */}
            {activeSubTab === "awaiting" && (
              <div className="space-y-6">
                {[
                  { username: "@iam_kaycee", id: 1 },
                  { username: "@thesheke_", id: 2 }
                ].map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-stone-200 rounded-2xl p-6 flex gap-6"
                  >
                    <VideoThumbnail />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-rethink font-medium text-sm text-stone-900">{item.username}</span>
                          <CreatorAvatar seed={item.username} />
                        </div>
                        <p className="font-rethink text-xs text-stone-500 font-medium leading-relaxed pr-8">
                          New drop from Musta4a is banging!!! This new jam called Pass am is so good #nusound #viral
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-[11px] font-medium text-stone-400">
                            00:34sec <span className="mx-1.5">•</span> Uploaded 1h ago
                          </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-TAB 3: POSTED */}
            {activeSubTab === "posted" && (
              <div className="space-y-6">
                {/* Creator Card 1 */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 flex gap-6">
                  <VideoThumbnail />
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-rethink font-medium text-sm text-stone-900">@thesheke_</span>
                        <CreatorAvatar seed="thesheke" />
                      </div>
                      <p className="font-rethink text-xs text-stone-500 font-medium leading-relaxed pr-8">
                        New drop from Musta4a is banging!!! This new jam called Pass am is so good #nusound #viral
                      </p>
                      <span className="text-[11px] font-medium text-stone-400 block pt-1">
                        00:34sec
                      </span>
                    </div>

                    {/* Segmented control for social platforms */}
                    <div className="pt-2">
                      <div className="flex border-b border-stone-100 pb-2">
                        {(["Tiktok", "Instagram", "X (Twitter)"] as SocialPlatformType[]).map((platform) => (
                          <button
                            key={platform}
                            onClick={() => setSelectedPlatform1(platform)}
                            className={cn(
                              "text-xs font-medium font-rethink mr-6 pb-2 border-b-2",
                              selectedPlatform1 === platform
                                ? "border-stone-900 text-stone-900 font-semibold"
                                : "border-transparent text-stone-400"
                            )}
                          >
                            {platform}
                          </button>
                        ))}
                      </div>

                      {/* Statistics Row for Platform 1 */}
                      <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-[10px] font-medium text-stone-500 block">Views</span>
                            <span className="text-xs font-medium text-stone-800 mt-0.5 block">18.4K</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-stone-500 block">Likes</span>
                            <span className="text-xs font-medium text-stone-800 mt-0.5 block">2.1K</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-stone-500 block">Comments</span>
                            <span className="text-xs font-medium text-stone-800 mt-0.5 block">198</span>
                          </div>
                        </div>
                        <button className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                          View post <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Creator Card 2 */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 flex gap-6">
                  <VideoThumbnail />
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-rethink font-medium text-sm text-stone-900">@thesheke_</span>
                        <CreatorAvatar seed="sheke2" />
                      </div>
                      <p className="font-rethink text-xs text-stone-500 font-medium leading-relaxed pr-8">
                        New drop from Musta4a is banging!!! This new jam called Pass am is so good #nusound #viral
                      </p>
                      <span className="text-[11px] font-medium text-stone-400 block pt-1">
                        00:34sec
                      </span>
                    </div>

                    {/* Segmented control for social platforms */}
                    <div className="pt-2">
                      <div className="flex border-b border-stone-100 pb-2">
                        {(["Tiktok", "Instagram"] as SocialPlatformType[]).map((platform) => (
                          <button
                            key={platform}
                            onClick={() => setSelectedPlatform2(platform)}
                            className={cn(
                              "text-xs font-medium font-rethink mr-6 pb-2 border-b-2",
                              selectedPlatform2 === platform
                                ? "border-stone-900 text-stone-900 font-semibold"
                                : "border-transparent text-stone-400"
                            )}
                          >
                            {platform}
                          </button>
                        ))}
                      </div>

                      {/* Statistics Row for Platform 2 */}
                      <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-[10px] font-medium text-stone-500 block">Views</span>
                            <span className="text-xs font-medium text-stone-800 mt-0.5 block">18.4K</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-stone-500 block">Likes</span>
                            <span className="text-xs font-medium text-stone-800 mt-0.5 block">2.1K</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-stone-500 block">Comments</span>
                            <span className="text-xs font-medium text-stone-800 mt-0.5 block">198</span>
                          </div>
                        </div>
                        <button className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                          View post <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: REJECTED */}
            {activeSubTab === "rejected" && (
              <div className="space-y-6">
                {[
                  {
                    username: "@iam_kaycee",
                    id: 1,
                    feedback: "Missed the CTA — please mention the streaming link"
                  },
                  {
                    username: "@iam_kaycee",
                    id: 2,
                    feedback: "Did not follow the brief"
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-stone-200 rounded-2xl p-6 flex gap-6"
                  >
                    <VideoThumbnail />
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-rethink font-medium text-sm text-stone-900">{item.username}</span>
                          <CreatorAvatar seed={item.username} />
                        </div>
                        <p className="font-rethink text-xs text-stone-500 font-medium leading-relaxed pr-8">
                          New drop from Musta4a is banging!!! This new jam called Pass am is so good #nusound #viral
                        </p>
                          <span className="text-[11px] font-medium text-red-600 block pt-1">
                            Rejected 2h ago
                          </span>
                      </div>

                      {/* Feedback Comment box */}
                      <div className="bg-stone-50 border border-stone-100 rounded-xl p-3.5 flex items-start gap-2.5">
                        <MessageSquare className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-medium text-stone-600 italic leading-relaxed">
                          "{item.feedback}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: PAYOUTS ================= */}
        {activeTab === "Payouts" && (
          <div className="w-[350px] mx-auto space-y-10 pb-10">
            {/* Header Title */}
            <div className="text-center">
              <h2 className="font-rethink font-semibold text-xl text-stone-900">Launch my new Afrobeats single</h2>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-white border border-stone-100  rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Total escrowed</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">{payoutsState === "populated" ? "₦385,000" : "₦0"}</span>
              </div>
              <div className="bg-white border border-stone-100  rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Creator pool</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">{payoutsState === "populated" ? "₦269,500" : "₦0"}</span>
              </div>
              <div className="bg-white border border-stone-100  rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Released</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">{payoutsState === "populated" ? "₦122,400" : "₦0"}</span>
              </div>
              <div className="bg-white border border-stone-100  rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Pending in escrow</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">{payoutsState === "populated" ? "₦140,600" : "₦0"}</span>
              </div>
              <div className="bg-white border border-stone-100  rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-medium text-stone-500 block">Refundable</span>
                <span className="font-rethink font-medium text-xl text-stone-900 block">₦0</span>
              </div>
            </div>

            {payoutsState === "populated" ? (
              <div className="space-y-6">
                <p className="text-xs text-stone-500 font-rethink font-medium">
                  Platform fee 30% of funded budget (₦115,500), already deducted from your total.
                </p>

                {/* Ledger Header */}
                <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                  <h3 className="font-rethink font-semibold text-lg text-stone-900">Transaction ledger</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-semibold text-stone-700">
                    <FolderOpen className="w-4 h-4 text-stone-500" />
                    Download statement
                  </button>
                </div>

                {/* Ledger Table */}
                <div className="w-full text-left">
                  <div className="grid grid-cols-5 py-3 border-b border-stone-100 text-[11px] font-medium text-stone-500">
                    <div>Date</div>
                    <div>Creator</div>
                    <div>Views</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y divide-stone-100">
                    <div className="grid grid-cols-5 py-4 text-sm items-center">
                      <div className="text-stone-600">Jul 15</div>
                      <div className="text-stone-900 font-medium">@thesheke_</div>
                      <div className="text-stone-600">100,000</div>
                      <div className="text-stone-900 font-medium">₦6,800</div>
                      <div>
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-[#D1FAE5] text-[#059669]">Released</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 py-4 text-sm items-center">
                      <div className="text-stone-600">Jul 15</div>
                      <div className="text-stone-900 font-medium">@iam_kaycee</div>
                      <div className="text-stone-600">100,000</div>
                      <div className="text-stone-900 font-medium">₦6,800</div>
                      <div>
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-[#D1FAE5] text-[#059669]">Released</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 py-4 text-sm items-center">
                      <div className="text-stone-600">Jul 15</div>
                      <div className="text-stone-400 font-medium">-</div>
                      <div className="text-stone-400">-</div>
                      <div className="text-stone-900 font-medium">₦385,000</div>
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
