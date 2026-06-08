"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role");
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"CUSTOMER" | "MERCHANT" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
  const handleBack = () => {
    setErrorMsg(null);
    setStep((s) => s - 1);
  };

  const handleSignup = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          role: role,
        },
      },
    });
    setIsLoading(false);

    if (error) {
      console.log({error})
      setErrorMsg(error.message);
      return;
    }

    if (data.user) {
      // Sync immediately so the user exists in Prisma
      // Email verification will be handled by Supabase Auth
      await syncUser(data.user.id);
    }
    
    // Proceed to email verification instruction step
    setStep(3);
  };

  const syncUser = async (userId: string) => {
    try {
      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          email: formData.email,
          name: formData.name,
          role: role,
        }),
      });
    } catch (e) {
      console.error("Failed to sync user:", e);
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="w-full bg-surface-container h-2 mb-8 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-300 ease-in-out"
          style={{ width: `${(step / 3) * 100}%` }}
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
          
          {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}

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
            disabled={!formData.name || !formData.email || !formData.password || isLoading}
            onClick={handleSignup}
          >
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Already have an account? <a href="/login" className="text-primary font-medium hover:underline">Log in</a>
            </p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="transition-all duration-500 text-center py-8">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>mark_email_unread</span>
          </div>
          <h2 className="text-headline-sm font-bold text-on-surface mb-2">Verify your email</h2>
          <p className="text-body-md text-on-surface-variant mb-8">
            We've sent a verification link to <span className="font-semibold text-primary">{formData.email}</span>. 
            Please check your inbox and click the link to activate your account.
          </p>
          <Button 
            className="w-full py-3 text-base" 
            onClick={() => router.push("/login")}
          >
            Go to Login
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
