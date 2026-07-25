import * as React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronDown, Check, X, Upload, FileText, Trash2 } from "lucide-react";
import { cn } from "@ep/ui/lib/utils";
import { TYPOGRAPHY } from "@ep/ui/lib/constants";
import { useReveal } from "../hooks/use-reveal";
import { ViewsSlider } from "./views-slider";
import { apiRequest, getToken } from "../lib/api";

// Assets imports
import illustration3 from "@ep/ui/assets/illustrations/illustration3.svg";
import illustration1 from "@ep/ui/assets/illustrations/illustration1.svg";
import illustration2 from "@ep/ui/assets/illustrations/illustration2.svg";

interface CampaignData {
  name: string;
  category: string;
  views: number;
  budget: number;
  brief: string;
  keyMessage: string;
  avoid: string;
  platforms: string[];
  contentStyle: string[];
  scriptUrl: string;
  scriptFileName: string;
  coverImageUrl: string;
}

interface CampaignWizardProps {
  onClose: () => void;
  onSuccess: () => void;
  isMobile?: boolean;
  draftId?: string;
  initialStep?: 1 | 2 | 3 | 4;
}

const PLATFORM_OPTIONS = ["TikTok", "Instagram", "X (Twitter)", "Facebook", "YouTube"];

export function CampaignWizard({ onClose, onSuccess, draftId, initialStep, isMobile }: CampaignWizardProps) {
  const [createStep, setCreateStep] = useState<1 | 2 | 3 | 4>(initialStep || 1);
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState("");
  const [pricingRates, setPricingRates] = useState<Record<string, number>>({});
  const [defaultRate, setDefaultRate] = useState(1.085);
  useReveal(createStep);

  React.useEffect(() => {
    apiRequest<{ default: number; categories: Record<string, number> }>("/campaigns/pricing")
      .then((data) => {
        setPricingRates(data.categories || {});
        setDefaultRate(data.default || 1.085);
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    if (!draftId) return;
    apiRequest<any>(`/campaigns/${draftId}`, { token: getToken() || undefined })
      .then((data) => {
        setCampaign({
          name: data.name || "",
          category: data.category || "Music",
          views: data.targetViews || 1000000,
          budget: data.budget || 0,
          brief: data.contentBrief || "",
          keyMessage: data.keyMessageCta || "",
          avoid: data.whatToAvoid || "",
          platforms: data.platforms || [],
          contentStyle: data.contentStyle ? (typeof data.contentStyle === "string" ? data.contentStyle.split(",").map((s: string) => s.trim()).filter(Boolean) : data.contentStyle) : [],
          scriptUrl: data.scriptUrl || "",
          scriptFileName: data.scriptFileName || "",
          coverImageUrl: data.coverImageUrl || "",
        });

        if (!initialStep) {
          const hasBrief = data.contentBrief && data.keyMessageCta;
          setCreateStep(hasBrief ? 3 : 1);
        }
      })
      .catch(() => {});
  }, [draftId, initialStep]);

  const getRate = (category: string) => pricingRates[category] || defaultRate;

  // Campaign Form State
  const [campaign, setCampaign] = useState<CampaignData>({
    name: "",
    category: "Music",
    views: 1000000,
    budget: 1085000,
    brief: "",
    keyMessage: "",
    avoid: "",
    platforms: ["TikTok", "Instagram"],
    contentStyle: ["Fun & Energetic"],
    scriptUrl: "",
    scriptFileName: "",
    coverImageUrl: "",
  });

  const [uploadingScript, setUploadingScript] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [customStyleInput, setCustomStyleInput] = useState("");
  const scriptInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleViewsChange = (val: number) => {
    const rate = getRate(campaign.category);
    const newBudget = Math.round(val * rate);
    setCampaign(prev => ({
      ...prev,
      views: val,
      budget: newBudget,
    }));
  };

  const handleCategoryChange = (category: string) => {
    const rate = getRate(category);
    const newBudget = Math.round(campaign.views * rate);
    setCampaign(prev => ({
      ...prev,
      category,
      budget: newBudget,
    }));
  };

  const handleScriptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingScript(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/upload/document`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setCampaign(prev => ({
        ...prev,
        scriptUrl: data.url,
        scriptFileName: file.name,
      }));
    } catch {
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploadingScript(false);
      if (scriptInputRef.current) scriptInputRef.current.value = "";
    }
  };

  const handleRemoveScript = () => {
    setCampaign(prev => ({ ...prev, scriptUrl: "", scriptFileName: "" }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setImageProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = getToken();
      const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/upload/image`;
      const data = await new Promise<{ url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setImageProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(formData);
      });
      setCampaign(prev => ({ ...prev, coverImageUrl: data.url }));
    } catch {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      setImageProgress(0);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const buildPayload = () => ({
    name: campaign.name,
    category: campaign.category,
    targetViews: campaign.views,
    contentBrief: campaign.brief,
    keyMessageCta: campaign.keyMessage,
    whatToAvoid: campaign.avoid,
    platforms: campaign.platforms.map((p) => p.toLowerCase()),
    contentStyle: campaign.contentStyle.filter(Boolean).join(", "),
    scriptUrl: campaign.scriptUrl || undefined,
    scriptFileName: campaign.scriptFileName || undefined,
    coverImageUrl: campaign.coverImageUrl || undefined,
  });

  const handleNextStep = async () => {
    if (createStep < 3) {
      setCreateStep((prev) => (prev + 1) as any);
      return;
    }

    if (createStep === 3) {
      setLaunching(true);
      setLaunchError("");
      try {
        const endpoint = draftId ? `/campaigns/${draftId}` : "/campaigns";
        const method = draftId ? "PATCH" : "POST";
        const campaignData = await apiRequest<{ id: string; budget: number }>(endpoint, {
          method,
          token: getToken() || undefined,
          body: JSON.stringify(buildPayload()),
        });

        const payData = await apiRequest<{ authorization_url: string }>("/campaigns/" + (draftId || campaignData.id) + "/pay", {
          method: "POST",
          token: getToken() || undefined,
        });

        window.location.href = payData.authorization_url;
      } catch (err: unknown) {
        setLaunchError(err instanceof Error ? err.message : "Failed to create campaign");
      } finally {
        setLaunching(false);
      }
    }
  };

  const handleSaveDraft = async () => {
    if (!campaign.name) return;
    try {
      const endpoint = draftId ? `/campaigns/${draftId}` : "/campaigns";
      const method = draftId ? "PATCH" : "POST";
      await apiRequest(endpoint, {
        method,
        token: getToken() || undefined,
        body: JSON.stringify(buildPayload()),
      });
      onSuccess();
      onClose();
    } catch {
      alert("Failed to save draft. Please try again.");
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
                onClick={campaign.name ? handleSaveDraft : onClose}
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

            {draftId && (
              <button
                onClick={async () => {
                  if (!window.confirm("Delete this draft campaign?")) return;
                  try {
                    await apiRequest(`/campaigns/${draftId}`, { method: "DELETE", token: getToken() || undefined });
                    onSuccess();
                    onClose();
                  } catch {
                    alert("Failed to delete draft");
                  }
                }}
                className="mt-3 text-xs font-medium text-red-500 hover:text-red-600 font-rethink"
              >
                Delete draft
              </button>
            )}
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
              <h3 className="font-rethink font-semibold tracking-tight text-xl text-stone-900">{draftId ? "Edit Draft" : "Create a Campaign"}</h3>
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
                  {campaign.coverImageUrl ? (
                    <img src={campaign.coverImageUrl} alt="Campaign cover" className="w-full h-full object-cover" />
                  ) : (
                    <Image src={illustration2} alt="Campaign cover" width={48} height={48} />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-stone-900">Campaign cover</h4>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  {uploadingImage ? (
                    <div className="w-full space-y-1">
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-stone-900 rounded-full transition-all duration-150"
                          style={{ width: `${imageProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-stone-500 font-rethink">{imageProgress}%</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => coverInputRef.current?.click()}
                      className="px-4 py-1.5 bg-white rounded-full text-xs font-medium text-stone-600 font-rethink hover:bg-stone-50 transition-colors"
                    >
                      {campaign.coverImageUrl ? "Change image" : "Upload image"}
                    </button>
                  )}
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
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-full text-sm font-rethink font-medium tracking-tight appearance-none placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0"
                  >
                    {Object.keys(pricingRates).length > 0
                      ? Object.keys(pricingRates).map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))
                      : ["Music", "Fashion", "Tech", "Food", "Travel", "Fitness", "Beauty", "Gaming"].map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))
                    }
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[10px] text-stone-400 font-medium">
                  ₦{getRate(campaign.category).toFixed(3)} per view — Budget calculated automatically
                </span>
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
              {/* Platform Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-500 block">Which platforms?</label>
                <div className="relative">
                  <select
                    value=""
                    onChange={(e) => {
                      const selected = e.target.value;
                      if (selected && !campaign.platforms.includes(selected)) {
                        setCampaign(prev => ({
                          ...prev,
                          platforms: [...prev.platforms, selected],
                        }));
                      }
                    }}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-full text-sm font-rethink font-medium tracking-tight appearance-none placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0"
                  >
                    <option value="" disabled>{campaign.platforms.length === 0 ? "Select platforms" : "Add another platform"}</option>
                    {PLATFORM_OPTIONS.filter(p => !campaign.platforms.includes(p)).map((platform) => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {campaign.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {campaign.platforms.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900 text-white text-[11px] font-medium font-rethink">
                        {p}
                        <button
                          onClick={() => setCampaign(prev => ({ ...prev, platforms: prev.platforms.filter(pl => pl !== p) }))}
                          className="ml-0.5 hover:text-stone-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

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

              {/* Script / Document Upload */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-500 block">Upload script (optional)</label>
                <input
                  ref={scriptInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleScriptUpload}
                  className="hidden"
                />
                {campaign.scriptFileName ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white border border-stone-200 rounded-xl">
                    <FileText className="w-5 h-5 text-stone-500 flex-shrink-0" />
                    <span className="text-sm font-rethink font-medium text-stone-900 truncate flex-1">
                      {campaign.scriptFileName}
                    </span>
                    <button
                      onClick={handleRemoveScript}
                      className="text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => scriptInputRef.current?.click()}
                    disabled={uploadingScript}
                    className="w-full px-4 py-3 bg-white border border-dashed border-stone-300 rounded-xl text-sm font-rethink font-medium text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingScript ? "Uploading..." : "Upload PDF or DOC"}
                  </button>
                )}
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
                  {["Fun & Energetic", "Lifestyle", "Comedy", "Trend/Challenge"].map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        setCampaign(prev => ({
                          ...prev,
                          contentStyle: prev.contentStyle.includes(style)
                            ? prev.contentStyle.filter(s => s !== style)
                            : [...prev.contentStyle, style],
                        }));
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

                {/* Custom style chips + input */}
                {campaign.contentStyle.filter(s => !["Fun & Energetic", "Lifestyle", "Comedy", "Trend/Challenge"].includes(s)).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {campaign.contentStyle.filter(s => !["Fun & Energetic", "Lifestyle", "Comedy", "Trend/Challenge"].includes(s)).map((style) => (
                      <span key={style} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900 text-white text-[11px] font-medium font-rethink">
                        {style}
                        <button
                          onClick={() => setCampaign(prev => ({ ...prev, contentStyle: prev.contentStyle.filter(s => s !== style) }))}
                          className="ml-0.5 hover:text-stone-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a custom style..."
                    value={customStyleInput}
                    onChange={(e) => setCustomStyleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customStyleInput.trim()) {
                        e.preventDefault();
                        if (!campaign.contentStyle.includes(customStyleInput.trim())) {
                          setCampaign(prev => ({
                            ...prev,
                            contentStyle: [...prev.contentStyle, customStyleInput.trim()],
                          }));
                        }
                        setCustomStyleInput("");
                      }
                    }}
                    className="flex-1 px-4 py-2.5 bg-white border border-stone-200 rounded-full text-xs font-rethink font-medium tracking-tight placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:ring-0"
                  />
                  <button
                    onClick={() => {
                      if (customStyleInput.trim() && !campaign.contentStyle.includes(customStyleInput.trim())) {
                        setCampaign(prev => ({
                          ...prev,
                          contentStyle: [...prev.contentStyle, customStyleInput.trim()],
                        }));
                        setCustomStyleInput("");
                      }
                    }}
                    disabled={!customStyleInput.trim()}
                    className="px-4 py-2.5 bg-stone-900 text-white text-xs font-bold font-rethink rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add+
                  </button>
                </div>
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
                  <div className="w-[70px] h-[70px] bg-purple-100 rounded-2xl overflow-hidden flex items-center justify-center border border-purple-200">
                    {campaign.coverImageUrl ? (
                      <img src={campaign.coverImageUrl} alt="Campaign cover" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                      </svg>
                    )}
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
                {campaign.scriptFileName && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-stone-500">Script</span>
                    <span className="font-semibold text-stone-800 truncate ml-4">{campaign.scriptFileName}</span>
                  </div>
                )}
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
                  className="flex-1 py-4 bg-white text-stone-900 font-bold text-sm rounded-full border border-stone-200 font-rethink"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={launching}
                  className="flex-1 py-4 bg-[#FEB604] text-[#1C1917] font-bold text-sm rounded-full border border-stone-100 font-rethink disabled:opacity-50"
                >
                  {launching ? "Launching..." : "Pay and Launch Campaign"}
                </button>
              </div>
              {launchError && (
                <p className="text-xs text-red-600 font-medium text-center mt-2">{launchError}</p>
              )}
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
