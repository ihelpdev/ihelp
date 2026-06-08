"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Calendar, CheckCircle2, Shield, Info } from "lucide-react";

const FREQUENCIES = [
  { id: "weekly", name: "Weekly", desc: "Best for ongoing cleaning or yard work", discount: "15% off" },
  { id: "biweekly", name: "Bi-Weekly", desc: "Every two weeks", discount: "10% off" },
  { id: "monthly", name: "Monthly", desc: "Once a month maintenance", discount: "5% off" },
];

export default function SubscriptionsPage() {
  const [freq, setFreq] = useState("weekly");

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-headline-md font-bold mb-2">Set up a Service Subscription</h1>
        <p className="text-body-md text-on-surface-variant">Lock in fixed rates for recurring services and never worry about booking again.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-6">
        <h2 className="font-bold text-lg mb-4">1. Select Frequency</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {FREQUENCIES.map(f => (
            <button
              key={f.id}
              onClick={() => setFreq(f.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${freq === f.id ? "border-primary bg-primary-fixed" : "border-outline-variant/30 hover:border-outline"}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold">{f.name}</span>
                {freq === f.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </div>
              <p className="text-xs text-on-surface-variant mb-2">{f.desc}</p>
              <Badge variant="success">{f.discount}</Badge>
            </button>
          ))}
        </div>

        <h2 className="font-bold text-lg mb-4">2. "Pool Dispatch" Architecture</h2>
        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20 mb-8 flex gap-4">
          <Shield className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">How Pool Dispatch Works</h4>
            <p className="text-sm text-on-surface-variant">
              When you subscribe, your request enters our Pro Pool. A highly-rated, background-checked professional will automatically be assigned to your timeslot 24 hours prior. If your favorite Pro is available, they get priority.
            </p>
          </div>
        </div>

        <h2 className="font-bold text-lg mb-4">3. Fixed-Rate Checkout</h2>
        <div className="bg-surface-bright border border-outline-variant/30 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-on-surface-variant">Base Service Rate</span>
            <span className="font-medium">$120.00</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-on-surface-variant flex items-center gap-1">Subscription Discount <Info className="w-3 h-3" /></span>
            <span className="font-medium text-[#10b981]">-$18.00</span>
          </div>
          <div className="border-t border-outline-variant/20 my-3"></div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Total per visit</span>
            <span className="font-bold text-lg text-primary">$102.00</span>
          </div>
        </div>

        <Button className="w-full text-lg h-12">
          Confirm Subscription & Add Payment
        </Button>
      </div>
    </div>
  );
}
