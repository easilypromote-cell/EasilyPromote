import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EasilyPromote — Creator Dashboard",
  description: "Find campaigns, earn rewards, grow your rank",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
