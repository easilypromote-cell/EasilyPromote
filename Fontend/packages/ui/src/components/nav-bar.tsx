import * as React from "react";
import { Home as HomeIcon, Wallet as WalletIcon, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { TYPOGRAPHY } from "../lib/constants";

export interface NavBarProps {
  activeTab: "home" | "wallet";
  onTabChange?: (tab: "home" | "wallet") => void;
  userName?: string;
  onLogout?: () => void;
  className?: string;
}

export function NavBar({
  activeTab,
  onTabChange,
  userName = "Acme Inc.",
  onLogout,
  className,
}: NavBarProps) {
  return (
    <header className={cn("sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-stone-100", className)}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          {/* Yellow circle logo */}
          <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-stone-900">E</span>
          </div>
          <span className={TYPOGRAPHY.brandLogo}>EasilyPromote</span>
        </div>

        {/* Center Pill Navigation */}
        <nav className="bg-stone-100 p-1.5 rounded-full flex gap-1 items-center border border-stone-200">
          <button
            onClick={() => onTabChange?.("home")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
              activeTab === "home"
                ? "bg-white text-stone-900 shadow-sm border border-stone-200/50"
                : "text-stone-500 hover:text-stone-900"
            )}
          >
            <HomeIcon className="w-4 h-4" />
            <span className={activeTab === "home" ? TYPOGRAPHY.home : TYPOGRAPHY.wallet}>Home</span>
          </button>

          <button
            onClick={() => onTabChange?.("wallet")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
              activeTab === "wallet"
                ? "bg-white text-stone-900 shadow-sm border border-stone-200/50"
                : "text-stone-500 hover:text-stone-900"
            )}
          >
            <WalletIcon className="w-4 h-4" />
            <span className={activeTab === "wallet" ? TYPOGRAPHY.home : TYPOGRAPHY.wallet}>Wallet</span>
          </button>
        </nav>

        {/* User Profile */}
        <div
          onClick={onLogout}
          className="flex items-center gap-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full pl-2 pr-4 py-1.5 cursor-pointer transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden border border-stone-300">
            {/* Generic placeholder avatar or user initial */}
            <span className="text-xs font-semibold text-stone-600">A</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={TYPOGRAPHY.userProfile}>{userName}</span>
            <ChevronDown className="w-4 h-4 text-stone-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
