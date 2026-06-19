import { Container, Button } from '@/components/ui';

export default function CTA() {
  return (
    <section className="py-16 tablet:py-20 desktop:py-24 bg-darkSurface text-white">
      <Container className="text-center">
        <h2 className="text-display-lg mb-6">Ready to get started?</h2>
        <p className="text-body-lg text-gray-300 max-w-reading mx-auto mb-8">
          Join thousands of creators and brands already using EasilyPromote.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" eventName="signup_clicked">
            Sign Up Now
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:border-primary hover:text-primary">
            Contact Sales
          </Button>
        </div>
      </Container>
    </section>
  );
}
