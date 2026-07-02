"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { logout, setLoggingOut } from "@/lib/features/auth/authSlice";
import { resetJobs } from "@/lib/features/jobs/jobsSlice";
import { resetPortfolio } from "@/lib/features/portfolio/portfolioSlice";
import { RootState } from "@/lib/store";
import Link from "next/link";
import { LogOut, User, Loader2 } from "lucide-react";

export default function MobileUserMenu() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggingOut, setLoggingOutLocal] = useState(false);

  // If no user is loaded, don't show the menu yet
  if (!user) return null;

  const handleLogout = async () => {
    setShowDropdown(false);
    setLoggingOutLocal(true);
    dispatch(setLoggingOut(true));

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      // Clear all slice states
      dispatch(resetJobs());
      dispatch(resetPortfolio());
      dispatch(logout()); // clears auth + resets isInitialized to false
      dispatch(setLoggingOut(false));
      router.replace("/login");
    }
  };

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={loggingOut}
        className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm transition-opacity disabled:opacity-60"
      >
        {loggingOut
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : user?.name?.charAt(0).toUpperCase() || "U"}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-3 border-b border-outline-variant">
              <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
              <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
            </div>
            <Link
              href={user.role === "MERCHANT" ? "/merchant/dashboard" : "/customer/dashboard"}
              onClick={() => setShowDropdown(false)}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium hover:bg-surface-container-low transition-colors"
            >
              <User className="w-4 h-4 text-on-surface-variant" />
              Profile
            </Link>
            <div className="h-px bg-outline-variant my-1" />
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-2 text-left px-4 py-3 text-sm font-medium text-error hover:bg-error/10 transition-colors disabled:opacity-60"
            >
              {loggingOut
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <LogOut className="w-4 h-4" />}
              {loggingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
