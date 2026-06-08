import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm">
      <nav className="flex items-center justify-between px-margin py-md max-w-7xl mx-auto">
        <Link href="/" className="font-headline-lg text-headline-lg font-bold text-primary hover:opacity-80 transition-opacity">i-help</Link>
        <div className="hidden md:flex items-center gap-lg">
          <a className="text-primary font-bold border-b-2 border-primary pb-1 font-label-lg transition-all duration-200" href="#">Find Services</a>
          <a className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="#">Explore Subscriptions</a>
          <a className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="#">Become a Merchant</a>
          <a className="text-on-secondary-container font-medium font-label-lg hover:text-primary transition-colors duration-200" href="#">How it Works</a>
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
