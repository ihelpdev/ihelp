"use client";

import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import GlobalLoader from "./GlobalLoader";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);

  if (!isInitialized) {
    return <GlobalLoader />;
  }

  return <>{children}</>;
}
