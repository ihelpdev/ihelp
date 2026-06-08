"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { ArrowDownRight, ArrowUpRight, ShieldCheck, Wallet } from "lucide-react";

export default function WalletTab() {
  const { deposited_funds_ngn, escrow_locked_ngn, transactions } = useSelector(
    (s: RootState) => s.wallet
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-primary">My Wallet</h2>
        <p className="text-sm text-on-surface-variant mt-1">Manage your funds and track escrow guarantees.</p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available */}
        <div className="bg-primary text-on-primary rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[180px]">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg"><Wallet className="w-5 h-5" /></div>
            <span className="font-semibold">Available Balance</span>
          </div>
          <div className="mt-4">
            <div className="text-xs text-white/70 uppercase tracking-widest mb-1">Deposited Funds</div>
            <div className="text-3xl font-black">NGN {deposited_funds_ngn.toLocaleString()}</div>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-white text-primary py-2 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors">Fund Wallet</button>
            <button className="flex-1 bg-primary-container text-on-primary-container py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">Withdraw</button>
          </div>
        </div>

        {/* Escrow */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[180px]">
          <div className="flex items-center gap-3">
            <div className="bg-secondary-container p-2 rounded-lg"><ShieldCheck className="w-5 h-5 text-on-secondary-container" /></div>
            <span className="font-semibold text-on-surface">Escrow Guarantee</span>
          </div>
          <div className="mt-4">
            <div className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Locked Funds</div>
            <div className="text-3xl font-black text-on-surface">NGN {escrow_locked_ngn.toLocaleString()}</div>
          </div>
          <div className="mt-6 text-xs text-center text-on-surface-variant bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5">
            Funds held securely until job completion
          </div>
        </div>
      </div>

      {/* Transaction ledger */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
          <h3 className="font-semibold text-on-surface">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-xs text-on-surface-variant border-b border-outline-variant">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-on-surface">{tx.date}</td>
                  <td className="px-6 py-4 text-on-surface">
                    <div className="flex items-center gap-2">
                      {tx.type === "credit"  && <ArrowDownRight className="w-4 h-4 text-on-tertiary-container shrink-0" />}
                      {tx.type === "debit"   && <ArrowUpRight   className="w-4 h-4 text-error shrink-0" />}
                      {tx.type === "escrow"  && <ShieldCheck    className="w-4 h-4 text-secondary shrink-0" />}
                      {tx.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full
                      ${tx.status === "completed" ? "bg-tertiary-container/20 text-on-tertiary-container"
                      : tx.status === "locked"    ? "bg-surface-variant text-on-surface-variant"
                      : "bg-surface-container text-on-surface-variant"}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-semibold text-right whitespace-nowrap ${tx.amount > 0 ? "text-on-tertiary-container" : "text-on-surface"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} NGN
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
