"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { GestureHandling } from "leaflet-gesture-handling";

// @ts-ignore
L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
import {
  X,
  Navigation,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  RotateCcw,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  AlertTriangle,
  CornerDownLeft,
  Map,
  Satellite,
  Mountain,
  Moon,
  Minimize,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  LocateFixed,
  Loader2,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface LatLng {
  lat: number;
  lng: number;
  label?: string;
}

interface InAppRoutingMapProps {
  startLoc: LatLng;
  endLoc: LatLng;
  customerPhone?: string;
  onClose: () => void;
  onArrived?: () => void;
}

interface RouteStep {
  instruction: string;
  distance: number;
  type: number;
}

// ─── Map Styles ────────────────────────────────────────────────────────────

const MAP_STYLES = [
  {
    id: "streets",
    label: "Streets",
    icon: Map,
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO &copy; OSM",
    maxZoom: 20,
  },
  {
    id: "satellite",
    label: "Satellite",
    icon: Satellite,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri &copy; USGS",
    maxZoom: 19,
  },
  {
    id: "terrain",
    label: "Terrain",
    icon: Mountain,
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap &copy; OSM",
    maxZoom: 17,
  },
  {
    id: "dark",
    label: "Dark",
    icon: Moon,
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO &copy; OSM",
    maxZoom: 20,
  },
  {
    id: "minimal",
    label: "Minimal",
    icon: Minimize,
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO &copy; OSM",
    maxZoom: 20,
  },
] as const;

type MapStyleId = (typeof MAP_STYLES)[number]["id"];

// ─── Helpers ───────────────────────────────────────────────────────────────

function getStepIcon(type: number) {
  const cls = "w-5 h-5 text-white";
  if (type === 1) return <ArrowLeft className={cls} />;
  if (type === 2) return <ArrowRight className={cls} />;
  if (type === 5) return <RotateCcw className={cls} />;
  if (type === 6) return <CornerDownLeft className={cls} />;
  return <ArrowUp className={cls} />;
}

function formatDist(m: number) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

function formatETA(secs: number) {
  const t = new Date();
  t.setSeconds(t.getSeconds() + secs);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.round((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function calcSpeed(distM: number, secs: number) {
  if (!secs) return "–";
  return `${Math.round((distM / 1000 / secs) * 3600)} km/h`;
}

// ─── Marker factory ────────────────────────────────────────────────────────

function makePin(color: string, letter: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="50" viewBox="0 0 38 50">
      <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.4"/>
      </filter>
      <path d="M19 0C8.51 0 0 8.51 0 19c0 14.25 19 31 19 31S38 33.25 38 19C38 8.51 29.49 0 19 0z"
            fill="${color}" filter="url(#sh)"/>
      <circle cx="19" cy="19" r="10" fill="white"/>
      <text x="19" y="23.5" text-anchor="middle" font-size="12" font-weight="bold"
            fill="${color}" font-family="system-ui,sans-serif">${letter}</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [38, 50],
    iconAnchor: [19, 50],
    popupAnchor: [0, -50],
  });
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function InAppRoutingMap({
  startLoc,
  endLoc,
  customerPhone,
  onClose,
  onArrived,
}: InAppRoutingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Route info
  const [totalDistM, setTotalDistM] = useState(0);
  const [totalSecs, setTotalSecs] = useState(0);
  const [steps, setSteps] = useState<RouteStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [routeLoaded, setRouteLoaded] = useState(false);
  const [routeError, setRouteError] = useState(false);

  // UI state
  const [mapStyle, setMapStyle] = useState<MapStyleId>("streets");
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [showStepsPanel, setShowStepsPanel] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showArrivalConfirm, setShowArrivalConfirm] = useState(false);

  // Locate-me state
  type LocateStatus = "idle" | "loading" | "found" | "denied" | "unavailable";
  const [locateStatus, setLocateStatus] = useState<LocateStatus>("idle");
  const myLocMarkerRef = useRef<L.Marker | null>(null);
  const myLocCircleRef = useRef<L.Circle | null>(null);

  const currentStep = steps[currentStepIdx] ?? null;
  const progress = steps.length > 0 ? ((currentStepIdx + 1) / steps.length) * 100 : 0;

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      gestureHandling: true,
    } as L.MapOptions).setView([startLoc.lat, startLoc.lng], 13);

    L.control
      .attribution({ prefix: false, position: "bottomleft" })
      .addTo(mapInstanceRef.current);

    const style = MAP_STYLES[0];
    tileLayerRef.current = L.tileLayer(style.url, {
      attribution: style.attribution,
      maxZoom: style.maxZoom,
    }).addTo(mapInstanceRef.current);
  }, [startLoc]);

  // ── Add routing once map is ready ─────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (routingControlRef.current) {
      try { map.removeControl(routingControlRef.current); } catch {}
    }
    setRouteLoaded(false);
    setRouteError(false);

    // @ts-ignore
    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(startLoc.lat, startLoc.lng), L.latLng(endLoc.lat, endLoc.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      show: false,
      collapsible: false,
      createMarker: (i: number, wp: any) =>
        L.marker(wp.latLng, {
          icon: i === 0 ? makePin("#2563eb", "A") : makePin("#059669", "B"),
        }),
      lineOptions: {
        styles: [
          { color: "#1e40af", weight: 7, opacity: 0.85 },
          { color: "#93c5fd", weight: 3, opacity: 0.5, dashArray: "10 10" },
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
    } as any)
      .on("routesfound", (e: any) => {
        const r = e.routes[0];
        setTotalDistM(r.summary.totalDistance);
        setTotalSecs(r.summary.totalTime);
        setSteps(
          (r.instructions ?? []).map((s: any) => ({
            instruction: s.text,
            distance: s.distance,
            type: s.type,
          }))
        );
        setCurrentStepIdx(0);
        setRouteLoaded(true);
      })
      .on("routingerror", () => {
        setRouteError(true);
        setRouteLoaded(true);
      })
      .addTo(map);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Switch tile layer when style changes ─────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const map = mapInstanceRef.current;
    map.removeLayer(tileLayerRef.current);
    const style = MAP_STYLES.find((s) => s.id === mapStyle)!;
    tileLayerRef.current = L.tileLayer(style.url, {
      attribution: style.attribution,
      maxZoom: style.maxZoom,
    }).addTo(map);
    tileLayerRef.current.bringToBack();
  }, [mapStyle]);

  // ── Map controls ──────────────────────────────────────────────────────────
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyToBounds(
      L.latLngBounds([startLoc.lat, startLoc.lng], [endLoc.lat, endLoc.lng]),
      { padding: [60, 60], duration: 1.2 }
    );
  };

  // ── Locate me ─────────────────────────────────────────────────────────────
  const handleLocateMe = useCallback(() => {
    if (!mapInstanceRef.current) return;
    if (!navigator.geolocation) {
      setLocateStatus("unavailable");
      setTimeout(() => setLocateStatus("idle"), 3000);
      return;
    }
    setLocateStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        const map = mapInstanceRef.current!;

        // Remove old markers
        if (myLocMarkerRef.current) map.removeLayer(myLocMarkerRef.current);
        if (myLocCircleRef.current) map.removeLayer(myLocCircleRef.current);

        // Pulsing "You Are Here" marker
        const youAreHereIcon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:24px;height:24px">
              <div style="position:absolute;inset:0;border-radius:50%;background:#2563eb;opacity:0.25;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite"></div>
              <div style="position:absolute;inset:4px;border-radius:50%;background:#2563eb;border:2.5px solid white;box-shadow:0 2px 8px rgba(37,99,235,0.5)"></div>
            </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        myLocMarkerRef.current = L.marker([lat, lng], { icon: youAreHereIcon })
          .bindPopup("<b>You are here</b>", { offset: [0, -8] })
          .addTo(map)
          .openPopup();

        // Accuracy circle
        myLocCircleRef.current = L.circle([lat, lng], {
          radius: accuracy,
          color: "#2563eb",
          fillColor: "#2563eb",
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: "4 4",
        }).addTo(map);

        map.flyTo([lat, lng], 16, { duration: 1.5 });
        setLocateStatus("found");
        setTimeout(() => setLocateStatus("idle"), 3500);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocateStatus("denied");
        } else {
          setLocateStatus("unavailable");
        }
        setTimeout(() => setLocateStatus("idle"), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const styleObj = MAP_STYLES.find((s) => s.id === mapStyle)!

  return (
    <div className="fixed inset-0 z-[100000] bg-surface flex flex-col overflow-hidden">
      {/* Keyframe for pulsing locate-me marker */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      {/* ─── Top Header ───────────────────────────────────────────────────── */}
      <div className="relative flex items-center gap-3 px-4 py-3 bg-surface-container-lowest border-b border-outline-variant shadow-md z-20">
        {/* Back button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high transition flex items-center justify-center"
        >
          <X className="w-5 h-5 text-on-surface" />
        </button>

        {/* Route summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-bold text-on-surface text-sm truncate">
              {endLoc.label ?? "Customer Location"}
            </span>
          </div>
          {routeLoaded && !routeError && totalSecs > 0 && (
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs font-bold text-primary">{formatDist(totalDistM)}</span>
              <span className="text-outline text-xs">·</span>
              <span className="text-xs text-on-surface-variant font-medium">{formatDuration(totalSecs)}</span>
              <span className="text-outline text-xs">·</span>
              <span className="text-xs text-on-surface-variant">ETA {formatETA(totalSecs)}</span>
              <span className="text-outline text-xs hidden sm:inline">·</span>
              <span className="text-xs text-on-surface-variant hidden sm:inline">avg {calcSpeed(totalDistM, totalSecs)}</span>
            </div>
          )}
          {!routeLoaded && (
            <p className="text-xs text-on-surface-variant animate-pulse mt-0.5">Calculating route…</p>
          )}
          {routeError && (
            <p className="text-xs text-error font-semibold flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-3 h-3" /> Route unavailable
            </p>
          )}
        </div>

        {/* Call button */}
        {customerPhone && (
          <a
            href={`tel:${customerPhone}`}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold hover:bg-emerald-500/20 transition border border-emerald-500/20"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Call</span>
          </a>
        )}
      </div>

      {/* ─── Progress Bar ─────────────────────────────────────────────────── */}
      {routeLoaded && !routeError && steps.length > 0 && (
        <div className="h-1 bg-outline-variant/30 z-20 relative">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* ─── Current Step Banner ──────────────────────────────────────────── */}
      {routeLoaded && !routeError && currentStep && (
        <div className="z-20 bg-primary shadow-lg">
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Turn icon */}
            <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              {getStepIcon(currentStep.type)}
            </div>

            {/* Instruction */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-snug line-clamp-2">
                {currentStep.instruction}
              </p>
              {currentStep.distance > 0 && (
                <p className="text-white/70 text-xs mt-0.5 font-medium">
                  in {formatDist(currentStep.distance)}
                </p>
              )}
            </div>

            {/* Step nav controls */}
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <button
                onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}
                disabled={currentStepIdx === 0}
                className="p-1.5 rounded-lg bg-white/20 disabled:opacity-30 hover:bg-white/30 transition"
              >
                <ChevronUp className="w-3.5 h-3.5 text-white" />
              </button>
              <span className="text-white/60 text-[10px] font-bold leading-none">
                {currentStepIdx + 1}/{steps.length}
              </span>
              <button
                onClick={() => setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1))}
                disabled={currentStepIdx === steps.length - 1}
                className="p-1.5 rounded-lg bg-white/20 disabled:opacity-30 hover:bg-white/30 transition"
              >
                <ChevronDown className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Map Area ─────────────────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0 z-0" />

        {/* Loading overlay */}
        {!routeLoaded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-surface/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 bg-surface-container-lowest/90 backdrop-blur px-8 py-6 rounded-2xl border border-outline-variant shadow-xl">
              <div className="relative">
                <div className="w-14 h-14 border-4 border-primary/20 rounded-full" />
                <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
                <Navigation className="w-5 h-5 text-primary absolute inset-0 m-auto" />
              </div>
              <p className="text-sm font-semibold text-on-surface">Plotting your route…</p>
              <p className="text-xs text-on-surface-variant -mt-2">Contacting OSRM routing server</p>
            </div>
          </div>
        )}

        {/* ── Right-side Floating Controls ──────────────────────────────── */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          {/* Map style picker button */}
          <div className="relative">
            <button
              onClick={() => { setShowStylePicker(!showStylePicker); setShowStepsPanel(false); }}
              className={`w-10 h-10 rounded-xl border shadow-md flex items-center justify-center transition ${
                showStylePicker
                  ? "bg-primary border-primary text-on-primary"
                  : "bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container"
              }`}
              title="Change map style"
            >
              <styleObj.icon className="w-4 h-4" />
            </button>

            {/* Style picker dropdown */}
            {showStylePicker && (
              <div className="absolute right-12 top-0 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden w-44 animate-in slide-in-from-right-2 fade-in duration-150">
                <div className="px-3 py-2 border-b border-outline-variant">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Map Style</p>
                </div>
                {MAP_STYLES.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => { setMapStyle(s.id); setShowStylePicker(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition hover:bg-surface-container ${
                        mapStyle === s.id
                          ? "bg-primary/10 font-bold text-primary"
                          : "text-on-surface font-medium"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        mapStyle === s.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {s.label}
                      {mapStyle === s.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md flex items-center justify-center hover:bg-surface-container transition"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-on-surface" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md flex items-center justify-center hover:bg-surface-container transition"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-on-surface" />
          </button>

          {/* Recenter / Fit route */}
          <button
            onClick={handleRecenter}
            className="w-10 h-10 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md flex items-center justify-center hover:bg-surface-container transition"
            title="Fit route"
          >
            <Crosshair className="w-4 h-4 text-primary" />
          </button>

          {/* ── Locate Me ── */}
          <button
            onClick={handleLocateMe}
            disabled={locateStatus === "loading"}
            className={`w-10 h-10 border rounded-xl shadow-md flex items-center justify-center transition disabled:opacity-60 ${
              locateStatus === "found"
                ? "bg-emerald-500 border-emerald-500 text-white"
                : locateStatus === "denied" || locateStatus === "unavailable"
                ? "bg-error border-error text-on-error"
                : "bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container"
            }`}
            title={
              locateStatus === "loading" ? "Getting location…"
              : locateStatus === "denied" ? "Permission denied"
              : locateStatus === "unavailable" ? "Location unavailable"
              : locateStatus === "found" ? "Location found!"
              : "Show my location"
            }
          >
            {locateStatus === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4" />
            )}
          </button>

          {/* Directions list */}
          {steps.length > 0 && (
            <button
              onClick={() => { setShowStepsPanel(!showStepsPanel); setShowStylePicker(false); }}
              className={`w-10 h-10 border rounded-xl shadow-md flex items-center justify-center transition ${
                showStepsPanel
                  ? "bg-primary border-primary text-on-primary"
                  : "bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container"
              }`}
              title="All directions"
            >
              <Layers className="w-4 h-4" />
            </button>
          )}

          {/* Locate status toast (denied / unavailable) */}
          {(locateStatus === "denied" || locateStatus === "unavailable") && (
            <div className="absolute right-12 top-[160px] bg-error text-on-error text-xs font-semibold px-3 py-2 rounded-xl shadow-lg w-44 animate-in fade-in slide-in-from-right-2 duration-200">
              {locateStatus === "denied"
                ? "Location access denied. Enable it in browser settings."
                : "Could not get your location. Try again."}
            </div>
          )}
          {locateStatus === "found" && (
            <div className="absolute right-12 top-[160px] bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg w-36 animate-in fade-in slide-in-from-right-2 duration-200">
              📍 Location found!
            </div>
          )}
        </div>

        {/* ── Stats Floating Card (bottom-left) ─────────────────────────── */}
        {routeLoaded && !routeError && totalSecs > 0 && (
          <div className="absolute left-3 bottom-3 z-20">
            <button
              onClick={() => setShowStats(!showStats)}
              className="mb-1.5 flex items-center gap-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider hover:text-primary transition"
            >
              <TrendingUp className="w-3 h-3" />
              {showStats ? "Hide" : "Stats"}
            </button>
            {showStats && (
              <div className="bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="grid grid-cols-3 divide-x divide-outline-variant">
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide">Distance</p>
                    <p className="text-sm font-black text-on-surface mt-0.5">{formatDist(totalDistM)}</p>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide">Duration</p>
                    <p className="text-sm font-black text-primary mt-0.5">{formatDuration(totalSecs)}</p>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide">Avg Speed</p>
                    <p className="text-sm font-black text-on-surface mt-0.5">{calcSpeed(totalDistM, totalSecs)}</p>
                  </div>
                </div>
                <div className="border-t border-outline-variant px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-[10px] text-on-surface-variant truncate max-w-[80px]">
                      {startLoc.label ?? "Start"}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-outline" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-on-surface-variant truncate max-w-[80px]">
                      {endLoc.label ?? "Destination"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Turn-by-Turn Slide Panel ───────────────────────────────────── */}
        {showStepsPanel && steps.length > 0 && (
          <>
            <div
              className="absolute inset-0 z-30 bg-black/20"
              onClick={() => setShowStepsPanel(false)}
            />
            <div className="absolute inset-y-0 right-0 z-40 w-80 max-w-[85vw] bg-surface-container-lowest flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container-low">
                <div>
                  <h3 className="font-bold text-on-surface text-sm">Turn-by-Turn</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">{steps.length} steps · {formatDist(totalDistM)}</p>
                </div>
                <button
                  onClick={() => setShowStepsPanel(false)}
                  className="p-1.5 rounded-full hover:bg-surface-container transition"
                >
                  <X className="w-4 h-4 text-on-surface-variant" />
                </button>
              </div>

              {/* ETA strip */}
              <div className="px-4 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary">
                  Arrive by {formatETA(totalSecs)} · {formatDuration(totalSecs)} away
                </span>
              </div>

              <div className="flex-1 overflow-y-auto">
                {steps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentStepIdx(idx); setShowStepsPanel(false); }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition border-b border-outline-variant/40 last:border-0 ${
                      idx === currentStepIdx
                        ? "bg-primary/8 border-l-[3px] border-l-primary"
                        : "hover:bg-surface-container"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${
                        idx === currentStepIdx
                          ? "bg-primary"
                          : idx < currentStepIdx
                          ? "bg-emerald-500"
                          : "bg-surface-container-high"
                      }`}
                    >
                      {idx < currentStepIdx ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : idx === currentStepIdx ? (
                        <Navigation className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <span className="text-[11px] font-bold text-on-surface-variant">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          idx === currentStepIdx
                            ? "font-bold text-primary"
                            : idx < currentStepIdx
                            ? "text-on-surface-variant line-through"
                            : "font-medium text-on-surface"
                        }`}
                      >
                        {step.instruction}
                      </p>
                      {step.distance > 0 && (
                        <p className="text-xs text-on-surface-variant mt-0.5">{formatDist(step.distance)}</p>
                      )}
                    </div>
                    {idx === currentStepIdx && (
                      <span className="flex-shrink-0 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                        NOW
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Destination footer */}
              <div className="px-4 py-3 border-t border-outline-variant bg-surface-container-low flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{endLoc.label ?? "Destination"}</p>
                  <p className="text-xs text-on-surface-variant">Final destination</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── Bottom Action Bar ────────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest border-t border-outline-variant z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {showArrivalConfirm ? (
          <div className="px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-bold text-on-surface">Confirm you've arrived?</p>
            </div>
            <p className="text-xs text-on-surface-variant -mt-1">
              This will mark the job as completed for the customer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowArrivalConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-semibold text-sm hover:bg-surface-container transition"
              >
                Not yet
              </button>
              <button
                onClick={() => { onArrived?.(); onClose(); }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Yes, Arrived!
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 flex items-center gap-3">
            {/* Destination info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <p className="text-sm font-bold text-on-surface truncate">
                  {endLoc.label ?? "Customer Location"}
                </p>
              </div>
              {routeLoaded && !routeError && totalSecs > 0 && (
                <p className="text-xs text-on-surface-variant mt-0.5 ml-3.5">
                  {formatDist(totalDistM)} · ~{formatDuration(totalSecs)} · ETA {formatETA(totalSecs)}
                </p>
              )}
            </div>

            {/* Arrived button */}
            <button
              onClick={() => setShowArrivalConfirm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 active:scale-[0.97] transition shadow-sm flex-shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              Arrived
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
