"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X, CheckCircle2, ChevronRight, User, MapPin, Calendar, Phone, Briefcase } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { setFullUser } from "@/lib/features/auth/authSlice";

export default function OnboardingModal() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  
  // Show if forcing open via Profile tab OR if authenticated but profile not completed
  const shouldShow = auth.showProfileModal || (auth.isAuthenticated && !auth.profileCompleted);

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hidden state handles "Skip for now" without mutating the Redux state 
  // so that the profile remains officially incomplete.
  const [skipped, setSkipped] = useState(false);

  // Pre-populate from existing profile so the "Edit" flow shows current values
  const existingProfile = auth.user?.profile;
  const [formData, setFormData] = useState({
    gender: existingProfile?.gender ?? "MALE",
    phone:  existingProfile?.phone    ?? "",
    dob:    existingProfile?.dob
              ? new Date(existingProfile.dob).toISOString().slice(0, 10)
              : "",
    location: existingProfile?.location ?? "",
    nin: "",
    bvn: "",
  });

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !shouldShow || skipped) return null;

  const isMerchant = auth.user?.role === "MERCHANT";
  
  const handleNext = () => setStep(s => (s + 1) as 1 | 2 | 3);
  const handleBack = () => setStep(s => (s - 1) as 1 | 2 | 3);

  const handleClose = () => {
    setSkipped(true);
    dispatch({ type: "auth/setShowProfileModal", payload: false });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log({ data })
      if (data.success) {
        // Sync the full updated user (with profile) into Redux immediately
        if (data.user) {
          dispatch(setFullUser(data.user));
        }
        dispatch({ type: "auth/setShowProfileModal", payload: false });
      } else {
        setErrorMsg(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.log({ err });
      setErrorMsg("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const modalJSX = (
    <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-surface w-full md:w-1/2 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-surface-container flex items-center justify-between p-5 border-b border-outline-variant">
          <div>
            <h2 className="text-xl font-bold text-on-surface">
              {existingProfile ? "Edit Profile" : "Complete Your Profile"}
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Step {step} of {isMerchant ? "3" : "2"}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-outline-variant/30 rounded-full transition-colors">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-6 p-3 bg-error/10 text-error rounded-lg text-sm border border-error/20">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+234..."
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Location / Address
                </label>
                <input
                  type="text"
                  placeholder="Lagos, Nigeria"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Identity (Merchant only) */}
          {step === 2 && isMerchant && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-2">
                <p className="text-sm text-on-surface flex items-start gap-2">
                  <Briefcase className="w-5 h-5 text-primary shrink-0" />
                  As a Merchant, you must verify your identity before accepting jobs. Provide either your NIN or BVN.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-on-surface">NIN (National Identity Number)</label>
                <input
                  type="text"
                  placeholder="11-digit NIN"
                  value={formData.nin}
                  onChange={e => setFormData({ ...formData, nin: e.target.value })}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="text-center text-sm font-semibold text-on-surface-variant my-2">OR</div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-on-surface">BVN (Bank Verification Number)</label>
                <input
                  type="text"
                  placeholder="11-digit BVN"
                  value={formData.bvn}
                  onChange={e => setFormData({ ...formData, bvn: e.target.value })}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              
              {/* Note: Passport upload can be added here using supabase storage */}
            </div>
          )}

          {/* FINAL STEP: Review */}
          {(step === 3 || (!isMerchant && step === 2)) && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-on-surface">Ready to go!</h3>
                <p className="text-sm text-on-surface-variant mt-2">
                  Review your information. Once submitted, your profile will be active and you can start {isMerchant ? "accepting requests" : "booking services"}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-outline-variant bg-surface-container-lowest flex flex-col gap-3">
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="primary" className="flex-1" onClick={handleBack} disabled={loading}>
                Back
              </Button>
            )}
            
            {((isMerchant && step < 3) || (!isMerchant && step < 2)) ? (
              <Button 
                className="flex-[2] flex items-center justify-center gap-2" 
                onClick={handleNext}
                disabled={step === 1 && (!formData.phone || !formData.dob || !formData.location) || (step === 2 && isMerchant && !formData.nin && !formData.bvn)}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                className="flex-[2] bg-primary text-on-primary hover:opacity-90" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            )}
          </div>
          <button onClick={handleClose} className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors py-2">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
