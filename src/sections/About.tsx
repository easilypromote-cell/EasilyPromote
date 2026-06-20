'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Container, Button } from '@/components/ui';
import { trackEvent } from '@/lib/analytics';

const tabs = [
  'Launch a campaign',
  'Creators join the campaign',
  'Videos get reviewed',
  'Content goes live',
  'Views trigger payouts',
];

const tabContent = [
  'Campaign performance is tracked continuously, and payouts happen when targets are achieved.',
  'Creators browse campaigns, claim briefs, and start producing content.',
  'Submissions are reviewed before delivery to ensure campaign quality and alignment.',
  'Approved videos publish directly through the platform workflow.',
  'Campaign performance is tracked continuously, and payouts happen when targets are achieved.',
];

export default function About() {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstBtn = tabRefs.current[0];
    if (firstBtn && indicatorRef.current) {
      gsap.set(indicatorRef.current, { x: firstBtn.offsetLeft, width: firstBtn.offsetWidth });
    }
  }, []);

  const handleTabClick = (i: number) => {
    setActiveTab(i);
    const btn = tabRefs.current[i];
    if (btn && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        x: btn.offsetLeft,
        width: btn.offsetWidth,
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  };

  return (
    <section id="about" className="py-16 tablet:py-20 desktop:py-24">
      <div className="relative w-full" style={{ minHeight: '400px' }}>

        <Container className="mt-24 hidden">
          <div className="flex flex-col tablet:flex-row items-start justify-between gap-24">
          <div className="max-w-[400px] text-left">
            <h3 className="text-[25px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
              Know what's working.
            </h3>
            <p className="text-[15px] font-medium leading-[180%] text-[#737373] mt-2 max-w-[368px]">
              See campaign performance unfold in real time instead of waiting for reports.
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src="/images/4.png"
              alt=""
              className="h-[420px] w-full object-contain"
            />
          </div>
        </div>
        </Container>

        <Container className="mt-24 hidden">
          <div className="flex flex-col tablet:flex-row items-start justify-between gap-24">
          <div className="max-w-[400px] text-left">
            <h3 className="text-[25px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
              Know what's working.
            </h3>
            <p className="text-[15px] font-medium leading-[180%] text-[#737373] mt-2 max-w-[368px]">
              See campaign performance unfold in real time instead of waiting for reports.
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src="/images/4.png"
              alt=""
              className="h-[420px] w-full object-contain"
            />
          </div>
        </div>
        </Container>

        <Container className="mt-24 hidden">
          <div className="flex flex-col tablet:flex-row items-start justify-between gap-24">
          <div className="max-w-[400px] text-left">
            <h3 className="text-[25px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
              Know what's working.
            </h3>
            <p className="text-[15px] font-medium leading-[180%] text-[#737373] mt-2 max-w-[368px]">
              See campaign performance unfold in real time instead of running reports.
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src="/images/4.png"
              alt=""
              className="h-[420px] w-full object-contain"
            />
          </div>
        </div>
        </Container>
      </div>

      <Container className="mt-16">
        <div className="flex flex-col tablet:flex-row items-start justify-between gap-24">
          <div className="max-w-[400px]">
            <h2 className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
              From brief creation to<br />creator payouts.
            </h2>
            <div className="mt-6">
              <Button variant="primary" size="lg" eventName="launch_campaign_clicked" className="h-14">
                Launch a campaign
              </Button>
            </div>
          </div>
          <p className="text-[17px] leading-[180%] text-[#737373] max-w-[450px]">
            EasilyPromote handles creator coordination, submission workflows, approvals, publishing, and performance tracking in one campaign system.
          </p>
        </div>
      </Container>

      <Container className="mt-16">
        <div className="relative w-full bg-[#f5f5f5] p-0.5 rounded-[30px] flex flex-row">
          <div
            ref={indicatorRef}
            className="absolute top-0.5 bottom-0.5 rounded-[40px] bg-white z-0"
          />
          {tabs.map((tab, i) => (
            <button
              key={tab}
              ref={(el) => { tabRefs.current[i] = el; }}
              onClick={() => handleTabClick(i)}
              className={`flex-1 h-12 rounded-[40px] text-[15px] font-medium transition-colors duration-200 relative z-10 ${
                activeTab === i ? 'text-black' : 'text-[#a3a3a3]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {tabContent[activeTab] && (
          <div className="flex flex-col tablet:flex-row items-start gap-16 mt-8 bg-[#F5F5F5] rounded-[32px] overflow-hidden">
            <p className="w-full tablet:w-2/5 text-[25px] leading-[140%] tracking-[-0.05em] font-medium text-[#171717] text-left pl-8 pt-8 pb-8">
              {tabContent[activeTab]}
            </p>
            <div className="w-full tablet:w-3/5 h-[600px] self-stretch">
              <img
                src="/images/5.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
