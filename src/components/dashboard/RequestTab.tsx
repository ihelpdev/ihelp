"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { Job, markJobRated } from "@/lib/features/jobs/jobsSlice";
import { Briefcase, Clock, CheckCircle2, AlertCircle, XCircle, Star } from "lucide-react";

const STATUS: Record<Job["status"], { label: string; cls: string; icon: React.ReactNode }> = {
  pending:   { label: "Pending",   cls: "bg-amber-100 text-amber-800",     icon: <AlertCircle  className="w-3.5 h-3.5" /> },
  accepted:  { label: "Accepted",  cls: "bg-blue-100 text-blue-800",       icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  completed: { label: "Completed", cls: "bg-emerald-100 text-emerald-800", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected:  { label: "Rejected",  cls: "bg-red-100 text-red-800",         icon: <XCircle      className="w-3.5 h-3.5" /> },
};

function StarRatingWidget({ jobId, serviceId, onDone }: { jobId: string; serviceId: string; onDone: () => void }) {
  const dispatch = useDispatch();
  const [hovered,     setHovered]     = useState(0);
  const [selected,    setSelected]    = useState(0);
  const [comment,     setComment]     = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState("");

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, merchantListingId: serviceId, rating: selected, comment }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(markJobRated(jobId));
        onDone();
      } else {
        setError(data.message || "Failed to submit rating.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-outline-variant flex flex-col gap-2">
      <p className="text-xs font-semibold text-on-surface">Rate this service</p>
      {/* Stars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(n)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className="w-6 h-6 transition-colors"
              fill={(hovered || selected) >= n ? "#f59e0b" : "none"}
              stroke={(hovered || selected) >= n ? "#f59e0b" : "#9ca3af"}
            />
          </button>
        ))}
        {selected > 0 && (
          <span className="ml-2 text-xs text-amber-600 font-medium self-center">
            {["", "Poor", "Fair", "Good", "Very good", "Excellent"][selected]}
          </span>
        )}
      </div>
      {/* Optional comment */}
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Leave a comment (optional)…"
        rows={2}
        className="w-full text-xs px-3 py-2 rounded-lg border border-outline-variant bg-surface outline-none focus:border-primary resize-none transition-colors"
      />
      {error && <p className="text-xs text-error">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          {submitting ? "Submitting…" : "Submit Rating"}
        </button>
        <button onClick={onDone} className="px-4 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-medium hover:bg-surface-container-high transition-colors">
          Skip
        </button>
      </div>
    </div>
  );
}

export default function RequestTab() {
  const { jobs } = useSelector((s: RootState) => s.jobs);
  const [ratingJobId, setRatingJobId] = useState<string | null>(null);

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
            const isCompleted  = b.status === "completed";
            const isOnDemand   = b.type === "on_demand";
            const canRate      = isCompleted && isOnDemand && !b.rated;
            const isRatingOpen = ratingJobId === b.id;

            return (
              <div key={b.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                      <div className={`text-xs ${b.escrowStatus === "released" ? "text-emerald-600" : "text-on-surface-variant"}`}>
                        {b.escrowStatus === "released" ? "Payment Released" : "Escrow Locked"}
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${st.cls}`}>
                      {st.icon} {st.label}
                    </span>
                    {b.rated && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" /> Rated
                      </span>
                    )}
                    {canRate && !isRatingOpen && (
                      <button
                        onClick={() => setRatingJobId(b.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <Star className="w-3.5 h-3.5" /> Rate
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline rating form */}
                {isRatingOpen && (
                  <StarRatingWidget
                    jobId={b.id}
                    serviceId={b.serviceId}
                    onDone={() => setRatingJobId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
