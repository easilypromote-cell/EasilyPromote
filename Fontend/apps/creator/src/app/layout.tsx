import type { Metadata } from "next";
import { Rethink_Sans, Inter, Raleway, Alex_Brush } from "next/font/google";
import "./globals.css";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-rethink",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-inter",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-raleway",
});

const motterdam = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-motterdam",
});

export const metadata: Metadata = {
  title: "EasilyPromote — Creator Dashboard",
  description: "Find campaigns, earn rewards, grow your rank",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${rethinkSans.variable} ${inter.variable} ${raleway.variable} ${motterdam.variable} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
