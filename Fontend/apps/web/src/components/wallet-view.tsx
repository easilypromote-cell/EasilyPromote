"use client";

import type { CreatorProfile, WalletData } from "./types";

interface WalletViewProps {
  profile: CreatorProfile;
  walletData: WalletData | null;
}

export function WalletView({ profile, walletData }: WalletViewProps) {
  const balance = walletData?.balance ?? profile.lifetimeEarnings;
  const lifetimeEarnings = walletData?.lifetimeEarnings ?? profile.lifetimeEarnings;
  const completionRate = walletData?.completionRate ?? profile.completionRate;
  const totalReleased = walletData?.totalReleased ?? 0;

  return (
    <div className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-8 shadow-sm text-center animate-in fade-in slide-in-from-bottom-2 duration-200">
      <h2 className="text-xl font-bold mb-3">Earnings Wallet</h2>
      <p className="text-sm text-stone-500 mb-6 font-medium">
        Manage your payouts, bank withdrawal accounts, and view overall statistics.
      </p>

      <div className="bg-[#FAFAF9] border border-stone-200 rounded-2xl p-6 mb-6">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
          Available Balance
        </div>
        <div className="text-3xl font-bold text-stone-900 mb-2">
          ₦{balance.toLocaleString()}.00
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full">
          Ledger Reconciled
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-4 text-left">
          <span className="text-[10px] font-semibold text-stone-500">Lifetime Earnings</span>
          <p className="text-lg font-bold mt-0.5">₦{lifetimeEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-4 text-left">
          <span className="text-[10px] font-semibold text-stone-500">Completion Rate</span>
          <p className="text-lg font-bold mt-0.5">{completionRate}%</p>
        </div>
      </div>

      {totalReleased > 0 && (
        <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-4 mb-6 text-left">
          <span className="text-[10px] font-semibold text-stone-500">Total Released</span>
          <p className="text-lg font-bold mt-0.5">₦{totalReleased.toLocaleString()}</p>
        </div>
      )}

      <button
        onClick={() => alert("Payout request submitted. Processing batch window.")}
        className="w-full py-3 bg-[#FEB604] hover:bg-[#FEB604]/90 text-stone-950 font-bold text-xs rounded-full shadow-sm transition-colors"
      >
        Withdraw Funds
      </button>
    </div>
  );
}
