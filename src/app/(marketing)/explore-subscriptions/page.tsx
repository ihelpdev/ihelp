import Link from "next/link";

export default function ExploreSubscriptionsPage() {
  const customSubscriptions = [
    {
      id: "sub_srv_001",
      name: "Routine Laundry Service",
      icon: "🧺",
      tagline: "Your wardrobe on autopilot.",
      description: "Standard wash, tumble dry, premium steam iron, and crisp folded delivery right back to your hangers.",
      basePrice: "₦6,000",
      details: ["Capped up to 15kg per individual session", "Free anti-bacterial fabric care treatment", "Guaranteed 48-hour standard turnaround time"]
    },
    {
      id: "sub_srv_002",
      name: "Executive Doorstep Car Wash",
      icon: "✨",
      tagline: "Showroom shine, zero effort.",
      description: "Meticulous exterior pressure foam washing, intense wheel detailing, tire dressing, and dashboard vacuuming.",
      basePrice: "₦4,250",
      details: ["Completely dynamic mobile setup (we bring our water & power source)", "Eco-friendly premium wax finishing coats", "Available for Sedans, SUVs, and heavy utility vehicles"]
    },
    {
      id: "sub_srv_003",
      name: "Standard Apartment Housekeeping",
      icon: "🧹",
      tagline: "Reclaim your weekend peace.",
      description: "Surface dusting, floor sweeping, wet mopping, kitchen surface polishing, bathroom disinfection, and waste removal.",
      basePrice: "₦15,000",
      details: ["All industrial cleaning agents provided by i-help agents", "Thoroughly vetted Tier-1 Flex Merchant pool assignments", "Customized attention mapping checklists left on counter handles"]
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-surface-container-lowest text-on-surface">
      {/* Dynamic Header Intro Block */}
      <section className="px-margin py-xl text-center max-w-3xl mx-auto space-y-md">
        <span className="text-primary font-bold tracking-widest text-label-lg uppercase block">
          Managed Chore Automation
        </span>
        <h1 className="font-headline-lg text-headline-xl text-primary font-black tracking-tight leading-none">
          Put Your Household Chores On Autopilot.
        </h1>
        <p className="text-on-secondary-container font-body-lg max-w-2xl mx-auto leading-relaxed">
          Subscribe to routine laundry, car cleaning, or housekeeping services. No negotiations, no search delays. 
          Our system automatically deploys certified agents at fixed rates to handle your home needs with precision.
        </p>
      </section>

      {/* Dynamic Savings Tier Strategy Section */}
      <section className="max-w-7xl mx-auto px-margin grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex items-start gap-md shadow-sm">
          <div className="bg-primary/10 text-primary p-sm rounded text-headline-sm">🗓️</div>
          <div>
            <h3 className="font-bold text-title-md text-primary">Monthly Package</h3>
            <p className="text-label-md text-on-secondary-container mt-xs">1 Session / month at standard default platform rates. Perfect for occasional deep tuning maintenance.</p>
          </div>
        </div>
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex items-start gap-md shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-on-primary text-3xs font-bold px-sm py-2xs rounded-bl uppercase tracking-wider">Save 5%</div>
          <div className="bg-primary/10 text-primary p-sm rounded text-headline-sm">🌓</div>
          <div>
            <h3 className="font-bold text-title-md text-primary">Bi-Weekly Package</h3>
            <p className="text-label-md text-on-secondary-container mt-xs">2 Sessions / month. A comfortable rhythm keeping your items organized and clean automatically.</p>
          </div>
        </div>
        <div className="bg-primary/5 border-2 border-primary rounded-xl p-md flex items-start gap-md shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-3xs font-bold px-sm py-2xs rounded-bl uppercase tracking-wider">Save 10%</div>
          <div className="bg-primary/10 text-primary p-sm rounded text-headline-sm">⚡</div>
          <div>
            <h3 className="font-bold text-title-md text-primary">Weekly Package</h3>
            <p className="text-label-md text-on-secondary-container mt-xs">4 Sessions / month. Maximum savings and zero structural household cognitive load. Freshness every week.</p>
          </div>
        </div>
      </section>

      {/* Core Dynamic Interactive Service Deck */}
      <section className="max-w-5xl mx-auto px-margin space-y-lg pb-xl">
        <h2 className="font-headline-sm text-title-lg text-primary font-bold border-b border-outline-variant pb-xs">
          Available Managed Categories
        </h2>
        
        <div className="space-y-md">
          {customSubscriptions.map((item) => (
            <div 
              key={item.id} 
              className="bg-surface-container rounded-2xl border border-outline-variant p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md shadow-sm hover:border-primary/40 transition-all duration-300"
            >
              <div className="space-y-sm max-w-2xl">
                <div className="flex items-center gap-xs">
                  <span className="text-headline-md">{item.icon}</span>
                  <div>
                    <h3 className="font-headline-sm text-title-lg font-bold text-primary">{item.name}</h3>
                    <span className="text-3xs text-slate-400 italic block">{item.tagline}</span>
                  </div>
                </div>
                <p className="text-on-secondary-container text-body-md leading-relaxed">
                  {item.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2xs pt-2xs">
                  {item.details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2xs text-label-md text-on-surface/80">
                      <span className="text-primary text-xs">✓</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-auto bg-surface-container-low border border-outline-variant p-md rounded-xl text-center md:text-right space-y-sm flex md:flex-col justify-between items-center md:items-end">
                <div>
                  <span className="text-3xs text-on-secondary-container uppercase font-bold tracking-widest block">Base Session Cost</span>
                  <span className="font-headline-md text-headline-md text-primary font-black block">{item.basePrice}</span>
                </div>
                <Link href="/register" className="w-full md:w-auto">
                  <button className="w-full md:w-auto bg-primary text-on-primary px-lg py-sm rounded font-label-lg transition-all duration-150 active:scale-95 shadow-sm">
                    Configure Plan
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}