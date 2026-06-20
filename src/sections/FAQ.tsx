import { Container, Button, Accordion } from '@/components/ui';
import { faqContent } from '@/content/faq';

export default function FAQ() {
  return (
    <section id="faq" className="py-16 tablet:py-20 desktop:py-24 bg-white">
      <Container>
        <div className="flex flex-col tablet:flex-row items-start justify-between gap-12">
          <div className="w-full tablet:w-2/5 text-left">
            <h2 className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold text-[#171717]">
              Everything you might<br />be wondering.
            </h2>
            <div className="mt-8">
              <Button variant="primary" size="lg" eventName="faq_cta_clicked">
                Get Started
              </Button>
            </div>
          </div>
          <div className="w-full tablet:w-3/5 pt-1">
            <Accordion items={faqContent} />
          </div>
        </div>
      </Container>
    </section>
  );
}
