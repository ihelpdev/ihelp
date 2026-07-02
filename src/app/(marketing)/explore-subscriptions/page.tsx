"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2, RefreshCw, AlertTriangle, Check,
  WashingMachine, Car, Home, Building2, Leaf,
  UtensilsCrossed, ShoppingBag, Waves, Bug, Cog,
  Calendar, CalendarClock, Zap, type LucideIcon,
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  base_price_per_session_ngn: number;
  features: string[];
  imageUrl?: string | null;
}

/** Map service name keywords to the most fitting Lucide icon */
function getServiceIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  if (lower.includes("laundry") || (lower.includes("wash") && lower.includes("cloth"))) return WashingMachine;
  if (lower.includes("car") || lower.includes("vehicle") || lower.includes("auto")) return Car;
  if (lower.includes("house") || lower.includes("clean") || lower.includes("janitor") || lower.includes("mop")) return Home;
  if (lower.includes("office") || lower.includes("corporate") || lower.includes("commercial")) return Building2;
  if (lower.includes("garden") || lower.includes("lawn") || lower.includes("landscape")) return Leaf;
  if (lower.includes("cook") || lower.includes("meal") || lower.includes("food")) return UtensilsCrossed;
  if (lower.includes("errand") || lower.includes("delivery") || lower.includes("shop")) return ShoppingBag;
  if (lower.includes("pool") || lower.includes("swim")) return Waves;
  if (lower.includes("pest") || lower.includes("fumigate")) return Bug;
  return Cog;
}

function SkeletonCard() {
  return (
    <div className="bg-surface-container rounded-2xl border border-outline-variant p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md shadow-sm animate-pulse">
      <div className="space-y-sm max-w-2xl w-full">
        <div className="flex items-center gap-xs">
          <div className="w-10 h-10 bg-outline-variant rounded-full" />
          <div>
            <div className="h-5 w-48 bg-outline-variant rounded mb-1" />
            <div className="h-3 w-32 bg-outline-variant/60 rounded" />
          </div>
        </div>
        <div className="h-4 w-full bg-outline-variant/50 rounded" />
        <div className="h-4 w-3/4 bg-outline-variant/40 rounded" />
      </div>
      <div className="w-full md:w-44 bg-outline-variant/30 rounded-xl p-md h-24 shrink-0" />
    </div>
  );
}

export default function ExploreSubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/services/subscriptions");
      const data = await res.json();
      if (data.success) {
        setPlans(data.data);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-surface-container-lowest text-on-surface">
      {/* Dynamic Header Intro Block */}
      <section className="px-margin py-xl text-center max-w-3xl mx-auto space-y-md">
        <span className="text-primary font-bold tracking-widest text-label-lg uppercase block">
          Managed Chore Automation
        </span>
        <h1 className="font-headline-lg text-headline-xl text-primary font-black tracking-tight leading-none">
          Put Your Household Chores On Autopilot.
        </h1>
        <p className="text-on-secondary-container font-body-lg max-w-2xl mx-auto leading-relaxed">
          Subscribe to routine laundry, car cleaning, or housekeeping services. No negotiations, no search delays.{" "}
          Our system automatically deploys certified agents at fixed rates to handle your home needs with precision.
        </p>
      </section>

      {/* Dynamic Savings Tier Strategy Section */}
      <section className="max-w-7xl mx-auto px-margin grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex items-start gap-md shadow-sm">
          <div className="bg-primary/10 text-primary p-sm rounded">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-title-md text-primary">Monthly Package</h3>
            <p className="text-label-md text-on-secondary-container mt-xs">1 Session / month at standard default platform rates. Perfect for occasional deep tuning maintenance.</p>
          </div>
        </div>
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex items-start gap-md shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-on-primary text-3xs font-bold px-sm py-2xs rounded-bl uppercase tracking-wider">Save 5%</div>
          <div className="bg-primary/10 text-primary p-sm rounded">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-title-md text-primary">Bi-Weekly Package</h3>
            <p className="text-label-md text-on-secondary-container mt-xs">2 Sessions / month. A comfortable rhythm keeping your items organized and clean automatically.</p>
          </div>
        </div>
        <div className="bg-primary/5 border-2 border-primary rounded-xl p-md flex items-start gap-md shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-3xs font-bold px-sm py-2xs rounded-bl uppercase tracking-wider">Save 10%</div>
          <div className="bg-primary/10 text-primary p-sm rounded">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-title-md text-primary">Weekly Package</h3>
            <p className="text-label-md text-on-secondary-container mt-xs">4 Sessions / month. Maximum savings and zero structural household cognitive load. Freshness every week.</p>
          </div>
        </div>
      </section>

      {/* Core Dynamic Interactive Service Deck */}
      <section className="max-w-5xl mx-auto px-margin space-y-lg pb-xl">
        <div className="flex items-center justify-between border-b border-outline-variant pb-xs">
          <h2 className="font-headline-sm text-title-lg text-primary font-bold">
            Available Managed Categories
          </h2>
          {!loading && (
            <button
              onClick={fetchPlans}
              className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-md">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="py-12 text-center text-on-surface-variant bg-surface-container rounded-2xl border border-dashed border-outline flex flex-col items-center gap-4">
            <AlertTriangle className="w-10 h-10 text-error" />
            <p className="text-sm">Could not load subscription plans. Please try again.</p>
            <button
              onClick={fetchPlans}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {/* Plans list */}
        {!loading && !error && plans.length === 0 && (
          <div className="py-12 text-center text-on-surface-variant bg-surface-container rounded-2xl border border-dashed border-outline">
            <p className="text-sm">No subscription plans are available right now. Check back soon.</p>
          </div>
        )}

        {!loading && !error && plans.length > 0 && (
          <div className="space-y-md">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-surface-container rounded-2xl border border-outline-variant p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-sm w-full">
                  <div className="flex items-center gap-xs">
                    {plan.imageUrl ? (
                      <div className="w-14 h-14 rounded-xl bg-surface-container overflow-hidden shrink-0">
                        <img src={plan.imageUrl} alt={plan.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        {(() => { const Icon = getServiceIcon(plan.name); return <Icon className="w-6 h-6 text-primary" />; })()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-headline-sm text-title-lg font-bold text-primary">{plan.name}</h3>
                    </div>
                  </div>
                  <p className="text-on-secondary-container text-body-md leading-relaxed">
                    {plan.description}
                  </p>
                  {/* Features list — if admin has provided them */}
                  {plan.features && plan.features.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2xs pt-2xs">
                      {plan.features.map((detail, index) => (
                        <div key={index} className="flex items-center gap-2xs text-label-md text-on-surface/80">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full md:w-auto bg-surface-container-low border border-outline-variant p-md rounded-xl text-center md:text-right space-y-sm flex md:flex-col justify-between items-center md:items-end shrink-0">
                  <div>
                    <span className="text-3xs text-on-secondary-container uppercase font-bold tracking-widest block">
                      Base Session Cost
                    </span>
                    <span className="font-headline-md text-headline-md text-primary font-black block">
                      ₦{plan.base_price_per_session_ngn.toLocaleString()}
                    </span>
                  </div>
                  <Link href="/register" className="w-full md:w-auto">
                    <button className="w-full md:w-auto bg-primary text-on-primary px-lg py-sm rounded font-label-lg transition-all duration-150 active:scale-95 shadow-sm whitespace-nowrap">
                      Configure Plan
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}