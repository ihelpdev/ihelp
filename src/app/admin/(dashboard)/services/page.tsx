"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LayoutList, ChevronLeft, ChevronRight, Star, CheckCircle2,
  XCircle, Loader2, AlertTriangle, User,
} from "lucide-react";

interface ServiceListing {
  id: string;
  name: string;
  description: string;
  category: string;
  baseRateNgn: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  merchant: { id: string; name: string; email: string };
  ratingAvg: number | null;
  ratingCount: number;
}

interface Meta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ToggleState {
  listing: ServiceListing;
  targetActive: boolean;
}

const UNIT_LABELS: Record<string, string> = {
  hour: "/ hr",
  job: "/ job",
  fixed_diagnostic: "Fixed",
  sq_meter: "/ m²",
  unit: "/ unit",
};

export default function AdminServicesPage() {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, pageSize: 20, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Modal state
  const [toggleTarget, setToggleTarget] = useState<ToggleState | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchListings = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services?page=${p}`);
      const data = await res.json();
      if (data.success) {
        setListings(data.data);
        setMeta(data.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings(page);
  }, [page, fetchListings]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const openModal = (listing: ServiceListing, targetActive: boolean) => {
    setToggleTarget({ listing, targetActive });
    setAdminMessage("");
  };

  const closeModal = () => {
    setToggleTarget(null);
    setAdminMessage("");
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: toggleTarget.listing.id,
          isActive: toggleTarget.targetActive,
          adminMessage: adminMessage || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === toggleTarget.listing.id
              ? { ...l, isActive: toggleTarget.targetActive }
              : l
          )
        );
        const verb = toggleTarget.targetActive ? "enabled" : "disabled";
        showToast(
          `"${toggleTarget.listing.name}" ${verb}${
            adminMessage ? " — message sent to merchant" : ""
          }.`
        );
        closeModal();
      } else {
        showToast("Failed to update service.");
      }
    } catch {
      showToast("An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto relative">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[200] bg-surface-container-lowest border border-outline-variant shadow-xl rounded-xl px-5 py-3.5 text-sm font-medium text-on-surface animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-sm">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
            <LayoutList className="w-8 h-8 text-primary" />
            Merchant Services
          </h1>
          <p className="text-on-surface-variant mt-2">
            Manage all active and inactive merchant service listings.{" "}
            <span className="font-semibold text-primary">{meta.total}</span> total.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="animate-pulse">Loading services…</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant text-sm">
            No merchant listings found.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="text-left px-5 py-4 font-semibold text-on-surface-variant text-xs uppercase tracking-wide">
                      Service
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-on-surface-variant text-xs uppercase tracking-wide">
                      Merchant
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-on-surface-variant text-xs uppercase tracking-wide">
                      Rate
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-on-surface-variant text-xs uppercase tracking-wide">
                      Rating
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-on-surface-variant text-xs uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right px-5 py-4 font-semibold text-on-surface-variant text-xs uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-on-surface">{l.name}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                          {l.description}
                        </div>
                        <span className="mt-1 inline-block text-3xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium uppercase tracking-wide">
                          {l.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-on-surface">{l.merchant.name}</div>
                            <div className="text-xs text-on-surface-variant">{l.merchant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-on-surface whitespace-nowrap">
                        ₦{l.baseRateNgn.toLocaleString()}
                        <span className="ml-1 text-xs font-normal text-on-surface-variant">
                          {UNIT_LABELS[l.unit] ?? `/ ${l.unit}`}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {l.ratingAvg !== null ? (
                          <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {l.ratingAvg}
                            <span className="text-on-surface-variant font-normal text-xs">
                              ({l.ratingCount})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-on-surface-variant">No ratings</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {l.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 text-xs font-semibold border border-green-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error/10 text-error text-xs font-semibold border border-error/20">
                            <XCircle className="w-3 h-3" /> Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {l.isActive ? (
                          <button
                            onClick={() => openModal(l, false)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-error/10 text-error text-xs font-semibold border border-error/20 hover:bg-error/20 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Disable
                          </button>
                        ) : (
                          <button
                            onClick={() => openModal(l, true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-green-500/10 text-green-700 text-xs font-semibold border border-green-500/20 hover:bg-green-500/20 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Enable
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-outline-variant">
              {listings.map((l) => (
                <div key={l.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-on-surface">{l.name}</div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium uppercase tracking-wide">
                        {l.category}
                      </span>
                    </div>
                    {l.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 text-xs font-semibold border border-green-500/20 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 text-error text-xs font-semibold border border-error/20 whitespace-nowrap">
                        <XCircle className="w-3 h-3" /> Disabled
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-on-surface-variant">{l.merchant.name} · {l.merchant.email}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">₦{l.baseRateNgn.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">{UNIT_LABELS[l.unit] ?? `/ ${l.unit}`}</span></span>
                    {l.isActive ? (
                      <button onClick={() => openModal(l, false)} className="px-3 py-1.5 rounded-lg bg-error/10 text-error text-xs font-semibold border border-error/20">
                        Disable
                      </button>
                    ) : (
                      <button onClick={() => openModal(l, true)} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-700 text-xs font-semibold border border-green-500/20">
                        Enable
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">
            Page <span className="font-semibold">{meta.page}</span> of{" "}
            <span className="font-semibold">{meta.totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg border border-outline-variant text-sm font-medium hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages || loading}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg border border-outline-variant text-sm font-medium hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Confirmation Modal */}
      {toggleTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant flex flex-col gap-6 p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
            {/* Icon + Title */}
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${toggleTarget.targetActive ? "bg-green-500/10" : "bg-error/10"}`}>
                {toggleTarget.targetActive
                  ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                  : <AlertTriangle className="w-5 h-5 text-error" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">
                  {toggleTarget.targetActive ? "Enable" : "Disable"} Service?
                </h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  <span className="font-semibold text-on-surface">"{toggleTarget.listing.name}"</span>{" "}
                  by{" "}
                  <span className="font-semibold">{toggleTarget.listing.merchant.name}</span>
                  {" "}will be{" "}
                  {toggleTarget.targetActive ? (
                    <span className="text-green-700 font-semibold">re-enabled</span>
                  ) : (
                    <span className="text-error font-semibold">hidden from customers</span>
                  )}.
                </p>
              </div>
            </div>

            {/* Optional message */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface">
                Message to merchant{" "}
                <span className="text-xs font-normal text-on-surface-variant">(optional — sent as notification)</span>
              </label>
              <textarea
                rows={3}
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                placeholder={
                  toggleTarget.targetActive
                    ? "e.g. Your service has been reviewed and re-enabled."
                    : "e.g. Your service was temporarily disabled due to quality concerns."
                }
                className="p-3 rounded-xl border border-outline-variant bg-surface-container text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none focus:border-primary resize-none transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmToggle}
                disabled={submitting}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors disabled:opacity-60 ${
                  toggleTarget.targetActive
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-error hover:bg-error/90"
                }`}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting
                  ? "Applying…"
                  : toggleTarget.targetActive
                  ? "Enable Service"
                  : "Disable Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
