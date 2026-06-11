"use client";

import MerchantHomeTab from "@/components/merchant/MerchantHomeTab";
import { useRouter } from "next/navigation";

export default function MerchantHomePage() {
  const router = useRouter();
  
  return <MerchantHomeTab onTabSwitch={(tab) => router.push(`/merchant/${tab === 'home' ? 'dashboard' : tab}`)} />;
}
