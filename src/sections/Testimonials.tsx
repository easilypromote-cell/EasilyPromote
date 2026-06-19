import { Container, SectionHeader, TestimonialCard } from '@/components/ui';
import { testimonialsContent } from '@/content/testimonials';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 tablet:py-20 desktop:py-24">
      <Container>
        <SectionHeader
          badge="Testimonials"
          title="Loved by creators & brands"
          subtitle="See what our community has to say."
        />

        <div
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonialsContent.map((testimonial, i) => (
            <div key={i} className="snap-start flex-shrink-0">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
