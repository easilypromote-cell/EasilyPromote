import type { AuthFormActions } from "./types";

interface ForgotStepProps {
  email: string;
  setEmail: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  actions: AuthFormActions;
  onBackToLogin?: () => void;
}

export function ForgotStep({ email, setEmail, onSubmit, actions, onBackToLogin }: ForgotStepProps) {
  const handleBack = onBackToLogin ?? (() => actions.goToStep("login"));

  return (
    <div className="w-[350px] space-y-8">
      <div className="space-y-2 text-center">
        <h2 data-reveal className="text-2xl font-semibold font-rethink text-stone-900 tracking-tighter">
          Reset your password
        </h2>
        <p data-reveal className="text-xs text-stone-400 font-medium font-rethink tracking-tight">
          Enter the email on your account and we&apos;ll send you a code.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div data-reveal className="space-y-1.5">
          <label className="text-xs font-medium text-stone-500 block font-rethink">
            Email address
          </label>
          <input
            type="email"
            required
            placeholder="Enter Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-stone-200 rounded-full text-sm font-medium placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0 transition-colors font-rethink"
          />
        </div>

        <button
          data-reveal
          type="submit"
          className="w-full py-4 bg-[#FEB604] text-stone-900 font-bold text-sm rounded-full shadow-sm font-rethink"
        >
          Send reset code
        </button>
      </form>

      <div data-reveal className="text-center">
        <button
          onClick={handleBack}
          className="text-sm font-bold text-stone-900 font-rethink"
        >
          Back to sign in
        </button>
      </div>
    </div>
  );
}
