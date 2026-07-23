import { useRef } from "react";

interface OtpStepProps {
  email: string;
  otpValues: string[];
  onOtpChange: (index: number, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function OtpStep({ email, otpValues, onOtpChange, onSubmit }: OtpStepProps) {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (index: number, val: string) => {
    onOtpChange(index, val);
    const numericVal = val.replace(/\D/g, "").slice(-1);
    if (numericVal && index < 5) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      onOtpChange(index - 1, "");
      refs[index - 1].current?.focus();
    }
  };

  return (
    <div className="w-[350px] space-y-8">
      <div className="space-y-2 text-center">
        <h2 data-reveal className="text-2xl font-semibold font-rethink text-stone-900 tracking-tighter">
          Check your inbox
        </h2>
        <p data-reveal className="text-xs text-stone-400 font-medium font-rethink tracking-tight">
          Enter the code we sent to {email || "name@business.com"}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div data-reveal className="flex gap-2 justify-center">
          {otpValues.map((val, index) => (
            <input
              key={index}
              ref={refs[index]}
              type="text"
              pattern="\d*"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 border border-stone-200 rounded-xl text-center text-lg font-bold text-stone-900 focus:outline-none focus:border-stone-400 focus:ring-0 bg-[#FBFBFA] font-rethink transition-colors"
            />
          ))}
        </div>

        <div data-reveal className="text-center">
          <span className="text-sm font-semibold text-stone-400 font-rethink">
            Didn&apos;t get it?{" "}
            <button type="button" className="text-stone-900">
              Resend code (0:45)
            </button>
          </span>
        </div>

        <button
          data-reveal
          type="submit"
          className="w-full py-4 bg-[#FEB604] text-stone-900 font-bold text-sm rounded-full shadow-sm font-rethink"
        >
          Verify
        </button>
      </form>
    </div>
  );
}
