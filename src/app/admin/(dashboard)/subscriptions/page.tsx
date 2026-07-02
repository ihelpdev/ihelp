"use client";

import { useEffect, useState, useRef } from "react";
import { CreditCard, Plus, Edit2, Image as ImageIcon, Loader2 } from "lucide-react";

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [featuresStr, setFeaturesStr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/services/subscriptions");
      const data = await res.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openNewPlanModal = () => {
    setEditingId(null);
    setName("");
    setDesc("");
    setPrice("");
    setFeaturesStr("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const openEditPlanModal = (plan: any) => {
    setEditingId(plan.id);
    setName(plan.name);
    setDesc(plan.description);
    setPrice(plan.base_price_per_session_ngn.toString());
    setFeaturesStr(plan.features?.join(", ") || "");
    setImageUrl(plan.imageUrl || "");
    setIsModalOpen(true);
  };

  const uploadToCloudinary = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', 'ihelp-images');
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/dik1cosdn/image/upload`, {
      method: 'POST',
      body: uploadData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(e.target.files[0]);
      if (url) {
        setImageUrl(url);
      }
    } catch (error) {
      console.error("Error uploading image", error);
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const features = featuresStr.split(",").map(s => s.trim()).filter(Boolean);
      
      const endpoint = "/api/services/subscriptions";
      const method = editingId ? "PATCH" : "POST";
      const body = {
        id: editingId || undefined,
        name,
        description: desc,
        basePriceNgn: Number(price) || 0,
        features,
        imageUrl: imageUrl || null
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchPlans();
      } else {
        alert(`Failed to ${editingId ? 'update' : 'create'} subscription`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error ${editingId ? 'updating' : 'creating'} subscription`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/services/subscriptions/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchPlans();
      } else {
        alert("Failed to seed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error seeding subscriptions.");
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-on-surface-variant animate-pulse">Loading subscriptions..</div>;

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-5xl mx-auto relative h-full pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface flex items-center gap-3">
            <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-primary" /> Manage Subscriptions
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant mt-2">Create and manage subscription-based services offered to users.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors disabled:opacity-50 text-sm md:text-base"
          >
            {seeding ? "Populating..." : "Auto Populate"}
          </button>
          <button 
            onClick={openNewPlanModal}
            className="flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-opacity text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" /> New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {plans.map((p) => (
          <div key={p.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm flex flex-col overflow-hidden relative group">
            {p.imageUrl ? (
              <div className="h-32 w-full bg-surface-container overflow-hidden">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-32 w-full bg-primary/5 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-primary/20" />
              </div>
            )}
            
            <button 
              onClick={() => openEditPlanModal(p)}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm shadow-sm rounded-lg text-on-surface hover:text-primary md:opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <div className="p-5 md:p-6 flex flex-col gap-3 md:gap-4 flex-1">
              <div>
                <h3 className="font-bold text-lg text-on-surface leading-tight">{p.name}</h3>
                <p className="text-xs md:text-sm text-on-surface-variant line-clamp-2 mt-1">{p.description}</p>
              </div>
              <div className="text-xl md:text-2xl font-black text-primary">NGN {p.base_price_per_session_ngn?.toLocaleString()}</div>
              <div className="flex-1">
                <h4 className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Features</h4>
                <ul className="text-xs md:text-sm text-on-surface flex flex-col gap-1.5">
                  {p.features?.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 before:content-['✓'] before:text-emerald-500 before:font-bold">{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="col-span-full p-8 md:p-12 text-center text-sm md:text-base text-on-surface-variant bg-surface-container rounded-2xl border border-dashed border-outline">
            No subscription plans found. Click "New Plan" to create one.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="bg-white w-full max-w-3xl rounded-t-2xl md:rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 md:my-8 animate-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface">{editingId ? 'Edit Subscription' : 'Create New Subscription'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="md:hidden p-2 bg-surface-container rounded-full text-on-surface-variant">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 md:gap-8">
              
              {/* Left Column: Image Upload Area */}
              <div className="flex flex-col gap-2 w-full md:w-1/3 shrink-0">
                <span className="text-sm font-semibold text-on-surface">Cover Image (Optional)</span>
                <div 
                  className={`h-40 md:h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors relative overflow-hidden ${imageUrl ? 'border-primary' : 'border-outline-variant hover:border-primary/50 bg-surface-container-lowest'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    disabled={uploadingImage}
                  />
                  
                  {uploadingImage ? (
                    <div className="flex flex-col items-center text-primary">
                      <Loader2 className="w-6 h-6 animate-spin mb-2" />
                      <span className="text-xs md:text-sm font-medium">Uploading...</span>
                    </div>
                  ) : imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white font-medium text-xs md:text-sm flex items-center gap-2">
                          <Edit2 className="w-4 h-4" /> Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center p-4">
                      <ImageIcon className="w-8 h-8 text-on-surface-variant/50 mb-2" />
                      <span className="text-xs md:text-sm text-on-surface-variant font-medium">Tap to upload image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Form Inputs */}
              <div className="flex flex-col gap-4 flex-1">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-on-surface">Plan Name</span>
                  <input required value={name} onChange={e => setName(e.target.value)} type="text" className="p-3 rounded-xl border border-outline-variant outline-none focus:border-primary text-sm bg-surface-container-lowest" placeholder="e.g. Weekly Cleaning" />
                </label>
                
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-on-surface">Description</span>
                  <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="p-3 rounded-xl border border-outline-variant outline-none focus:border-primary text-sm resize-none bg-surface-container-lowest" placeholder="Short description..." />
                </label>
                
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-on-surface">Base Price (NGN)</span>
                  <input required value={price} onChange={e => setPrice(e.target.value)} type="number" className="p-3 rounded-xl border border-outline-variant outline-none focus:border-primary text-sm bg-surface-container-lowest" placeholder="e.g. 5000" />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-on-surface">Features (comma separated)</span>
                  <input value={featuresStr} onChange={e => setFeaturesStr(e.target.value)} type="text" className="p-3 rounded-xl border border-outline-variant outline-none focus:border-primary text-sm bg-surface-container-lowest" placeholder="e.g. 1 Room, Deep Clean, Disinfect" />
                </label>
                
                <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-4 pt-2 border-t border-outline-variant/30">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-full md:w-auto px-5 py-3 md:py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting || uploadingImage} className="w-full md:w-auto px-5 py-3 md:py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 transition-opacity">
                    {submitting ? "Saving..." : (editingId ? "Save Changes" : "Create Plan")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
