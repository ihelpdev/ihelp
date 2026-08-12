"use client";

import { Briefcase, Clock, ShieldCheck, ArrowRight, User, Power, MapPin, Banknote, ChevronDown, ChevronUp, Compass } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useState, useEffect, lazy, Suspense } from "react";
import JobChat from "@/components/shared/JobChat";

// Lazy-load the full ExploreTab so it doesn't bloat the home tab bundle
const ExploreTab = lazy(() => import("@/components/dashboard/ExploreTab"));

export default function MerchantHomeTab({ onTabSwitch }: { onTabSwitch?: (t: string) => void }) {
  const { user } = useSelector((s: RootState) => s.auth);
  const { jobs } = useSelector((s: RootState) => s.jobs);
  const [isAvailable, setIsAvailable] = useState(true);
  const [chatJob, setChatJob] = useState<{ id: string; name: string; customerId: string } | null>(null);
  const [showDiscover, setShowDiscover] = useState(false);

  useEffect(() => {
    fetch('/api/merchant/availability')
      .then(r => r.json())
      .then(d => { if (d.success) setIsAvailable(d.data.isAvailable); })
      .catch(console.error);
  }, []);

  const toggleAvailability = async () => {
    const newState = !isAvailable;
    setIsAvailable(newState);
    try {
      await fetch('/api/merchant/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: newState })
      });
    } catch (err) {
      console.error(err);
      setIsAvailable(!newState); // revert on error
    }
  };

  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const activeCount  = jobs.filter(j => j.status === 'accepted').length;

  // Available requests: pending jobs (unassigned or already assigned to this merchant)
  const availableRequests = jobs.filter(
    j => j.status === 'pending' && (!j.merchantId || j.merchantId === user?.id)
  ).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner */}
      <div className="bg-primary text-on-primary rounded-2xl p-6 md:p-8 flex flex-col gap-4 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold font-display">Welcome back, {user?.name?.split(' ')[0] ?? 'Pro'}!</h2>
            <p className="text-on-primary/80 mt-1">You have {pendingCount} new job requests pending your review.</p>
          </div>
          <button 
            onClick={toggleAvailability}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
              isAvailable 
                ? "bg-emerald-500/20 text-emerald-100 border-emerald-400/30 hover:bg-emerald-500/30" 
                : "bg-surface/20 text-white border-white/30 hover:bg-surface/30"
            }`}
          >
            <Power className="w-3.5 h-3.5" /> {isAvailable ? "Online" : "Away"}
          </button>
        </div>
        <div className="flex gap-3 relative z-10 mt-2">
          <button 
            onClick={() => onTabSwitch?.("jobs")} 
            className="bg-on-primary text-primary font-bold py-2.5 px-5 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            <Briefcase className="w-4 h-4" /> View All Jobs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm flex flex-col gap-2 cursor-pointer transition-colors hover:bg-surface-container-low" onClick={() => onTabSwitch?.("jobs")}>
          <div className="bg-amber-100 text-amber-800 p-2.5 w-max rounded-lg"><Clock className="w-5 h-5" /></div>
          <div className="font-bold text-2xl text-primary mt-1">{pendingCount}</div>
          <div className="text-xs text-on-surface-variant font-medium">Pending Requests</div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm flex flex-col gap-2 cursor-pointer transition-colors hover:bg-surface-container-low" onClick={() => onTabSwitch?.("jobs")}>
          <div className="bg-blue-100 text-blue-800 p-2.5 w-max rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
          <div className="font-bold text-2xl text-primary mt-1">{activeCount}</div>
          <div className="text-xs text-on-surface-variant font-medium">Active Jobs</div>
        </div>
      </div>

      {/* Available Requests Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-primary">Available Requests</h3>
          {pendingCount > 5 && (
            <button 
              onClick={() => onTabSwitch?.("jobs")} 
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {availableRequests.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Briefcase className="w-8 h-8 text-outline" />
            <p className="text-sm text-on-surface-variant">No pending requests at the moment.</p>
            <p className="text-xs text-on-surface-variant/70">New job requests will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {availableRequests.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 hover:bg-surface-container transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-on-surface truncate">{job.serviceName || "Service Request"}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 capitalize">{job.type?.replace("_", " ")}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0">
                    <Clock className="w-3 h-3" /> Pending
                  </div>
                </div>

                {job.customerNote && (
                  <p className="text-xs text-on-surface-variant italic border-l-2 border-outline-variant pl-2 line-clamp-2">
                    &ldquo;{job.customerNote}&rdquo;
                  </p>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <Banknote className="w-3.5 h-3.5" />
                    <span className="font-semibold text-on-surface">₦{job.amount?.toLocaleString()}</span>
                  </div>
                  {job.customerAddress && (
                    <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[140px]">{job.customerAddress}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => onTabSwitch?.("jobs")}
                    className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                  >
                    <Briefcase className="w-3.5 h-3.5" /> View Details
                  </button>
                  {job.merchantId === user?.id && (
                    <button
                      onClick={() => setChatJob({ id: job.id, name: job.serviceName, customerId: job.customerId })}
                      className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1"
                    >
                      Chat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discover Services — merchants can browse & book other pros */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowDiscover(v => !v)}
          className="w-full flex items-center justify-between p-6 hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-secondary-container text-on-secondary-container p-2.5 rounded-xl">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-on-surface">Discover & Book Services</div>
              <div className="text-xs text-on-surface-variant mt-0.5">Browse other pros and book services for yourself</div>
            </div>
          </div>
          {showDiscover
            ? <ChevronUp className="w-5 h-5 text-on-surface-variant" />
            : <ChevronDown className="w-5 h-5 text-on-surface-variant" />
          }
        </button>

        {showDiscover && (
          <div className="border-t border-outline-variant p-4">
            <Suspense fallback={
              <div className="py-12 flex items-center justify-center gap-2 text-on-surface-variant text-sm animate-pulse">
                <Compass className="w-5 h-5" /> Loading services...
              </div>
            }>
              <ExploreTab />
            </Suspense>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-primary mb-4">Quick Actions</h3>
        <div className="flex flex-col gap-3">
          <button onClick={() => onTabSwitch?.("portfolio")} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-primary-container text-on-primary-container p-2 rounded-lg"><Briefcase className="w-5 h-5" /></div>
              <div className="text-left">
                <div className="font-semibold text-sm text-on-surface">Manage Portfolio</div>
                <div className="text-xs text-on-surface-variant">Update your listed services</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-outline" />
          </button>
          
          <button onClick={() => onTabSwitch?.("profile")} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-tertiary-container text-on-tertiary-container p-2 rounded-lg"><User className="w-5 h-5" /></div>
              <div className="text-left">
                <div className="font-semibold text-sm text-on-surface">Pro Profile</div>
                <div className="text-xs text-on-surface-variant">Update your availability and skills</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-outline" />
          </button>
        </div>
      </div>

      {chatJob && (
        <JobChat
          jobId={chatJob.id}
          jobName={chatJob.name}
          receiverId={chatJob.customerId}
          onClose={() => setChatJob(null)}
        />
      )}
    </div>
  );
}
