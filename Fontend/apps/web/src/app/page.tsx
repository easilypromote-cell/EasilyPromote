"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, isAuthenticated } from "../lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const user = getUser();
    const role = user?.role;

    if (role === "creator") {
      router.replace("/dashboard/creator");
    } else if (role === "admin" || role === "super_admin" || role === "finance_admin" || role === "support") {
      window.location.href = "http://localhost:3003";
    } else {
      router.replace("/dashboard/brand");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <span className="text-sm font-semibold text-stone-500">Redirecting...</span>
    </div>
  );
}
