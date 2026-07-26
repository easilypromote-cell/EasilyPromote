"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth, getUser } from "../lib/api";

const NAV = [
  {
    label: "Overview",
    href: "/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Campaigns",
    href: "/campaigns",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/users",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = typeof window !== "undefined" ? getUser() : null;

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-stone-950 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#FEB604] flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-stone-950">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <span className="font-rethink font-semibold text-sm text-white leading-none block">EasilyPromote</span>
            <span className="text-[10px] font-medium text-stone-400 font-rethink">Admin Console</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {NAV.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-rethink transition-all duration-150 ${
                isActive
                  ? "bg-stone-800 text-white"
                  : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"
              }`}
            >
              <span className={isActive ? "text-[#FEB604]" : ""}>{item.icon}</span>
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FEB604]" />}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-5 border-t border-stone-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center text-[11px] font-semibold text-stone-200 flex-shrink-0">
            {(user?.name || "A").substring(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-stone-200 font-rethink truncate">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-stone-500 font-rethink capitalize">{user?.role || "admin"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-stone-500 hover:text-stone-300 font-rethink transition-colors"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
