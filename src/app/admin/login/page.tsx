"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

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

    // Verify role through our API just to be safe and set profile state
    try {
      const res = await fetch("/api/profile/check");
      if (res.ok) {
        const profileData = await res.json();
        if (profileData.success && profileData.role === "SUPER_ADMIN") {
          router.push("/admin/dashboard");
          return;
        } else if (profileData.success && profileData.role !== "SUPER_ADMIN") {
          // If they try to login here but are not an admin
          setErrorMsg("Unauthorized: You do not have Super Admin privileges.");
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile status on login", err);
    }

    // Fallback if API fails but metadata says they are admin
    if (role === "SUPER_ADMIN") {
      router.push("/admin/dashboard");
    } else {
      setErrorMsg("Unauthorized: You do not have Super Admin privileges.");
      await supabase.auth.signOut();
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container flex flex-col items-center py-10 px-4">
      <div className="flex items-center gap-2 mb-8">
        <img
          src="/icon.png"
          alt="myIhelp logo"
          className="w-10 h-10 object-contain"
        />
        <span className="font-bold text-2xl text-primary tracking-tight">
          Super Admin
        </span>
      </div>

      <div className="w-1/2 mx-auto p-8 bg-surface rounded-2xl shadow-sm border border-outline-variant">
        <h2 className="text-headline-sm font-bold text-on-surface mb-2">
          Welcome back, Admin
        </h2>
        <p className="text-body-md text-on-surface-variant mb-6">
          Log in to the super admin portal.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <div className="space-y-5">
          <Input
            label="Admin Email"
            type="email"
            placeholder="admin@myihelp.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
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
            Need an admin account?{" "}
            <a
              href="/admin/register"
              className="text-primary font-medium hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
