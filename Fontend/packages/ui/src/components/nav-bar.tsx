import * as React from "react";
import Image from "next/image";
import { Home as HomeIcon, Wallet as WalletIcon, ChevronDown, User, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import { TYPOGRAPHY } from "../lib/constants";
import logoPrimary from "../assets/logo-primary.svg";
import avatarSvg from "../assets/illustrations/Avatar [1.0].svg";

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
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={cn("w-full bg-stone-100 z-40", className)}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <Image src={logoPrimary} alt="EasilyPromote" width={32} height={32} priority />
        </div>

        {/* Center Pill Navigation */}
        <nav className="bg-stone-50 p-1.5 rounded-full border border-stone-100">
          <div className="bg-stone-50 rounded-full p-1 flex items-center gap-1">
            <button
              onClick={() => onTabChange?.("home")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                activeTab === "home"
                  ? "bg-white text-stone-900 font-semibold"
                  : "text-stone-500 font-medium"
              )}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onTabChange?.("wallet")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                activeTab === "wallet"
                  ? "bg-white text-stone-900 font-semibold"
                  : "text-stone-500 font-medium"
              )}
            >
              <WalletIcon className="w-4 h-4" />
              <span>Wallet</span>
            </button>
          </div>
        </nav>

        {/* User Profile with Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 bg-white rounded-full pl-2 pr-4 py-1.5 cursor-pointer"
          >
            <Image src={avatarSvg} alt={userName} width={28} height={28} className="rounded-full" />
            <div className="flex items-center gap-1.5">
              <span className={TYPOGRAPHY.userProfile}>{userName}</span>
              <ChevronDown className="w-4 h-4 text-stone-400" />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl py-1 z-50">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-stone-900"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">Profile</span>
              </button>
              {onLogout && (
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-stone-900"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Log out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
