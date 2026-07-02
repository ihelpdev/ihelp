"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// NOTE: leaflet-routing-machine does not natively support ES modules well without extra config in Next.js, 
// so we typically require it on the client side after L is loaded.
import "leaflet-routing-machine";
import { X, Navigation } from "lucide-react";

interface InAppRoutingMapProps {
  startLoc: { lat: number; lng: number };
  endLoc: { lat: number; lng: number };
  onClose: () => void;
}

export default function InAppRoutingMap({ startLoc, endLoc, onClose }: InAppRoutingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);
  const [distance, setDistance] = useState<string>("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([startLoc.lat, startLoc.lng], 13);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Custom Icons
    const startIcon = L.divIcon({ className: "bg-blue-600 w-4 h-4 rounded-full border-2 border-white shadow-md", iconSize: [16, 16] });
    const endIcon = L.divIcon({ className: "bg-emerald-600 w-5 h-5 rounded-full border-2 border-white shadow-md", iconSize: [20, 20] });

    // Remove existing routing control if any
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // @ts-ignore - Leaflet Routing Machine extends L
    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(startLoc.lat, startLoc.lng),
        L.latLng(endLoc.lat, endLoc.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: function (i: number, waypoint: any, n: number) {
        return L.marker(waypoint.latLng, { icon: i === 0 ? startIcon : endIcon });
      },
      lineOptions: {
        styles: [{ color: '#2563eb', weight: 5, opacity: 0.8 }]
      }
    } as any).on('routesfound', function(e: any) {
      const routes = e.routes;
      const summary = routes[0].summary;
      setDistance((summary.totalDistance / 1000).toFixed(1) + ' km');
      setTime(Math.round(summary.totalTime % 3600 / 60) + ' min');
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
         try { map.removeControl(routingControlRef.current); } catch {}
      }
    };
  }, [startLoc, endLoc]);

  return (
    <div className="fixed inset-0 z-[100000] bg-surface flex flex-col">
      <div className="flex items-center justify-between p-4 bg-surface-container-lowest border-b border-outline-variant shadow-sm z-10 relative">
        <div className="flex flex-col">
          <h2 className="font-bold text-on-surface text-lg flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" /> Live Navigation
          </h2>
          {distance && time && (
            <p className="text-sm font-semibold text-primary">{distance} · Est. {time}</p>
          )}
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high transition">
          <X className="w-6 h-6 text-on-surface" />
        </button>
      </div>
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0 z-0" />
      </div>
    </div>
  );
}
