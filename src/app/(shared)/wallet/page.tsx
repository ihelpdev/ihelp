"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, Lock, CheckCircle2, RefreshCw } from "lucide-react";

export default function OmniWalletPage() {
  const [tab, setTab] = useState<"earned" | "deposited">("deposited");
  const [balance, setBalance] = useState(500.00);
  const [escrow, setEscrow] = useState(150.00);
  
  // Mock Transaction Logs
  const [transactions, setTransactions] = useState([
    { id: "tx1", type: "deposit", amount: 500, date: "Oct 24", status: "completed" },
    { id: "tx2", type: "lock", amount: 150, date: "Oct 25", status: "escrow" },
  ]);

  const [earnedBalance, setEarnedBalance] = useState(1240.50);

  // Atomic Transaction Simulation: Booking Lock-in
  const handleSimulateBooking = () => {
    if (balance >= 100) {
      setBalance(b => b - 100);
      setEscrow(e => e + 100);
      setTransactions([{ id: `tx${Date.now()}`, type: "lock", amount: 100, date: "Today", status: "escrow" }, ...transactions]);
      alert("Simulated: Customer books a $100 job. Funds atomically moved from Balance to Escrow.");
    } else {
      alert("Insufficient deposited funds to simulate booking.");
    }
  };

  // Atomic Transaction Simulation: Escrow Release
  const handleSimulateJobComplete = () => {
    if (escrow >= 100) {
      setEscrow(e => e - 100);
      setEarnedBalance(e => e + 100);
      alert("Simulated: Job Marked Complete! $100 Escrow released to Merchant's Earned Income.");
    } else {
      alert("No sufficient escrow funds to release.");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      
      {/* Wallet Tabs */}
      <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
        <button 
          onClick={() => setTab("deposited")}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${tab === "deposited" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          Customer (Deposited)
        </button>
        <button 
          onClick={() => setTab("earned")}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${tab === "earned" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          Pro (Earned)
        </button>
      </div>

      {tab === "deposited" ? (
        <div className="space-y-6">
          {/* Deposited Funds Summary */}
          <div className="bg-primary text-white rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-primary/20">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-primary-fixed-dim font-medium">Available Balance</span>
                <WalletIcon className="w-6 h-6 text-primary-fixed-dim" />
              </div>
              <h2 className="text-4xl font-extrabold mb-1">${balance.toFixed(2)}</h2>
              <div className="flex items-center gap-2 text-sm text-primary-fixed-dim">
                <Lock className="w-4 h-4" /> 
                <span>${escrow.toFixed(2)} currently locked in Escrow</span>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 bg-surface-container-high text-on-surface hover:bg-surface-container-highest border-0" variant="secondary">
              Add Funds <ArrowDownRight className="w-4 h-4 ml-2" />
            </Button>
            <Button className="flex-1" onClick={handleSimulateBooking}>
              Simulate Booking <RefreshCw className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Ledger */}
          <div>
            <h3 className="font-bold text-lg mb-4">Transaction History</h3>
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-[#e2f8eb] text-[#005236]' : 'bg-[#fff3cd] text-[#856404]'}`}>
                      {tx.type === 'deposit' ? <ArrowDownRight className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold capitalize">{tx.type === 'lock' ? 'Escrow Lock' : 'Deposit'}</p>
                      <p className="text-xs text-on-surface-variant">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'deposit' ? 'text-[#10b981]' : 'text-on-surface'}`}>
                      {tx.type === 'deposit' ? '+' : ''}${tx.amount.toFixed(2)}
                    </p>
                    <Badge variant={tx.status === 'completed' ? 'success' : 'warning'} className="mt-1">{tx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          {/* Earned Funds Summary */}
          <div className="bg-surface-container-lowest border-2 border-[#10b981] rounded-2xl p-6 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="text-on-surface-variant font-medium">Earned Income</span>
              <Badge variant="success" className="bg-[#10b981] text-white">Ready for Payout</Badge>
            </div>
            <h2 className="text-4xl font-extrabold mb-1 text-[#10b981]">${earnedBalance.toFixed(2)}</h2>
            <p className="text-sm text-on-surface-variant">Available to withdraw to bank</p>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 bg-[#10b981] border-[#10b981] hover:bg-[#0e9d6e]">
              Withdraw Funds <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
            <Button className="flex-1" variant="secondary" onClick={handleSimulateJobComplete}>
              Simulate Job Complete
            </Button>
          </div>

          <div className="p-8 text-center text-on-surface-variant bg-surface-container-low rounded-lg border border-dashed border-outline-variant/50">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-outline-variant" />
            <p className="font-medium">Recent earnings will appear here</p>
            <p className="text-sm mt-1">Complete jobs to release funds from Escrow.</p>
          </div>
        </div>
      )}

    </div>
  );
}
