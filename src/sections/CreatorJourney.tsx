import { Container, SectionHeader, Card } from '@/components/ui';

const journeySteps = [
  { title: 'Discovery', desc: 'Find campaigns that match your niche and audience' },
  { title: 'Application', desc: 'Apply with a single click using your profile' },
  { title: 'Submission', desc: 'Create content using our built-in tools' },
  { title: 'Earnings', desc: 'Track your earnings and get paid fast' },
];

export default function CreatorJourney() {
  return (
    <section className="py-16 tablet:py-20 desktop:py-24">
      <Container>
        <SectionHeader
          badge="Creator Journey"
          title="Your path to success"
          subtitle="From discovery to payout, we make every step effortless."
        />

        <div className="grid tablet:grid-cols-2 desktop:grid-cols-4 gap-6">
          {journeySteps.map((step, i) => (
            <Card key={i}>
              <div className="text-primary text-display-lg font-bold mb-4">{i + 1}</div>
              <h4 className="text-h4 mb-2">{step.title}</h4>
              <p className="text-text-secondary">{step.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
