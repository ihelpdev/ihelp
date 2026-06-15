"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setFullUser, setInitialized } from "@/lib/features/auth/authSlice";
import { setJobs } from "@/lib/features/jobs/jobsSlice";
import { RootState } from "@/lib/store";

export default function CustomerDataLoader() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);
  const loadingStarted = useRef(false);

  useEffect(() => {
    if (isInitialized || loadingStarted.current) return;
    loadingStarted.current = true;

    const loadData = async () => {
      try {
        const [profileRes, jobsRes] = await Promise.all([
          fetch("/api/profile/me"),
          fetch("/api/jobs/list"),
        ]);

        if (profileRes.status === 401 || profileRes.status === 403) {
          router.replace("/login");
          return;
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success && profileData.user) {
            // Check role mismatch
            if (profileData.user.role === "MERCHANT") {
              router.replace("/merchant/dashboard");
              return;
            }
            dispatch(setFullUser(profileData.user));
          } else {
            router.replace("/login");
            return;
          }
        }

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          if (jobsData.success) {
            dispatch(setJobs(jobsData.data));
          }
        }

        dispatch(setInitialized(true));
      } catch (err) {
        console.error("Failed to load global customer data:", err);
        router.replace("/login");
      }
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, router, dispatch]);

  return null;
}
