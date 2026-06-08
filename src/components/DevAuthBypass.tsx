"use client";

import { useDispatch } from "react-redux";
import { setUser, logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DevAuthBypass() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleMockLogin = (role: "CUSTOMER" | "MERCHANT") => {
    document.cookie = "dev_mock_bypass=true; path=/";
    document.cookie = `dev_mock_role=${role}; path=/`;
    
    dispatch(setUser({
      id: `mock-${role.toLowerCase()}-123`,
      email: `${role.toLowerCase()}@mock.dev`,
      user_metadata: {
        role: role,
        name: `Dev ${role === 'CUSTOMER' ? 'Customer' : 'Merchant'}`
      }
    }));

    router.push(role === "CUSTOMER" ? "/customer/dashboard" : "/merchant/dashboard");
  };

  const handleClear = () => {
    document.cookie = "dev_mock_bypass=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "dev_mock_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-surface-container-highest border border-outline p-4 rounded-lg shadow-2xl flex flex-col gap-2 max-w-[200px]">
      <div className="font-bold text-xs text-primary mb-1 tracking-widest text-center">DEV BYPASS</div>
      <button onClick={() => handleMockLogin("CUSTOMER")} className="bg-primary text-on-primary font-label-md py-1.5 px-3 rounded hover:opacity-90 transition-opacity">Mock Customer</button>
      <button onClick={() => handleMockLogin("MERCHANT")} className="bg-secondary text-on-secondary font-label-md py-1.5 px-3 rounded hover:opacity-90 transition-opacity">Mock Merchant</button>
      <button onClick={handleClear} className="bg-error text-on-error font-label-md py-1.5 px-3 rounded hover:opacity-90 mt-2 transition-opacity">Clear Mock</button>
    </div>
  );
}
