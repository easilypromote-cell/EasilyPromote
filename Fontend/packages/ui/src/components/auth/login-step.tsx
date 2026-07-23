import { Eye, EyeOff } from "lucide-react";
import type { AuthFormState, AuthFormActions } from "./types";

interface LoginStepProps {
  form: Pick<AuthFormState, "email" | "password" | "showPassword">;
  actions: AuthFormActions;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
}

export function LoginStep({ form, actions, onSubmit, onForgotPassword, onCreateAccount }: LoginStepProps) {
  const handleForgot = onForgotPassword ?? (() => actions.goToStep("forgot"));
  const handleCreate = onCreateAccount ?? (() => actions.goToStep("role-select"));

  return (
    <div className="w-[350px] space-y-8">
      <div className="space-y-2 text-center">
        <h2 data-reveal className="text-2xl font-semibold font-rethink text-stone-900 tracking-tighter">
          Welcome back
        </h2>
        <p data-reveal className="text-xs text-stone-400 font-medium font-rethink tracking-tight">
          Sign in to manage your campaigns.
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
            value={form.email}
            onChange={(e) => actions.setField("email", e.target.value)}
            className="w-full px-4 py-3 border border-stone-200 rounded-full text-sm font-medium placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0 transition-colors font-rethink"
          />
        </div>

        <div data-reveal className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-stone-500 block font-rethink">
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
              className="w-full px-4 py-3 border border-stone-200 rounded-full text-sm font-medium placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0 transition-colors font-rethink"
            />
            <button
              type="button"
              onClick={() => actions.setField("showPassword", !form.showPassword)}
              className="text-stone-400 absolute right-4 top-1/2 -translate-y-1/2"
            >
              {form.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="button"
            onClick={handleForgot}
            className="text-sm font-bold text-stone-900 block pt-1 font-rethink"
          >
            Forgot password?
          </button>
        </div>

        <button
          data-reveal
          type="submit"
          className="w-full py-4 bg-[#FEB604] text-stone-900 font-bold text-sm rounded-full shadow-sm font-rethink mt-2"
        >
          Sign in
        </button>
      </form>

      <div data-reveal className="text-center">
        <span className="text-sm font-semibold text-stone-400 font-rethink">
          New to EasilyPromote?{" "}
          <button
            onClick={handleCreate}
            className="text-stone-900 font-bold"
          >
            Create an account
          </button>
        </span>
      </div>
    </div>
  );
}
