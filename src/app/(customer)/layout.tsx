import { ReactNode } from "react";
import MobileUserMenu from "@/components/layout/MobileUserMenu";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-50 w-full bg-surface-container-low/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-primary font-bold text-headline-sm">i-help</h1>
        <MobileUserMenu />
      </header>
      <main className="p-6 max-w-4xl mx-auto">
        {children}
      </main>
      {/* Bottom navigation bar placeholder for mobile */}
    </div>
  );
}
