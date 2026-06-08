import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm">
      <nav className="flex items-center justify-between px-margin py-md max-w-7xl mx-auto">
        <Link href="/" className="font-headline-lg text-headline-lg font-bold text-primary hover:opacity-80 transition-opacity">i-help</Link>
        <div className="hidden md:flex items-center gap-lg">
          <Link className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="/customer/dashboard">Find Services</Link>
          <Link className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="/explore-subscriptions">Explore Subscriptions</Link>
          <Link className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="/become-a-merchant">Become a Merchant</Link>
          <Link className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="/how-it-works">How it Works</Link>
        </div>
        <div className="flex items-center gap-sm">
          <Link href="/login">
            <button className="text-primary hover:bg-primary/5 px-lg py-sm rounded font-label-lg transition-all duration-150 active:scale-95 border border-primary/20">
              Log In
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-primary text-on-primary px-lg py-sm rounded font-label-lg transition-all duration-150 active:scale-95">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
