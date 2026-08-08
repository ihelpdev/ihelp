"use client";

import { useState } from "react";
import { Settings, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");


  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routingMode: "in_app" }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Settings saved successfully.");
      } else {
        setMessage("Failed to save settings: " + data.message);
      }
    } catch (err) {
      setMessage("Network error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" /> System Settings
        </h1>
        <p className="text-on-surface-variant mt-2">Configure platform-wide variables and features.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Merchant Navigation Setting</h3>
        
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <p className="text-sm font-semibold text-primary">In-App Navigation (OSRM / Leaflet) is active</p>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              All merchant navigation uses the built-in in-app routing map powered by OSRM and Leaflet. External map app links (Google Maps, Waze) are disabled.
            </p>

          {message && <div className="text-sm font-semibold text-primary mt-2">{message}</div>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-6 rounded-xl font-bold hover:bg-primary/90 transition disabled:opacity-50 w-max"
          >
            <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
