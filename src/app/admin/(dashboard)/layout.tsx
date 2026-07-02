import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, Briefcase, CreditCard, LayoutList } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline-variant flex flex-col">
        <div className="p-6 border-b border-outline-variant">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-on-primary font-black text-sm">iH</span>
            </div>
            <span className="font-bold text-xl text-primary tracking-tight">Super Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 text-on-surface-variant" /> Dashboard
          </Link>
          <Link href="/admin/services" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface font-medium transition-colors">
            <LayoutList className="w-5 h-5 text-on-surface-variant" /> Services
          </Link>
          <Link href="/admin/subscriptions" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface font-medium transition-colors">
            <CreditCard className="w-5 h-5 text-on-surface-variant" /> Subscriptions
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface font-medium transition-colors">
            <Settings className="w-5 h-5 text-on-surface-variant" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
