import type { AuthFormActions } from "./types";

interface ForgotStepProps {
  email: string;
  setEmail: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  actions: AuthFormActions;
}

export function ForgotStep({ email, setEmail, onSubmit, actions }: ForgotStepProps) {
  return (
    <div className="w-full max-w-[480px] space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold font-rethink text-stone-900">
          Reset your password
        </h1>
        <p className="text-xs text-stone-400 font-semibold font-rethink">
          Enter the email on your account and we&apos;ll send you a code.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block font-rethink">
            Email address
          </label>
          <input
            type="email"
            required
            placeholder="Enter Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-stone-200 rounded-full text-xs font-semibold placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0 transition-colors font-rethink"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#FEB604] hover:bg-[#EAA503] text-stone-900 font-bold text-sm rounded-full shadow-sm transition-colors font-rethink"
        >
          Send reset code
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => actions.goToStep("login")}
          className="text-xs font-bold text-stone-900 hover:underline font-rethink"
        >
          Back to sign in
        </button>
      </div>
    </div>
  );
}
