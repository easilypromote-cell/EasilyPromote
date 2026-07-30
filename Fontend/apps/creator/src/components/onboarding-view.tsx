"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import type { CreatorProfile } from "./types";
import { useReveal } from "../hooks/use-reveal";

interface OnboardingViewProps {
  profile: CreatorProfile;
  onConnectSocial: () => void;
  onChooseNiches: () => void;
  onCompleteProfile: () => void;
}

export function OnboardingView({
  profile,
  onConnectSocial,
  onChooseNiches,
  onCompleteProfile,
}: OnboardingViewProps) {
  useReveal();

  const isSocialConnected = profile.socialAccounts.length > 0;
  const isNichesChosen = profile.niches.length > 0;
  const isProfileCompleted = profile.bio !== "" && profile.country !== "";

  return (
    <div className="w-full flex flex-col items-center max-w-xl text-center">
      <div className="mb-6 h-[200px] w-auto flex items-center justify-center">
        <svg className="w-[180px] h-[180px] text-stone-800" viewBox="0 0 200 200" fill="none">
          <path d="M50 40h90v120H50z" fill="#FAFAF9" stroke="#1C1917" strokeWidth="3" strokeDasharray="3 3" />
          <path d="M60 50h70v100H60z" fill="white" stroke="#1C1917" strokeWidth="3" />
          <rect x="85" y="38" width="20" height="15" rx="3" fill="#FEB604" stroke="#1C1917" strokeWidth="3" />
          <circle cx="75" cy="75" r="10" fill={isSocialConnected ? "#1C1917" : "none"} stroke="#1C1917" strokeWidth="2" />
          {isSocialConnected && (
            <path d="m71 75 3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <circle cx="75" cy="105" r="10" fill={isNichesChosen ? "#1C1917" : "none"} stroke="#1C1917" strokeWidth="2" />
          {isNichesChosen && (
            <path d="m71 105 3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <circle cx="75" cy="135" r="10" fill={isProfileCompleted ? "#1C1917" : "none"} stroke="#1C1917" strokeWidth="2" />
          {isProfileCompleted && (
            <path d="m71 135 3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <path d="M120 140c10-5 25-10 30-25s-5-25-15-20-15 25-15 45z" fill="#F5F5F4" stroke="#1C1917" strokeWidth="3" />
          <path d="m140 100-30-20-5 5 30 20z" fill="#FEB604" stroke="#1C1917" strokeWidth="3" />
        </svg>
      </div>

      <h2 data-reveal className="font-motterdam font-normal text-[33px] leading-[42.67px] text-stone-900 mb-2">
        Welcome, {profile.displayName.split(" ")[0]}
      </h2>

      <p data-reveal className="text-sm font-medium text-stone-500 mb-8 max-w-sm">
        You&apos;re almost ready to start earning. Complete these to unlock your first campaign.
      </p>

      <div data-reveal className="w-full bg-[#F5F5F4]/60 border border-stone-200 border-dashed rounded-3xl p-8 space-y-8 text-left">
        <ChecklistStep
          completed={isSocialConnected}
          title="Connect a social account"
          description="TikTok, Instagram, or YouTube — this is how we verify your views"
          actionLabel="Connect"
          onAction={onConnectSocial}
        />

        <ChecklistStep
          completed={isNichesChosen}
          title="Choose your niches"
          description="We'll match you with campaigns that fit what you actually create."
          actionLabel="Select niches"
          onAction={onChooseNiches}
        />

        <ChecklistStep
          completed={isProfileCompleted}
          title="Complete your profile"
          description="Add a display name and photo so brands know who's delivering."
          actionLabel="Finish profile"
          onAction={onCompleteProfile}
        />
      </div>
    </div>
  );
}

function ChecklistStep({
  completed,
  title,
  description,
  actionLabel,
  onAction,
}: {
  completed: boolean;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">
        {completed ? (
          <div className="w-5 h-5 rounded-full bg-stone-950 flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-stone-300"></div>
        )}
      </div>
      <div className="flex-1 space-y-1.5">
        <h4 className="font-rethink font-medium text-sm text-stone-900 leading-none">{title}</h4>
        <p className="text-xs text-stone-500 font-medium leading-normal max-w-sm">{description}</p>
        {!completed && (
          <button
            onClick={onAction}
            className="mt-2 px-6 py-2 bg-white text-stone-900 font-semibold text-xs border border-stone-200 rounded-full font-rethink"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
