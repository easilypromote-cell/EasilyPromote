import { Eye, EyeOff, ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import type { AuthFormState, AuthFormActions } from "./types";

interface RegisterStepProps {
  form: Pick<AuthFormState, "businessName" | "industry" | "email" | "phone" | "password" | "showPassword" | "agreed">;
  actions: AuthFormActions;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterStep({ form, actions, onSubmit }: RegisterStepProps) {
  return (
    <div className="w-full max-w-[480px] space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold font-rethink text-stone-900">
          Create your business account
        </h1>
        <p className="text-xs text-stone-400 font-semibold font-rethink">
          Fund campaigns, track delivery, and only pay for results.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block font-rethink">
            Business name
          </label>
          <input
            type="text"
            required
            placeholder="Enter Business name"
            value={form.businessName}
            onChange={(e) => actions.setField("businessName", e.target.value)}
            className="w-full px-4 py-3 border border-stone-200 rounded-full text-xs font-semibold placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0 transition-colors font-rethink"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block font-rethink">
            Industry
          </label>
          <div className="relative">
            <select
              value={form.industry}
              onChange={(e) => actions.setField("industry", e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-full text-xs font-semibold text-stone-850 appearance-none focus:outline-none focus:border-stone-400 focus:ring-0 bg-white cursor-pointer font-rethink"
            >
              <option value="Technology">Technology</option>
              <option value="Music">Music</option>
              <option value="Apparel & Fashion">Apparel & Fashion</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Food & Beverages">Food & Beverages</option>
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

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
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block font-rethink">
            Phone number
          </label>
          <div className="flex gap-2">
            <div className="relative flex-shrink-0">
              <select className="px-4 py-3 border border-stone-200 rounded-full text-xs font-semibold text-stone-850 appearance-none focus:outline-none focus:border-stone-400 focus:ring-0 bg-white cursor-pointer font-rethink">
                <option value="+234">+234</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <input
              type="tel"
              required
              placeholder="Enter Phone number"
              value={form.phone}
              onChange={(e) => actions.setField("phone", e.target.value)}
              className="flex-1 px-4 py-3 border border-stone-200 rounded-full text-xs font-semibold placeholder-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0 transition-colors font-rethink"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block font-rethink">
            Password
          </label>
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
          <span className="text-[10px] font-medium text-stone-400 block font-rethink">
            Use at least 8 characters, with a number.
          </span>
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => actions.setField("agreed", !form.agreed)}
            className={cn(
              "w-4 h-4 rounded-md border flex items-center justify-center transition-colors flex-shrink-0 mt-0.5",
              form.agreed
                ? "bg-stone-950 border-stone-950 text-white"
                : "border-stone-300 hover:border-stone-400 bg-white"
            )}
          >
            {form.agreed && <Check className="w-3 h-3" />}
          </button>
          <span className="text-[11px] font-semibold text-stone-500 font-rethink">
            I agree to the Terms of Service and Privacy Policy
          </span>
        </div>

        <button
          type="submit"
          disabled={!form.agreed}
          className={cn(
            "w-full py-4 font-bold text-sm rounded-full shadow-sm transition-all font-rethink mt-2",
            form.agreed
              ? "bg-[#FEB604] hover:bg-[#EAA503] text-stone-900 cursor-pointer"
              : "bg-stone-100 text-stone-300 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </form>

      <button
        onClick={() => actions.goToStep("login")}
        className="w-full py-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-900 font-bold text-sm rounded-full shadow-sm transition-colors font-rethink"
      >
        Sign in
      </button>
    </div>
  );
}
