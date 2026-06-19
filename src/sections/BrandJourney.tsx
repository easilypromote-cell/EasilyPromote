import { Container, SectionHeader, Card } from '@/components/ui';

const journeySteps = [
  { title: 'Campaign Creation', desc: 'Set goals, budgets, and requirements' },
  { title: 'Creator Selection', desc: 'Choose from curated creator matches' },
  { title: 'Review Process', desc: 'Approve content with easy feedback tools' },
  { title: 'Analytics', desc: 'Measure ROI with comprehensive dashboards' },
];

export default function BrandJourney() {
  return (
    <section className="py-16 tablet:py-20 desktop:py-24 bg-surface">
      <Container>
        <SectionHeader
          badge="Brand Journey"
          title="Scale your campaigns"
          subtitle="From brief to results, manage everything in one place."
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
