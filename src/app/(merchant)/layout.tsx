import { ReactNode } from "react";
import MobileUserMenu from "@/components/layout/MobileUserMenu";
import MerchantNav from "@/components/layout/MerchantNav";
import MerchantDataLoader from "@/components/layout/MerchantDataLoader";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import AuthGuard from "@/components/layout/AuthGuard";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface relative">
      <MerchantDataLoader />
      <AuthGuard>
        <header className="sticky top-0 z-50 w-full bg-surface-container-low/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-primary font-bold text-headline-sm">i-help <span className="text-sm font-normal text-on-surface-variant ml-2">Merchant</span></h1>
          <MobileUserMenu />
        </header>
        <main className="p-6 md:p-8 w-full max-w-7xl mx-auto pb-24 md:pb-8 flex flex-col">
          <MerchantNav />
          <div className="w-full mt-2">
            {children}
          </div>
        </main>
        <OnboardingModal />
      </AuthGuard>
    </div>
  );
}
