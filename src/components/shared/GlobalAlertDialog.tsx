"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";

export function GlobalAlertDialog() {
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalAlert = window.alert;
      window.alert = (message: any) => {
        setAlerts((prev) => [...prev, String(message)]);
      };

      // Cleanup on unmount (optional, but good practice)
      return () => {
        window.alert = originalAlert;
      };
    }
  }, []);

  if (alerts.length === 0) return null;

  const currentAlert = alerts[0];

  const handleDismiss = () => {
    setAlerts((prev) => prev.slice(1));
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface w-full md:w-1/2 rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-center text-on-surface mb-2">
          Notification
        </h3>
        <p className="text-center text-on-surface-variant text-sm mb-6">
          {currentAlert}
        </p>
        <button
          onClick={handleDismiss}
          className="w-full bg-primary text-on-primary py-2.5 rounded-xl font-bold shadow hover:bg-primary/90 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}
