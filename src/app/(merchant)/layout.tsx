import { ReactNode } from "react";
import MobileUserMenu from "@/components/layout/MobileUserMenu";
import MerchantNav from "@/components/layout/MerchantNav";
import MerchantDataLoader from "@/components/layout/MerchantDataLoader";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import AuthGuard from "@/components/layout/AuthGuard";
import NotificationsDropdown from "@/components/layout/NotificationsDropdown";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface relative">
      <MerchantDataLoader />
      <AuthGuard>
        <header className="sticky top-0 z-50 w-full bg-surface-container-low/80 backdrop-blur-md px-4 md:px-6 py-4 flex items-center border-b border-outline-variant">
          
          <MerchantNav />

          <h1 className="text-primary font-bold text-headline-sm flex-shrink-0 ml-2 md:ml-0 md:mr-4 lg:mr-8 md:order-first">
            i-help <span className="text-sm font-normal text-on-surface-variant ml-2 hidden sm:inline">Merchant</span>
          </h1>

          <div className="ml-auto flex items-center gap-2 md:gap-4 order-last">
            <ThemeToggle />
            <NotificationsDropdown />
            <MobileUserMenu />
          </div>
        </header>
        <main className="p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col">
          <div className="w-full mt-2">
            {children}
          </div>
        </main>
        <OnboardingModal />
      </AuthGuard>
    </div>
  );
}
