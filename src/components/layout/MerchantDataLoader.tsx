"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFullUser } from "@/lib/features/auth/authSlice";
import { setJobs } from "@/lib/features/jobs/jobsSlice";
import { setListings } from "@/lib/features/portfolio/portfolioSlice";

export default function MerchantDataLoader() {
  const dispatch = useDispatch();

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

  return null;
}
