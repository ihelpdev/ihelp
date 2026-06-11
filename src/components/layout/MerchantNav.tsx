"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Home, Wallet, User, FolderOpen, Compass } from "lucide-react";

const TABS = [
  { href: "/merchant/dashboard", label: "Home",      icon: <Home className="w-5 h-5" /> },
  { href: "/merchant/jobs",      label: "Jobs",      icon: <Briefcase className="w-5 h-5" /> },
  { href: "/merchant/portfolio", label: "Portfolio", icon: <FolderOpen className="w-5 h-5" /> },
  { href: "/merchant/explore",   label: "Explore",   icon: <Compass className="w-5 h-5" /> },
  { href: "/merchant/wallet",    label: "Wallet",    icon: <Wallet className="w-5 h-5" /> },
  { href: "/merchant/profile",   label: "Profile",   icon: <User className="w-5 h-5" /> },
];

export default function MerchantNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex flex-wrap items-center gap-2 mb-6">
        {TABS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant flex items-center justify-around z-50 px-2 py-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center p-1 rounded-lg min-w-[56px] transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <div className={`mb-1 ${isActive ? "bg-primary-container text-on-primary-container rounded-full px-4 py-1" : "px-4 py-1"}`}>
                 {icon}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
