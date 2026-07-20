import Image from "next/image";
import imagePng from "@ep/ui/assets/image.png";

export function LeftPanel() {
  return (
    <div
      className="hidden md:flex md:col-span-5 bg-[#FEB604] p-16 flex-col justify-between relative overflow-hidden h-screen"
      style={{
        backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.16) 1.5px, transparent 1.5px)",
        backgroundSize: "18px 18px",
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center relative shadow-sm border border-stone-200/40">
          <div className="w-4.5 h-2 rounded-b-full border-b-2 border-stone-900 absolute bottom-2.5" />
        </div>
        <span className="text-white font-bold font-raleway text-sm tracking-wide">
          EasilyPromote
        </span>
      </div>

      <div className="relative w-64 h-64 mx-auto my-10 flex-1 flex items-center justify-center">
        <div className="absolute w-52 h-52 rounded-[24px] bg-stone-900/10 transform rotate-[-6deg] translate-x-2 translate-y-1 shadow-inner" />
        <div className="absolute w-52 h-52 rounded-[24px] overflow-hidden border-4 border-white shadow-xl transform rotate-[-3deg] transition-all hover:rotate-0 hover:scale-105 duration-300">
          <Image
            src={imagePng}
            alt="Creator smiling in hoodie"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[32px] font-bold text-stone-950 font-rethink leading-tight">
          Get thousands of creators promoting your business
        </h2>
        <p className="text-sm font-medium text-stone-950/80 leading-relaxed font-rethink">
          EasilyPromote is a performance marketplace for businesses that want proof, not promises.
          Fund a target, let creators deliver it, and your budget stays in escrow until the views
          are verified.
        </p>
      </div>
    </div>
  );
}
