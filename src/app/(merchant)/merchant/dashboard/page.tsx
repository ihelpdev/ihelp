"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Power, TrendingUp, CheckSquare, Star, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function MerchantDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [showIncomingJob, setShowIncomingJob] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);

  // Mock incoming job trigger
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        setShowIncomingJob(true);
        setTimeLeft(45);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowIncomingJob(false);
    }
  }, [isOnline]);

  // Fallback ticker
  useEffect(() => {
    if (showIncomingJob && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && showIncomingJob) {
      setShowIncomingJob(false); // Auto reject
    }
  }, [showIncomingJob, timeLeft]);

  const handleAcceptJob = () => {
    setShowIncomingJob(false);
    // In real app, route to the active job tracker or update DB status
    alert("Job Accepted! Escrow locked.");
  };

  const handleDeclineJob = () => {
    setShowIncomingJob(false);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* Availability Toggle */}
      <div className={`p-6 rounded-lg border-2 flex items-center justify-between transition-colors ${isOnline ? "bg-primary-fixed border-primary" : "bg-surface-container-lowest border-outline-variant/30"}`}>
        <div>
          <h2 className="text-headline-sm font-bold flex items-center gap-2">
            {isOnline ? "You are Online" : "You are Offline"}
            {isOnline && <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
            </span>}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {isOnline ? "Waiting for nearby dispatch requests..." : "Toggle to start receiving jobs."}
          </p>
        </div>
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isOnline ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-surface-container-high text-on-surface-variant hover:bg-outline-variant/20"}`}
        >
          <Power className="w-8 h-8" />
        </button>
      </div>

      {/* Performance Matrix */}
      <div>
        <h3 className="text-body-lg font-bold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/30">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <TrendingUp className="w-4 h-4" /> <span className="text-xs font-semibold uppercase">Earnings (Wk)</span>
            </div>
            <p className="text-2xl font-bold text-primary">$840.50</p>
          </div>
          
          <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/30">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <CheckSquare className="w-4 h-4" /> <span className="text-xs font-semibold uppercase">Accept Rate</span>
            </div>
            <p className="text-2xl font-bold text-on-surface">94%</p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/30">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <Star className="w-4 h-4" /> <span className="text-xs font-semibold uppercase">Trust Score</span>
            </div>
            <p className="text-2xl font-bold text-on-surface">4.9</p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/30">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <Clock className="w-4 h-4" /> <span className="text-xs font-semibold uppercase">Avg Response</span>
            </div>
            <p className="text-2xl font-bold text-on-surface">2 min</p>
          </div>
        </div>
      </div>

      {/* Portfolio Quick Link */}
      <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between border border-outline-variant/20">
        <div>
          <h4 className="font-bold">Portfolio & Rates</h4>
          <p className="text-xs text-on-surface-variant">Update your gallery and service pricing.</p>
        </div>
        <Link href="/merchant/portfolio" className="text-sm font-semibold text-primary hover:underline">
          Manage
        </Link>
      </div>

      {/* Incoming Job Modal Overlay */}
      {showIncomingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header Map/Visual Placeholder */}
            <div className="bg-surface-container-highest h-32 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10"></div>
              <div className="text-center relative z-10">
                <AlertCircle className="w-10 h-10 text-primary mx-auto mb-2 animate-bounce" />
                <Badge variant="warning" className="uppercase font-bold tracking-widest">New Dispatch</Badge>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">Emergency Plumbing</h3>
                  <p className="text-sm text-on-surface-variant">Downtown Metro • 3.2 miles</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#10b981]">$150</p>
                  <p className="text-xs text-on-surface-variant">Fixed Rate</p>
                </div>
              </div>

              <div className="bg-surface-container-low rounded p-3 mb-6 flex justify-between items-center border border-outline-variant/20">
                <span className="text-sm font-medium">Acceptance Window</span>
                <span className={`font-bold ${timeLeft <= 10 ? 'text-[#ba1a1a] animate-pulse' : 'text-on-surface'}`}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={handleDeclineJob}>Decline</Button>
                <Button className="flex-1 bg-[#10b981] border-[#10b981] hover:bg-[#0e9d6e]" onClick={handleAcceptJob}>Accept Job</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
