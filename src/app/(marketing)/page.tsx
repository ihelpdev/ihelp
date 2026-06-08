import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
      <main className="pt-24 overflow-x-hidden flex-1">
        {/* Section 1: Hero */}
        <section className="relative px-margin py-xl lg:py-48 flex flex-col items-center text-center max-w-7xl mx-auto">
          <h1 className="font-black text-5xl md:text-7xl text-primary max-w-4xl tracking-tighter leading-[1.1] mb-lg">
            Reliable Local Services, Handled by Vetted Professionals.
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mb-xl text-lg md:text-xl">
            Book certified artisans on-demand or subscribe to automated home chores. Safe, escrow-protected, and vetted by our internal agents.
          </p>
          <div className="flex flex-col md:flex-row gap-md w-full md:w-auto mb-32">
            <Link href="/register?role=customer">
              <button className="w-full bg-primary text-on-primary px-xl py-lg rounded-xl font-headline-sm shadow-lg hover:shadow-xl transition-all active:scale-95">
                Find a Service Pro Now
              </button>
            </Link>
            <Link href="/register?role=merchant">
              <button className="w-full mt-4 md:mt-0 bg-surface-container-lowest text-primary border border-primary px-xl py-lg rounded-xl font-headline-sm hover:bg-surface-container transition-all active:scale-95">
                Join as a Merchant & Earn
              </button>
            </Link>
          </div>
          
          {/* Abstract UI Mockup */}
          <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] bg-surface-container-low rounded-3xl overflow-hidden shadow-2xl border border-outline-variant">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 grid grid-cols-12 gap-md p-lg">
              {/* Profile Card */}
              <div className="col-span-5 bg-white/70 backdrop-blur-md border border-white/30 p-lg rounded-2xl shadow-xl flex flex-col items-start gap-md">
                <div className="flex items-center gap-md w-full">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-outline-variant">
                    <img className="w-full h-full object-cover" alt="Professional artisan portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyd3zGafujD5cr-2rsnbQS845B_9lzp7vhxVOs8_efXMZGqOYZvRhZz_euImsnPd1fML3J5G7kbUwpj7ABwlxVVbqhpjuDTGBbHhvUpF4gOMScHK-xP9fxigP2uqyUD5R78TS44smm0dz5w1RWDVRWwbsOVXJxrtkcd5_s8yZY19tjocmFAXn_9CoMxSpMXK54yulychG0V6i_QF3bZD2fNIYOKC4F5PMp7f7IKaN-90fYePa54AhMYbTscE8om7paXNIhNtJpCbY"/>
                  </div>
                  <div>
                    <div className="font-headline-sm text-primary">Samuel O.</div>
                    <div className="font-label-md text-on-surface-variant">Master Electrician</div>
                  </div>
                </div>
                <div className="flex items-center gap-sm bg-surface-container-lowest px-md py-xs rounded-full border border-outline-variant">
                  <span className="material-symbols-outlined text-tertiary-container text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="font-label-lg font-bold">4.9</span>
                  <span className="text-on-surface-variant font-label-md">(124 Jobs)</span>
                </div>
              </div>
              
              {/* Status/Escrow Card */}
              <div className="col-start-8 col-span-5 bg-white/70 backdrop-blur-md border border-white/30 p-lg rounded-2xl shadow-xl mt-xl flex flex-col gap-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-lg text-on-surface-variant">Transaction Security</span>
                  <span className="material-symbols-outlined text-tertiary-container" style={{fontVariationSettings: "'FILL' 1"}}>lock</span>
                </div>
                <div className="h-1 w-full bg-outline-variant rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-container w-3/4"></div>
                </div>
                <div className="text-primary font-bold font-headline-sm mt-xs">Escrow Active</div>
                <div className="text-on-surface-variant font-label-md">NGN 12,500 held in secure vault</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Value Matrix */}
        <section className="bg-surface-container px-margin py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="font-headline-lg text-4xl text-primary mb-md">Why Choose i-help?</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
              {/* Seekers */}
              <div className="space-y-md">
                <div className="flex items-center gap-md mb-lg">
                  <div className="bg-primary p-md rounded-xl">
                    <span className="material-symbols-outlined text-on-primary text-3xl">person_search</span>
                  </div>
                  <h3 className="font-headline-md text-primary">For Service Seekers</h3>
                </div>
                <div className="grid grid-cols-1 gap-md">
                  <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-primary transition-colors flex items-start gap-md">
                    <span className="material-symbols-outlined text-primary">verified</span>
                    <div>
                      <h4 className="font-headline-sm mb-xs">Dual-Layer Ratings</h4>
                      <p className="text-on-surface-variant font-body-md">Peer reviews backed by physical audit reports from i-help agents.</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-primary transition-colors flex items-start gap-md">
                    <span className="material-symbols-outlined text-primary">security</span>
                    <div>
                      <h4 className="font-headline-sm mb-xs">Escrow Protection</h4>
                      <p className="text-on-surface-variant font-body-md">Payment is only released when you confirm the job is 100% complete.</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-primary transition-colors flex items-start gap-md">
                    <span className="material-symbols-outlined text-primary">emergency</span>
                    <div>
                      <h4 className="font-headline-sm mb-xs">Emergency Dispatch</h4>
                      <p className="text-on-surface-variant font-body-md">Get a technician on-site in under 45 minutes for urgent repairs.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Merchants */}
              <div className="space-y-md">
                <div className="flex items-center gap-md mb-lg">
                  <div className="bg-tertiary-container p-md rounded-xl">
                    <span className="material-symbols-outlined text-on-tertiary text-3xl">storefront</span>
                  </div>
                  <h3 className="font-headline-md text-tertiary-container">For Skilled Merchants</h3>
                </div>
                <div className="grid grid-cols-1 gap-md">
                  <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-tertiary-container transition-colors flex items-start gap-md">
                    <span className="material-symbols-outlined text-tertiary-container">payments</span>
                    <div>
                      <h4 className="font-headline-sm mb-xs">Keep 100% of Base Rate</h4>
                      <p className="text-on-surface-variant font-body-md">We only charge a small platform fee on top, never from your pocket.</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-tertiary-container transition-colors flex items-start gap-md">
                    <span className="material-symbols-outlined text-tertiary-container">calendar_month</span>
                    <div>
                      <h4 className="font-headline-sm mb-xs">Managed Flex Gigs</h4>
                      <p className="text-on-surface-variant font-body-md">Control your own schedule with our smart-matching availability engine.</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-tertiary-container transition-colors flex items-start gap-md">
                    <span className="material-symbols-outlined text-tertiary-container">account_balance_wallet</span>
                    <div>
                      <h4 className="font-headline-sm mb-xs">Instant Omni-Wallet</h4>
                      <p className="text-on-surface-variant font-body-md">Cash out your earnings instantly to any local bank or mobile money.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Catalog */}
        <section className="px-margin py-32 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-headline-lg text-primary">Popular On-Demand Services</h2>
              <p className="text-on-surface-variant font-body-lg">Top-rated artisans ready to help today.</p>
            </div>
            <button className="text-primary font-label-lg flex items-center gap-xs hover:gap-sm transition-all">
              View all categories <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
            {/* Card 1: Plumbing */}
            <div className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 cursor-pointer">
              <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-3xl">plumbing</span>
              </div>
              <h3 className="font-headline-md text-primary mb-sm">Plumbing</h3>
              <p className="text-on-surface-variant font-body-md mb-xl">Leak repairs, pipe installations, and bathroom fittings.</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="bg-surface-container px-sm py-xs rounded font-label-md text-primary">From NGN 4,500/hr</span>
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-primary">add_circle</span>
              </div>
            </div>
            
            {/* Card 2: Electrical */}
            <div className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 cursor-pointer">
              <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-3xl">electrical_services</span>
              </div>
              <h3 className="font-headline-md text-primary mb-sm">Electrical</h3>
              <p className="text-on-surface-variant font-body-md mb-xl">Fault finding, wiring, and appliance installation.</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="bg-surface-container px-sm py-xs rounded font-label-md text-primary">From NGN 5,000/hr</span>
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-primary">add_circle</span>
              </div>
            </div>
            
            {/* Card 3: Car Repair */}
            <div className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 cursor-pointer">
              <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-3xl">car_repair</span>
              </div>
              <h3 className="font-headline-md text-primary mb-sm">Car Repairs</h3>
              <p className="text-on-surface-variant font-body-md mb-xl">On-site mechanics for maintenance and emergency fixes.</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="bg-surface-container px-sm py-xs rounded font-label-md text-primary">From NGN 7,500/hr</span>
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-primary">add_circle</span>
              </div>
            </div>
            
            {/* Card 4: Cleaning */}
            <div className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 cursor-pointer">
              <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-3xl">cleaning_services</span>
              </div>
              <h3 className="font-headline-md text-primary mb-sm">Deep Home Cleaning</h3>
              <p className="text-on-surface-variant font-body-md mb-xl">Professional sanitation for homes and office spaces.</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="bg-surface-container px-sm py-xs rounded font-label-md text-primary">From NGN 10,000/visit</span>
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-primary">add_circle</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Subscriptions */}
        <section className="bg-inverse-surface text-on-primary-fixed-variant px-margin py-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
            <div>
              <h2 className="font-headline-lg text-5xl text-surface-bright mb-lg">Put Your Household Chores on Autopilot</h2>
              <p className="font-body-lg text-primary-fixed-dim mb-xl text-lg opacity-80">
                Stop worrying about recurring tasks. Subscribe to a weekly or monthly plan and we'll handle the scheduling, merchant selection, and quality control automatically.
              </p>
              <div className="flex flex-col gap-md">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim">check_circle</span>
                  <span className="font-body-md text-white">Fixed monthly pricing, no hidden fees</span>
                </div>
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim">check_circle</span>
                  <span className="font-body-md text-white">Priority access to top-rated merchants</span>
                </div>
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim">check_circle</span>
                  <span className="font-body-md text-white">Cancel or pause subscriptions any time</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
              {/* Subscription Card */}
              <div className="relative bg-surface-container-lowest p-xl rounded-3xl shadow-2xl border border-outline/20">
                <div className="flex items-center justify-between mb-xl">
                  <div>
                    <h4 className="font-headline-md text-primary">Monthly Laundry Subscription</h4>
                    <p className="text-on-surface-variant font-label-md">Active Plan: Premium Wash & Fold</p>
                  </div>
                  <div className="bg-tertiary-container/10 text-tertiary-container px-md py-xs rounded-full font-bold text-xs uppercase tracking-wider">Active</div>
                </div>
                <div className="bg-surface-container-low p-lg rounded-2xl mb-xl border border-outline-variant">
                  <div className="flex items-center justify-between mb-sm">
                    <span className="font-label-lg text-primary">Next Pickup</span>
                    <span className="font-bold text-primary">tomorrow at 4:00 PM</span>
                  </div>
                  <div className="flex items-center gap-md p-sm bg-white rounded-xl shadow-sm">
                    <img className="w-10 h-10 rounded-full object-cover" alt="Merchant portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQjSzr5rnwzcfzxwDpJvaJLD3aroMOz_kOs8N1Jv88Zjn-7Py9ZizNdIrMmeMMAdlKQhiz4T52odfnnLYmcgHhMGRkicncoy9dVnObgXsuH_lz1VCLpA8ja-od0P6g_P5qgsUzUezYIbXeg-sEo7R8jBPNGfDqexHKniV0P4P0BahIobdUskBK_gbnNVdDiEyZRO5egoOuIh8j3pWtzoWsG88b5Zn2q9dKA6d1JLG94dT6Z2qpI2fz8NFMaz8FXECjVxYhT-pp7iE"/>
                    <div>
                      <div className="font-label-lg text-primary">Bisi A.</div>
                      <div className="text-on-surface-variant font-label-md">Verified Merchant</div>
                    </div>
                    <div className="ml-auto flex items-center gap-xs">
                      <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      <span className="font-bold text-on-surface">4.8</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-primary text-on-primary py-lg rounded-xl font-headline-sm hover:brightness-110 transition-all">
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Trust Pipeline */}
        <section className="px-margin py-32 max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-headline-lg text-primary mb-md">Our Vetting Process</h2>
            <p className="text-on-surface-variant font-body-lg">We take reliability seriously so you don't have to.</p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-xl">
            {/* Connective Line (Desktop Only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mb-lg shadow-xl ring-8 ring-background">
                <span className="material-symbols-outlined text-3xl">fingerprint</span>
              </div>
              <h3 className="font-headline-sm text-primary mb-sm">1. Multi-Tier KYC Validation</h3>
              <p className="text-on-surface-variant font-body-md px-lg">Strict government ID verification and background checks for every registered merchant.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mb-lg shadow-xl ring-8 ring-background">
                <span className="material-symbols-outlined text-3xl">groups</span>
              </div>
              <h3 className="font-headline-sm text-primary mb-sm">2. Physical Agent Curation</h3>
              <p className="text-on-surface-variant font-body-md px-lg">Our physical agents visit merchant workspaces to verify skill level and tool quality.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mb-lg shadow-xl ring-8 ring-background">
                <span className="material-symbols-outlined text-3xl">account_balance</span>
              </div>
              <h3 className="font-headline-sm text-primary mb-sm">3. Transparent Escrow Engine</h3>
              <p className="text-on-surface-variant font-body-md px-lg">An automated payment system that holds funds safely until you sign off on the work.</p>
            </div>
          </div>
        </section>

        {/* Section 6: Footer CTA */}
        <section className="px-margin py-32 max-w-7xl mx-auto">
          <div className="bg-primary rounded-[32px] p-xl md:p-32 text-center text-on-primary overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/40 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center gap-xl">
              <h2 className="font-headline-lg text-4xl md:text-6xl max-w-4xl tracking-tight">Ready to get things done?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg w-full max-w-4xl mt-xl">
                <div className="bg-white/10 backdrop-blur-md p-xl rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
                  <p className="font-body-lg mb-lg">Need a pro for a project?</p>
                  <Link href="/register?role=customer">
                    <button className="w-full bg-white text-primary py-lg rounded-xl font-headline-sm shadow-xl hover:scale-105 transition-all">
                      Create Your Free Customer Account
                    </button>
                  </Link>
                </div>
                <div className="bg-tertiary-container p-xl rounded-2xl border border-white/10 hover:brightness-110 transition-all">
                  <p className="font-body-lg mb-lg text-white">Want to monetize your skills?</p>
                  <Link href="/register?role=merchant">
                    <button className="w-full bg-white text-tertiary-container py-lg rounded-xl font-headline-sm shadow-xl hover:scale-105 transition-all">
                      Register as an i-help Merchant
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
