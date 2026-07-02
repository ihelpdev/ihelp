import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { updateJobStatus, releaseJobEscrow } from "@/lib/features/jobs/jobsSlice";
import { Briefcase, CheckCircle2, AlertCircle, XCircle, Clock, MapIcon, Navigation } from "lucide-react";
import InAppRoutingMap from "./InAppRoutingMap";

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

  const [activeFilter, setActiveFilter] = useState<"pending" | "accepted" | "en_route" | "history">("pending");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [appSettings, setAppSettings] = useState<{ routingMode?: string }>({});
  const [navigatingJob, setNavigatingJob] = useState<any>(null);


  
  useEffect(() => {
    // Fetch settings for map routing mode
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => { if (data.success) setAppSettings(data.data); })
      .catch(console.error);
  }, []);

  const filteredJobs = merchantJobs.filter(j => {
    if (activeFilter === "pending") return j.status === "pending";
    if (activeFilter === "accepted") return j.status === "accepted";
    if (activeFilter === "en_route") return j.status === "en_route";
    if (activeFilter === "history") return ["completed", "confirmed", "rejected"].includes(j.status);
    return true;
  });

  const handleStatusUpdate = async (id: string, status: "accepted" | "en_route" | "completed" | "rejected") => {
    setUpdatingId(id);
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
          // Escrow releases when CONFIRMED by customer, not here
        }
        setIsDetailsModalOpen(false);
      } else {
        alert("Failed to update status: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNavigate = (job: any) => {
    // Mock customer location
    const lat = 9.0820; 
    const lng = 8.6753;
    
    if (appSettings.routingMode === "in_app") {
      setNavigatingJob(job);
    } else {
      // Default to external intent link
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Job Queue</h2>
        <p className="text-sm text-on-surface-variant mt-1">Manage your incoming tasks and active jobs.</p>
      </div>

      <div className="flex bg-surface-container-low p-1 rounded-xl w-max border border-outline-variant">
        {(["pending", "accepted", "en_route", "history"] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              activeFilter === f ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {f.replace("_", " ")}
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
                <div className="flex gap-3 pt-4 border-t border-outline-variant mt-4">
                  <button onClick={() => { setSelectedJob(job); setIsDetailsModalOpen(true); }} className="flex-1 bg-surface-container-high text-on-surface py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-container-highest transition-colors">
                    View Details
                  </button>
                </div>
              )}

              {job.status === "accepted" && (
                <div className="flex gap-3 pt-4 border-t border-outline-variant mt-4">
                  <button disabled={updatingId === job.id} onClick={() => handleStatusUpdate(job.id, "en_route")} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                    <Navigation className="w-4 h-4" /> {updatingId === job.id ? "Updating..." : "Head to Location (En Route)"}
                  </button>
                </div>
              )}

              {job.status === "en_route" && (
                <div className="flex gap-3 pt-4 border-t border-outline-variant mt-4">
                  <button onClick={() => handleNavigate(job)} className="flex-1 bg-surface-container-high text-on-surface py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-container-highest transition-colors flex justify-center items-center gap-2">
                    <MapIcon className="w-4 h-4" /> Navigate
                  </button>
                  <button disabled={updatingId === job.id} onClick={() => handleStatusUpdate(job.id, "completed")} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                    <CheckCircle2 className="w-4 h-4" /> {updatingId === job.id ? "Updating..." : "Mark as Completed"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/60" onClick={(e) => { if (e.target === e.currentTarget) setIsDetailsModalOpen(false); }}>
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-on-surface">Request Details</h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              <div>
                <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Service</div>
                <div className="font-bold text-on-surface text-lg">{selectedJob.serviceName}</div>
                <div className="text-sm text-primary font-bold mt-1">NGN {selectedJob.amount.toLocaleString()}</div>
              </div>
              
              <div>
                <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Customer Note</div>
                <div className="text-sm text-on-surface p-3 bg-surface-container-lowest border border-outline-variant rounded-xl italic">
                  "{selectedJob.customerNote || "No additional details provided."}"
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Location</div>
                <div className="text-sm font-medium text-on-surface flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-primary" /> Abuja, Nigeria (Est. 12 mins away)
                </div>
              </div>
              
            </div>
            
            <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex gap-3">
              <button disabled={updatingId === selectedJob.id} onClick={() => handleStatusUpdate(selectedJob.id, "accepted")} className="flex-1 bg-primary text-on-primary py-3 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {updatingId === selectedJob.id ? "Accepting..." : "Accept Request"}
              </button>
              <button disabled={updatingId === selectedJob.id} onClick={() => handleStatusUpdate(selectedJob.id, "rejected")} className="flex-1 bg-error-container text-on-error-container py-3 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {navigatingJob && (
        <InAppRoutingMap
          startLoc={{ lat: 9.0579, lng: 8.6632 }} // Mock merchant start loc
          endLoc={{ lat: 9.0820, lng: 8.6753 }}   // Mock customer end loc
          onClose={() => setNavigatingJob(null)}
        />
      )}
    </div>
  );
}
