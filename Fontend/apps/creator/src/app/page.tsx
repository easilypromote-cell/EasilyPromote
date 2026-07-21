"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CreatorProfile, DemoState, ActiveTab, CampaignItem } from "../components/types";
import { CreatorHeader } from "../components/creator-header";
import { StateSwitcher } from "../components/state-switcher";
import { OnboardingView } from "../components/onboarding-view";
import { OnboardingComplete } from "../components/onboarding-complete";
import { CampaignFeed } from "../components/campaign-feed";
import { CampaignTable } from "../components/campaign-table";
import { WalletView } from "../components/wallet-view";
import { CampaignMarketplace } from "../components/campaign-marketplace";
import { SocialConnectModal } from "../components/modals/social-connect-modal";
import { NicheModal } from "../components/modals/niche-modal";
import { ProfileModal } from "../components/modals/profile-modal";
import { CampaignDetailsDrawer } from "../components/campaign-details-drawer";

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: "c1",
    title: "Launch my new Afrobeats single",
    category: "Music",
    delivery: "3 Days Left",
    status: "needs_content",
    reward: 60800,
    slotTarget: "5K – 10K views",
  },
  {
    id: "c2",
    title: "Skincare launch weekend",
    category: "Music",
    delivery: "5 Days Left",
    status: "changes_requested",
    reward: 60800,
    comment: "Missed the CTA — please mention the streaming link...",
  },
  {
    id: "c3",
    title: "Launch my new Afrobeats single",
    category: "Music",
    delivery: "Submitted 4 Hours Ago",
    status: "under_review",
    reward: 60800,
    slotTarget: "5K – 10K views",
  },
  {
    id: "c4",
    title: "Launch my new Afrobeats single",
    category: "Music",
    delivery: "Submitted 4 Hours Ago",
    status: "approved_post",
    reward: 60800,
  },
  {
    id: "c5",
    title: "Launch my new Afrobeats single",
    category: "Music",
    delivery: "Live · tracking views",
    status: "live_tracking",
    reward: 60800,
    progress: 68,
    currentViews: 170000,
    targetViews: 250000,
  },
  {
    id: "c6",
    title: "Launch my new Afrobeats single",
    category: "Music",
    delivery: "Delivered",
    status: "delivered",
    reward: 60800,
    progress: 100,
    currentViews: 250000,
    targetViews: 250000,
  },
];

export default function CreatorDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<CreatorProfile>({
    name: "John",
    displayName: "John",
    username: "john_creator",
    bio: "",
    country: "",
    socialAccounts: [],
    niches: [],
    rank: "Rank #1",
    creatorScore: 0,
    lifetimeEarnings: 0,
    completionRate: 0,
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [demoState, setDemoState] = useState<DemoState>("feed");
  const [campaignsFilter, setCampaignsFilter] = useState<string>("all");
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);

  // Modal visibility
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showNicheModal, setShowNicheModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Form states
  const [socialPlatform, setSocialPlatform] = useState("TikTok");
  const [socialHandle, setSocialHandle] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [profileForm, setProfileForm] = useState({
    displayName: "John",
    bio: "Content creator and designer.",
    country: "Nigeria",
    avatarUrl: "",
  });

  // Post URL inputs
  const [readyPostUrl, setReadyPostUrl] = useState<Record<string, string>>({});

  // Auth and Profile fetch
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setProfile((prev) => ({
        ...prev,
        name: parsed.name,
        displayName: parsed.name,
        username: parsed.email.split("@")[0],
      }));
      fetchProfile(parsed.id);
    } else {
      // Auto-populate for mock/demo purposes if localstorage is empty
      setProfile((prev) => ({
        ...prev,
        name: "John",
        displayName: "John",
        username: "john_creator",
      }));
    }
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`http://localhost:5000/api/creators/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name,
          displayName: data.displayName || data.name,
          username: data.username,
          bio: data.bio || "",
          country: data.country || "",
          socialAccounts: data.socialAccounts || [],
          niches: data.niches || [],
          rank: data.rank === "rank1" ? "Rank #1" : data.rank,
          creatorScore: data.creatorScore || 0,
          lifetimeEarnings: data.lifetimeEarnings || 0,
          completionRate: data.completionRate || 0,
        });

        const hasSocial = data.socialAccounts && data.socialAccounts.length > 0;
        const hasNiches = data.niches && data.niches.length > 0;
        const hasProfile = data.displayName && data.country;

        if (hasSocial && hasNiches && hasProfile) {
          setDemoState("feed");
        } else if (hasSocial || hasNiches) {
          setDemoState("onboarding_progress");
        } else {
          setDemoState("onboarding_start");
        }
      }
    } catch (err) {
      console.log("Could not load backend profile, using mock fallback", err);
    }
  };

  // Connect Social Account
  const handleConnectSocial = async () => {
    if (!socialHandle) return;
    const newSocial = {
      platform: socialPlatform.toLowerCase(),
      handle: socialHandle.startsWith("@") ? socialHandle : `@${socialHandle}`,
      verified: true,
    };

    const updatedSocials = [
      ...profile.socialAccounts.filter((s) => s.platform !== newSocial.platform),
      newSocial,
    ];
    setProfile((prev) => ({ ...prev, socialAccounts: updatedSocials }));
    setShowSocialModal(false);
    setSocialHandle("");

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`http://localhost:5000/api/creators/profile/socials`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ platform: socialPlatform, handle: newSocial.handle }),
        });
      }
    } catch (err) {
      console.error(err);
    }

    if (demoState === "onboarding_start") {
      setDemoState("onboarding_progress");
    }
  };

  // Save Niches
  const handleSaveNiches = async () => {
    if (selectedNiches.length === 0) return;

    setProfile((prev) => ({ ...prev, niches: selectedNiches }));
    setShowNicheModal(false);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`http://localhost:5000/api/creators/profile/niches`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ niches: selectedNiches }),
        });
      }
    } catch (err) {
      console.error(err);
    }

    if (demoState === "onboarding_start") {
      setDemoState("onboarding_progress");
    }
  };

  // Complete Profile
  const handleSaveProfile = async () => {
    setProfile((prev) => ({
      ...prev,
      displayName: profileForm.displayName,
      bio: profileForm.bio,
      country: profileForm.country,
    }));
    setShowProfileModal(false);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`http://localhost:5000/api/creators/profile/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            displayName: profileForm.displayName,
            bio: profileForm.bio,
            country: profileForm.country,
          }),
        });
      }
    } catch (err) {
      console.error(err);
    }

    setDemoState("onboarding_done");
  };

  // Campaign actions
  const handleSubmitContent = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? { ...c, status: "under_review" as const, delivery: "Submitted just now" }
          : c
      )
    );
  };

  const handleUpdateContent = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? { ...c, status: "under_review" as const, comment: undefined, delivery: "Submitted just now" }
          : c
      )
    );
  };

  const handleSubmitPostUrl = (campaignId: string) => {
    const url = readyPostUrl[campaignId];
    if (!url) return;

    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              status: "live_tracking" as const,
              progress: 0,
              currentViews: 0,
              targetViews: 250000,
              postUrl: url,
            }
          : c
      )
    );
  };

  const handleDetailsSubmitPostUrl = (campaignId: string, urls: { tiktok?: string; instagram?: string; x?: string }) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              status: "live_tracking" as const,
              progress: 68,
              currentViews: 170000,
              targetViews: 250000,
            }
          : c
      )
    );
  };

  // Sync selected campaign status reactively when campaigns change
  useEffect(() => {
    if (selectedCampaign) {
      const updated = campaigns.find((c) => c.id === selectedCampaign.id);
      if (updated) setSelectedCampaign(updated);
    }
  }, [campaigns]);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    if (campaignsFilter === "all") return true;
    return c.status === campaignsFilter;
  });

  // Sync niche selection when opening modal
  useEffect(() => {
    setSelectedNiches(profile.niches);
  }, [profile.niches]);

  // Sync demo state switcher
  useEffect(() => {
    if (demoState === "onboarding_start") {
      setProfile((prev) => ({ ...prev, socialAccounts: [], niches: [], bio: "", country: "" }));
      setActiveTab("home");
    } else if (demoState === "onboarding_progress") {
      setProfile((prev) => ({
        ...prev,
        socialAccounts: [{ platform: "tiktok", handle: "@john_test", verified: true }],
        niches: ["Music", "Lifestyle"],
        bio: "",
        country: "",
      }));
      setActiveTab("home");
    } else if (demoState === "onboarding_done") {
      setProfile((prev) => ({
        ...prev,
        socialAccounts: [{ platform: "tiktok", handle: "@john_test", verified: true }],
        niches: ["Music", "Lifestyle"],
        bio: "Bio details here.",
        country: "Nigeria",
      }));
      setActiveTab("home");
    } else if (demoState === "feed") {
      setProfile((prev) => ({
        ...prev,
        socialAccounts: [{ platform: "tiktok", handle: "@john_test", verified: true }],
        niches: ["Music", "Lifestyle"],
        bio: "Bio details here.",
        country: "Nigeria",
      }));
      setActiveTab("home");
    } else if (demoState === "marketplace_empty" || demoState === "marketplace_feed") {
      setProfile((prev) => ({
        ...prev,
        socialAccounts: [{ platform: "tiktok", handle: "@john_test", verified: true }],
        niches: ["Music", "Lifestyle"],
        bio: "Bio details here.",
        country: "Nigeria",
      }));
      setActiveTab("campaign");
    }
  }, [demoState]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] flex flex-col font-rethink">
      <StateSwitcher demoState={demoState} onStateChange={setDemoState} />

      <CreatorHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        profile={profile}
        demoState={demoState}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col items-center">
        {activeTab === "home" && (
          <>
            {demoState !== "feed" && demoState !== "onboarding_done" && (
              <OnboardingView
                profile={profile}
                onConnectSocial={() => setShowSocialModal(true)}
                onChooseNiches={() => setShowNicheModal(true)}
                onCompleteProfile={() => setShowProfileModal(true)}
              />
            )}

            {demoState === "onboarding_done" && (
              <OnboardingComplete
                profile={profile}
                onBrowseCampaigns={() => setDemoState("feed")}
              />
            )}

            {demoState === "feed" && (
              <CampaignFeed
                profile={profile}
                campaigns={filteredCampaigns}
                filter={campaignsFilter}
                onFilterChange={setCampaignsFilter}
                onSubmitContent={handleSubmitContent}
                onUpdateContent={handleUpdateContent}
                onSubmitPostUrl={handleSubmitPostUrl}
                postUrls={readyPostUrl}
                onPostUrlChange={(id, url) => setReadyPostUrl({ ...readyPostUrl, [id]: url })}
                onSelectCampaign={setSelectedCampaign}
              />
            )}
          </>
        )}

        {selectedCampaign && (
          <CampaignDetailsDrawer
            campaign={selectedCampaign}
            onClose={() => setSelectedCampaign(null)}
            onSubmitContent={handleSubmitContent}
            onUpdateContent={handleUpdateContent}
            onSubmitPostUrl={handleDetailsSubmitPostUrl}
          />
        )}

        {activeTab === "campaign" && (
          <CampaignMarketplace isEmpty={demoState === "marketplace_empty"} />
        )}

        {activeTab === "wallet" && <WalletView profile={profile} />}
      </main>

      {/* Modals */}
      <SocialConnectModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        onConnect={handleConnectSocial}
        platform={socialPlatform}
        onPlatformChange={setSocialPlatform}
        handle={socialHandle}
        onHandleChange={setSocialHandle}
      />

      <NicheModal
        isOpen={showNicheModal}
        onClose={() => setShowNicheModal(false)}
        onSave={handleSaveNiches}
        selectedNiches={selectedNiches}
        onNichesChange={setSelectedNiches}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={handleSaveProfile}
        profileForm={profileForm}
        onProfileFormChange={setProfileForm}
      />
    </div>
  );
}
