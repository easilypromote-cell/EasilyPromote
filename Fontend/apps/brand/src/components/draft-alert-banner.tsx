import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import illustration4 from "@ep/ui/assets/illustrations/illustration4.svg";

interface DraftAlertBannerProps {
  draftCount: number;
  onClose: () => void;
}

export function DraftAlertBanner({ draftCount, onClose }: DraftAlertBannerProps) {
  return (
    <div className="flex items-center justify-between bg-[#EBF3FF] border border-dashed border-blue-200 rounded-[20px] p-2 relative overflow-hidden w-fit">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Image src={illustration4} alt="Unfinished business" width={52} height={52} />
        </div>
        <div>
          <h4 className="font-rethink font-bold text-sm text-stone-900">Unfinished business!</h4>
          <p className="font-rethink text-xs text-stone-500 mt-0.5">You have {draftCount} draft campaign{draftCount !== 1 ? "s" : ""} waiting</p>
        </div>
      </div>
      <button onClick={onClose} className="text-stone-400 p-1 absolute top-2 right-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
