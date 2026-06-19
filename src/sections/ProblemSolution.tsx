'use client';

import { useState } from 'react';
import { Container, Button } from '@/components/ui';
import { trackEvent } from '@/lib/analytics';

const tabs = [
  'Launch a campaign',
  'Creators join the campaign',
  'Videos get reviewed',
  'Content goes live',
  'Views trigger payouts',
];

export default function ProblemSolution() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-16 tablet:py-20 desktop:py-24">
      <Container>
        <div className="flex flex-col tablet:flex-row items-center justify-between gap-24">
          <div className="max-w-[400px]">
            <h2 className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
              From brief creation to<br />creator payouts.
            </h2>
            <div className="mt-6">
              <Button variant="primary" size="lg" eventName="launch_campaign_clicked">
                Launch a campaign
              </Button>
            </div>
          </div>
          <p className="text-[15px] leading-[180%] text-[#737373] max-w-[450px]">
            EasilyPromote handles creator coordination, submission workflows, approvals, publishing, and performance tracking in one campaign system.
          </p>
        </div>
      </Container>

      <Container className="mt-16">
        <div className="w-full bg-[#f5f5f5] p-0.5 rounded-[30px] flex flex-row">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-1 h-12 rounded-[40px] text-[15px] font-medium transition-all duration-200 ${
                activeTab === i
                  ? 'bg-white text-black'
                  : 'bg-transparent text-[#a3a3a3]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full min-h-[200px] mt-8" />
      </Container>
    </section>
  );
}
