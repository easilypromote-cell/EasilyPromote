import * as React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, Wallet02Icon } from "@hugeicons/core-free-icons";
import { ChevronDownIcon, UserIcon, Logout01Icon } from "@hugeicons/core-free-icons";
import { cn } from "../lib/utils";
import { TYPOGRAPHY } from "../lib/constants";
import { MobileDrawer } from "../components/mobile-drawer";
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
      <div className="max-w-7xl mx-auto px-6 h-16 grid grid-cols-3 items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 justify-self-start">
          <Image src={logoPrimary} alt="EasilyPromote" width={32} height={32} priority />
        </div>

        {/* Center Pill Navigation */}
        <nav className="bg-stone-50 p-0.5 rounded-full border-[0.2px] border-stone-200 md:border md:border-stone-100 justify-self-center flex">
          <button
            onClick={() => onTabChange?.("home")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-base md:text-sm",
              activeTab === "home"
                ? "bg-white border-[0.2px] border-stone-200 md:border md:border-stone-100 text-stone-900 font-semibold"
                : "text-stone-500 font-medium"
            )}
          >
            <HugeiconsIcon icon={Home01Icon} size={16} />
            <span>Home</span>
          </button>

          <button
            onClick={() => onTabChange?.("wallet")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-base md:text-sm",
              activeTab === "wallet"
                ? "bg-white border-[0.2px] border-stone-200 md:border md:border-stone-100 text-stone-900 font-semibold"
                : "text-stone-500 font-medium"
            )}
          >
            <HugeiconsIcon icon={Wallet02Icon} size={16} />
            <span>Wallet</span>
          </button>
        </nav>

        {/* User Profile with Dropdown */}
        <div ref={profileRef} className="relative justify-self-end">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 md:bg-stone-50 md:rounded-full md:pl-2 md:pr-4 md:py-1.5 cursor-pointer"
          >
            <Image src={avatarSvg} alt={userName} width={32} height={32} className="rounded-full md:w-5 md:h-5" />
            <div className="hidden sm:flex items-center gap-1.5">
              <span className={TYPOGRAPHY.userProfile}>{userName}</span>
              <HugeiconsIcon icon={ChevronDownIcon} size={16} className="text-stone-400" />
            </div>
          </button>

          {/* Desktop Dropdown Menu */}
          {isProfileOpen && (
            <div className="hidden md:block absolute top-full right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl py-1 z-50">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-stone-900"
              >
                <HugeiconsIcon icon={UserIcon} size={16} />
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
                  <HugeiconsIcon icon={Logout01Icon} size={16} />
                  <span className="font-medium">Log out</span>
                </button>
              )}
            </div>
          )}

          {/* Mobile Drawer */}
          <div className="md:hidden">
            <MobileDrawer open={isProfileOpen} onOpenChange={(open) => setIsProfileOpen(open)}>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-stone-900"
              >
                <HugeiconsIcon icon={UserIcon} size={16} />
                <span className="font-medium">Profile</span>
              </button>
              {onLogout && (
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-stone-900"
                >
                  <HugeiconsIcon icon={Logout01Icon} size={16} />
                  <span className="font-medium">Log out</span>
                </button>
              )}
            </MobileDrawer>
          </div>
        </div>
      </div>
    </header>
  );
}
