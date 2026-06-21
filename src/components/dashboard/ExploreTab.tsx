"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { addJob } from "@/lib/features/jobs/jobsSlice";
import { lockEscrow } from "@/lib/features/wallet/walletSlice";
import {
  Search, ChevronDown, ChevronUp, X,
  Clock, Briefcase, CheckCircle2, ArrowRight, ShieldCheck, Lock,
  Droplets, Zap, Car, Wind, Sparkles, WashingMachine, Hammer,
  Brush, Wrench, Leaf, Paintbrush, Shield, Bug, LayoutGrid,
  MessageSquare, ImagePlus, Star, ChevronLeft, Grid2x2, Map as MapIcon, List as ListIcon
} from "lucide-react";
import { RootState } from "@/lib/store";
import dynamic from "next/dynamic";

const ServiceMap = dynamic(() => import("./ServiceMap"), { ssr: false, loading: () => <div className="h-[600px] w-full bg-surface-container rounded-xl animate-pulse" /> });

import servicesRaw from "@/mockup/services.json";

const SUBS        = servicesRaw.subscription_base_services;
const FREQ_MATRIX = servicesRaw.subscription_frequency_matrix;

type FlowStep = "detail" | "frequency" | "confirm" | "success";

interface ModalState {
  kind: "on_demand" | "subscription";
  serviceId: string;
  step: FlowStep;
  frequencyKey: string | null;
}

export default function ExploreTab({ onTabSwitch }: { onTabSwitch?: (tab: string) => void }) {
  const dispatch = useDispatch();

  const [search,               setSearch]               = useState("");
  const [showAllOD,             setShowAllOD]             = useState(false);
  const [showAllSub,            setShowAllSub]            = useState(false);
  const [modal,                 setModal]                 = useState<ModalState | null>(null);
  const [toast,                 setToast]                 = useState<string | null>(null);
  const [isSubmitting,          setIsSubmitting]          = useState(false);
  const [expandedImage,         setExpandedImage]         = useState<string | null>(null);
  const [customerNote,          setCustomerNote]          = useState("");
  const [noteImages,            setNoteImages]            = useState<string[]>([]);
  const [isUploadingNoteImages, setIsUploadingNoteImages] = useState(false);
  const [selectedCategory,      setSelectedCategory]      = useState<string | null>(null);
  const [showAllCategories,     setShowAllCategories]     = useState(false);
  const [isMapExpanded,         setIsMapExpanded]         = useState(false);

  const profileCompleted = useSelector((state: RootState) => state.auth.profileCompleted);
  const [mounted,  setMounted]  = useState(false);
  const [onDemand, setOnDemand] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  
  useEffect(() => { 
    setMounted(true); 
    const fetchOnDemand = async () => {
      try {
        setIsLoadingServices(true);
        const res = await fetch("/api/services/on-demand");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setOnDemand(data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching on-demand services:", err);
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchOnDemand();
  }, []);

  const filterFn = (s: { name: string; description: string }) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase());

  const filteredOD  = onDemand.filter(filterFn);
  const filteredSub = SUBS.filter(filterFn);
  const visibleSub  = showAllSub ? filteredSub : filteredSub.slice(0, 2);

  // Group on-demand services by category, sort by count desc
  const categoryMap: Record<string, any[]> = {};
  filteredOD.forEach(svc => {
    const cat = svc.category || "General";
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(svc);
  });
  const sortedCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1].length - a[1].length);
  const visibleCategories = showAllCategories
    ? sortedCategories
    : sortedCategories.slice(0, 8);

  // Services in the currently selected category
  const categoryServices = selectedCategory
    ? (categoryMap[selectedCategory] || [])
    : [];

  const odSvc  = modal?.kind === "on_demand"    ? onDemand.find(s => s.id === modal.serviceId) ?? null : null;
  const subSvc = modal?.kind === "subscription" ? SUBS.find(s => s.id === modal.serviceId) ?? null      : null;
  const freqEntry = FREQ_MATRIX.find(f => f.frequency_key === modal?.frequencyKey) ?? null;

  const subTotal = subSvc && freqEntry
    ? (() => {
        const raw = subSvc.base_price_per_session_ngn * freqEntry.sessions_per_month;
        return raw - (raw * freqEntry.discount_percentage) / 100;
      })()
    : 0;

  const openOD  = (id: string) => {
    if (!profileCompleted) return setToast("Please complete your profile to book services.");
    setModal({ kind: "on_demand",    serviceId: id, step: "detail", frequencyKey: null });
  };
  const openSub = (id: string) => {
    if (!profileCompleted) return setToast("Please complete your profile to book services.");
    setModal({ kind: "subscription", serviceId: id, step: "detail", frequencyKey: null });
  };
  const goStep  = (step: FlowStep, patch?: Partial<ModalState>) =>
    setModal(m => m ? { ...m, step, ...patch } : null);
  const close   = () => { setModal(null); setCustomerNote(""); setNoteImages([]); };

  // Upload a single image to Cloudinary and append URL to noteImages
  const handleNoteImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingNoteImages(true);
    try {
      const uploaded: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const fd = new FormData();
        fd.append('file', e.target.files[i]);
        fd.append('upload_preset', 'ihelp-images');
        const res = await fetch('https://api.cloudinary.com/v1_1/dik1cosdn/image/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.secure_url) uploaded.push(data.secure_url);
      }
      setNoteImages(prev => [...prev, ...uploaded]);
    } catch {
      setToast('Image upload failed. Please try again.');
    } finally {
      setIsUploadingNoteImages(false);
      // reset the input so the same file can be re-selected if needed
      e.target.value = '';
    }
  };

  const removeNoteImage = (idx: number) =>
    setNoteImages(prev => prev.filter((_, i) => i !== idx));

  const confirmOD = async () => {
    if (!odSvc) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'on_demand',
          serviceId: odSvc.id,
          serviceName: odSvc.name,
          amount: odSvc.suggested_base_rate_ngn,
          customerNote: customerNote.trim() || null,
          customerNoteImages: noteImages,
        })
      });
      
      if (!res.ok) throw new Error('Failed to create job');
      const data = await res.json();

      dispatch(addJob(data.data)); // The API returns the exact Job shape
      dispatch(lockEscrow({ amount: odSvc.suggested_base_rate_ngn, description: `Escrow locked — ${odSvc.name}` }));
      goStep("success");
    } catch (error) {
      setToast("Failed to book service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmSub = async () => {
    if (!subSvc || !freqEntry) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          serviceId: subSvc.id,
          serviceName: subSvc.name,
          amount: subTotal,
          frequency: freqEntry.frequency_key
        })
      });

      if (!res.ok) throw new Error('Failed to create subscription');
      const data = await res.json();

      dispatch(addJob(data.data)); // The API returns the exact Job shape
      dispatch(lockEscrow({ amount: subTotal, description: `Subscription — ${subSvc.name} (${freqEntry.label})` }));
      goStep("success");
    } catch (error) {
      setToast("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Modal JSX (rendered via portal into document.body) ──────────────────────
  const modalJSX = modal ? (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "16px", backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div style={{ backgroundColor: "#ffffff", width: "100%", maxWidth: "480px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <span style={{ fontWeight: 600, color: "#111827", fontSize: "15px" }}>
            {odSvc?.name ?? subSvc?.name ?? "Service Details"}
          </span>
          <button onClick={close} style={{ padding: "4px", borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer" }}>
            <X style={{ width: 20, height: 20, color: "#6b7280" }} />
          </button>
        </div>

        <div style={{ padding: "20px" }}>

          {/* ON-DEMAND: DETAIL */}
          {modal.kind === "on_demand" && modal.step === "detail" && odSvc && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {odSvc.images && odSvc.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
                  {odSvc.images.map((img: string, idx: number) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`Preview ${idx + 1}`} 
                      onClick={() => setExpandedImage(img)}
                      className="w-28 h-28 object-cover rounded-xl shrink-0 snap-center border border-outline-variant shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  ))}
                </div>
              )}
              <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.6 }}>{odSvc.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", background: "#f9fafb", borderRadius: "10px", padding: "12px 16px", fontSize: "14px" }}>
                <span style={{ color: "#6b7280" }}>Rate</span>
                <strong style={{ color: "#002d62" }}>NGN {odSvc.suggested_base_rate_ngn.toLocaleString()} / {odSvc.unit}</strong>
              </div>
              <InfoBox lines={["Vetted pro dispatched to your location.", "Payment held in escrow until completion.", "Funds released after your confirmation."]} />
              {/* Customer note + images */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MessageSquare style={{ width: 14, height: 14, color: "#6b7280" }} />
                  Note for provider <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
                </label>
                <textarea
                  value={customerNote}
                  onChange={e => setCustomerNote(e.target.value)}
                  placeholder="e.g. Gate code is 1234. Please call before arriving."
                  rows={3}
                  style={{
                    width: "100%", resize: "none", padding: "10px 12px",
                    borderRadius: "10px", border: "1.5px solid #e5e7eb",
                    fontSize: "13px", color: "#111827", outline: "none",
                    fontFamily: "inherit", lineHeight: 1.5,
                    boxSizing: "border-box",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#002d62")}
                  onBlur={e  => (e.target.style.borderColor = "#e5e7eb")}
                />

                {/* Thumbnail strip + upload button */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                  {noteImages.map((url, idx) => (
                    <div key={idx} style={{ position: "relative", width: 60, height: 60, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb", flexShrink: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Attachment ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => removeNoteImage(idx)}
                        style={{
                          position: "absolute", top: 2, right: 2,
                          background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%",
                          width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", padding: 0,
                        }}
                      >
                        <X style={{ width: 10, height: 10, color: "#fff" }} />
                      </button>
                    </div>
                  ))}

                  {/* Upload trigger */}
                  <label style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 8,
                    border: "1.5px dashed #d1d5db", cursor: isUploadingNoteImages ? "not-allowed" : "pointer",
                    fontSize: 12, fontWeight: 500, color: "#6b7280",
                    background: "#f9fafb", flexShrink: 0,
                    opacity: isUploadingNoteImages ? 0.6 : 1,
                  }}>
                    <ImagePlus style={{ width: 14, height: 14 }} />
                    {isUploadingNoteImages ? "Uploading…" : "Add photos"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={isUploadingNoteImages}
                      onChange={handleNoteImageUpload}
                    />
                  </label>
                </div>
              </div>
              <ModalBtn label={`Request ${odSvc?.name}`} onClick={() => goStep("confirm")} />
            </div>
          )}

          {/* ON-DEMAND: CONFIRM */}
          {modal.kind === "on_demand" && modal.step === "confirm" && odSvc && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "14px", color: "#4b5563" }}>Confirm and lock escrow funds to proceed.</p>
              <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                <SummaryRow label="Service" value={odSvc.name} />
                <SummaryRow label="Escrow Amount" value={`NGN ${odSvc.suggested_base_rate_ngn.toLocaleString()}`} highlight />
                {(customerNote.trim() || noteImages.length > 0) && (
                  <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px", marginTop: "4px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {customerNote.trim() && (
                      <div>
                        <div style={{ color: "#6b7280", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                          <MessageSquare style={{ width: 12, height: 12 }} /> Your note
                        </div>
                        <div style={{ color: "#374151", fontSize: "13px", fontStyle: "italic" }}>&ldquo;{customerNote.trim()}&rdquo;</div>
                      </div>
                    )}
                    {noteImages.length > 0 && (
                      <div>
                        <div style={{ color: "#6b7280", marginBottom: 6, fontSize: 12 }}>Attached photos ({noteImages.length})</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {noteImages.map((url, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={i}
                              src={url}
                              alt={`Attachment ${i + 1}`}
                              onClick={() => setExpandedImage(url)}
                              style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer" }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <ModalBtn label={isSubmitting ? "Confirming..." : "Confirm & Lock Funds"} onClick={confirmOD} icon={<ShieldCheck style={{ width: 16, height: 16 }} />} disabled={isSubmitting} />
            </div>
          )}

          {/* SUBSCRIPTION: DETAIL */}
          {modal.kind === "subscription" && modal.step === "detail" && subSvc && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.6 }}>{subSvc.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", background: "#f9fafb", borderRadius: "10px", padding: "12px 16px", fontSize: "14px" }}>
                <span style={{ color: "#6b7280" }}>Base price</span>
                <strong style={{ color: "#002d62" }}>NGN {subSvc.base_price_per_session_ngn.toLocaleString()} / session</strong>
              </div>
              <InfoBox lines={["Same trusted professional every session.", "Discounts on weekly & bi-weekly frequencies.", "Cancel or pause anytime."]} />
              <ModalBtn label="Choose Frequency" onClick={() => goStep("frequency")} />
            </div>
          )}

          {/* SUBSCRIPTION: FREQUENCY */}
          {modal.kind === "subscription" && modal.step === "frequency" && subSvc && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>How often do you need this?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {FREQ_MATRIX.map(f => {
                  const raw   = subSvc.base_price_per_session_ngn * f.sessions_per_month;
                  const total = raw - (raw * f.discount_percentage) / 100;
                  const sel   = modal.frequencyKey === f.frequency_key;
                  return (
                    <button
                      key={f.frequency_key}
                      onClick={() => goStep("frequency", { frequencyKey: f.frequency_key })}
                      style={{
                        width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
                        border: `2px solid ${sel ? "#002d62" : "#e5e7eb"}`,
                        background: sel ? "#eff4ff" : "#fff",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{f.label}</div>
                        {f.discount_percentage > 0 && <div style={{ fontSize: "12px", color: "#16a34a", marginTop: 2 }}>{f.discount_percentage}% discount</div>}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#002d62" }}>NGN {total.toLocaleString()}</div>
                        <div style={{ fontSize: "12px", color: "#9ca3af" }}>/month</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <ModalBtn label="Review Subscription" onClick={() => goStep("confirm")} disabled={!modal.frequencyKey} />
            </div>
          )}

          {/* SUBSCRIPTION: CONFIRM */}
          {modal.kind === "subscription" && modal.step === "confirm" && subSvc && freqEntry && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "14px", color: "#4b5563" }}>Review your subscription before confirming.</p>
              <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                <SummaryRow label="Service"   value={subSvc.name} />
                <SummaryRow label="Frequency" value={freqEntry.label} />
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px" }}>
                  <SummaryRow label="Monthly Total" value={`NGN ${subTotal.toLocaleString()}`} highlight />
                </div>
              </div>
              <ModalBtn label={isSubmitting ? "Confirming..." : "Confirm Subscription"} onClick={confirmSub} icon={<ShieldCheck style={{ width: 16, height: 16 }} />} disabled={isSubmitting} />
            </div>
          )}

          {/* SUCCESS */}
          {modal.step === "success" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "16px 0", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 style={{ width: 36, height: 36, color: "#16a34a" }} />
              </div>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "#111827" }}>
                {modal.kind === "on_demand"
                  ? "Request placed! A pro will be assigned shortly."
                  : "Subscription activated! Your first session will be scheduled soon."}
              </p>
              <button
                onClick={() => { close(); onTabSwitch?.("bookings"); }}
                style={{ width: "100%", marginTop: 8, background: "#002d62", color: "#fff", padding: "14px", borderRadius: "12px", fontWeight: 600, fontSize: "15px", border: "none", cursor: "pointer" }}
              >
                View in Bookings
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  ) : null;

  const imageViewerJSX = expandedImage ? (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={() => setExpandedImage(null)}
    >
      <button onClick={() => setExpandedImage(null)} style={{ position: "absolute", top: 24, right: 24, padding: "8px", borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", cursor: "pointer", color: "#fff" }}>
        <X style={{ width: 24, height: 24 }} />
      </button>
      <img src={expandedImage} alt="Expanded preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px" }} />
    </div>
  ) : null;

  return (
    <>
      {toast && (
        <div className="fixed top-20 right-6 bg-error text-on-error px-4 py-3 rounded-xl shadow-xl z-[100] flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium">{toast}</span>
          <button onClick={() => setToast(null)}><X className="w-4 h-4 opacity-80 hover:opacity-100" /></button>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {/* Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Explore Services</h2>
            <p className="text-sm text-on-surface-variant mt-1">Find vetted pros or set up a recurring subscription.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Map View */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-on-surface flex items-center gap-2 text-sm">
              <MapIcon className="w-4 h-4 text-primary" /> Services Near You
            </h3>
            <button 
              onClick={() => setIsMapExpanded(!isMapExpanded)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              {isMapExpanded ? "Collapse Map" : "Expand Map"}
            </button>
          </div>
          <ServiceMap 
            services={filteredOD} 
            onSelectService={openOD} 
            locked={!profileCompleted} 
            heightClass={isMapExpanded ? "h-[600px]" : "h-[300px]"}
          />
        </section>

        {/* Browse Categories */}
        <section>
          {isLoadingServices ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-40 bg-surface-container rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <div key={n} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-outline-variant bg-surface-container-lowest h-[116px] animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-surface-container"></div>
                    <div className="h-3 w-20 bg-surface-container rounded mt-1"></div>
                    <div className="h-2 w-12 bg-surface-container rounded mt-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedCategory ? (
            // ── Drill-down: services within a category ──
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" /> All Categories
                </button>
                <span className="text-on-surface-variant text-sm">/</span>
                <span className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                  {getCategoryIcon(selectedCategory)} {selectedCategory}
                </span>
                <span className="ml-auto text-xs text-on-surface-variant">{categoryServices.length} service{categoryServices.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryServices.map((svc: any) => (
                  <ServiceCard
                    key={svc.id}
                    title={svc.name}
                    badge="Pro"
                    badgeClass="bg-primary-container text-on-primary-container"
                    description={svc.description}
                    meta={`NGN ${svc.suggested_base_rate_ngn.toLocaleString()} / ${svc.unit === "hour" ? "hr" : svc.unit}`}
                    locked={!profileCompleted}
                    onSelect={() => openOD(svc.id)}
                    coverImageUrl={svc.coverImageUrl}
                    tags={svc.tags}
                    category={svc.category}
                    ratingAvg={svc.ratingAvg}
                    ratingCount={svc.ratingCount}
                  />
                ))}
              </div>
              {categoryServices.length === 0 && (
                <p className="text-sm text-on-surface-variant text-center py-8">No services in this category yet.</p>
              )}
            </div>
          ) : (
            // ── Category grid ──
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-on-surface flex items-center gap-2 text-sm">
                  <Grid2x2 className="w-4 h-4 text-primary" /> Browse Categories
                </h3>
                <span className="text-xs text-on-surface-variant">{sortedCategories.length} categories</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {visibleCategories.map(([cat, svcs]) => {
                  const colorCls = CATEGORY_COLORS[cat] ?? "bg-surface-container text-on-surface-variant";
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-outline-variant bg-surface-container-lowest hover:shadow-md hover:border-primary/40 transition-all group text-center`}
                    >
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorCls} group-hover:scale-110 transition-transform`}>
                        {getCategoryIconLg(cat)}
                      </span>
                      <span className="text-xs font-semibold text-on-surface leading-tight">{cat}</span>
                      {/* <span className="text-[10px] text-on-surface-variant">{svcs.length} service{svcs.length !== 1 ? "s" : ""}</span> */}
                    </button>
                  );
                })}
              </div>
              {sortedCategories.length > 8 && (
                <button
                  onClick={() => setShowAllCategories(v => !v)}
                  className="flex items-center gap-1 text-primary font-semibold text-sm hover:underline mt-1"
                >
                  {showAllCategories
                    ? <><ChevronUp className="w-4 h-4" /> Show less</>  
                    : <><ChevronDown className="w-4 h-4" /> View all {sortedCategories.length} categories</>}
                </button>
              )}
              {sortedCategories.length === 0 && onDemand.length === 0 && (
                <p className="text-sm text-on-surface-variant text-center py-8">No services available yet.</p>
              )}
            </div>
          )}
        </section>

        {/* Subscriptions */}
        <section>
          <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-on-tertiary-container" /> Managed Subscriptions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleSub.map(svc => (
              <ServiceCard
                key={svc.id}
                title={svc.name}
                badge="Flex"
                badgeClass="bg-tertiary-container text-on-tertiary-container"
                description={svc.description}
                meta={`NGN ${svc.base_price_per_session_ngn.toLocaleString()} / session`}
                locked={!profileCompleted}
                onSelect={() => openSub(svc.id)}
              />
            ))}
          </div>
          {filteredSub.length > 2 && (
            <ToggleBtn expanded={showAllSub} count={filteredSub.length} label="subscriptions" onClick={() => setShowAllSub(v => !v)} />
          )}
        </section>
      </div>

      {/* Portal — renders directly into document.body, escaping ALL parent stacking contexts */}
      {mounted && modalJSX && createPortal(modalJSX, document.body)}
      {mounted && imageViewerJSX && createPortal(imageViewerJSX, document.body)}
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────────

function getCategoryIcon(category: string) {
  const cls = "w-3 h-3 shrink-0";
  const map: Record<string, React.ReactNode> = {
    "Plumbing":     <Droplets className={cls} />,
    "Electrical":   <Zap className={cls} />,
    "Auto Mechanic":<Car className={cls} />,
    "AC Repair":    <Wind className={cls} />,
    "Deep Cleaning":<Sparkles className={cls} />,
    "Laundry":      <WashingMachine className={cls} />,
    "Carpentry":    <Hammer className={cls} />,
    "Cleaning":     <Brush className={cls} />,
    "Maintenance":  <Wrench className={cls} />,
    "Repairs":      <Hammer className={cls} />,
    "Gardening":    <Leaf className={cls} />,
    "Painting":     <Paintbrush className={cls} />,
    "Security":     <Shield className={cls} />,
    "Pest Control": <Bug className={cls} />,
    "General":      <LayoutGrid className={cls} />,
  };
  return map[category] ?? <LayoutGrid className={cls} />;
}

function getCategoryIconLg(category: string) {
  const cls = "w-5 h-5";
  const map: Record<string, React.ReactNode> = {
    "Plumbing":     <Droplets className={cls} />,
    "Electrical":   <Zap className={cls} />,
    "Auto Mechanic":<Car className={cls} />,
    "AC Repair":    <Wind className={cls} />,
    "Deep Cleaning":<Sparkles className={cls} />,
    "Laundry":      <WashingMachine className={cls} />,
    "Carpentry":    <Hammer className={cls} />,
    "Cleaning":     <Brush className={cls} />,
    "Maintenance":  <Wrench className={cls} />,
    "Repairs":      <Hammer className={cls} />,
    "Gardening":    <Leaf className={cls} />,
    "Painting":     <Paintbrush className={cls} />,
    "Security":     <Shield className={cls} />,
    "Pest Control": <Bug className={cls} />,
    "General":      <LayoutGrid className={cls} />,
  };
  return map[category] ?? <LayoutGrid className={cls} />;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Plumbing":     "bg-blue-100 text-blue-800",
  "Electrical":   "bg-yellow-100 text-yellow-800",
  "Auto Mechanic":"bg-orange-100 text-orange-800",
  "AC Repair":    "bg-cyan-100 text-cyan-800",
  "Deep Cleaning":"bg-emerald-100 text-emerald-800",
  "Laundry":      "bg-indigo-100 text-indigo-800",
  "Carpentry":    "bg-amber-100 text-amber-800",
  "Cleaning":     "bg-teal-100 text-teal-800",
  "Maintenance":  "bg-gray-100 text-gray-700",
  "Repairs":      "bg-red-100 text-red-800",
  "Gardening":    "bg-green-100 text-green-800",
  "Painting":     "bg-purple-100 text-purple-800",
  "Security":     "bg-slate-100 text-slate-800",
  "Pest Control": "bg-lime-100 text-lime-800",
  "General":      "bg-surface-container text-on-surface-variant",
};

function StarDisplay({ avg, count }: { avg: number | null; count: number }) {
  if (!avg || count === 0) return null;
  const full  = Math.floor(avg);
  const frac  = avg - full;
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => (
        <Star
          key={n}
          className="w-3 h-3"
          fill={n <= full ? "#f59e0b" : (n === full + 1 && frac >= 0.5 ? "#f59e0b" : "none")}
          stroke="#f59e0b"
          strokeWidth={1.5}
        />
      ))}
      <span className="text-[10px] font-semibold text-amber-600">{avg.toFixed(1)}</span>
      <span className="text-[10px] text-on-surface-variant">({count})</span>
    </div>
  );
}

function ServiceCard({ title, badge, badgeClass, description, meta, locked, onSelect, coverImageUrl, tags, category, ratingAvg, ratingCount }: {
  title: string; badge: string; badgeClass: string; description: string; meta: string; locked?: boolean; onSelect: () => void;
  coverImageUrl?: string | null; tags?: string[]; category?: string; ratingAvg?: number | null; ratingCount?: number;
}) {
  const chipClass = category ? (CATEGORY_COLORS[category] ?? "bg-surface-container text-on-surface-variant") : "";
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col hover:border-primary/50 hover:shadow-md transition-all">
      {coverImageUrl && (
        <div className="w-full h-32 bg-surface-container overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-on-surface text-sm leading-snug">{title}</h4>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>{badge}</span>
        </div>
        {category && (
          <span className={`self-start inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${chipClass}`}>
            {getCategoryIcon(category)} {category}
          </span>
        )}
        <p className="text-xs text-on-surface-variant leading-relaxed flex-1">{description}</p>
        <StarDisplay avg={ratingAvg ?? null} count={ratingCount ?? 0} />
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pb-2">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-surface-container rounded-md text-on-surface-variant">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] font-medium px-2 py-0.5 bg-surface-container rounded-md text-on-surface-variant">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-outline-variant pt-3">
        <span className="text-sm font-semibold text-on-surface">{meta}</span>
        <button onClick={onSelect} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-opacity ${locked ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-80' : 'bg-primary text-on-primary hover:opacity-90'}`}>
          {locked && <Lock className="w-3.5 h-3.5" />}
          Select
        </button>
      </div>
      </div>
    </div>
  );
}

function ToggleBtn({ expanded, count, label, onClick }: { expanded: boolean; count: number; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-3 flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
      {expanded ? <><ChevronUp className="w-4 h-4" />Show less</> : <><ChevronDown className="w-4 h-4" />View all {count} {label}</>}
    </button>
  );
}

function InfoBox({ lines }: { lines: string[] }) {
  return (
    <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
      {lines.map((l, i) => (
        <p key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#374151", margin: 0 }}>
          <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>{l}
        </p>
      ))}
    </div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "#6b7280" }}>{label}</span>
      <span style={{ fontWeight: highlight ? 700 : 500, color: highlight ? "#002d62" : "#111827" }}>{value}</span>
    </div>
  );
}

function ModalBtn({ label, onClick, icon, disabled }: { label: string; onClick: () => void; icon?: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        background: disabled ? "#94a3b8" : "#002d62", color: "#fff",
        padding: "14px", borderRadius: "12px", fontWeight: 600, fontSize: "15px",
        border: "none", cursor: disabled ? "not-allowed" : "pointer", marginTop: "4px",
      }}
    >
      {label} {icon ?? <ArrowRight style={{ width: 16, height: 16 }} />}
    </button>
  );
}
