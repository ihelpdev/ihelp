import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <div className="w-50% bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant p-8">
        <div className="flex justify-center mb-6">
          <h1 className="text-primary font-bold text-headline-md tracking-tight">i-help</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
