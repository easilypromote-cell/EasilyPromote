import { Eye, EyeOff } from "lucide-react";
import type { AuthFormState, AuthFormActions } from "./types";

interface LoginStepProps {
  form: Pick<AuthFormState, "email" | "password" | "showPassword">;
  actions: AuthFormActions;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginStep({ form, actions, onSubmit }: LoginStepProps) {
  return (
    <div className="w-full max-w-[480px] space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold font-rethink text-stone-900">
          Welcome back
        </h1>
        <p className="text-xs text-stone-400 font-semibold font-rethink">
          Sign in to manage your campaigns.
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
            value={form.email}
            onChange={(e) => actions.setField("email", e.target.value)}
            className="w-full px-4 py-3 border border-stone-200 rounded-full text-xs font-semibold placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0 transition-colors font-rethink"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block font-rethink">
              Password
            </label>
          </div>
          <div className="relative">
            <input
              type={form.showPassword ? "text" : "password"}
              required
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => actions.setField("password", e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-full text-xs font-semibold placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0 transition-colors font-rethink"
            />
            <button
              type="button"
              onClick={() => actions.setField("showPassword", !form.showPassword)}
              className="text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 hover:text-stone-600 transition-colors"
            >
              {form.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="button"
            onClick={() => actions.goToStep("forgot")}
            className="text-xs font-bold text-stone-900 hover:underline block pt-1 font-rethink"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#FEB604] hover:bg-[#EAA503] text-stone-900 font-bold text-sm rounded-full shadow-sm transition-colors font-rethink mt-2"
        >
          Sign in
        </button>
      </form>

      <div className="text-center">
        <span className="text-xs font-semibold text-stone-400 font-rethink">
          New to EasilyPromote?{" "}
          <button
            onClick={() => actions.goToStep("role-select")}
            className="text-stone-900 hover:underline font-bold"
          >
            Create an account
          </button>
        </span>
      </div>
    </div>
  );
}
