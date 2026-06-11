"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/lib/features/auth/authSlice";
import { RootState } from "@/lib/store";

export default function MobileUserMenu() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);

  // If no user is loaded, don't show the menu yet
  if (!user) return null;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    dispatch(logout());
    router.push("/");
  };

  const handleProfileClick = () => {
    // If the app had a dedicated /profile route, we'd go there.
    // Since profile is a tab on the dashboard, we navigate to dashboard.
    const dashPath = user.role === "MERCHANT" ? "/merchant/dashboard" : "/customer/dashboard";
    if (pathname !== dashPath) {
      router.push(dashPath);
    }
    setShowDropdown(false);
  };

  return (
    <div className="md:hidden relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm"
      >
        {user?.name?.charAt(0).toUpperCase() || "U"}
      </button>
      
      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-1 z-50">
            <button 
              onClick={handleProfileClick}
              className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-surface-container-low transition-colors"
            >
              Profile
            </button>
            <div className="h-px bg-outline-variant my-1" />
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm font-medium text-error hover:bg-error/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
