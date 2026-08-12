"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { MessageSquare, Briefcase, Clock, CheckCircle2, XCircle } from "lucide-react";
import JobChat from "./JobChat";

interface ChatsTabProps {
  role: "customer" | "merchant";
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:   <Clock className="w-3.5 h-3.5" />,
  accepted:  <CheckCircle2 className="w-3.5 h-3.5" />,
  en_route:  <CheckCircle2 className="w-3.5 h-3.5" />,
  completed: <CheckCircle2 className="w-3.5 h-3.5" />,
  rejected:  <XCircle className="w-3.5 h-3.5" />,
  disputed:  <XCircle className="w-3.5 h-3.5" />,
};

const STATUS_COLOR: Record<string, string> = {
  pending:   "text-amber-600 bg-amber-50",
  accepted:  "text-blue-600 bg-blue-50",
  en_route:  "text-indigo-600 bg-indigo-50",
  completed: "text-emerald-600 bg-emerald-50",
  rejected:  "text-red-600 bg-red-50",
  disputed:  "text-red-600 bg-red-50",
};

export default function ChatsTab({ role }: ChatsTabProps) {
  const { jobs } = useSelector((s: RootState) => s.jobs);
  const { user } = useSelector((s: RootState) => s.auth);

  const [chatJob, setChatJob] = useState<{
    id: string;
    name: string;
    otherId: string;
  } | null>(null);

  // Only show jobs that were initiated (i.e. have a merchantId set — job has been accepted / at least assigned)
  // For customer: show jobs they created that have a merchant
  // For merchant: show jobs assigned to them (accepted or further)
  const chatableJobs = jobs.filter((j) => {
    if (role === "customer") {
      // Jobs the customer created that have a merchant assigned
      return j.customerId === user?.id && j.merchantId;
    } else {
      // Jobs assigned to this merchant
      return j.merchantId === user?.id;
    }
  });

  const otherPartyLabel = role === "customer" ? "Service Pro" : "Customer";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Chats</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Conversations from your job requests.
        </p>
      </div>

      {chatableJobs.length === 0 ? (
        <div className="border border-outline-variant rounded-xl p-12 text-center flex flex-col items-center gap-3 bg-surface-container-lowest">
          <MessageSquare className="w-10 h-10 text-outline" />
          <p className="text-on-surface font-semibold">No conversations yet</p>
          <p className="text-on-surface-variant text-sm max-w-xs">
            Chats are available once a service pro has been assigned to your job request.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {chatableJobs.map((job) => {
            const otherId = role === "customer" ? job.merchantId! : job.customerId;
            const statusKey = job.status?.toLowerCase() ?? "pending";
            return (
              <button
                key={job.id}
                onClick={() =>
                  setChatJob({ id: job.id, name: job.serviceName || "Job", otherId })
                }
                className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors text-left shadow-sm"
              >
                <div className="bg-primary-container text-on-primary-container p-3 rounded-xl shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface truncate">
                    {job.serviceName || "Service Job"}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                    {otherPartyLabel} • {new Date(job.date).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${STATUS_COLOR[statusKey] ?? "text-on-surface-variant bg-surface-container"}`}
                >
                  {STATUS_ICON[statusKey]}
                  <span>{statusKey.replace("_", " ")}</span>
                </div>
                <MessageSquare className="w-5 h-5 text-primary shrink-0" />
              </button>
            );
          })}
        </div>
      )}

      {chatJob && (
        <JobChat
          jobId={chatJob.id}
          jobName={chatJob.name}
          receiverId={chatJob.otherId}
          onClose={() => setChatJob(null)}
        />
      )}
    </div>
  );
}
