import type { Metadata } from "next";
import { Rethink_Sans, Inter, Raleway, Alex_Brush } from "next/font/google";
import { LenisProvider } from "../components/lenis-provider";
import "./globals.css";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
  title: "EasilyPromote — Brand Dashboard",
  description: "Manage your promotional campaigns",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${rethinkSans.variable} ${inter.variable} ${raleway.variable} ${motterdam.variable} min-h-screen antialiased bg-stone-50 text-stone-900`}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
