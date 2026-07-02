"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function RegisterAdminForm() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // In a real application, this should be an environment variable
  // or a secure backend check. For demonstration, we use a simple hardcoded secret.
  const ADMIN_SECRET = "IHELP_ADMIN_2026";

  const handleSignup = async () => {
    setErrorMsg(null);
    
    if (formData.adminSecret !== ADMIN_SECRET) {
      setErrorMsg("Invalid Admin Secret Code");
      return;
    }

    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          role: "SUPER_ADMIN",
        },
        emailRedirectTo: "https://ihelp-ten.vercel.app/admin/login",
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      await syncUser(data.user.id);
    }
    
    setIsLoading(false);
    setIsSuccess(true);
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
          role: "SUPER_ADMIN",
        }),
      });
    } catch (e) {
      console.error("[Register] Exception caught during sync-user fetch:", e);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full mx-auto p-8 bg-surface rounded-2xl shadow-sm border border-outline-variant mt-20 text-center">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>mark_email_unread</span>
        </div>
        <h2 className="text-headline-sm font-bold text-on-surface mb-2">Verify your email</h2>
        <p className="text-body-md text-on-surface-variant mb-8">
          We've sent a verification link to <span className="font-semibold text-primary">{formData.email}</span>. 
          Please check your inbox and click the link to activate your admin account.
        </p>
        <Button 
          className="w-full py-3 text-base" 
          onClick={() => router.push("/admin/login")}
        >
          Go to Admin Login
        </Button>
      </div>
    );
  }

  return (
    <div className=" w-1/2 mx-auto p-8 bg-surface rounded-2xl shadow-sm border border-outline-variant mt-20">
      <button onClick={() => router.push("/")} className="text-sm flex items-center text-on-surface-variant mb-4 hover:text-primary font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
      </button>
      <h2 className="text-headline-sm font-bold text-on-surface mb-2">Super Admin Registration</h2>
      <p className="text-body-md text-on-surface-variant mb-6">Create a new super administrator account.</p>
      
      {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}

      <div className="space-y-5">
        <Input 
          label="Full Name" 
          placeholder="e.g. Jane Doe"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <Input 
          label="Email Address" 
          type="email" 
          placeholder="admin@ihelp.com"
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
        <Input 
          label="Admin Secret Code" 
          type="password" 
          placeholder="Enter the registration secret"
          value={formData.adminSecret}
          onChange={(e) => setFormData({...formData, adminSecret: e.target.value})}
        />
      </div>

      <Button 
        className="w-full mt-8 py-3 text-base" 
        disabled={!formData.name || !formData.email || !formData.password || !formData.adminSecret || isLoading}
        onClick={handleSignup}
      >
        {isLoading ? "Creating..." : "Create Admin Account"}
      </Button>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-on-surface-variant">
          Already an admin? <a href="/admin/login" className="text-primary font-medium hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default function RegisterAdminPage() {
  return (
    <div className="min-h-screen bg-surface-container flex flex-col items-center py-10 px-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-on-primary font-black text-lg">iH</span>
        </div>
        <span className="font-bold text-2xl text-primary tracking-tight">Super Admin</span>
      </div>
      <Suspense fallback={<div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
        <RegisterAdminForm />
      </Suspense>
    </div>
  );
}
