import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="pt-24 min-h-screen bg-surface-container-lowest text-on-surface">
      {/* Intro Hero Header */}
      <section className="px-margin py-xl text-center max-w-3xl mx-auto space-y-md">
        <span className="text-primary font-bold tracking-widest text-label-lg uppercase block">
          Trust & Logistics Architecture
        </span>
        <h1 className="font-headline-lg text-headline-xl text-primary font-black tracking-tight leading-none">
          Transparent, Secure, Frictionless.
        </h1>
        <p className="text-on-secondary-container font-body-lg max-w-2xl mx-auto leading-relaxed">
          i-help removes the anxiety of hiring local help. By pairing verified, skilled merchants with automated escrow 
          guarantees, we protect both your hard-earned funds and your home logistics.
        </p>
      </section>

      {/* The Core Operational Engine Timeline */}
      <section className="max-w-4xl mx-auto px-margin relative border-l border-outline-variant ml-margin md:ml-auto space-y-xl pb-xl">
        
        {/* Step 1 */}
        <div className="relative pl-lg group">
          <div className="absolute -left-[13px] top-xs bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-between text-xs font-bold shadow-md">
            <span className="mx-auto">1</span>
          </div>
          <div className="bg-surface-container border border-outline-variant p-md rounded-2xl shadow-sm space-y-2xs">
            <span className="text-3xs uppercase font-bold text-primary tracking-wider">Step 1: Discover & Request</span>
            <h3 className="font-headline-sm text-title-lg font-bold text-primary">Select Your Service Model</h3>
            <p className="text-on-secondary-container text-body-md leading-relaxed">
              Browse through our structural On-Demand Services provided by professional local merchants, or choose a 
              managed structural Subscription Package (Laundry, Car Wash, Housekeeping) to run automatically on your chosen schedule.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative pl-lg group">
          <div className="absolute -left-[13px] top-xs bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-between text-xs font-bold shadow-md">
            <span className="mx-auto">2</span>
          </div>
          <div className="bg-surface-container border border-outline-variant p-md rounded-2xl shadow-sm space-y-2xs">
            <span className="text-3xs uppercase font-bold text-primary tracking-wider">Step 2: Instant Escrow Hold</span>
            <h3 className="font-headline-sm text-title-lg font-bold text-primary">Your Cash is Safe and Protected</h3>
            <p className="text-on-secondary-container text-body-md leading-relaxed">
              When you request an item, the required fee transitions from your active wallet into an insulated Escrow Vault. 
              The merchant can see that the payout is fully funded and guaranteed, but the funds remain securely locked until the assignment finishes.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative pl-lg group">
          <div className="absolute -left-[13px] top-xs bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-between text-xs font-bold shadow-md">
            <span className="mx-auto">3</span>
          </div>
          <div className="bg-surface-container border border-outline-variant p-md rounded-2xl shadow-sm space-y-2xs">
            <span className="text-3xs uppercase font-bold text-primary tracking-wider">Step 3: Real-Time Sync</span>
            <h3 className="font-headline-sm text-title-lg font-bold text-primary">Merchants Manage via the Jobs Portal</h3>
            <p className="text-on-secondary-container text-body-md leading-relaxed">
              The service request directly routes right onto the designated merchant's Jobs Tab. Merchants retain total flexibility 
              to accept or reject tasks. Once a job state transitions to "accepted," you are paired instantly and receive progress metrics.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="relative pl-lg group">
          <div className="absolute -left-[13px] top-xs bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-between text-xs font-bold shadow-md">
            <span className="mx-auto">4</span>
          </div>
          <div className="bg-surface-container border border-outline-variant p-md rounded-2xl shadow-sm space-y-2xs">
            <span className="text-3xs uppercase font-bold text-primary tracking-wider">Step 4: Complete & Release</span>
            <h3 className="font-headline-sm text-title-lg font-bold text-primary">Seamless Service Offboarding</h3>
            <p className="text-on-secondary-container text-body-md leading-relaxed">
              Once the merchant completes the physical task, they trigger the "Complete" action inside their console. The app updates your 
              Request Tab, releases the vault escrow funds straight to the merchant's withdrawable balance, and triggers transparency reviews.
            </p>
          </div>
        </div>

      </section>

      {/* Trust & Verification Protocol Summary Cards */}
      <section className="bg-surface-container-low border-t border-b border-outline-variant py-xl px-margin mb-xl">
        <div className="max-w-5xl mx-auto text-center space-y-lg">
          <h2 className="font-headline-sm text-title-xl font-bold text-primary">Our 3-Tier Security Framework</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md text-left">
            <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-2xs">
              <div className="text-title-lg mb-xs">🔒</div>
              <h4 className="font-bold text-primary mb-2xs">Zero-Risk Payments</h4>
              <p className="text-label-md text-on-secondary-container">Merchants are only deployed once your wallet funds are escrow-verified. No cash hassles, no price spikes.</p>
            </div>
            <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-2xs">
              <div className="text-title-lg mb-xs">🛡️</div>
              <h4 className="font-bold text-primary mb-2xs">Vetted Artisans</h4>
              <p className="text-label-md text-on-secondary-container">Every active merchant passes standard background verifications, identity validation checks, and operational training trials.</p>
            </div>
            <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-2xs">
              <div className="text-title-lg mb-xs">📉</div>
              <h4 className="font-bold text-primary mb-2xs">Accountability Scores</h4>
              <p className="text-label-md text-on-secondary-container">Merchants who reject tasks excessively or receive poor quality indicators lose tier positioning and visibility weight.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Block */}
      <section className="text-center pb-xl space-y-sm">
        <h3 className="font-headline-sm text-title-lg text-primary font-bold">Ready to experience effortless logistics?</h3>
        <div className="flex gap-sm justify-center">
          <Link href="/register">
            <button className="bg-primary text-on-primary px-lg py-sm rounded font-label-lg transition-all duration-150 active:scale-95 shadow-sm">
              Create Free Account
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}