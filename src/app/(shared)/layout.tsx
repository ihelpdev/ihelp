import { ReactNode } from "react";

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <header className="sticky top-0 z-50 w-full bg-surface-container-lowest border-b border-outline-variant/20 px-6 py-4 flex justify-between items-center">
        <h1 className="text-primary font-bold text-headline-sm">i-help Wallet</h1>
      </header>
      <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
