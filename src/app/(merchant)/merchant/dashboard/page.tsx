"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Briefcase, Home, Wallet, User, FolderOpen } from "lucide-react";
import MerchantHomeTab from "@/components/merchant/MerchantHomeTab";
import JobsTab from "@/components/merchant/JobsTab";
import PortfolioTab from "@/components/merchant/PortfolioTab";
import WalletTab from "@/components/dashboard/WalletTab";
import MerchantProfileTab from "@/components/merchant/MerchantProfileTab";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { setFullUser } from "@/lib/features/auth/authSlice";
import { setJobs } from "@/lib/features/jobs/jobsSlice";
import { setListings } from "@/lib/features/portfolio/portfolioSlice";

type Tab = "home" | "jobs" | "portfolio" | "wallet" | "profile";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "home",      label: "Home",      icon: <Home className="w-5 h-5" /> },
  { key: "jobs",      label: "Jobs",      icon: <Briefcase className="w-5 h-5" /> },
  { key: "portfolio", label: "Portfolio", icon: <FolderOpen className="w-5 h-5" /> },
  { key: "wallet",    label: "Wallet",    icon: <Wallet className="w-5 h-5" /> },
  { key: "profile",   label: "Profile",   icon: <User className="w-5 h-5" /> },
];

export default function MerchantDashboard() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<Tab>("home");

  // ── Fetch Profile, Jobs, and Portfolio ONCE when dashboard mounts ────────
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
      } catch (err) { console.error("Failed to load user profile:", err); }
    };

    const loadJobs = async () => {
      try {
        const res = await fetch("/api/jobs/list");
        if (res.ok) {
          const data = await res.json();
          if (data.success) dispatch(setJobs(data.data));
        }
      } catch (err) { console.error("Failed to load jobs:", err); }
    };

    const loadPortfolio = async () => {
      try {
        const res = await fetch("/api/merchant/portfolio");
        if (res.ok) {
          const data = await res.json();
          if (data.success) dispatch(setListings(data.data));
        }
      } catch (err) { console.error("Failed to load portfolio:", err); }
    };

    loadProfile();
    loadJobs();
    loadPortfolio();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "home":      return <MerchantHomeTab onTabSwitch={(t) => setActiveTab(t as Tab)} />;
      case "jobs":      return <JobsTab />;
      case "portfolio": return <PortfolioTab />;
      case "wallet":    return <WalletTab />;
      case "profile":   return <MerchantProfileTab />;
      default:          return <MerchantHomeTab onTabSwitch={(t) => setActiveTab(t as Tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface relative">
      {/* Top Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="font-bold text-primary text-xl">i-help PRO</div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === key
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 p-6 md:p-8 w-full max-w-7xl mx-auto pb-24 md:pb-8">
        {renderTab()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant flex items-center justify-around z-50 px-2 py-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-col items-center justify-center p-1 rounded-lg min-w-[56px] transition-colors ${
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
