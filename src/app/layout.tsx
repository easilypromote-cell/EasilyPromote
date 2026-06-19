import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EasilyPromote | Connect Creators & Brands',
  description: 'The premium platform connecting creators and brands. Launch campaigns, discover talent, and scale your content marketing effortlessly.',
  openGraph: {
    title: 'EasilyPromote | Connect Creators & Brands',
    description: 'The premium platform connecting creators and brands.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EasilyPromote | Connect Creators & Brands',
    description: 'The premium platform connecting creators and brands.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        </body>
    </html>
  );
}
