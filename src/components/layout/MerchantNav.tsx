"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Home, Wallet, User, FolderOpen, MessageSquare } from "lucide-react";

const DESKTOP_TABS = [
  { href: "/merchant/dashboard", label: "Home",      icon: <Home className="w-5 h-5" /> },
  { href: "/merchant/jobs",      label: "Jobs",      icon: <Briefcase className="w-5 h-5" /> },
  { href: "/merchant/chats",     label: "Chats",     icon: <MessageSquare className="w-5 h-5" /> },
  { href: "/merchant/portfolio", label: "Portfolio", icon: <FolderOpen className="w-5 h-5" /> },
  { href: "/merchant/wallet",    label: "Wallet",    icon: <Wallet className="w-5 h-5" /> },
  { href: "/merchant/profile",   label: "Profile",   icon: <User className="w-5 h-5" /> },
];

const MOBILE_TABS = [
  { href: "/merchant/dashboard", label: "Home",      icon: <Home className="w-5 h-5" /> },
  { href: "/merchant/jobs",      label: "Jobs",      icon: <Briefcase className="w-5 h-5" /> },
  { href: "/merchant/chats",     label: "Chats",     icon: <MessageSquare className="w-5 h-5" /> },
  { href: "/merchant/portfolio", label: "Portfolio", icon: <FolderOpen className="w-5 h-5" /> },
  { href: "/merchant/wallet",    label: "Wallet",    icon: <Wallet className="w-5 h-5" /> },
  { href: "/merchant/profile",   label: "Profile",   icon: <User className="w-5 h-5" /> },
];

export function MerchantDesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-1 items-center gap-1 lg:gap-2 px-2 overflow-x-auto no-scrollbar">
      {DESKTOP_TABS.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              isActive
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {icon}
            <span className="hidden lg:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MerchantMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant pb-safe z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {MOBILE_TABS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? "text-primary font-bold" : "text-on-surface-variant font-medium hover:text-on-surface"
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
                {icon}
              </div>
              <span className="text-[10px] leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
