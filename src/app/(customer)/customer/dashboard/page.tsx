"use client";

import ExploreTab from "@/components/dashboard/ExploreTab";
import { useRouter } from "next/navigation";

export default function CustomerExplorePage() {
  const router = useRouter();
  
  return <ExploreTab onTabSwitch={(tab) => router.push(`/customer/${tab === 'explore' ? 'dashboard' : tab}`)} />;
}
