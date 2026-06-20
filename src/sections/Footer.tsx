'use client';
import { trackEvent } from '@/lib/analytics';

export default function Footer() {
  return (
    <footer
      onClick={() => trackEvent('footer_cta_clicked')}
      className="bg-primary py-8 px-4 text-center cursor-pointer"
    >
      <h2 className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
        Launch a creator campaign
      </h2>
      <p className="text-[17px] leading-[180%] text-[#171717] mt-2 max-w-[400px] mx-auto">
        Set a target, fund your campaign, and start receiving creator submissions.
      </p>
    </footer>
  );
}
