export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface SocialAccount {
  platform: string;
  handle: string;
  verified: boolean;
}

export interface CreatorProfile {
  name: string;
  displayName: string;
  username: string;
  bio: string;
  country: string;
  socialAccounts: SocialAccount[];
  niches: string[];
  rank: string;
  creatorScore: number;
  lifetimeEarnings: number;
  completionRate: number;
}

export type DemoState =
  | "onboarding_start"
  | "onboarding_progress"
  | "onboarding_done"
  | "feed"
  | "marketplace_empty"
  | "marketplace_feed";

export type ActiveTab = "home" | "campaign" | "wallet";

export interface CampaignItem {
  id: string;
  title: string;
  category: string;
  delivery: string;
  status:
    | "needs_content"
    | "changes_requested"
    | "under_review"
    | "approved_post"
    | "live_tracking"
    | "delivered";
  reward: number;
  slotTarget?: string;
  submittedAgo?: string;
  comment?: string;
  progress?: number;
  currentViews?: number;
  targetViews?: number;
  postUrl?: string;
}
