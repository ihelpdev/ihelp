"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useDispatch } from "react-redux";
import { setProfileCompleted, setUser } from "@/lib/features/auth/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMsg(null);
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    // Determine where to route based on metadata role
    const role = data.user?.user_metadata?.role;

    // Fetch profile completion status
    try {
      const res = await fetch('/api/profile/check');
      if (res.ok) {
        const profileData = await res.json();
        if (profileData.success) {
          dispatch(setProfileCompleted(profileData.profileCompleted));
          dispatch(setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || 'User',
            role: profileData.role
          }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile status on login", err);
    }

    if (role === "MERCHANT") {
      router.push("/merchant/dashboard");
    } else {
      router.push("/customer/dashboard");
    }
  };

  return (
    <div className="w-full transition-all duration-500">
      <h2 className="text-headline-sm font-bold text-on-surface mb-2">Welcome back</h2>
      <p className="text-body-md text-on-surface-variant mb-6">Log in to your i-help account.</p>
      
      {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}

      <div className="space-y-5">
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
      </div>

      <Button 
        className="w-full mt-8 py-3 text-base" 
        disabled={!formData.email || !formData.password || isLoading}
        onClick={handleLogin}
      >
        {isLoading ? "Logging in..." : "Log In"}
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-on-surface-variant">
          Don't have an account? <a href="/register" className="text-primary font-medium hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
