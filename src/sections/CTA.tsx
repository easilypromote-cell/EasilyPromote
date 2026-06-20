export default function CTA() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <img
        src="/images/6.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <p className="text-[17px] leading-[180%] opacity-60">
          Stop paying for influencer posts.
        </p>
        <h2 className="text-[36px] leading-[110%] tracking-[-0.05em] font-semibold mt-2">
          Start paying for<br />performance.
        </h2>
      </div>
    </section>
  );
}
