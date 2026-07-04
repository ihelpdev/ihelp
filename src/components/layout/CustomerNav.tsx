"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Calendar, Wallet, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const TABS = [
  { href: "/customer/dashboard", label: "Explore", icon: <Compass className="w-5 h-5" /> },
  { href: "/customer/requests", label: "Requests", icon: <Calendar className="w-5 h-5" /> },
  { href: "/customer/wallet", label: "Wallet", icon: <Wallet className="w-5 h-5" /> },
  { href: "/customer/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
];

export default function CustomerNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden p-2 -ml-2 text-on-surface"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Nav */}
      <nav className="hidden md:flex flex-1 items-center gap-1 lg:gap-2 px-2 overflow-x-auto no-scrollbar">
        {TABS.map(({ href, label, icon }) => {
          const isActive = pathname === href || (href === "/customer/dashboard" && pathname === "/customer/explore");
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

      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 h-[100dvh] w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col z-50 transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
         <div className="p-4 border-b border-outline-variant flex justify-between items-center">
            <span className="font-bold text-lg text-primary">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg">
               <X className="w-5 h-5" />
            </button>
         </div>
         <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
           {TABS.map(({ href, label, icon }) => {
             const isActive = pathname === href || (href === "/customer/dashboard" && pathname === "/customer/explore");
             return (
               <Link 
                 key={href}
                 href={href}
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                   isActive 
                     ? "bg-primary/10 text-primary" 
                     : "hover:bg-surface-container text-on-surface"
                 }`}
               >
                 <div className={isActive ? "text-primary" : "text-on-surface-variant"}>{icon}</div>
                 {label}
               </Link>
             );
           })}
         </nav>
      </aside>
    </>
  );
}
