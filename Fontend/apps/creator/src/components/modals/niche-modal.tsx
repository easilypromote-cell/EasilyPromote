"use client";

import { AVAILABLE_NICHES } from "../constants";

interface NicheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedNiches: string[];
  onNichesChange: (niches: string[]) => void;
}

export function NicheModal({
  isOpen,
  onClose,
  onSave,
  selectedNiches,
  onNichesChange,
}: NicheModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm">
      <div className="bg-white border border-stone-200 rounded-3xl p-8 max-w-sm w-full shadow-xl space-y-6 mx-4 animate-in fade-in zoom-in duration-150">
        <div className="space-y-1.5">
          <h3 className="font-rethink font-bold text-lg text-stone-900">Choose your niches</h3>
          <p className="text-xs text-stone-500 font-medium">
            Select categories that match the type of content you usually publish.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1 border border-stone-100 rounded-xl">
          {AVAILABLE_NICHES.map((niche) => {
            const isSelected = selectedNiches.includes(niche);
            return (
              <button
                key={niche}
                onClick={() => {
                  if (isSelected) {
                    onNichesChange(selectedNiches.filter((n) => n !== niche));
                  } else {
                    onNichesChange([...selectedNiches, niche]);
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-[#FEB604] text-stone-950 border-[#FEB604] shadow-sm"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                }`}
              >
                {niche}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-full font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-2.5 bg-stone-950 hover:bg-stone-800 text-white rounded-full font-semibold text-xs transition-colors shadow-sm"
          >
            Save Niches
          </button>
        </div>
      </div>
    </div>
  );
}
