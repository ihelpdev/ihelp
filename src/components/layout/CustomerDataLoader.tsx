"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFullUser } from "@/lib/features/auth/authSlice";
import { setJobs } from "@/lib/features/jobs/jobsSlice";

export default function CustomerDataLoader() {
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

  return null;
}
