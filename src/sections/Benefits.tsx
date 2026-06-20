import { Container, Button } from '@/components/ui';

export default function Benefits() {
  return (
    <section className="py-16 tablet:py-20 desktop:py-24 bg-darkSurface text-white relative overflow-hidden">

      <Container className="relative z-10">
        <div className="flex flex-col tablet:flex-row items-end justify-between gap-24">
          <div className="max-w-[500px]">
            <h2 className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold">
              Get creators promoting<br />your brand at scale, without<br />wasting ad spend.
            </h2>
            <p className="text-[15px] leading-[180%] text-gray-300 mt-4 max-w-[450px]">
              Launch campaigns that multiple creators can join at once.<br />Set a target view count, fund your campaign, and only pay when content performs.
            </p>
            <div className="mt-6">
              <Button variant="primary" size="lg" eventName="benefits_cta_clicked" className="w-[450px]">
                Get Started
              </Button>
            </div>
          </div>
          <div className="w-[499px] h-screen rounded-[30px] overflow-hidden shrink-0">
            <img src="/images/3.jpg" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </Container>
    </section>
  );
}
