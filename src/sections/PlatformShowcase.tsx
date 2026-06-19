import { Container, SectionHeader, Card } from '@/components/ui';

const features = [
  { title: 'Dashboard', desc: 'Real-time analytics and campaign management' },
  { title: 'Campaign Builder', desc: 'Create and customize campaigns in minutes' },
  { title: 'Creator Marketplace', desc: 'Discover and connect with top creators' },
];

export default function PlatformShowcase() {
  return (
    <section className="py-16 tablet:py-20 desktop:py-24 bg-surface">
      <Container>
        <SectionHeader
          badge="Platform"
          title="See it in action"
          subtitle="A powerful platform designed for simplicity and scale."
        />

        <div className="grid tablet:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card key={i} className="text-center">
              <div className="bg-darkSurface rounded-lg h-48 mb-6 flex items-center justify-center text-white text-caption">
                [Screenshot Placeholder]
              </div>
              <h4 className="text-h4 mb-2">{feature.title}</h4>
              <p className="text-text-secondary">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
