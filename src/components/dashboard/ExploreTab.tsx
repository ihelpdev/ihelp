"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { addJob } from "@/lib/features/jobs/jobsSlice";
import { lockEscrow } from "@/lib/features/wallet/walletSlice";
import {
  Search, ChevronDown, ChevronUp, X,
  Clock, Briefcase, CheckCircle2, ArrowRight, ShieldCheck, Lock
} from "lucide-react";
import { RootState } from "@/lib/store";

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

  const [search,     setSearch]     = useState("");
  const [showAllOD,  setShowAllOD]  = useState(false);
  const [showAllSub, setShowAllSub] = useState(false);
  const [modal,      setModal]      = useState<ModalState | null>(null);
  const [toast,      setToast]      = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const profileCompleted = useSelector((state: RootState) => state.auth.profileCompleted);
  // Portal mount guard — ensures createPortal only runs client-side
  const [mounted,    setMounted]    = useState(false);
  const [onDemand,   setOnDemand]   = useState<any[]>([]);
  
  useEffect(() => { 
    setMounted(true); 
    const fetchOnDemand = async () => {
      try {
        const res = await fetch("/api/services/on-demand");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setOnDemand(data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching on-demand services:", err);
      }
    };
    fetchOnDemand();
  }, []);

  const filterFn = (s: { name: string; description: string }) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase());

  const filteredOD  = onDemand.filter(filterFn);
  const filteredSub = SUBS.filter(filterFn);
  const visibleOD   = showAllOD  ? filteredOD  : filteredOD.slice(0, 2);
  const visibleSub  = showAllSub ? filteredSub : filteredSub.slice(0, 2);

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
  const close   = () => setModal(null);

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
          amount: odSvc.suggested_base_rate_ngn
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

        {/* On-Demand */}
        <section>
          <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-primary" /> On-Demand Pros
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleOD.map(svc => (
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
              />
            ))}
          </div>
          {filteredOD.length > 2 && (
            <ToggleBtn expanded={showAllOD} count={filteredOD.length} label="services" onClick={() => setShowAllOD(v => !v)} />
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

function ServiceCard({ title, badge, badgeClass, description, meta, locked, onSelect, coverImageUrl, tags }: {
  title: string; badge: string; badgeClass: string; description: string; meta: string; locked?: boolean; onSelect: () => void;
  coverImageUrl?: string | null; tags?: string[];
}) {
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
        <p className="text-xs text-on-surface-variant leading-relaxed flex-1">{description}</p>
        
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
