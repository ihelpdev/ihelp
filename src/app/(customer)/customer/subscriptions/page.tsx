"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Calendar, CheckCircle2, Shield, Info, PauseCircle, PlayCircle } from "lucide-react";

const FREQUENCIES = [
  { id: "WEEKLY", name: "Weekly", desc: "Best for ongoing cleaning or yard work", discount: "15% off" },
  { id: "BIWEEKLY", name: "Bi-Weekly", desc: "Every two weeks", discount: "10% off" },
];

export default function SubscriptionsPage() {
  const [freq, setFreq] = useState("WEEKLY");
  const [subs, setSubs] = useState<any[]>([]);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubs = async () => {
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubs(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      const res = await fetch("/api/services/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setAvailablePlans(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedPlan(data.data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { 
    fetchSubs(); 
    fetchAvailablePlans();
  }, []);

  const toggleSub = async (id: string, isActive: boolean) => {
    try {
      await fetch("/api/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive })
      });
      fetchSubs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto space-y-8">
      
      {/* Active Subscriptions List */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-on-surface">Your Subscriptions</h2>
        {loading ? (
           <div className="p-6 text-center animate-pulse text-on-surface-variant bg-surface-container-low rounded-lg">Loading...</div>
        ) : subs.length === 0 ? (
           <div className="p-6 text-center text-sm text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-lg">No active subscriptions.</div>
        ) : (
           <div className="flex flex-col gap-3">
             {subs.map(sub => (
               <div key={sub.id} className={`p-4 border rounded-xl flex items-center justify-between ${sub.isActive ? 'bg-surface-container-lowest border-primary/30' : 'bg-surface-container-low border-outline-variant opacity-70'}`}>
                 <div>
                   <h3 className="font-bold text-on-surface">{sub.baseService}</h3>
                   <div className="flex items-center gap-2 mt-1">
                     <Badge variant={sub.isActive ? 'success' : 'secondary'} className="text-[10px]">
                       {sub.isActive ? 'ACTIVE' : 'PAUSED'}
                     </Badge>
                     <span className="text-xs font-semibold text-on-surface-variant capitalize">{sub.frequency.toLowerCase()}</span>
                   </div>
                 </div>
                 <button onClick={() => toggleSub(sub.id, sub.isActive)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${sub.isActive ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}>
                   {sub.isActive ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                   {sub.isActive ? 'Pause' : 'Resume'}
                 </button>
               </div>
             ))}
           </div>
        )}
      </div>

      <div className="text-center pt-6 border-t border-outline-variant">
        <h1 className="text-headline-sm font-bold mb-2">Set up a New Subscription</h1>
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

        <h2 className="font-bold text-lg mb-4">2. Select Service Plan</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {availablePlans.length === 0 && (
            <div className="col-span-2 p-4 text-center text-sm text-on-surface-variant">No subscription plans available at the moment.</div>
          )}
          {availablePlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${selectedPlan?.id === plan.id ? "border-primary bg-primary/5" : "border-outline-variant/30 hover:border-outline"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-on-surface">{plan.name}</span>
                {selectedPlan?.id === plan.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </div>
              <p className="text-xs text-on-surface-variant mb-3">{plan.description}</p>
              <div className="font-bold text-primary">NGN {plan.base_price_per_session_ngn?.toLocaleString()}/visit</div>
            </button>
          ))}
        </div>

        <h2 className="font-bold text-lg mb-4">3. "Pool Dispatch" Architecture</h2>
        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20 mb-8 flex gap-4">
          <Shield className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">How Pool Dispatch Works</h4>
            <p className="text-sm text-on-surface-variant">
              When you subscribe, your request enters our Pro Pool. A highly-rated, background-checked professional will automatically be assigned to your timeslot 24 hours prior. If your favorite Pro is available, they get priority.
            </p>
          </div>
        </div>

        <h2 className="font-bold text-lg mb-4">4. Fixed-Rate Checkout</h2>
        <div className="bg-surface-bright border border-outline-variant/30 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-on-surface-variant">Base Service Rate</span>
            <span className="font-medium">
              NGN {selectedPlan?.base_price_per_session_ngn ? selectedPlan.base_price_per_session_ngn.toLocaleString() : "0"}
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-on-surface-variant flex items-center gap-1">Subscription Discount <Info className="w-3 h-3" /></span>
            <span className="font-medium text-[#10b981]">
              - NGN {selectedPlan?.base_price_per_session_ngn ? (selectedPlan.base_price_per_session_ngn * (freq === "WEEKLY" ? 0.15 : 0.10)).toLocaleString() : "0"}
            </span>
          </div>
          <div className="border-t border-outline-variant/20 my-3"></div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Total per visit</span>
            <span className="font-bold text-lg text-primary">
              NGN {selectedPlan?.base_price_per_session_ngn ? (selectedPlan.base_price_per_session_ngn * (freq === "WEEKLY" ? 0.85 : 0.90)).toLocaleString() : "0"}
            </span>
          </div>
        </div>

        <Button className="w-full text-lg h-12">
          Confirm Subscription & Add Payment
        </Button>
      </div>
    </div>
  );
}
