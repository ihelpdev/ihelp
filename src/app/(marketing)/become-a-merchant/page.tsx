import Link from "next/link";

export default function BecomeAMerchantPage() {
  const valueProps = [
    {
      icon: "💸",
      title: "Guaranteed Payouts via Escrow",
      description: "Never chase a client for payment again. Before you even pack your tools, our automated system locks down the customer's funds in an insulated escrow vault. When you click complete, your payout is released straight to your balance."
    },
    {
      icon: "📈",
      title: "Consistent, Free Job Pipeline",
      description: "Stop spending money on flyers or social media ads. i-help routes active clients directly to your dashboard. Whether you do on-demand work or routine subscription orders, we handle the marketing while you handle the craft."
    },
    {
      icon: "🛠️",
      title: "Total Operational Autonomy",
      description: "You choose your hours, your service radiuses, and your working days. Manage incoming requests seamlessly through your dedicated Jobs Tab. Accept what matches your schedule, and reject what doesn't fit."
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-surface-container-lowest text-on-surface">
      {/* Hero Recruitment Section */}
      <section className="px-margin py-xl text-center max-w-4xl mx-auto space-y-md">
        <span className="text-primary font-bold tracking-widest text-label-lg uppercase block">
          Empowering Local Artisans
        </span>
        <h1 className="font-headline-lg text-headline-xl text-primary font-black tracking-tight leading-none">
          Turn Your Technical Skills Into A Highly Predictable Income.
        </h1>
        <p className="text-on-secondary-container font-body-lg max-w-2xl mx-auto leading-relaxed">
          Join Nigeria's elite network of professional merchants. Get access to verified cleaning, laundry, 
          and repair jobs in your neighborhood with upfront guaranteed pricing and zero client haggling.
        </p>
        <div className="pt-sm">
          <Link href="/register?role=merchant">
            <button className="bg-primary text-on-primary text-title-md font-bold px-xl py-md rounded-lg transition-all duration-150 active:scale-95 shadow-md hover:bg-primary/90">
              Apply as an i-help Merchant
            </button>
          </Link>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="max-w-6xl mx-auto px-margin py-lg space-y-lg">
        <h2 className="font-headline-sm text-title-xl font-bold text-primary text-center">
          Why Top Professionals Work With i-help
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {valueProps.map((prop, idx) => (
            <div key={idx} className="bg-surface-container border border-outline-variant p-md rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="space-y-sm">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center text-headline-sm">
                  {prop.icon}
                </div>
                <h3 className="font-bold text-title-lg text-primary">{prop.title}</h3>
                <p className="text-on-secondary-container text-body-md leading-relaxed">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Onboarding Operational Workflow */}
      <section className="bg-surface-container-low border-t border-b border-outline-variant py-xl px-margin">
        <div className="max-w-4xl mx-auto space-y-lg">
          <div className="text-center space-y-xs">
            <h2 className="font-headline-sm text-title-xl font-bold text-primary">Your 3-Step Journey to First Payout</h2>
            <p className="text-on-secondary-container text-body-md">Our onboarding verification takes less than 48 hours to complete.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-md relative">
            <div className="space-y-2xs text-center md:text-left">
              <span className="font-headline-md text-primary/30 font-black text-headline-xl block">01</span>
              <h4 className="font-bold text-title-md text-primary">Submit Profile</h4>
              <p className="text-label-md text-on-secondary-container">Fill out your business details, select your core skills, and upload links showing sights of your past services.</p>
            </div>
            <div className="space-y-2xs text-center md:text-left">
              <span className="font-headline-md text-primary/30 font-black text-headline-xl block">02</span>
              <h4 className="font-bold text-title-md text-primary">Verification Clear</h4>
              <p className="text-label-md text-on-secondary-container">Our operations team runs a standard swift background check and identity validation to certify you as a vetted tier merchant.</p>
            </div>
            <div className="space-y-2xs text-center md:text-left">
              <span className="font-headline-md text-primary/30 font-black text-headline-xl block">03</span>
              <h4 className="font-bold text-title-md text-primary">Go Live & Earn</h4>
              <p className="text-label-md text-on-secondary-container">Open your Merchant Portal, watch active requests land directly on your Jobs Tab, and control your financial growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Merchant Target Verticals Reference */}
      <section className="max-w-4xl mx-auto px-margin py-xl text-center space-y-md">
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-md shadow-xs">
          <h3 className="font-bold text-title-lg text-primary mb-xs">Who is i-help looking for?</h3>
          <div className="flex flex-wrap gap-xs justify-center text-label-md text-on-surface/90 font-medium">
            <span className="bg-surface-container-highest px-sm py-2xs border border-outline-variant rounded-full">🧺 Professional Laundries</span>
            <span className="bg-surface-container-highest px-sm py-2xs border border-outline-variant rounded-full">✨ Auto Detailing Specialists</span>
            <span className="bg-surface-container-highest px-sm py-2xs border border-outline-variant rounded-full">🧹 Housekeeping Agencies</span>
            <span className="bg-surface-container-highest px-sm py-2xs border border-outline-variant rounded-full">⚡ Electricians & HVAC Technicians</span>
            <span className="bg-surface-container-highest px-sm py-2xs border border-outline-variant rounded-full">🚰 Certified Plumbers</span>
          </div>
        </div>
      </section>
    </div>
  );
}