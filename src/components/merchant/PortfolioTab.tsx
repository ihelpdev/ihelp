import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { MerchantListing, blankListing, addListing, updateListing, removeListing, UNIT_LABELS } from "@/lib/features/portfolio/portfolioSlice";
import { Briefcase, Plus, Edit2, Trash2, MapPin, Wrench, Award, CheckCircle2, X } from "lucide-react";

export default function PortfolioTab() {
  const dispatch = useDispatch();
  const { listings } = useSelector((s: RootState) => s.portfolio);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [formData, setFormData]     = useState<Partial<MerchantListing>>(blankListing());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openNewForm = () => {
    setFormData(blankListing());
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (listing: MerchantListing) => {
    setFormData(listing);
    setEditingId(listing.id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleToggleActive = async (listing: MerchantListing) => {
    try {
      const res = await fetch(`/api/merchant/portfolio/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !listing.isActive }),
      });
      if (res.ok) {
        dispatch(updateListing({ ...listing, isActive: !listing.isActive }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`/api/merchant/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        dispatch(removeListing(id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/merchant/portfolio/${editingId}` : "/api/merchant/portfolio";
      const method = editingId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        if (editingId) dispatch(updateListing(data.data));
        else dispatch(addListing(data.data));
        closeForm();
      } else {
        alert(data.message || "Error saving listing");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFormOpen) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">{editingId ? "Edit Service" : "Add New Service"}</h2>
            <p className="text-sm text-on-surface-variant mt-1">Provide details to attract customers.</p>
          </div>
          <button onClick={closeForm} className="p-2 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors"><X className="w-5 h-5 text-on-surface" /></button>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface">Service Name</label>
              <input required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary transition-colors text-sm" placeholder="e.g. Premium Plumbing Repair" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface">Category</label>
              <select value={formData.category || 'General'} onChange={e => setFormData({ ...formData, category: e.target.value })} className="px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary transition-colors text-sm">
                <option value="Pro">Pro Services</option>
                <option value="Home">Home Maintenance</option>
                <option value="Auto">Auto Repairs</option>
                <option value="General">General</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface">Base Rate (NGN)</label>
              <input required type="number" value={formData.baseRateNgn || ''} onChange={e => setFormData({ ...formData, baseRateNgn: Number(e.target.value) })} className="px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary transition-colors text-sm" placeholder="5000" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface">Pricing Unit</label>
              <select value={formData.unit || 'hour'} onChange={e => setFormData({ ...formData, unit: e.target.value as any })} className="px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary transition-colors text-sm">
                {Object.entries(UNIT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-on-surface">Description</label>
            <textarea required value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary transition-colors text-sm resize-none" placeholder="Describe the scope of work..." />
          </div>

          <div className="border-t border-outline-variant pt-6">
            <h3 className="font-semibold text-primary mb-4">Portfolio Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-on-surface">Years of Experience</label>
                <input type="number" value={formData.details?.yearsExperience || 0} onChange={e => setFormData({ ...formData, details: { ...formData.details!, yearsExperience: Number(e.target.value) }})} className="px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary transition-colors text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-on-surface">Coverage Area (Radius in km)</label>
                <input type="number" value={formData.details?.coverageAreaKm || 10} onChange={e => setFormData({ ...formData, details: { ...formData.details!, coverageAreaKm: Number(e.target.value) }})} className="px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary transition-colors text-sm" />
              </div>
              
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-outline-variant bg-surface-container-low cursor-pointer">
                  <input type="checkbox" checked={formData.details?.toolsProvided || false} onChange={e => setFormData({ ...formData, details: { ...formData.details!, toolsProvided: e.target.checked }})} className="w-5 h-5 accent-primary" />
                  <div className="text-sm">
                    <div className="font-semibold text-on-surface">I provide my own tools</div>
                    <div className="text-on-surface-variant text-xs">Check this if the customer does not need to provide equipment.</div>
                  </div>
                </label>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-on-surface">Portfolio Image URLs (One per line)</label>
                <textarea 
                  value={(formData.details?.portfolioImageUrls || []).join('\n')} 
                  onChange={e => setFormData({ ...formData, details: { ...formData.details!, portfolioImageUrls: e.target.value.split('\n').filter(s=>s.trim()) }})} 
                  rows={3} 
                  className="px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary transition-colors text-sm font-mono" 
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant">
            <button type="button" onClick={closeForm} className="px-6 py-3 rounded-xl font-semibold text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-xl font-semibold text-on-primary bg-primary hover:bg-primary/90 transition-colors text-sm disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save Listing"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-primary">My Portfolio</h2>
          <p className="text-sm text-on-surface-variant mt-1">Manage the services you offer.</p>
        </div>
        <button onClick={openNewForm} className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="border border-outline-variant rounded-xl p-12 text-center flex flex-col items-center gap-3 bg-surface-container-lowest">
          <Briefcase className="w-10 h-10 text-outline" />
          <p className="text-on-surface-variant text-sm">Your portfolio is empty. Add a service to start receiving jobs.</p>
          <button onClick={openNewForm} className="mt-2 text-primary font-semibold text-sm hover:underline">Add your first service</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {listings.map(l => (
            <div key={l.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
              {l.details.portfolioImageUrls.length > 0 && (
                <div className="h-40 w-full overflow-hidden bg-surface-container relative">
                  <div className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory">
                    {l.details.portfolioImageUrls.map((url, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={url} alt="" className="h-full w-full object-cover shrink-0 snap-center" />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-on-surface text-lg leading-tight">{l.name}</h3>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${l.isActive ? "bg-emerald-100 text-emerald-800" : "bg-surface-variant text-on-surface-variant"}`}>
                    {l.isActive ? "Active" : "Hidden"}
                  </div>
                </div>
                
                <div className="text-sm text-on-surface-variant mb-4 line-clamp-2">{l.description}</div>
                
                <div className="mt-auto flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-xs font-medium text-on-surface">
                      <Award className="w-3.5 h-3.5 text-primary" /> {l.details.yearsExperience} yrs exp
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-xs font-medium text-on-surface">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {l.details.coverageAreaKm} km
                    </span>
                    {l.details.toolsProvided && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-xs font-medium text-on-surface">
                        <Wrench className="w-3.5 h-3.5 text-primary" /> Tools provided
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-outline-variant pt-3">
                    <div className="font-bold text-primary">NGN {l.baseRateNgn.toLocaleString()} <span className="text-xs text-on-surface-variant font-medium block">{UNIT_LABELS[l.unit]}</span></div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleToggleActive(l)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors rounded-lg" title={l.isActive ? "Hide" : "Show"}>
                        {l.isActive ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEditForm(l)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(l.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container transition-colors rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
