"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setFullUser, setInitialized } from "@/lib/features/auth/authSlice";
import { setJobs } from "@/lib/features/jobs/jobsSlice";
import { setListings } from "@/lib/features/portfolio/portfolioSlice";
import { RootState } from "@/lib/store";

export default function MerchantDataLoader() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);
  const loadingStarted = useRef(false);

  useEffect(() => {
    if (isInitialized || loadingStarted.current) return;
    loadingStarted.current = true;

    const loadData = async () => {
      try {
        const [profileRes, jobsRes, portfolioRes] = await Promise.all([
          fetch("/api/profile/me"),
          fetch("/api/jobs/list"),
          fetch("/api/merchant/portfolio"),
        ]);

        if (profileRes.status === 401 || profileRes.status === 403) {
          router.replace("/login");
          return;
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success && profileData.user) {
            // Check role mismatch
            if (profileData.user.role === "CUSTOMER") {
              router.replace("/customer/dashboard");
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
          if (jobsData.success) dispatch(setJobs(jobsData.data));
        }

        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json();
          if (portfolioData.success) dispatch(setListings(portfolioData.data));
        }

        dispatch(setInitialized(true));
      } catch (err) {
        console.error("Failed to load global merchant data:", err);
        router.replace("/login");
      }
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, router, dispatch]);

  return null;
}
