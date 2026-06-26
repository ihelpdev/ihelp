"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { X } from "lucide-react";
import L from "leaflet";
import MapSearchBar from "@/components/ui/MapSearchBar";

export type LocationPoint = {
  lat: number;
  lng: number;
  address?: string;
};

interface LocationPickerProps {
  locations: LocationPoint[];
  onChange: (locations: LocationPoint[]) => void;
}

// Helper to recenter the map when user location is found
function RecenterMap({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

// Internal component for handling map clicks
function ClickableMap({ onAddLocation }: { onAddLocation: (loc: LocationPoint) => void }) {
  useMapEvents({
    click(e) {
      onAddLocation({ lat: e.latlng.lat, lng: e.latlng.lng, address: `Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}` });
    },
  });
  return null;
}

export default function LocationPickerMap({ locations, onChange }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setMounted(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocation failed", err),
        { timeout: 10000 }
      );
    }
  }, []);

  const handleAddLocation = (loc: LocationPoint) => {
    onChange([...locations, loc]);
  };

  const handleRemoveLocation = (index: number) => {
    onChange(locations.filter((_, i) => i !== index));
  };

  const handleUpdateAddress = (index: number, newAddress: string) => {
    const newLocs = [...locations];
    newLocs[index] = { ...newLocs[index], address: newAddress };
    onChange(newLocs);
  };

  if (!mounted) return <div className="h-[300px] w-full bg-surface-container rounded-xl animate-pulse" />;

  // If there are existing locations, focus on the first one. Otherwise fallback to user loc or default
  const fallbackCenter = userLoc || { lat: 9.0820, lng: 8.6753 };
  const center = locations.length > 0 
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : fallbackCenter;
    
  const zoom = locations.length > 0 ? 15 : (userLoc ? 15 : 6);

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[300px] w-full rounded-xl overflow-hidden border border-outline-variant relative z-0">
        <MapContainer 
          center={center} 
          zoom={zoom} 
          scrollWheelZoom={false} 
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap center={center} zoom={zoom} />
          <ClickableMap onAddLocation={handleAddLocation} />
          {locations.map((loc, idx) => (
            <Marker key={idx} position={{ lat: loc.lat, lng: loc.lng }}>
              <Popup>
                {loc.address || `Location ${idx + 1}`}
                <br />
                <button 
                  onClick={() => handleRemoveLocation(idx)}
                  className="mt-2 text-xs text-error font-medium"
                >
                  Remove Location
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="absolute bottom-4 right-4 bg-surface p-2 rounded-lg shadow text-xs font-semibold z-[400] text-on-surface pointer-events-none">
          Click map to add location
        </div>

        {/* Map Search Bar */}
        <div className="absolute top-4 right-4 left-16 z-[1000] max-w-[320px] ml-auto">
          <MapSearchBar 
            onLocationSelect={(lat, lng) => {
              if (mapRef.current) {
                mapRef.current.flyTo({ lat, lng }, 15, { duration: 1.5 });
              }
            }}
          />
        </div>
      </div>

      {locations.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Selected Locations ({locations.length})</span>
          <div className="flex flex-col gap-2">
            {locations.map((loc, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant text-sm w-full">
                <input 
                  value={loc.address || ""}
                  onChange={(e) => handleUpdateAddress(idx, e.target.value)}
                  className="flex-1 bg-transparent border-b border-outline-variant focus:border-primary outline-none px-1 py-0.5 text-on-surface"
                  placeholder="Enter location name or address"
                />
                <button type="button" onClick={() => handleRemoveLocation(idx)} className="text-on-surface-variant hover:text-error shrink-0" title="Remove Location">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
