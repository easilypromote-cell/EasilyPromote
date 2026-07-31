"use client";

import { ToastProvider } from "@ep/ui/components/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
