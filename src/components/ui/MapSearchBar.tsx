"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";

interface MapSearchBarProps {
  onLocationSelect: (lat: number, lng: number, displayName: string) => void;
  className?: string;
}

export default function MapSearchBar({ onLocationSelect, className = "" }: MapSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const skipNextSearchRef = useRef(false);

  // Debounce search
  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (!query.trim() || query.length < 3) {
      if (!query.trim()) {
        setResults([]);
        setShowResults(false);
      }
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Geocoding failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (lat: string, lon: string, displayName: string) => {
    onLocationSelect(parseFloat(lat), parseFloat(lon), displayName);
    setShowResults(false);
    skipNextSearchRef.current = true;
    setQuery(displayName.split(",")[0]); // Set a shorter version in the input
  };

  return (
    <div ref={wrapperRef} className={`relative z-[1000] w-full ${className}`}>
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          onFocus={() => { if (results.length > 0) setShowResults(true); }}
          placeholder="Search location..."
          className="w-full bg-surface text-on-surface pl-10 pr-10 py-2.5 rounded-xl shadow-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        />
        <Search className="absolute left-3.5 w-4 h-4 text-on-surface-variant pointer-events-none" />
        
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); setShowResults(false); }}
            className="absolute right-10 p-1 text-on-surface-variant hover:text-on-surface pointer-events-auto"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => handleSearch()}
          className="absolute right-2 p-1.5 bg-primary text-on-primary rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          disabled={isSearching}
        >
          {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-surface rounded-xl shadow-lg border border-outline-variant overflow-hidden max-h-60 overflow-y-auto">
          {results.map((res, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(res.lat, res.lon, res.display_name)}
              className="w-full flex items-start gap-3 p-3 text-left hover:bg-surface-container-low border-b border-outline-variant/50 last:border-0 transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-xs text-on-surface line-clamp-2">{res.display_name}</span>
            </button>
          ))}
        </div>
      )}
      
      {showResults && results.length === 0 && !isSearching && query && (
        <div className="absolute top-full mt-2 w-full bg-surface rounded-xl shadow-lg border border-outline-variant p-4 text-center">
          <span className="text-xs text-on-surface-variant">No locations found.</span>
        </div>
      )}
    </div>
  );
}
