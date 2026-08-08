import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-32 pb-16">
        <div className="w-full md:w-1/2 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant p-8">
          <div className="flex justify-center mb-6 items-center gap-2">
            <img
              src="/icon.png"
              alt="myIhelplogo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-primary font-bold text-headline-md tracking-tight">
              myIhelp
            </h1>
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
