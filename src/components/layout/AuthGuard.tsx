"use client";

import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import GlobalLoader from "./GlobalLoader";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoggingOut = useSelector((state: RootState) => state.auth.isLoggingOut);

  useEffect(() => {
    // Once initialized but not authenticated → send to login immediately
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  // Show loader while sign-out is in progress
  if (isLoggingOut) {
    return <GlobalLoader message="Signing out…" />;
  }

  // Show loader while session is resolving (data loading)
  if (!isInitialized) {
    return <GlobalLoader message="Loading your dashboard…" />;
  }

  // Prevent flash of authenticated content while redirecting unauthenticated users
  if (!isAuthenticated) {
    return <GlobalLoader message="Redirecting…" />;
  }

  return <>{children}</>;
}
