"use client";

import * as React from "react";
import { cn } from "@ep/ui/lib/utils";

interface ViewsSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  steps?: number[];
  className?: string;
}

const DEFAULT_STEPS = [100000, 500000, 1000000, 1500000, 2000000, 3000000];

function formatViews(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}

function formatFullNumber(value: number): string {
  return value.toLocaleString();
}

export function ViewsSlider({
  value,
  onChange,
  min = DEFAULT_STEPS[0],
  max = DEFAULT_STEPS[DEFAULT_STEPS.length - 1],
  steps = DEFAULT_STEPS,
  className,
}: ViewsSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(() => {
    const idx = steps.findIndex((s) => s === value);
    return idx >= 0 ? idx : 0;
  });

  const fillPercent = (activeIndex / (steps.length - 1)) * 100;

  const getValueFromPosition = React.useCallback(
    (clientX: number) => {
      if (!trackRef.current) return activeIndex;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const nearestIndex = Math.round(percent * (steps.length - 1));
      return nearestIndex;
    },
    [activeIndex, steps.length]
  );

  const updateValue = React.useCallback(
    (index: number) => {
      setActiveIndex(index);
      onChange(steps[index]);
    },
    [steps, onChange]
  );

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const idx = getValueFromPosition(e.clientX);
      updateValue(idx);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getValueFromPosition, updateValue]
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const idx = getValueFromPosition(e.clientX);
      if (idx !== activeIndex) {
        updateValue(idx);
      }
    },
    [isDragging, getValueFromPosition, activeIndex, updateValue]
  );

  const handlePointerUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        if (activeIndex < steps.length - 1) {
          updateValue(activeIndex + 1);
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        if (activeIndex > 0) {
          updateValue(activeIndex - 1);
        }
      }
    },
    [activeIndex, steps.length, updateValue]
  );

  return (
    <div className={cn("relative select-none", className)} data-vaul-no-drag>
      {/* Outer track container */}
      <div
        ref={trackRef}
        className="relative h-[30px] bg-white rounded-[30px] border border-stone-200 cursor-pointer overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${formatFullNumber(value)} views`}
      >
        {/* Inner fill slider */}
        <div
          className="absolute top-0 left-0 h-full bg-stone-900 rounded-[30px] transition-all duration-300 ease-out"
          style={{ width: `${fillPercent}%` }}
        />

        {/* Milestone dots */}
        {steps.map((step, i) => {
          const isActive = i <= activeIndex;
          const isCurrent = i === activeIndex;
          const percent = (i / (steps.length - 1)) * 100;
          return (
            <div
              key={step}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
              style={{ left: `${percent}%` }}
            >
              <div
                className={cn(
                  "rounded-full transition-all duration-300",
                  isCurrent
                    ? "w-2.5 h-2.5 bg-white"
                    : isActive
                    ? "w-1.5 h-1.5 bg-white/80"
                    : "w-1.5 h-1.5 bg-stone-300"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Step labels */}
      <div className="flex justify-between mt-3 px-1">
        {steps.map((step, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={step}
              onClick={() => updateValue(i)}
              className={cn(
                "text-[10px] font-medium font-rethink tracking-tight transition-colors",
                isActive ? "text-stone-900" : "text-stone-400"
              )}
              style={{
                width: `${100 / steps.length}%`,
              }}
            >
              {formatViews(step)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
