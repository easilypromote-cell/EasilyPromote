import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "@ep/ui/lib/utils";
import { TYPOGRAPHY } from "@ep/ui/lib/constants";

// Assets imports
import illustration3 from "@ep/ui/assets/illustrations/illustration3.svg";
import illustration1 from "@ep/ui/assets/illustrations/illustration1.svg";
import illustration2 from "@ep/ui/assets/illustrations/illustration2.svg";

interface CampaignData {
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  views: number;
  budget: number;
  brief: string;
  keyMessage: string;
  avoid: string;
  platforms: string[];
  contentStyle: string;
}

interface CampaignWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CampaignWizard({ onClose, onSuccess }: CampaignWizardProps) {
  const [createStep, setCreateStep] = useState<1 | 2 | 3 | 4>(1);

  // Campaign Form State
  const [campaign, setCampaign] = useState<CampaignData>({
    name: "",
    category: "Music",
    startDate: "2026-05-26",
    endDate: "2026-08-30",
    views: 1000000,
    budget: 385000,
    brief: "",
    keyMessage: "",
    avoid: "",
    platforms: ["TikTok", "Instagram"],
    contentStyle: "Fun & Energetic",
  });

  const handleViewsChange = (val: number) => {
    const baseRate = 0.385; // ₦0.385 per view
    const newBudget = Math.round(val * baseRate);
    setCampaign(prev => ({
      ...prev,
      views: val,
      budget: newBudget,
    }));
  };

  const handleNextStep = () => {
    if (createStep < 4) {
      setCreateStep((prev) => (prev + 1) as any);
    }
  };

  const handleBackStep = () => {
    if (createStep > 1) {
      setCreateStep((prev) => (prev - 1) as any);
    }
  };

  return (
    <div className="flex w-full h-full overflow-hidden">
        {/* Left Sidebar Progress Indicator */}
        {createStep !== 4 && (
          <div className="w-80 border-r border-stone-100 bg-[#FBFBFA] p-8 flex flex-col justify-between h-full">
            <div>
              <button
                onClick={onClose}
                className="text-stone-500 hover:text-stone-800 text-xs font-semibold font-rethink mb-10 block"
              >
                Save and Close
              </button>

              <div className="space-y-8">
                {/* Step 1 Indicator */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold",
                      createStep === 1
                        ? "border-stone-900 bg-stone-900 text-white"
                        : createStep > 1
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-stone-300 text-stone-400"
                    )}
                  >
                    {createStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold font-rethink",
                      createStep === 1 ? "text-stone-900" : "text-stone-400"
                    )}
                  >
                    Set up your campaign
                  </span>
                </div>

                {/* Step 2 Indicator */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold",
                      createStep === 2
                        ? "border-stone-900 bg-stone-900 text-white"
                        : createStep > 2
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-stone-300 text-stone-400"
                    )}
                  >
                    {createStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold font-rethink",
                      createStep === 2 ? "text-stone-900" : "text-stone-400"
                    )}
                  >
                    Campaign brief
                  </span>
                </div>

                {/* Step 3 Indicator */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold",
                      createStep === 3 ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 text-stone-400"
                    )}
                  >
                    3
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold font-rethink",
                      createStep === 3 ? "text-stone-900" : "text-stone-400"
                    )}
                  >
                    Review & launch
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-400 font-medium">Step {createStep} of 3</div>
          </div>
        )}

        {/* Right Form Content */}
        <div className="flex-1 p-12 flex flex-col justify-between overflow-y-auto h-full">
          {/* Header */}
          {createStep !== 4 && (
            <div className="text-center mb-8">
              <h3 className="font-rethink font-bold text-xl text-stone-900">Create a Campaign</h3>
            </div>
          )}

          {/* Wizard Step 1: Set up campaign */}
          {createStep === 1 && (
            <div className="max-w-xl mx-auto w-full space-y-6 flex-1">
              {/* Campaign Cover */}
              <div className="flex items-center gap-4 bg-stone-50 border border-stone-200 rounded-2xl p-4">
                <div className="w-16 h-16 bg-stone-200 rounded-xl overflow-hidden flex items-center justify-center">
                  <Image src={illustration2} alt="Campaign cover" width={48} height={48} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-stone-900">Campaign cover</h4>
                  <button className="px-4 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-700 shadow-sm transition-colors">
                    Upload image
                  </button>
                </div>
              </div>

              {/* Campaign Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-600 block">Campaign name</label>
                <input
                  type="text"
                  placeholder="Placeholder text..."
                  value={campaign.name}
                  onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              {/* Promotion category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-600 block">What are you promoting?</label>
                <div className="relative">
                  <select
                    value={campaign.category}
                    onChange={(e) => setCampaign({ ...campaign, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="Music">Music</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Beauty">Beauty & Fashion</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Campaign Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-600 block">Start date</label>
                  <input
                    type="date"
                    value={campaign.startDate}
                    onChange={(e) => setCampaign({ ...campaign, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-600 block">End date</label>
                  <input
                    type="date"
                    value={campaign.endDate}
                    onChange={(e) => setCampaign({ ...campaign, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
              </div>

              {/* Campaign Views Slider */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-stone-600 block">How many views do you want?</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={100000}
                    max={3000000}
                    step={100000}
                    value={campaign.views}
                    onChange={(e) => handleViewsChange(Number(e.target.value))}
                    className="flex-1 accent-stone-900 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="bg-white border border-stone-200 px-4 py-2.5 rounded-xl font-bold text-sm text-stone-900 min-w-[120px] text-center">
                    {campaign.views.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Campaign Budget Display */}
              <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                <span className="text-xs font-bold text-stone-600">Campaign Budget</span>
                <span className="text-2xl font-bold text-stone-900">
                  ₦{campaign.budget.toLocaleString()}
                </span>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleNextStep}
                disabled={!campaign.name}
                className="w-full py-4 bg-[#FEB604] hover:bg-[#FEB604]/95 disabled:bg-stone-100 disabled:text-stone-400 text-[#1C1917] font-semibold text-sm rounded-full transition-colors mt-6"
              >
                Continue
              </button>
            </div>
          )}

          {/* Wizard Step 2: Campaign Brief */}
          {createStep === 2 && (
            <div className="max-w-xl mx-auto w-full space-y-6 flex-1">
              {/* Content Brief */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-600 block">Content brief</label>
                <textarea
                  placeholder="Describe what you want creators to do..."
                  value={campaign.brief}
                  onChange={(e) => setCampaign({ ...campaign, brief: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              {/* Key Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-600 block">Key message / CTA</label>
                <textarea
                  placeholder="What should the creators say or direct viewers to do..."
                  value={campaign.keyMessage}
                  onChange={(e) => setCampaign({ ...campaign, keyMessage: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              {/* Preferred Style selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-600 block">Preferred content style</label>
                <div className="flex flex-wrap gap-2">
                  {["Fun & Energetic", "Lifestyle", "Comedy", "Trend/Challenge", "Other"].map((style) => (
                    <button
                      key={style}
                      onClick={() => setCampaign({ ...campaign, contentStyle: style })}
                      className={cn(
                        "px-4 py-2 rounded-full border text-xs font-semibold transition-colors",
                        campaign.contentStyle === style
                          ? "bg-stone-900 border-stone-900 text-white"
                          : "bg-white border-stone-200 hover:border-stone-300 text-stone-600"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleBackStep}
                  className="flex-1 py-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-900 font-semibold text-sm rounded-full transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!campaign.brief || !campaign.keyMessage}
                  className="flex-1 py-4 bg-[#FEB604] hover:bg-[#FEB604]/95 disabled:bg-stone-100 disabled:text-stone-400 text-[#1C1917] font-semibold text-sm rounded-full transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Wizard Step 3: Review & Launch */}
          {createStep === 3 && (
            <div className="max-w-xl mx-auto w-full space-y-6 flex-1">
              {/* Campaign Summary Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center border border-purple-200">
                    <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-rethink font-bold text-base text-stone-900">{campaign.name}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold font-inter mt-1">
                      {campaign.category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-stone-200/60 pt-4">
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 block">Target views</span>
                    <span className="text-xl font-bold text-stone-900">{campaign.views.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 block">Budget</span>
                    <span className="text-xl font-bold text-stone-900">₦{campaign.budget.toLocaleString()}</span>
                  </div>
                </div>

                <table className="w-full text-left border-t border-stone-200/60 pt-4 block space-y-2">
                  <tbody className="block w-full">
                    <tr className="flex justify-between items-center text-xs">
                      <td className="font-medium text-stone-500">Platforms</td>
                      <td className="font-semibold text-stone-800">{campaign.platforms.join(", ")}</td>
                    </tr>
                    <tr className="flex justify-between items-center text-xs">
                      <td className="font-medium text-stone-500">Content style</td>
                      <td className="font-semibold text-stone-800">{campaign.contentStyle}</td>
                    </tr>
                    <tr className="flex justify-between items-center text-xs">
                      <td className="font-medium text-stone-500">Start date</td>
                      <td className="font-semibold text-stone-800">{campaign.startDate}</td>
                    </tr>
                    <tr className="flex justify-between items-center text-xs">
                      <td className="font-medium text-stone-500">End date</td>
                      <td className="font-semibold text-stone-800">{campaign.endDate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Warning Info Box */}
              <div className="flex items-center gap-4 bg-[#EBF3FF] border border-blue-200 rounded-2xl p-4 shadow-sm">
                <div className="flex-shrink-0">
                  <Image src={illustration3} alt="Info" width={48} height={48} />
                </div>
                <p className="font-rethink text-xs text-stone-600 leading-normal">
                  You only pay for results. Creators get paid when their views are delivered.
                </p>
              </div>

              {/* Bottom Navigation */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleBackStep}
                  className="flex-1 py-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-900 font-semibold text-sm rounded-full transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-4 bg-[#FEB604] hover:bg-[#FEB604]/95 text-[#1C1917] font-semibold text-sm rounded-full transition-colors shadow-md"
                >
                  Pay and Launch Campaign
                </button>
              </div>
            </div>
          )}

          {/* Wizard Step 4: Success / Confirmation Screen */}
          {createStep === 4 && (
            <div className="max-w-xl mx-auto w-full text-center space-y-8 py-8 flex flex-col justify-center items-center">
              {/* Folder Illustration */}
              <div>
                <Image src={illustration1} alt="Success Folder" width={160} height={160} />
              </div>

              {/* Header & Subtitle */}
              <div className="space-y-3">
                <h3 className="font-rethink font-bold text-2xl text-stone-900">Locked in. Let's get you views.</h3>
                <p className="font-rethink text-sm text-stone-500 leading-relaxed max-w-md mx-auto">
                  Your campaign is funded and waiting for a quick review. We'll notify you the moment it's live and creators can start claiming slots.
                </p>
              </div>

              {/* View Dashboard Button */}
              <button
                onClick={onSuccess}
                className="px-10 py-4 bg-[#FEB604] hover:bg-[#FEB604]/95 text-[#1C1917] font-semibold text-sm rounded-full transition-all shadow-md hover:scale-105"
              >
                View Campaign Dashboard
              </button>

              {/* What happens next box */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-left w-full space-y-4">
                <h4 className="font-rethink font-bold text-sm text-stone-900">What happens next</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-stone-800">Quick review</h5>
                    <p className="text-xs text-stone-500 mt-1">We check your campaign meets our guidelines — usually within a few hours.</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-800">Finding creators</h5>
                    <p className="text-xs text-stone-500 mt-1">Once live, your campaign appears to matching creators instantly.</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-800">Creators submit content</h5>
                    <p className="text-xs text-stone-500 mt-1">You'll get notified as work starts coming in.</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-800">Review & approve</h5>
                    <p className="text-xs text-stone-500 mt-1">Approve submissions you're happy with — you only pay for what's delivered.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
