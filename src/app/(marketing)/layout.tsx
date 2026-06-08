import { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center">
        <h1 className="text-primary font-bold text-headline-md tracking-tight">i-help</h1>
        <nav>
          {/* Navigation items placeholder */}
        </nav>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="w-full py-6 px-6 md:px-12 bg-surface-container text-on-surface-variant text-center">
        <p className="text-body-md">&copy; 2026 i-help. All rights reserved.</p>
      </footer>
    </div>
  );
}
