import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { updateJobStatus, releaseJobEscrow } from "@/lib/features/jobs/jobsSlice";
import { Briefcase, CheckCircle2, AlertCircle, XCircle, Clock, MapIcon, Navigation, Phone, MessageSquare } from "lucide-react";
import InAppRoutingMap from "./InAppRoutingMap";
import JobChat from "../shared/JobChat";

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
  const [navigatingJob, setNavigatingJob] = useState<any>(null);
  const [chatJob, setChatJob] = useState<{ id: string, name: string, customerId: string } | null>(null);


  

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNavigatingJob({
            ...job,
            startLat: position.coords.latitude,
            startLng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your current location. Please ensure location services are enabled.");
          // Fallback to default
          setNavigatingJob({
            ...job,
            startLat: 9.0579,
            startLng: 8.6632
          });
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setNavigatingJob({
        ...job,
        startLat: 9.0579,
        startLng: 8.6632
      });
    }
    
    // Alert customer asynchronously
    fetch(`/api/jobs/${job.id}/alert-customer`, { method: "POST" })
      .then(() => console.log("Customer notified"))
      .catch((err) => console.error("Error alerting customer:", err));
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
                    {job.status !== 'pending' && job.status !== 'rejected' && job.customerPhone && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">
                        <Phone className="w-3.5 h-3.5" />
                        <a href={`tel:${job.customerPhone}`} className="hover:underline">{job.customerPhone}</a>
                      </div>
                    )}
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

              {['accepted', 'en_route'].includes(job.status) && (
                <div className="flex gap-3 pt-4 border-t border-outline-variant mt-4">
                  <button 
                    onClick={() => setChatJob({ id: job.id, name: job.serviceName, customerId: job.customerId })}
                    className="flex-1 bg-surface-container-high text-on-surface py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-container-highest transition-colors flex justify-center items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Chat
                  </button>
                  <button disabled={updatingId === job.id} onClick={() => handleStatusUpdate(job.id, "en_route")} className="flex-1 bg-primary text-on-primary py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
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
          <div className="bg-white w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col">
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
                  &ldquo;{selectedJob.customerNote || "No additional details provided."}&rdquo;
                </div>
              </div>

              {selectedJob.customerNoteImages && selectedJob.customerNoteImages.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Attached Images</div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedJob.customerNoteImages.map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={url}
                          alt={`Customer image ${i + 1}`}
                          className="w-full h-28 object-cover rounded-lg border border-outline-variant hover:opacity-80 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Location</div>
                <div className="text-sm font-medium text-on-surface flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-primary" /> Abuja, Nigeria (Est. 12 mins away)
                </div>
              </div>

              {selectedJob.status !== 'pending' && selectedJob.status !== 'rejected' && selectedJob.customerPhone && (
                <div>
                  <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Customer Contact</div>
                  <div className="text-sm font-medium text-on-surface flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${selectedJob.customerPhone}`} className="hover:underline text-primary">{selectedJob.customerPhone}</a>
                  </div>
                </div>
              )}
              
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
          startLoc={{ lat: navigatingJob.startLat ?? 9.0579, lng: navigatingJob.startLng ?? 8.6632, label: "Your Location" }}
          endLoc={{ lat: navigatingJob.customerLat ?? 9.0820, lng: navigatingJob.customerLng ?? 8.6753, label: navigatingJob.customerAddress ?? "Customer Location" }}
          customerPhone={navigatingJob.customerPhone}
          onClose={() => setNavigatingJob(null)}
          onArrived={() => handleStatusUpdate(navigatingJob.id, "completed")}
        />
      )}

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
