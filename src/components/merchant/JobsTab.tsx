import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { updateJobStatus, releaseJobEscrow } from "@/lib/features/jobs/jobsSlice";
import { Briefcase, CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";

export default function JobsTab() {
  const dispatch = useDispatch();
  const { jobs } = useSelector((s: RootState) => s.jobs);
  const { user } = useSelector((s: RootState) => s.auth);

  // Fallback to empty if not a merchant
  const merchantJobs = user?.role === "MERCHANT" 
    ? jobs.filter(j => 
        (j.merchantId === user.id) || 
        (!j.merchantId && j.customerId !== user.id)
      ) 
    : jobs;

  const [activeFilter, setActiveFilter] = useState<"pending" | "accepted" | "history">("pending");

  const filteredJobs = merchantJobs.filter(j => {
    if (activeFilter === "pending") return j.status === "pending";
    if (activeFilter === "accepted") return j.status === "accepted";
    if (activeFilter === "history") return ["completed", "rejected"].includes(j.status);
    return true;
  });

  const handleStatusUpdate = async (id: string, status: "accepted" | "completed" | "rejected") => {
    try {
      const res = await fetch(`/api/jobs/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status.toUpperCase() }),
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch(updateJobStatus({ id, status }));
        if (status === "completed") {
          dispatch(releaseJobEscrow(id));
          // In a full implementation, we would also dispatch the walletSlice action here
        }
      } else {
        alert("Failed to update status: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Job Queue</h2>
        <p className="text-sm text-on-surface-variant mt-1">Manage your incoming tasks and active jobs.</p>
      </div>

      <div className="flex bg-surface-container-low p-1 rounded-xl w-max border border-outline-variant">
        {(["pending", "accepted", "history"] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              activeFilter === f ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="border border-outline-variant rounded-xl p-12 text-center flex flex-col items-center gap-3 bg-surface-container-lowest">
          <Briefcase className="w-10 h-10 text-outline" />
          <p className="text-on-surface-variant text-sm">No {activeFilter} jobs found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    job.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    job.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.type === "subscription" ? <Clock className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-base">{job.serviceName}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 capitalize flex items-center gap-2">
                      <span>{job.type === "subscription" ? `Sub: ${job.frequency}` : "On-Demand"}</span>
                      <span>·</span>
                      <span>{job.date}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary text-lg">NGN {job.amount.toLocaleString()}</div>
                  <div className={`text-xs font-medium ${job.escrowStatus === 'released' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {job.escrowStatus === 'released' ? 'Funds Released' : 'Escrow Locked'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {job.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-outline-variant">
                  <button onClick={() => handleStatusUpdate(job.id, "accepted")} className="flex-1 bg-primary text-on-primary py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Accept Job
                  </button>
                  <button onClick={() => handleStatusUpdate(job.id, "rejected")} className="flex-1 bg-error-container text-on-error-container py-2.5 rounded-xl text-sm font-semibold hover:bg-error-container/90 transition-colors">
                    Reject
                  </button>
                </div>
              )}

              {job.status === "accepted" && (
                <div className="flex gap-3 pt-4 border-t border-outline-variant">
                  <button onClick={() => handleStatusUpdate(job.id, "completed")} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
