"use client";

import { useEffect, useState } from "react";
import { Settings, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [routingMode, setRoutingMode] = useState("external");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRoutingMode(data.data.routingMode || "external");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routingMode }),
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

  if (loading) return <div className="p-8 text-center text-on-surface-variant animate-pulse">Loading settings...</div>;

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
          <label className="flex flex-col gap-2">
            <span className="font-semibold text-sm text-on-surface">Routing Mode</span>
            <select
              value={routingMode}
              onChange={(e) => setRoutingMode(e.target.value)}
              className="p-3 rounded-xl border border-outline-variant bg-surface text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="external">External Intent Links (Google Maps, Apple Maps)</option>
              <option value="in_app">In-App Routing (OSRM / Leaflet)</option>
            </select>
          </label>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <strong>External:</strong> Uses standard map intents which will open the user's default mapping application (Google Maps, Waze, etc).<br/><br/>
            <strong>In-App:</strong> Uses Leaflet Routing Machine via OSRM directly in the app.
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
