"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [viewingDispute, setViewingDispute] = useState<any | null>(null);

  const fetchDisputes = async () => {
    try {
      const res = await fetch("/api/admin/disputes");
      if (res.ok) {
        const data = await res.json();
        setDisputes(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (jobId: string, resolution: 'FAVOR_MERCHANT' | 'FAVOR_CUSTOMER') => {
    if (!confirm(`Are you sure you want to resolve this dispute in favor of the ${resolution === 'FAVOR_MERCHANT' ? 'Merchant' : 'Customer'}?`)) return;
    setResolvingId(jobId);
    try {
      const res = await fetch("/api/admin/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, resolution })
      });
      if (res.ok) {
        setDisputes(disputes.filter((d) => d.id !== jobId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Active Disputes</h1>
        <p className="text-on-surface-variant text-sm mt-1">Review and resolve job disputes between customers and merchants.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container-low border-b border-outline-variant text-xs uppercase text-on-surface-variant font-semibold">
              <tr>
                <th className="px-6 py-4">Job Info</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center animate-pulse">Loading...</td></tr>
              ) : disputes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
                      <div className="text-lg font-bold text-on-surface">No Active Disputes</div>
                      <div className="text-sm text-on-surface-variant mt-1">All issues have been resolved.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                disputes.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-error" /> {d.serviceName}
                      </div>
                      <div className="text-xs text-on-surface-variant mt-1">ID: {d.id.slice(0,8)}...</div>
                      <div className="text-xs text-on-surface-variant mt-1 italic max-w-xs truncate">"{d.customerNote}"</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{d.customer?.name}</div>
                      <div className="text-xs text-on-surface-variant">{d.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {d.merchant ? (
                        <>
                          <div className="font-bold">{d.merchant.name}</div>
                          <div className="text-xs text-on-surface-variant">{d.merchant.email}</div>
                        </>
                      ) : (
                        <div className="text-xs text-on-surface-variant">Unassigned</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      NGN {d.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col gap-2 items-end">
                        <button 
                          onClick={() => setViewingDispute(d)}
                          className="text-xs bg-surface-container-high text-on-surface hover:bg-surface-container-highest px-3 py-1.5 rounded-lg font-semibold transition-colors w-max"
                        >
                          Review Evidence
                        </button>
                        <button 
                          disabled={resolvingId === d.id}
                          onClick={() => handleResolve(d.id, 'FAVOR_MERCHANT')} 
                          className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-semibold transition-colors w-max disabled:opacity-50"
                        >
                          Favor Merchant
                        </button>
                        <button 
                          disabled={resolvingId === d.id}
                          onClick={() => handleResolve(d.id, 'FAVOR_CUSTOMER')} 
                          className="text-xs bg-error/10 text-error hover:bg-error/20 px-3 py-1.5 rounded-lg font-semibold transition-colors w-max disabled:opacity-50"
                        >
                          Favor Customer (Refund)
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Evidence Modal */}
      {viewingDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={(e) => { if (e.target === e.currentTarget) setViewingDispute(null); }}>
          <div className="bg-surface w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-error" /> Review Dispute Evidence
              </h3>
              <button onClick={() => setViewingDispute(null)} className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6">
              {/* Customer Side */}
              <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-error mb-4 border-b border-outline-variant pb-2">Customer Claim</h4>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Customer</div>
                  <div className="font-bold text-sm">{viewingDispute.customer?.name}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Explanation</div>
                  <div className="text-sm bg-error-container/10 p-3 rounded-lg italic text-on-surface">
                    {viewingDispute.customerDisputeEvidenceText ? `"${viewingDispute.customerDisputeEvidenceText}"` : <span className="text-on-surface-variant opacity-70">No text provided.</span>}
                  </div>
                </div>
                {viewingDispute.customerDisputeEvidenceImages?.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Attached Evidence</div>
                    <div className="grid grid-cols-2 gap-2">
                      {viewingDispute.customerDisputeEvidenceImages.map((img: string, i: number) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer">
                          <img src={img} alt="Customer Evidence" className="w-full h-24 object-cover rounded-lg border border-outline-variant hover:opacity-80 transition" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Merchant Side */}
              <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-primary mb-4 border-b border-outline-variant pb-2">Merchant Defense</h4>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Merchant</div>
                  <div className="font-bold text-sm">{viewingDispute.merchant?.name || "Unassigned"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Explanation</div>
                  <div className="text-sm bg-primary/5 p-3 rounded-lg italic text-on-surface">
                    {viewingDispute.merchantDisputeEvidenceText ? `"${viewingDispute.merchantDisputeEvidenceText}"` : <span className="text-on-surface-variant opacity-70">No defense submitted yet.</span>}
                  </div>
                </div>
                {viewingDispute.merchantDisputeEvidenceImages?.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Attached Evidence</div>
                    <div className="grid grid-cols-2 gap-2">
                      {viewingDispute.merchantDisputeEvidenceImages.map((img: string, i: number) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer">
                          <img src={img} alt="Merchant Evidence" className="w-full h-24 object-cover rounded-lg border border-outline-variant hover:opacity-80 transition" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex justify-end gap-3">
              <button 
                onClick={() => {
                  handleResolve(viewingDispute.id, 'FAVOR_CUSTOMER');
                  setViewingDispute(null);
                }}
                disabled={resolvingId === viewingDispute.id}
                className="px-6 py-2.5 bg-error text-white font-bold rounded-xl shadow-sm hover:bg-error/90 transition-colors disabled:opacity-50"
              >
                Resolve in Favor of Customer
              </button>
              <button 
                onClick={() => {
                  handleResolve(viewingDispute.id, 'FAVOR_MERCHANT');
                  setViewingDispute(null);
                }}
                disabled={resolvingId === viewingDispute.id}
                className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow-sm hover:opacity-90 transition-colors disabled:opacity-50"
              >
                Resolve in Favor of Merchant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
