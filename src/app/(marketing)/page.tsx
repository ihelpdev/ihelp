import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowRight, BadgeCheck, Star, Lock, Search, Shield, Siren, Store, Banknote, Calendar, Wallet, Wrench, PlusCircle, Zap, Car, Sparkles, CheckCircle2, Fingerprint, Users, Landmark } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="pt-12 overflow-x-hidden flex-1 bg-background">
      {/* Section 1: Hero */}
      <section className="relative px-margin py-12  max-w-7xl mx-auto">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-tertiary-container/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text Content & CTAs */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:col-span-6 xl:col-span-5 space-y-6">
            {/* Trust Micro-Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full backdrop-blur-sm animate-fade-in">
              <ShieldCheck className="text-primary text-sm font-bold" />
              <span className="text-primary font-medium text-xs tracking-wide uppercase">100% Vetted & Guarded by Escrow</span>
            </div>

            <h1 className="font-black text-4xl md:text-6xl text-primary tracking-tighter leading-[1.05]">
              Reliable Local Services, Handled by <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Vetted Pros.</span>
            </h1>
            
            <p className="font-body-lg text-on-surface-variant  text-base md:text-lg leading-relaxed">
              Book certified artisans on-demand or subscribe to automated home chores. Safe, escrow-protected, and physically audited by our internal agents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <Link href="/register?role=customer" className="w-full sm:w-auto">
                <button className="w-full bg-primary text-on-primary px-8 py-4 rounded-xl font-headline-sm shadow-md hover:shadow-xl hover:bg-primary/95 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  <span>Find a Service Pro Now</span>
                  <ArrowRight className="text-sm" />
                </button>
              </Link>
              <Link href="/register?role=merchant" className="w-full sm:w-auto">
                <button className="w-full bg-surface-container-lowest text-primary border border-primary/30 px-8 py-4 rounded-xl font-headline-sm hover:bg-surface-container-low hover:border-primary transition-all active:scale-[0.98]">
                  Join as a Merchant & Earn
                </button>
              </Link>
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex items-center gap-6 pt-6 border-t border-outline-variant/60 w-full justify-center lg:justify-start">
              <div>
                <div className="text-2xl font-black text-primary">45 Mins</div>
                <div className="text-xs text-on-surface-variant">Avg. Response Time</div>
              </div>
              <div className="h-8 w-px bg-outline-variant/60"></div>
              <div>
                <div className="text-2xl font-black text-primary">Verified</div>
                <div className="text-xs text-on-surface-variant">Physical Agent Audit</div>
              </div>
            </div>
          </div>

          {/* Right Column: Abstract Interactive UI Mockup */}
          <div className="lg:col-span-6 xl:col-span-7 relative w-full flex justify-center items-center">
            {/* Visual Anchor Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-tertiary-container/10 rounded-3xl filter blur-xl transform scale-95 -z-10"></div>
            
            <div className="relative w-full max-w-2xl aspect-[4/3] sm:aspect-[16/10] bg-surface-container-low rounded-3xl overflow-hidden shadow-2xl border border-outline-variant p-6 sm:p-8 flex flex-col justify-between">
              {/* Mockup Header/App bar simulation */}
              <div className="flex items-center justify-between w-full pb-4 border-b border-outline-variant/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/40"></div>
                  <div className="w-3 h-3 rounded-full bg-tertiary-container/40"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                </div>
                <div className="bg-surface-container px-4 py-1 rounded-lg text-xs text-on-surface-variant font-mono">i-help.ng/dashboard</div>
              </div>

              {/* Dynamic Grid Contents */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-auto relative z-10">
                {/* Profile Card */}
                <div className="sm:col-span-7 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-white/40 dark:border-white/10 p-5 rounded-2xl shadow-xl flex flex-col items-start gap-4 transform hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-outline-variant relative flex-shrink-0">
                      <Image 
                        className="object-cover" 
                        alt="Professional artisan portrait" 
                        src="https://www.shutterstock.com/image-photo/handsome-young-african-man-head-600nw-2258228929.jpg"
                        fill
                        sizes="56px"
                        priority
                      />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-primary flex items-center gap-1.5">
                        <span>Samuel O.</span>
                        <BadgeCheck className="text-primary text-base font-bold" />
                      </div>
                      <div className="text-sm text-white">Master Electrician</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant w-full justify-between sm:w-auto">
                    <div className="flex items-center gap-1">
                      <Star className="text-amber-500 text-sm fill-current" />
                      <span className="font-bold text-sm">4.9</span>
                    </div>
                    <span className="text-on-surface-variant text-xs">(124 Jobs Completed)</span>
                  </div>
                </div>
                
                {/* Status/Escrow Card */}
                <div className="sm:col-span-5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-white/40 dark:border-white/10 p-5 rounded-2xl shadow-xl sm:mt-8 flex flex-col gap-3 transform hover:-translate-y-1 transition-transform">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Security Engine</span>
                    <Lock className="text-emerald-500 bg-emerald-500/10 p-1 rounded-lg text-sm" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-emerald-600 dark:text-emerald-400 font-black text-base flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      Escrow Active
                    </div>
                    <div className="text-xs text-white font-medium">NGN 12,500 held securely</div>
                  </div>
                  
                  <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                  </div>
                </div>
              </div>

              {/* Decorative Subtle Grid Layer */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
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
                  <Search className="text-on-primary text-3xl" />
                </div>
                <h3 className="font-headline-md text-primary">For Service Seekers</h3>
              </div>
              <div className="grid grid-cols-1 gap-md">
                <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-primary transition-colors flex items-start gap-md">
                  <BadgeCheck className="text-primary" />
                  <div>
                    <h4 className="font-headline-sm mb-xs">Dual-Layer Ratings</h4>
                    <p className="text-on-surface-variant font-body-md">Peer reviews backed by physical audit reports from i-help agents.</p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-primary transition-colors flex items-start gap-md">
                  <Shield className="text-primary" />
                  <div>
                    <h4 className="font-headline-sm mb-xs">Escrow Protection</h4>
                    <p className="text-on-surface-variant font-body-md">Payment is only released when you confirm the job is 100% complete.</p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-primary transition-colors flex items-start gap-md">
                  <Siren className="text-primary" />
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
                  <Store className="text-on-tertiary text-3xl" />
                </div>
                <h3 className="font-headline-md text-tertiary-container">For Skilled Merchants</h3>
              </div>
              <div className="grid grid-cols-1 gap-md">
                <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-tertiary-container transition-colors flex items-start gap-md">
                  <Banknote className="text-tertiary-container" />
                  <div>
                    <h4 className="font-headline-sm mb-xs">Keep 100% of Base Rate</h4>
                    <p className="text-on-surface-variant font-body-md">We only charge a small platform fee on top, never from your pocket.</p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-tertiary-container transition-colors flex items-start gap-md">
                  <Calendar className="text-tertiary-container" />
                  <div>
                    <h4 className="font-headline-sm mb-xs">Managed Flex Gigs</h4>
                    <p className="text-on-surface-variant font-body-md">Control your own schedule with our smart-matching availability engine.</p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-tertiary-container transition-colors flex items-start gap-md">
                  <Wallet className="text-tertiary-container" />
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
            View all categories <ArrowRight className="" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {/* Card 1: Plumbing */}
          <div className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 cursor-pointer">
            <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary transition-colors">
              <Wrench className="text-primary group-hover:text-on-primary text-3xl" />
            </div>
            <h3 className="font-headline-md text-primary mb-sm">Plumbing</h3>
            <p className="text-on-surface-variant font-body-md mb-xl">Leak repairs, pipe installations, and bathroom fittings.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="bg-surface-container px-sm py-xs rounded font-label-md text-primary">From NGN 4,500/hr</span>
              <PlusCircle className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </div>
          </div>
          
          {/* Card 2: Electrical */}
          <div className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 cursor-pointer">
            <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary transition-colors">
              <Zap className="text-primary group-hover:text-on-primary text-3xl" />
            </div>
            <h3 className="font-headline-md text-primary mb-sm">Electrical</h3>
            <p className="text-on-surface-variant font-body-md mb-xl">Fault finding, wiring, and appliance installation.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="bg-surface-container px-sm py-xs rounded font-label-md text-primary">From NGN 5,000/hr</span>
              <PlusCircle className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </div>
          </div>
          
          {/* Card 3: Car Repair */}
          <div className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 cursor-pointer">
            <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary transition-colors">
              <Car className="text-primary group-hover:text-on-primary text-3xl" />
            </div>
            <h3 className="font-headline-md text-primary mb-sm">Car Repairs</h3>
            <p className="text-on-surface-variant font-body-md mb-xl">On-site mechanics for maintenance and emergency fixes.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="bg-surface-container px-sm py-xs rounded font-label-md text-primary">From NGN 7,500/hr</span>
              <PlusCircle className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </div>
          </div>
          
          {/* Card 4: Cleaning */}
          <div className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 cursor-pointer">
            <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary transition-colors">
              <Sparkles className="text-primary group-hover:text-on-primary text-3xl" />
            </div>
            <h3 className="font-headline-md text-primary mb-sm">Deep Home Cleaning</h3>
            <p className="text-on-surface-variant font-body-md mb-xl">Professional sanitation for homes and office spaces.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="bg-surface-container px-sm py-xs rounded font-label-md text-primary">From NGN 10,000/visit</span>
              <PlusCircle className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
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
                <CheckCircle2 className="text-tertiary-fixed-dim" />
                <span className="font-body-md text-white">Fixed monthly pricing, no hidden fees</span>
              </div>
              <div className="flex items-center gap-md">
                <CheckCircle2 className="text-tertiary-fixed-dim" />
                <span className="font-body-md text-white">Priority access to top-rated merchants</span>
              </div>
              <div className="flex items-center gap-md">
                <CheckCircle2 className="text-tertiary-fixed-dim" />
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
                <div className="flex items-center gap-md p-sm bg-white rounded-xl shadow-sm relative h-16">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-outline-variant relative flex-shrink-0">
                    <Image 
                      className="object-cover" 
                      alt="Merchant portrait" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQjSzr5rnwzcfzxwDpJvaJLD3aroMOz_kOs8N1Jv88Zjn-7Py9ZizNdIrMmeMMAdlKQhiz4T52odfnnLYmcgHhMGRkicncoy9dVnObgXsuH_lz1VCLpA8ja-od0P6g_P5qgsUzUezYIbXeg-sEo7R8jBPNGfDqexHKniV0P4P0BahIobdUskBK_gbnNVdDiEyZRO5egoOuIh8j3pWtzoWsG88b5Zn2q9dKA6d1JLG94dT6Z2qpI2fz8NFMaz8FXECjVxYhT-pp7iE"
                      fill
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <div className="font-label-lg text-primary">Bisi A.</div>
                    <div className="text-on-surface-variant font-label-md">Verified Merchant</div>
                  </div>
                  <div className="ml-auto flex items-center gap-xs">
                    <Star className="text-sm fill-current text-amber-500" />
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
              <Fingerprint className="text-3xl" />
            </div>
            <h3 className="font-headline-sm text-primary mb-sm">1. Multi-Tier KYC Validation</h3>
            <p className="text-on-surface-variant font-body-md px-lg">Strict government ID verification and background checks for every registered merchant.</p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mb-lg shadow-xl ring-8 ring-background">
              <Users className="text-3xl" />
            </div>
            <h3 className="font-headline-sm text-primary mb-sm">2. Physical Agent Curation</h3>
            <p className="text-on-surface-variant font-body-md px-lg">Our physical agents visit merchant workspaces to verify skill level and tool quality.</p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mb-lg shadow-xl ring-8 ring-background">
              <Landmark className="text-3xl" />
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