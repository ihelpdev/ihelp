"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Compass, Calendar, Wallet, User } from "lucide-react";
import ExploreTab from "@/components/dashboard/ExploreTab";
import RequestTab from "@/components/dashboard/RequestTab";
import WalletTab from "@/components/dashboard/WalletTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { setFullUser } from "@/lib/features/auth/authSlice";
import { setJobs } from "@/lib/features/jobs/jobsSlice";

type Tab = "explore" | "requests" | "wallet" | "profile";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "explore", label: "Explore", icon: <Compass className="w-5 h-5" /> },
  { key: "requests", label: "Requests", icon: <Calendar className="w-5 h-5" /> },
  { key: "wallet", label: "Wallet", icon: <Wallet className="w-5 h-5" /> },
  { key: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
];

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<Tab>("explore");

  // ── Fetch full profile and jobs ONCE when the dashboard mounts ───────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            dispatch(setFullUser(data.user));
          }
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };

    const loadJobs = async () => {
      try {
        const res = await fetch("/api/jobs/list");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            dispatch(setJobs(data.data));
          }
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      }
    };

    loadProfile();
    loadJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "explore":
        return <ExploreTab onTabSwitch={(tab) => setActiveTab(tab as Tab)} />;
      case "requests":
        return <RequestTab />;
      case "wallet":
        return <WalletTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return <ExploreTab onTabSwitch={(tab) => setActiveTab(tab as Tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface relative">
      <main className="flex-1 p-6 md:p-8 w-full max-w-7xl mx-auto pb-24 md:pb-8 flex flex-col gap-6">
        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-wrap items-center gap-2">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === key
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <div className="w-full mt-2">
          {renderTab()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant flex items-center justify-around z-50 px-2 py-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-col items-center justify-center p-1 rounded-lg min-w-[64px] transition-colors ${
              activeTab === key
                ? "text-primary"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <div className={`mb-1 ${activeTab === key ? "bg-primary-container text-on-primary-container rounded-full px-4 py-1" : "px-4 py-1"}`}>
               {icon}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>

      <OnboardingModal />
    </div>
  );
}
