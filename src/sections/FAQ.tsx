import { Container, SectionHeader, Accordion } from '@/components/ui';
import { faqContent } from '@/content/faq';

export default function FAQ() {
  return (
    <section id="faq" className="py-16 tablet:py-20 desktop:py-24 bg-surface">
      <Container>
        <SectionHeader
          badge="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about EasilyPromote."
        />

        <Accordion items={faqContent} />
      </Container>
    </section>
  );
}
