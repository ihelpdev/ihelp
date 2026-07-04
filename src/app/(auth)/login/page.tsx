"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/utils/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMsg(null);
    setIsLoading(true);

    const supabase = createClient();

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

    setIsSuccess(true);

    if (role === "MERCHANT") {
      router.replace("/merchant/dashboard");
    } else if (role === "SUPER_ADMIN" || role === "ADMIN") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/customer/dashboard");
    }
  };

  return (
    <div className="w-full transition-all duration-500">
      <h2 className="text-headline-sm font-bold text-on-surface mb-2">Welcome back</h2>
      <p className="text-body-md text-on-surface-variant mb-6">Log in to your i-help account.</p>

      {errorMsg && (
        <div className="mb-4 p-3 bg-error/10 text-error border border-error/20 rounded-lg text-sm flex items-start gap-2 animate-in fade-in duration-200">
          <span className="mt-0.5 shrink-0">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {isSuccess && (
        <div className="mb-4 p-3 bg-green-500/10 text-green-700 border border-green-500/20 rounded-lg text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Login successful! Redirecting…</span>
        </div>
      )}

      <div className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isLoading || isSuccess}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          disabled={isLoading || isSuccess}
          onKeyDown={(e) => {
            if (e.key === "Enter" && formData.email && formData.password && !isLoading) {
              handleLogin();
            }
          }}
        />
      </div>

      <Button
        className="w-full mt-8 py-3 text-base relative"
        disabled={!formData.email || !formData.password || isLoading || isSuccess}
        onClick={handleLogin}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Logging in…
          </span>
        ) : isSuccess ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Redirecting…
          </span>
        ) : (
          "Log In"
        )}
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-primary font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
