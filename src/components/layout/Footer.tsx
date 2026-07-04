import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container-high border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-lg px-margin py-xl max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-sm">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="i-help logo" className="w-8 h-8 object-contain" />
            <div className="font-headline-sm font-black text-primary">i-help</div>
          </div>
          <p className="text-on-surface-variant font-body-md text-center md:text-left">© 2026 i-help Marketplace. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-xl">
          <Link className="text-on-surface-variant font-label-md hover:text-primary transition-all duration-200" href="/customer/dashboard">Find Services</Link>
          <Link className="text-on-surface-variant font-label-md hover:text-primary transition-all duration-200" href="/explore-subscriptions">Explore Subscriptions</Link>
          <Link className="text-on-surface-variant font-label-md hover:text-primary transition-all duration-200" href="/become-a-merchant">Become a Merchant</Link>
          <Link className="text-on-surface-variant font-label-md hover:text-primary transition-all duration-200" href="/how-it-works">How it Works</Link>
          <div className="w-px h-4 bg-outline-variant hidden md:block"></div>
          <Link className="text-on-surface-variant font-label-md hover:text-primary transition-all duration-200" href="/privacy-policy">Privacy Policy</Link>
          <Link className="text-on-surface-variant font-label-md hover:text-primary transition-all duration-200" href="/terms-and-conditions">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
