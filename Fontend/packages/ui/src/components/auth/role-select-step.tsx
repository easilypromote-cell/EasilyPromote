import Image from "next/image";
import { cn } from "../../lib/utils";
import illustration5 from "../../assets/illustrations/illustration5.svg";
import illustration6 from "../../assets/illustrations/illustration6.svg";
import type { UserRole } from "./types";

interface RoleSelectStepProps {
  role: UserRole;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
}

export function RoleSelectStep({ role, onSelectRole, onContinue }: RoleSelectStepProps) {
  return (
    <div className="w-full max-w-[480px] space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold font-rethink text-stone-900">
          How do you want to use EasilyPromote?
        </h1>
        <p className="text-sm text-stone-400 font-semibold font-rethink">
          You can always add the other later.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onSelectRole("business")}
          className={cn(
            "p-6 rounded-3xl border-2 text-left space-y-4 transition-all duration-200 outline-none flex flex-col justify-between",
            role === "business"
              ? "border-[#FEB604] bg-white shadow-sm"
              : "border-stone-100 bg-[#FBFBFA] hover:border-stone-200"
          )}
        >
          <div className="w-full h-32 flex items-center justify-center relative">
            <Image src={illustration5} alt="I'm a business" width={110} height={110} />
          </div>
          <div className="space-y-1.5 mt-auto">
            <h3 className="font-bold text-sm text-stone-900 font-rethink">I&apos;m a business</h3>
            <p className="text-[11px] text-stone-500 font-medium leading-normal font-rethink">
              Create and fund campaigns, get verified views
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelectRole("creator")}
          className={cn(
            "p-6 rounded-3xl border-2 text-left space-y-4 transition-all duration-200 outline-none flex flex-col justify-between",
            role === "creator"
              ? "border-[#FEB604] bg-white shadow-sm"
              : "border-stone-100 bg-[#FBFBFA] hover:border-stone-200"
          )}
        >
          <div className="w-full h-32 flex items-center justify-center relative">
            <Image src={illustration6} alt="I'm a creator" width={110} height={110} />
          </div>
          <div className="space-y-1.5 mt-auto">
            <h3 className="font-bold text-sm text-stone-900 font-rethink">I&apos;m a creator</h3>
            <p className="text-[11px] text-stone-500 font-medium leading-normal font-rethink">
              Claim slots and get paid for real views
            </p>
          </div>
        </button>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 bg-[#FEB604] hover:bg-[#EAA503] text-stone-900 font-bold text-sm rounded-full shadow-sm transition-colors font-rethink"
      >
        Continue
      </button>
    </div>
  );
}
