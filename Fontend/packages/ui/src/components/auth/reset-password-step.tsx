import { Eye, EyeOff } from "lucide-react";
import type { AuthFormActions } from "./types";

interface ResetPasswordStepProps {
  newPassword: string;
  confirmPassword: string;
  showPassword: boolean;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setShowPassword: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  actions: AuthFormActions;
}

export function ResetPasswordStep({
  newPassword,
  confirmPassword,
  showPassword,
  setNewPassword,
  setConfirmPassword,
  setShowPassword,
  onSubmit,
  actions,
}: ResetPasswordStepProps) {
  return (
    <div className="w-full max-w-[480px] space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold font-rethink text-stone-900">
          Choose a new password
        </h1>
        <p className="text-xs text-stone-400 font-semibold font-rethink">
          Enter a new password for your account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block font-rethink">
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-full text-xs font-semibold placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0 transition-colors font-rethink"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 hover:text-stone-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <span className="text-[10px] font-medium text-stone-400 block font-rethink">
            Use at least 8 characters, with a number.
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block font-rethink">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-full text-xs font-semibold placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0 transition-colors font-rethink"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 hover:text-stone-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!newPassword || newPassword !== confirmPassword}
          className="w-full py-4 bg-[#FEB604] hover:bg-[#EAA503] disabled:bg-stone-100 disabled:text-stone-300 text-stone-900 font-bold text-sm rounded-full shadow-sm transition-all font-rethink"
        >
          Reset password
        </button>
      </form>
    </div>
  );
}
