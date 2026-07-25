import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "@ep/ui/lib/utils";
import { TYPOGRAPHY } from "@ep/ui/lib/constants";
import { useReveal } from "../hooks/use-reveal";
import { ViewsSlider } from "./views-slider";

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
  contentStyle: string[];
  contentStyleOther: string;
}

interface CampaignWizardProps {
  onClose: () => void;
  onSuccess: () => void;
  isMobile?: boolean;
}

export function CampaignWizard({ onClose, onSuccess, isMobile }: CampaignWizardProps) {
  const [createStep, setCreateStep] = useState<1 | 2 | 3 | 4>(1);
  useReveal(createStep);

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
    contentStyle: ["Fun & Energetic"],
    contentStyleOther: "",
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

  const getStepClasses = (step: 1 | 2 | 3) => {
    if (createStep === step) {
      return "border-stone-900 bg-stone-900 text-white";
    }
    if (createStep > step) {
      return "border-green-600 bg-green-600 text-white";
    }
    return "border-stone-300 text-stone-400";
  };

  const getStepLabelClasses = (step: 1 | 2 | 3) => {
    return createStep === step ? "text-stone-900" : "text-stone-400";
  };

  return (
    <div className={cn(
      "w-full h-full overflow-hidden",
      isMobile ? "flex flex-col" : "flex"
    )}>
        {/* Mobile Stepper Bar */}
        {isMobile && createStep !== 4 && (
          <div className="flex items-center justify-center gap-0 px-6 py-4 bg-[#FBFBFA] border-b border-stone-100 flex-shrink-0">
            {/* Step 1 */}
            <button
              onClick={() => createStep >= 1 && setCreateStep(1)}
              className={cn("w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold flex-shrink-0", getStepClasses(1))}
            >
              {createStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
            </button>
            <div className={cn("flex-1 h-[1px] mx-2", createStep > 1 ? "bg-green-600" : "bg-stone-200")} />
            {/* Step 2 */}
            <button
              onClick={() => createStep >= 2 && setCreateStep(2)}
              className={cn("w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold flex-shrink-0", getStepClasses(2))}
            >
              {createStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
            </button>
            <div className={cn("flex-1 h-[1px] mx-2", createStep > 2 ? "bg-green-600" : "bg-stone-200")} />
            {/* Step 3 */}
            <button
              onClick={() => createStep >= 3 && setCreateStep(3)}
              className={cn("w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold flex-shrink-0", getStepClasses(3))}
            >
              3
            </button>
          </div>
        )}

        {/* Desktop Left Sidebar Progress Indicator */}
        {!isMobile && createStep !== 4 && (
          <div className="w-80 border-r border-stone-100 bg-[#FBFBFA] p-8 flex flex-col justify-between h-full">
            <div>
              <button
                onClick={onClose}
                className="text-stone-500 text-xs font-medium font-rethink mb-10 block"
              >
                Save and Close
              </button>

              <div className="space-y-8">
                {/* Step 1 Indicator */}
                <button
                  onClick={() => createStep >= 1 && setCreateStep(1)}
                  className={cn(
                    "flex items-center gap-3 w-full text-left",
                    createStep >= 1 ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold",
                      getStepClasses(1)
                    )}
                  >
                    {createStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium font-rethink tracking-tight",
                      getStepLabelClasses(1)
                    )}
                  >
                    Set up your campaign
                  </span>
                </button>

                {/* Step 2 Indicator */}
                <button
                  onClick={() => createStep >= 2 && setCreateStep(2)}
                  className={cn(
                    "flex items-center gap-3 w-full text-left",
                    createStep >= 2 ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold",
                      getStepClasses(2)
                    )}
                  >
                    {createStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium font-rethink tracking-tight",
                      getStepLabelClasses(2)
                    )}
                  >
                    Campaign brief
                  </span>
                </button>

                {/* Step 3 Indicator */}
                <button
                  onClick={() => createStep >= 3 && setCreateStep(3)}
                  className={cn(
                    "flex items-center gap-3 w-full text-left",
                    createStep >= 3 ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold",
                      getStepClasses(3)
                    )}
                  >
                    3
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium font-rethink tracking-tight",
                      getStepLabelClasses(3)
                    )}
                  >
                    Review & launch
                  </span>
                </button>
              </div>
            </div>

            <div className="text-xs text-stone-400 font-medium">Step {createStep} of 3</div>
          </div>
        )}

        {/* Right Form Content */}
        <div className={cn(
          "flex-1 flex flex-col justify-between overflow-y-auto overflow-x-hidden h-full",
          isMobile ? "p-4" : "p-12"
        )}>
          {/* Header */}
          {!isMobile && createStep !== 4 && (
              <div className="text-center mb-8 relative">
              <h3 className="font-rethink font-semibold tracking-tight text-xl text-stone-900">Create a Campaign</h3>
              <button onClick={onClose} className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Wizard Step 1: Set up campaign */}
          {createStep === 1 && (
            <div data-reveal className={cn("space-y-8 flex-1", isMobile ? "w-full" : "w-[350px] mx-auto")}>
              {/* Campaign Cover */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-stone-200 rounded-xl overflow-hidden flex items-center justify-center">
                  <Image src={illustration2} alt="Campaign cover" width={48} height={48} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-stone-900">Campaign cover</h4>
                  <button className="px-4 py-1.5 bg-white rounded-full text-xs font-medium text-stone-600 font-rethink">
                    Upload image
                  </button>
                </div>
              </div>

              {/* Campaign Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-500 block">Campaign name</label>
                <input
                  type="text"
                  placeholder="Campaign name"
                  value={campaign.name}
                  onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-full text-sm font-rethink font-medium tracking-tight placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0"
                />
              </div>

              {/* Promotion category */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-500 block">What are you promoting?</label>
                <div className="relative">
                  <select
                    value={campaign.category}
                    onChange={(e) => setCampaign({ ...campaign, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-full text-sm font-rethink font-medium tracking-tight appearance-none placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0"
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
              <div className={cn("gap-4", isMobile ? "grid grid-cols-1" : "grid grid-cols-2")}>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-stone-500 block">Start date</label>
                  <input
                    type="date"
                    value={campaign.startDate}
                    onChange={(e) => setCampaign({ ...campaign, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-full text-sm font-rethink font-medium tracking-tight placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-stone-500 block">End date</label>
                  <input
                    type="date"
                    value={campaign.endDate}
                    onChange={(e) => setCampaign({ ...campaign, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-full text-sm font-rethink font-medium tracking-tight placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0"
                  />
                </div>
              </div>

              {/* Campaign Views Slider */}
              <div className="space-y-4">
                <label className="text-xs font-medium text-stone-500 block">How many views do you want?</label>
                <ViewsSlider
                  value={campaign.views}
                  onChange={handleViewsChange}
                  min={100000}
                  max={3000000}
                  steps={[100000, 500000, 1000000, 1500000, 2000000, 3000000]}
                />
              </div>

              {/* Campaign Budget Display */}
              <div className="pt-4 border-t border-stone-100 space-y-1">
                <span className="text-xs font-medium text-stone-500 block">Campaign Budget</span>
                <span className="text-[23px] font-medium text-stone-900 font-rethink tracking-tight">
                  ₦{campaign.budget.toLocaleString()}
                </span>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleNextStep}
                disabled={!campaign.name}
                className="w-full py-4 bg-[#FEB604] disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed text-[#1C1917] font-bold text-sm rounded-full border border-stone-100 font-rethink"
              >
                Continue
              </button>
            </div>
          )}

          {/* Wizard Step 2: Campaign Brief */}
          {createStep === 2 && (
            <div data-reveal className={cn("space-y-6 flex-1", isMobile ? "w-full" : "w-[350px] mx-auto")}>
              {/* Content Brief */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-500 block">Content brief</label>
                <textarea
                  placeholder="Describe what you want creators to do..."
                  value={campaign.brief}
                  onChange={(e) => setCampaign({ ...campaign, brief: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-rethink font-medium tracking-tight placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0"
                />
              </div>

              {/* Key Message */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-500 block">Key message / CTA</label>
                <textarea
                  placeholder="What should the creators say or direct viewers to do..."
                  value={campaign.keyMessage}
                  onChange={(e) => setCampaign({ ...campaign, keyMessage: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-rethink font-medium tracking-tight placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0"
                />
              </div>

              {/* Preferred Style selection */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-stone-500 block">Preferred content style</label>
                <div className="flex flex-wrap gap-2">
                  {["Fun & Energetic", "Lifestyle", "Comedy", "Trend/Challenge", "Other"].map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        if (style === "Other") {
                          setCampaign(prev => ({
                            ...prev,
                            contentStyle: prev.contentStyle.includes(style)
                              ? prev.contentStyle.filter(s => s !== style)
                              : [...prev.contentStyle, style],
                          }));
                        } else {
                          setCampaign(prev => ({
                            ...prev,
                            contentStyle: prev.contentStyle.includes(style)
                              ? prev.contentStyle.filter(s => s !== style)
                              : [...prev.contentStyle, style],
                          }));
                        }
                      }}
                      className={cn(
                        "px-4 py-2 rounded-full border text-xs font-medium tracking-tight font-rethink transition-colors",
                        campaign.contentStyle.includes(style)
                          ? "bg-stone-900 border-stone-900 text-white"
                          : "bg-white border-stone-200 text-stone-600"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>

                {/* Custom input when Other is selected */}
                {campaign.contentStyle.includes("Other") && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    value={campaign.contentStyleOther}
                    onChange={(e) => setCampaign({ ...campaign, contentStyleOther: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-full text-sm font-rethink font-medium tracking-tight placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0"
                  />
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleBackStep}
                  className="flex-1 py-4 bg-white border border-stone-200 text-stone-900 font-semibold text-sm rounded-full"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!campaign.brief || !campaign.keyMessage}
                  className="flex-1 py-4 bg-[#FEB604] disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed text-[#1C1917] font-bold text-sm rounded-full border border-stone-100 font-rethink"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Wizard Step 3: Review & Launch */}
          {createStep === 3 && (
            <div data-reveal className={cn("space-y-6 flex-1", isMobile ? "w-full" : "w-[350px] mx-auto")}>
              {/* Campaign Summary */}
              <div className="space-y-4">
                {/* Image */}
                <div>
                  <div className="w-[70px] h-[70px] bg-purple-100 rounded-2xl flex items-center justify-center border border-purple-200">
                    <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                    </svg>
                  </div>
                </div>

                {/* Name */}
                <h4 className="font-rethink font-semibold text-base text-stone-900">{campaign.name}</h4>

                {/* Category tag */}
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-[11px] font-medium font-rethink">
                  {campaign.category}
                </span>

                {/* Views & Budget */}
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[11px] font-medium text-stone-400 block">Target views</span>
                    <span className="text-lg font-semibold text-stone-900 font-rethink">{campaign.views.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-stone-400 block">Budget</span>
                    <span className="text-lg font-semibold text-stone-900 font-rethink">₦{campaign.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Details container */}
              <div className="bg-stone-100 rounded-[18px] p-4 space-y-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-stone-500">Platforms</span>
                  <span className="font-semibold text-stone-800">{campaign.platforms.join(", ")}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-stone-500">Content style</span>
                  <span className="font-semibold text-stone-800">{campaign.contentStyle.join(", ")}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-stone-500">Start date</span>
                  <span className="font-semibold text-stone-800">{campaign.startDate}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-stone-500">End date</span>
                  <span className="font-semibold text-stone-800">{campaign.endDate}</span>
                </div>
              </div>

              {/* Warning Info Box */}
              <div className="flex items-center gap-4 bg-[#EBF3FF] border border-dashed border-blue-200 rounded-[20px] p-4">
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
                  className="flex-1 py-4 bg-white border border-stone-100 text-stone-900 font-bold text-sm rounded-full font-rethink"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-4 bg-[#FEB604] text-[#1C1917] font-bold text-sm rounded-full border border-stone-100 font-rethink"
                >
                  Pay and Launch Campaign
                </button>
              </div>
            </div>
          )}

          {/* Wizard Step 4: Success / Confirmation Screen */}
          {createStep === 4 && (
            <div data-reveal className={cn("text-center space-y-8 py-8 flex flex-col justify-center items-center", isMobile ? "w-full" : "w-[350px] mx-auto")}>
              {/* Folder Illustration */}
              <div>
                <Image src={illustration3} alt="Success Folder" width={160} height={160} />
              </div>

              {/* Header & Subtitle */}
              <div className="space-y-3">
                <h3 className="font-rethink font-semibold tracking-tight text-2xl text-stone-900">Locked in. Let's get you views.</h3>
                <p className="font-rethink text-sm text-stone-500 leading-relaxed max-w-md mx-auto">
                  Your campaign is funded and waiting for a quick review. We'll notify you the moment it's live and creators can start claiming slots.
                </p>
              </div>

              {/* View Dashboard Button */}
              <button
                onClick={onSuccess}
                className="w-full py-4 bg-[#FEB604] text-[#1C1917] font-bold text-sm rounded-full border border-stone-100 font-rethink"
              >
                View Campaign Dashboard
              </button>

              {/* What happens next box */}
              <div className="bg-stone-100 rounded-[24px] p-4 text-left w-full space-y-8">
                <h4 className="font-rethink text-[19px] font-medium tracking-tight text-stone-900">What happens next</h4>
                <div className="space-y-8">
                  <div>
                    <h5 className="text-xs font-medium tracking-tight text-stone-800">Quick review</h5>
                    <p className="text-xs text-stone-500 mt-1">We check your campaign meets our guidelines — usually within a few hours.</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium tracking-tight text-stone-800">Finding creators</h5>
                    <p className="text-xs text-stone-500 mt-1">Once live, your campaign appears to matching creators instantly.</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium tracking-tight text-stone-800">Creators submit content</h5>
                    <p className="text-xs text-stone-500 mt-1">You'll get notified as work starts coming in.</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium tracking-tight text-stone-800">Review & approve</h5>
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
