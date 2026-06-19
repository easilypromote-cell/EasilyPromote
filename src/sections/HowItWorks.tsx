import { Container, SectionHeader } from '@/components/ui';

const creatorSteps = [
  { step: 1, title: 'Join', desc: 'Create your creator profile' },
  { step: 2, title: 'Discover Campaigns', desc: 'Find opportunities that match your style' },
  { step: 3, title: 'Submit Content', desc: 'Create and submit your best work' },
  { step: 4, title: 'Get Approved', desc: 'Brands review and approve your content' },
  { step: 5, title: 'Get Paid', desc: 'Receive fast, reliable payouts' },
];

const brandSteps = [
  { step: 1, title: 'Create Campaign', desc: 'Define your goals and requirements' },
  { step: 2, title: 'Set Requirements', desc: 'Specify content guidelines' },
  { step: 3, title: 'Recruit Creators', desc: 'Find the perfect creators for your brand' },
  { step: 4, title: 'Review Content', desc: 'Approve or request revisions' },
  { step: 5, title: 'Approve Payouts', desc: 'Pay creators securely through the platform' },
];

function StepCard({ step, title, desc, isLast }: { step: number; title: string; desc: string; isLast: boolean }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold mb-4">
        {step}
      </div>
      <h4 className="text-h4 mb-2">{title}</h4>
      <p className="text-text-secondary">{desc}</p>
      {!isLast && (
        <div className="hidden desktop:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-8" />
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 tablet:py-20 desktop:py-24">
      <Container>
        <SectionHeader
          badge="How It Works"
          title="Simple process, powerful results"
          subtitle="Get started in minutes, whether you're a creator or a brand."
        />

        <div className="mb-16">
          <h3 className="text-h3 text-center mb-12">For Creators</h3>
          <div className="grid desktop:grid-cols-5 gap-8">
            {creatorSteps.map((step, i) => (
              <StepCard key={i} {...step} isLast={i === creatorSteps.length - 1} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-h3 text-center mb-12">For Brands</h3>
          <div className="grid desktop:grid-cols-5 gap-8">
            {brandSteps.map((step, i) => (
              <StepCard key={i} {...step} isLast={i === brandSteps.length - 1} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
