"use client";

import type { DemoState } from "./types";

interface StateSwitcherProps {
  demoState: DemoState;
  onStateChange: (state: DemoState) => void;
}

const STATES: { key: DemoState; label: string }[] = [
  { key: "onboarding_start", label: "Start" },
  { key: "onboarding_progress", label: "Progress" },
  { key: "onboarding_done", label: "Finished" },
  { key: "feed", label: "Feed" },
  { key: "marketplace_empty", label: "Mkt Empty" },
  { key: "marketplace_feed", label: "Mkt Grid" },
];

export function StateSwitcher({ demoState, onStateChange }: StateSwitcherProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#1C1917] text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-3 text-xs font-semibold border border-stone-850">
      <span>
        State:{" "}
        <strong className="text-[#FEB604]">{demoState.replace("_", " ").toUpperCase()}</strong>
      </span>
      <div className="flex gap-1 bg-stone-800 p-0.5 rounded-full">
        {STATES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onStateChange(key)}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              demoState === key
                ? "bg-[#FEB604] text-stone-950"
                : "text-stone-300 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
