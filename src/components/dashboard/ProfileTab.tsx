"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { logout, setShowProfileModal } from "@/lib/features/auth/authSlice";
import {
  User, CheckCircle2, LogOut, Phone, MapPin,
  Calendar, Users, Shield, Pencil,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileTab() {
  const dispatch = useDispatch();
  const router   = useRouter();

  // ── All data comes straight from the Redux store ──────────────────────────
  const { user, profileCompleted } = useSelector((state: RootState) => state.auth);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    dispatch(logout());
    router.push("/");
  };

  const handleEdit = () => {
    dispatch(setShowProfileModal(true));
  };

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-primary">Profile &amp; Settings</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Manage your account details and preferences.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-xl flex flex-col gap-6">

        {/* Avatar + name + email */}
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-on-surface">{user?.name || "User"}</h3>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {profileCompleted ? (
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Profile Complete
              </span>
            ) : (
              <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-semibold">
                Profile Incomplete
              </span>
            )}
            {user?.role && (
              <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-semibold uppercase flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> {user.role}
              </span>
            )}
          </div>

          {/* Complete / Edit Profile button */}
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 mt-2 bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Pencil className="w-3.5 h-3.5" />
            {profileCompleted ? "Edit Profile" : "Complete Profile"}
          </button>
        </div>

        {/* Full profile details (shown only if profile exists) */}
        {user?.profile && (
          <div className="border-t border-outline-variant pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailCard icon={<Phone className="w-5 h-5 text-primary" />} label="Phone" value={user.profile.phone} />
            <DetailCard icon={<MapPin className="w-5 h-5 text-primary" />} label="Location" value={user.profile.location} />
            <DetailCard
              icon={<Calendar className="w-5 h-5 text-primary" />}
              label="Date of Birth"
              value={new Date(user.profile.dob).toLocaleDateString()}
            />
            <DetailCard
              icon={<Users className="w-5 h-5 text-primary" />}
              label="Gender"
              value={user.profile.gender?.toLowerCase()}
            />
          </div>
        )}

        {/* Log out */}
        <div className="border-t border-outline-variant pt-6 flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-error hover:bg-error/10 px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helper ─────────────────────────────────────────────────────────────────────
function DetailCard({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-lg">
      {icon}
      <div>
        <p className="text-xs text-on-surface-variant">{label}</p>
        <p className="text-sm font-semibold text-on-surface capitalize">{value ?? "—"}</p>
      </div>
    </div>
  );
}
