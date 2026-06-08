"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Job } from "@/lib/features/jobs/jobsSlice";
import { Briefcase, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

const STATUS: Record<Job["status"], { label: string; cls: string; icon: React.ReactNode }> = {
  pending:   { label: "Pending",   cls: "bg-amber-100 text-amber-800",       icon: <AlertCircle  className="w-3.5 h-3.5" /> },
  accepted:  { label: "Accepted",  cls: "bg-blue-100 text-blue-800",         icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  completed: { label: "Completed", cls: "bg-emerald-100 text-emerald-800",   icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected:  { label: "Rejected",  cls: "bg-red-100 text-red-800",           icon: <XCircle      className="w-3.5 h-3.5" /> },
};

export default function RequestTab() {
  const { jobs } = useSelector((s: RootState) => s.jobs);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">My Requests</h2>
        <p className="text-sm text-on-surface-variant mt-1">Your active jobs and subscriptions.</p>
      </div>

      {jobs.length === 0 ? (
        <div className="border border-outline-variant rounded-xl p-12 text-center flex flex-col items-center gap-3 bg-surface-container-lowest">
          <Briefcase className="w-10 h-10 text-outline" />
          <p className="text-on-surface-variant text-sm">No requests yet. Explore services to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((b) => {
            const st = STATUS[b.status];
            return (
              <div key={b.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-container p-2.5 rounded-lg shrink-0">
                    {b.type === "subscription"
                      ? <Clock      className="w-5 h-5 text-on-primary-container" />
                      : <Briefcase  className="w-5 h-5 text-on-primary-container" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-on-surface text-sm">{b.serviceName}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 capitalize">
                      {b.type === "subscription"
                        ? `Subscription · ${(b.frequency ?? "").replace("_", "-").toLowerCase()}`
                        : "On-Demand"} · {b.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:ml-auto">
                  <div className="text-right">
                    <div className="font-bold text-primary text-sm">NGN {b.amount.toLocaleString()}</div>
                    <div className={`text-xs ${b.escrowStatus === 'released' ? 'text-emerald-600' : 'text-on-surface-variant'}`}>
                      {b.escrowStatus === 'released' ? 'Payment Released' : 'Escrow Locked'}
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${st.cls}`}>
                    {st.icon} {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
