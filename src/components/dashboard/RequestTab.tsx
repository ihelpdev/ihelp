"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import {
  Job,
  markJobRated,
  updateJobStatus,
  releaseJobEscrow,
} from "@/lib/features/jobs/jobsSlice";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  Phone,
  MessageSquare,
} from "lucide-react";
import JobChat from "../shared/JobChat";

const STATUS: Record<
  Job["status"],
  { label: string; cls: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    cls: "bg-amber-100 text-amber-800",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  accepted: {
    label: "Accepted",
    cls: "bg-blue-100 text-blue-800",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  en_route: {
    label: "En Route",
    cls: "bg-indigo-100 text-indigo-800",
    icon: <Briefcase className="w-3.5 h-3.5" />,
  },
  in_progress: {
    label: "In Progress",
    cls: "bg-cyan-100 text-cyan-800",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  completed: {
    label: "Completed",
    cls: "bg-emerald-100 text-emerald-800",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  confirmed: {
    label: "Confirmed",
    cls: "bg-emerald-100 text-emerald-800",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-100 text-red-800",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  disputed: {
    label: "Disputed",
    cls: "bg-orange-100 text-orange-800",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};

function StarRatingWidget({
  jobId,
  serviceId,
  onDone,
}: {
  jobId: string;
  serviceId: string;
  onDone: () => void;
}) {
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          merchantListingId: serviceId,
          rating: selected,
          comment,
        }),
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
        {[1, 2, 3, 4, 5].map((n) => (
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
        onChange={(e) => setComment(e.target.value)}
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
        <button
          onClick={onDone}
          className="px-4 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-medium hover:bg-surface-container-high transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

export default function RequestTab() {
  const { jobs } = useSelector((s: RootState) => s.jobs);
  const dispatch = useDispatch();
  const [ratingJobId, setRatingJobId] = useState<string | null>(null);
  const [confirmingJobId, setConfirmingJobId] = useState<string | null>(null);
  const [chatJob, setChatJob] = useState<{
    id: string;
    name: string;
    merchantId: string;
  } | null>(null);
  const [disputeJobId, setDisputeJobId] = useState<string | null>(null);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [disputeEvidenceText, setDisputeEvidenceText] = useState("");
  const [disputeEvidenceImages, setDisputeEvidenceImages] = useState<string[]>(
    [],
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const uploadToCloudinary = async (files: FileList) => {
    setIsUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", "ihelp-images");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dik1cosdn/image/upload",
          {
            method: "POST",
            body: fd,
          },
        );
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error.message || "Failed to upload");
        }
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }
      if (uploadedUrls.length > 0) {
        setDisputeEvidenceImages((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Image upload failed: ${e.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const confirmDispute = async (jobId: string) => {
    setIsSubmittingDispute(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "DISPUTED",
          customerDisputeEvidenceText: disputeEvidenceText,
          customerDisputeEvidenceImages: disputeEvidenceImages,
        }),
      });
      if (res.ok) {
        dispatch(updateJobStatus({ id: jobId, status: "disputed" }));
        alert("Dispute raised. Our team will contact you shortly.");
      } else {
        console.log(res);
        alert("Failed to raise dispute. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Error raising dispute.");
    } finally {
      setIsSubmittingDispute(false);
      setDisputeJobId(null);
      setDisputeEvidenceText("");
      setDisputeEvidenceImages([]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">My Requests</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Your active jobs and subscriptions.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="border border-outline-variant rounded-xl p-12 text-center flex flex-col items-center gap-3 bg-surface-container-lowest">
          <Briefcase className="w-10 h-10 text-outline" />
          <p className="text-on-surface-variant text-sm">
            No requests yet. Explore services to get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((b) => {
            const st = STATUS[b.status];
            const isCompleted = b.status === "completed";
            const isConfirmed = b.status === "confirmed";
            const isOnDemand =
              b.type === "on_demand" || b.type === ("special_request" as any);
            const canRate = isConfirmed && isOnDemand && !b.rated;
            const isRatingOpen = ratingJobId === b.id;

            return (
              <div
                key={b.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-container p-2.5 rounded-lg shrink-0">
                      {b.type === "subscription" ? (
                        <Clock className="w-5 h-5 text-on-primary-container" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-on-primary-container" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-on-surface text-sm">
                        {b.serviceName}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5 capitalize">
                        {b.type === "subscription"
                          ? `Subscription · ${(b.frequency ?? "").replace("_", "-").toLowerCase()}`
                          : "On-Demand"}{" "}
                        · {b.date}
                      </p>
                      {b.status !== "pending" &&
                        b.status !== "rejected" &&
                        b.merchantPhone && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">
                            <Phone className="w-3.5 h-3.5" />
                            <a
                              href={`tel:${b.merchantPhone}`}
                              className="hover:underline"
                            >
                              {b.merchantPhone}
                            </a>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:ml-auto">
                    <div className="text-right">
                      <div className="font-bold text-primary text-sm">
                        NGN {b.amount.toLocaleString()}
                      </div>
                      <div
                        className={`text-xs ${b.escrowStatus === "released" ? "text-emerald-600" : "text-on-surface-variant"}`}
                      >
                        {b.escrowStatus === "released"
                          ? "Payment Released"
                          : "Escrow Locked"}
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${st.cls}`}
                    >
                      {st.icon} {st.label}
                    </span>
                    {b.rated && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />{" "}
                        Rated
                      </span>
                    )}
                    {b.status === "completed" && (
                      <button
                        disabled={confirmingJobId === b.id}
                        onClick={async () => {
                          setConfirmingJobId(b.id);
                          try {
                            const res = await fetch("/api/jobs/confirm", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ jobId: b.id }),
                            });
                            if (res.ok) {
                              dispatch(
                                updateJobStatus({
                                  id: b.id,
                                  status: "confirmed",
                                }),
                              );
                              dispatch(releaseJobEscrow(b.id));
                              alert(
                                `Success! Escrow funds of NGN ${b.amount.toLocaleString()} have been released to the merchant.`,
                              );
                            } else {
                              alert("Failed to confirm completion.");
                            }
                          } finally {
                            setConfirmingJobId(null);
                          }
                        }}
                        className="px-3 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        {confirmingJobId === b.id
                          ? "Confirming..."
                          : "Confirm Completion"}
                      </button>
                    )}
                    {["accepted", "en_route", "in_progress"].includes(
                      b.status,
                    ) &&
                      b.merchantId && (
                        <button
                          onClick={() =>
                            setChatJob({
                              id: b.id,
                              name: b.serviceName,
                              merchantId: b.merchantId!,
                            })
                          }
                          className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                          title="Chat with Pro"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}
                    {[
                      "accepted",
                      "en_route",
                      "in_progress",
                      "completed",
                    ].includes(b.status) && (
                      <button
                        onClick={() => setDisputeJobId(b.id)}
                        className="px-3 py-1 text-xs font-semibold bg-error-container text-on-error-container rounded-lg shadow hover:bg-error-container/90 transition"
                      >
                        Raise Dispute
                      </button>
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

                {/* Evidence Review (if disputed) */}
                {b.status === "disputed" &&
                  (b as any).customerDisputeEvidenceText && (
                    <div className="mt-4 pt-4 border-t border-outline-variant bg-error-container/10 p-4 rounded-xl">
                      <h5 className="text-sm font-bold text-error mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> Your Dispute
                        Evidence
                      </h5>
                      <p className="text-sm text-on-surface-variant italic mb-3">
                        "{(b as any).customerDisputeEvidenceText}"
                      </p>
                      {(b as any).customerDisputeEvidenceImages?.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                          {(b as any).customerDisputeEvidenceImages.map(
                            (img: string, i: number) => (
                              <a
                                key={i}
                                href={img}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={img}
                                  alt="Evidence"
                                  className="w-16 h-16 object-cover rounded-lg border border-outline-variant"
                                />
                              </a>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}

      {/* Job Chat Modal */}
      {chatJob && (
        <JobChat
          jobId={chatJob.id}
          jobName={chatJob.name}
          receiverId={chatJob.merchantId}
          onClose={() => setChatJob(null)}
        />
      )}

      {/* Dispute Confirmation Modal */}
      {disputeJobId && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface w-full md:w-1/2 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-error" />
            </div>
            <h3 className="text-lg font-bold text-center text-on-surface mb-2">
              Raise a Dispute?
            </h3>
            <p className="text-sm text-center text-on-surface-variant mb-4 leading-relaxed">
              Are you sure you want to raise a dispute? Please provide evidence
              for your claim.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">
                  Explain the Issue
                </label>
                <textarea
                  value={disputeEvidenceText}
                  onChange={(e) => setDisputeEvidenceText(e.target.value)}
                  placeholder="Describe what went wrong in detail..."
                  className="w-full p-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-error min-h-[100px] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">
                  Upload Photo Evidence (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      uploadToCloudinary(e.target.files);
                      e.target.value = "";
                    }
                  }}
                  className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-error-container file:text-on-error-container hover:file:bg-error-container/90"
                />
                {isUploadingImage && (
                  <p className="text-xs text-error mt-1 animate-pulse">
                    Uploading image...
                  </p>
                )}

                {disputeEvidenceImages.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {disputeEvidenceImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img}
                          alt="Uploaded evidence"
                          className="w-16 h-16 object-cover rounded-lg border border-outline-variant"
                        />
                        <button
                          onClick={() =>
                            setDisputeEvidenceImages((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                          className="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5 shadow-md"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDisputeJobId(null)}
                disabled={isSubmittingDispute}
                className="flex-1 px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDispute(disputeJobId)}
                disabled={
                  isSubmittingDispute ||
                  isUploadingImage ||
                  disputeEvidenceText.trim() === ""
                }
                className="flex-1 px-4 py-2 rounded-xl bg-error text-white font-semibold hover:bg-error/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmittingDispute ? "Submitting..." : "Submit Dispute"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
