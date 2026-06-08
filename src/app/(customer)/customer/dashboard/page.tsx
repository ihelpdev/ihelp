"use client";

import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Search, MapPin, Wrench, Zap, Droplet, Paintbrush, Home, Star } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { id: "plumbing", name: "Plumbing", icon: <Droplet className="w-6 h-6" /> },
  { id: "electrical", name: "Electrical", icon: <Zap className="w-6 h-6" /> },
  { id: "carpentry", name: "Carpentry", icon: <Wrench className="w-6 h-6" /> },
  { id: "painting", name: "Painting", icon: <Paintbrush className="w-6 h-6" /> },
  { id: "cleaning", name: "Cleaning", icon: <Home className="w-6 h-6" /> },
];

const FILTERS = ["Available Now", "Top Rated", "Fixed Price", "Subscriptions"];

const PROS = [
  { id: "p1", name: "Michael T.", role: "Master Electrician", rating: 4.9, jobs: 124, rate: "$80/hr", verified: true },
  { id: "p2", name: "Sarah J.", role: "Plumber", rating: 4.8, jobs: 89, rate: "$70/hr", verified: true },
];

export default function CustomerDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search and Location */}
      <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/30 shadow-sm">
        <h2 className="text-headline-sm font-bold mb-4">Find a Professional</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
            <input 
              type="text" 
              placeholder="What do you need help with?" 
              className="w-full pl-10 pr-4 py-3 rounded border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative md:w-64">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
            <input 
              type="text" 
              placeholder="Your Location" 
              defaultValue="Downtown Metro"
              className="w-full pl-10 pr-4 py-3 rounded border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide">
        {FILTERS.map(f => (
          <button key={f} className="whitespace-nowrap px-4 py-2 bg-surface-container-low hover:bg-surface-container rounded-full text-sm font-medium border border-outline-variant/20 transition-colors">
            {f}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div>
        <h3 className="text-body-lg font-bold mb-4">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map(c => (
            <div key={c.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-4 flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer transition-colors group">
              <div className="p-3 bg-surface-container-low rounded-full group-hover:bg-primary-fixed transition-colors">
                {c.icon}
              </div>
              <span className="font-medium text-sm">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Pros */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-body-lg font-bold">Recommended for you</h3>
          <Link href="/customer/search" className="text-primary text-sm font-medium hover:underline">View all</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {PROS.map(pro => (
            <div key={pro.id} className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/30 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center font-bold text-primary">
                    {pro.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface flex items-center gap-2">
                      {pro.name}
                      {pro.verified && <Badge variant="success" className="px-1.5 py-0">Verified</Badge>}
                    </h4>
                    <p className="text-sm text-on-surface-variant">{pro.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{pro.rate}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[#eab308] fill-[#eab308]" /> {pro.rating}</span>
                <span>{pro.jobs} jobs completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
