import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm">
      <nav className="flex items-center justify-between px-margin py-md max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/icon.png" alt="myiHelp logo" className="w-8 h-8 object-contain" />
          <span className="font-headline-lg text-headline-lg font-bold text-primary">myiHelp</span>
        </Link>
        <div className="hidden md:flex items-center gap-lg">
          <Link className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="/customer/dashboard">Find Services</Link>
          <Link className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="/explore-subscriptions">Explore Subscriptions</Link>
          <Link className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="/become-a-merchant">Become a Merchant</Link>
          <Link className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="/how-it-works">How it Works</Link>
        </div>
        <div className="flex items-center gap-sm">
          <ThemeToggle />
          <Link href="/login">
            <button className="bg-primary text-on-primary px-lg py-sm rounded font-label-lg transition-all duration-150 active:scale-95 hover:bg-primary/90">
              Log In
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
