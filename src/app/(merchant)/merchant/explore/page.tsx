"use client";

import ExploreTab from "@/components/dashboard/ExploreTab";
import { useRouter } from "next/navigation";

export default function MerchantExplorePage() {
  const router = useRouter();
  
  return <ExploreTab onTabSwitch={(tab) => router.push(`/merchant/${tab === 'explore' ? 'dashboard' : tab}`)} />;
}
