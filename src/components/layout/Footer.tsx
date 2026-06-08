import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container-high border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-lg px-margin py-xl max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-sm">
          <div className="font-headline-sm font-black text-primary">i-help</div>
          <p className="text-on-surface-variant font-body-md text-center md:text-left">© 2026 i-help Marketplace. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-xl">
          <a className="text-on-surface-variant font-label-md hover:text-primary underline transition-all duration-200" href="#">Privacy Policy</a> 
          <a className="text-on-surface-variant font-label-md hover:text-primary transition-all duration-200" href="#">Terms of Service</a>
          <a className="text-on-surface-variant font-label-md hover:text-primary transition-all duration-200" href="#">Cookie Policy</a>
          <a className="text-on-surface-variant font-label-md hover:text-primary transition-all duration-200" href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}
