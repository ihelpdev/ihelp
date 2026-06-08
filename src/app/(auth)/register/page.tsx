"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, UploadCloud, Camera, ArrowRight, ArrowLeft } from "lucide-react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role");
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"CUSTOMER" | "MERCHANT" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [kycStatus, setKycStatus] = useState<"pending" | "none">("none");

  useEffect(() => {
    if (defaultRole === "customer") {
      setRole("CUSTOMER");
      setStep(2);
    } else if (defaultRole === "merchant") {
      setRole("MERCHANT");
      setStep(2);
    }
  }, [defaultRole]);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const submitKyc = async () => {
    try {
      const res = await fetch("/api/auth/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "mock-id", documents: [] }),
      });
      const data = await res.json();
      if (data.success) {
        setKycStatus("pending");
        handleNext(); // Move to completion
      }
    } catch (error) {
      console.error("KYC Error:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="w-full bg-surface-container h-2 mb-8 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-300 ease-in-out"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {step === 1 && (
        <div className="transition-all duration-500">
          <h2 className="text-headline-sm font-bold text-on-surface mb-2">How do you want to use i-help?</h2>
          <p className="text-body-md text-on-surface-variant mb-6">Select your account type to customize your onboarding experience.</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setRole("CUSTOMER")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${role === "CUSTOMER" ? "border-primary bg-primary-fixed" : "border-outline-variant hover:border-primary"}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-on-surface">Customer</h3>
                  <p className="text-sm text-on-surface-variant mt-1">I want to hire professionals for my tasks.</p>
                </div>
                {role === "CUSTOMER" && <CheckCircle2 className="text-primary w-6 h-6" />}
              </div>
            </button>

            <button 
              onClick={() => setRole("MERCHANT")}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${role === "MERCHANT" ? "border-primary bg-primary-fixed" : "border-outline-variant hover:border-primary"}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-on-surface">Service Provider (Pro)</h3>
                  <p className="text-sm text-on-surface-variant mt-1">I want to offer my services and find jobs.</p>
                </div>
                {role === "MERCHANT" && <CheckCircle2 className="text-primary w-6 h-6" />}
              </div>
            </button>
          </div>

          <Button 
            className="w-full mt-8 py-3 text-base" 
            disabled={!role} 
            onClick={handleNext}
          >
            Continue <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="transition-all duration-500">
          <button onClick={handleBack} className="text-sm flex items-center text-on-surface-variant mb-4 hover:text-primary font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <h2 className="text-headline-sm font-bold text-on-surface mb-6">Create your account</h2>
          
          <div className="space-y-5">
            <Input 
              label="Full Name" 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="Create a secure password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <Button 
            className="w-full mt-8 py-3 text-base" 
            disabled={!formData.name || !formData.email || !formData.password}
            onClick={handleNext}
          >
            Create Account
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="transition-all duration-500">
          <button onClick={handleBack} className="text-sm flex items-center text-on-surface-variant mb-4 hover:text-primary font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <h2 className="text-headline-sm font-bold text-on-surface mb-2">Verify your email</h2>
          <p className="text-body-md text-on-surface-variant mb-6">We've sent a 6-digit code to <span className="font-semibold text-primary">{formData.email}</span>.</p>
          
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                className="w-12 h-14 text-center text-xl font-bold rounded-lg border-2 border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed transition-all"
              />
            ))}
          </div>

          <Button 
            className="w-full py-3 text-base" 
            disabled={otp.join("").length !== 6}
            onClick={handleNext}
          >
            Verify Email
          </Button>
          <div className="mt-6 text-center">
            <button className="text-sm text-primary font-medium hover:underline">Resend Code</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="transition-all duration-500">
          <h2 className="text-headline-sm font-bold text-on-surface mb-2">Identity Verification</h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            {role === "MERCHANT" 
              ? "As a Pro, we need to verify your identity before you can accept jobs." 
              : "Verify your identity to increase your trust score on the platform."}
          </p>
          
          <div className="space-y-4 mb-8">
            {/* ID Upload Dropzone */}
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 bg-surface-container-low text-center hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
                <UploadCloud className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-semibold text-on-surface mb-1">Upload Government ID</h3>
              <p className="text-xs text-on-surface-variant">PNG, JPG or PDF (Max 5MB)</p>
            </div>

            {/* Selfie Placeholder */}
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 bg-surface-container-low text-center hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors">
                <Camera className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-semibold text-on-surface mb-1">Take a Selfie</h3>
              <p className="text-xs text-on-surface-variant">Ensure your face is clearly visible</p>
            </div>
          </div>

          <div className="flex gap-4">
            {role === "CUSTOMER" && (
              <Button variant="ghost" className="w-full py-3" onClick={handleNext}>
                Skip for now
              </Button>
            )}
            <Button className="w-full py-3 text-base" onClick={submitKyc}>
              Submit for Verification
            </Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="transition-all duration-500 text-center py-8">
          <div className="mx-auto w-20 h-20 bg-tertiary-fixed rounded-full flex items-center justify-center mb-6 shadow-lg shadow-black/5">
            <CheckCircle2 className="text-tertiary w-10 h-10" />
          </div>
          <h2 className="text-headline-sm font-bold text-on-surface mb-2">You're all set!</h2>
          <p className="text-body-md text-on-surface-variant mb-8">
            Welcome to i-help. 
            {kycStatus === "pending" && <span className="block mt-3"><Badge className="bg-[#ffdad6] text-[#93000a] hover:bg-[#ffdad6]">KYC Pending</Badge><br/><span className="text-sm mt-2 block">We are reviewing your documents.</span></span>}
          </p>
          <Button className="w-full py-3 text-base shadow-md" onClick={() => router.push(role === "MERCHANT" ? "/merchant/dashboard" : "/customer/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
