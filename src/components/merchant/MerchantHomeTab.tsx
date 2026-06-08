import { Briefcase, Clock, ShieldCheck, ArrowRight, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function MerchantHomeTab({ onTabSwitch }: { onTabSwitch?: (t: string) => void }) {
  const { user } = useSelector((s: RootState) => s.auth);
  const { jobs } = useSelector((s: RootState) => s.jobs);

  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const activeCount  = jobs.filter(j => j.status === 'accepted').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-primary text-on-primary rounded-2xl p-6 md:p-8 flex flex-col gap-4 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold font-display">Welcome back, {user?.name?.split(' ')[0] ?? 'Pro'}!</h2>
          <p className="text-on-primary/80 mt-1">You have {pendingCount} new job requests pending your review.</p>
        </div>
        <div className="flex gap-3 relative z-10 mt-2">
          <button 
            onClick={() => onTabSwitch?.("jobs")} 
            className="bg-on-primary text-primary font-bold py-2.5 px-5 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            <Briefcase className="w-4 h-4" /> View Jobs
          </button>
        </div>
      </div>

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
    </div>
  );
}
