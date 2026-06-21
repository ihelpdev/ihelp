"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Star } from "lucide-react";

export type ServiceMapData = {
  id: string;
  name: string;
  category: string;
  suggested_base_rate_ngn: number;
  unit: string;
  ratingAvg: number | null;
  ratingCount: number;
  locations: Array<{ lat: number; lng: number; address?: string }>;
};

interface ServiceMapProps {
  services: ServiceMapData[];
  onSelectService: (id: string) => void;
  locked?: boolean;
  heightClass?: string;
}

// Helper to recenter the map when user location is found
function RecenterMap({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function ServiceMap({ services, onSelectService, locked, heightClass = "h-[600px]" }: ServiceMapProps) {
  const [mounted, setMounted] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.warn("Geolocation failed or denied", err),
        { timeout: 10000 }
      );
    }
  }, []);

  if (!mounted) return <div className={`${heightClass} w-full bg-surface-container rounded-xl animate-pulse`} />;

  // Find the first service with a location to use as fallback center
  const firstWithLocation = services.find(s => s.locations && s.locations.length > 0);
  const fallbackCenter = firstWithLocation 
    ? { lat: firstWithLocation.locations[0].lat, lng: firstWithLocation.locations[0].lng }
    : { lat: 9.0820, lng: 8.6753 };
    
  const center = userLoc || fallbackCenter;
  const zoom = userLoc ? 15 : 6; // Zoom 15 is approximately a 1km to 2km radius view

  return (
    <div className={`${heightClass} w-full rounded-xl overflow-hidden border border-outline-variant relative z-0 shadow-sm transition-all duration-300`}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={center} zoom={zoom} />
        
        {/* Optional: Marker for user's own location */}
        {userLoc && (
          <Marker position={userLoc}>
            <Popup>
              <span className="font-semibold text-primary">Your Location</span>
            </Popup>
          </Marker>
        )}
        
        {services.map(svc => {
          if (!svc.locations || svc.locations.length === 0) return null;

          return svc.locations.map((loc, idx) => (
            <Marker key={`${svc.id}-${idx}`} position={{ lat: loc.lat, lng: loc.lng }}>
              <Popup>
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <h4 className="font-bold text-on-surface m-0 leading-tight">{svc.name}</h4>
                  <span className="text-xs font-semibold text-primary">{svc.category}</span>
                  
                  <div className="flex items-center justify-between border-t border-b border-outline-variant py-2 my-1">
                    <span className="text-sm font-bold text-on-surface">NGN {svc.suggested_base_rate_ngn.toLocaleString()} <span className="text-xs text-on-surface-variant font-medium">/ {svc.unit === "hour" ? "hr" : svc.unit}</span></span>
                    {svc.ratingAvg ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-semibold">{svc.ratingAvg.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant">No ratings</span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => onSelectService(svc.id)}
                    disabled={locked}
                    className={`w-full py-1.5 rounded-lg text-sm font-semibold transition-opacity mt-1 ${locked ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-80' : 'bg-primary text-on-primary hover:opacity-90'}`}
                  >
                    Request Service
                  </button>
                </div>
              </Popup>
            </Marker>
          ));
        })}
      </MapContainer>
    </div>
  );
}
