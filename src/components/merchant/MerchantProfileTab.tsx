import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { logout, setShowProfileModal } from "@/lib/features/auth/authSlice";
import {
  User, CheckCircle2, LogOut, Phone, MapPin,
  Calendar, Users, Shield, Pencil, Star, Percent, Settings
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function MerchantProfileTab() {
  const dispatch = useDispatch();
  const router   = useRouter();

  const { user, profileCompleted } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    dispatch(logout());
    router.push("/");
  };

  const handleEdit = () => {
    dispatch(setShowProfileModal(true));
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Pro Profile</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage your professional identity and account settings.
          </p>
        </div>
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-outline-variant"
        >
          <Settings className="w-4 h-4" /> Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Identity Card */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center relative">
              <User className="w-12 h-12 text-on-primary-container" />
              {profileCompleted && (
                <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-surface-container-lowest">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-on-surface">{user?.name || "Professional"}</h3>
              <p className="text-sm text-on-surface-variant">{user?.email}</p>
            </div>

            <div className="flex flex-col gap-2 w-full mt-2">
              <span className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-semibold uppercase flex justify-center items-center gap-1.5 w-full">
                <Shield className="w-3.5 h-3.5" /> VERIFIED MERCHANT
              </span>
              {!profileCompleted && (
                <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1.5 rounded-full font-semibold w-full">
                  Profile Incomplete
                </span>
              )}
            </div>

            <button
              onClick={handleEdit}
              className="w-full flex justify-center items-center gap-2 mt-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Pencil className="w-4 h-4" /> Edit Details
            </button>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant p-2 rounded-xl shadow-sm">
             <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-error hover:bg-error-container p-3 rounded-lg text-sm font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Right Column: Details & Stats */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Performance Stats (Mocked from MerchantProfile) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm flex flex-col gap-2">
              <div className="bg-amber-100 text-amber-800 p-2 w-max rounded-lg"><Star className="w-5 h-5" /></div>
              <div className="font-bold text-2xl text-primary mt-1">4.9 / 5.0</div>
              <div className="text-xs text-on-surface-variant font-medium">Customer Rating</div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm flex flex-col gap-2">
              <div className="bg-emerald-100 text-emerald-800 p-2 w-max rounded-lg"><Percent className="w-5 h-5" /></div>
              <div className="font-bold text-2xl text-primary mt-1">98%</div>
              <div className="text-xs text-on-surface-variant font-medium">Acceptance Rate</div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-on-surface mb-4">Personal Information</h3>
            {user?.profile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            ) : (
              <div className="text-center p-6 bg-surface-container-low rounded-lg border border-dashed border-outline text-on-surface-variant text-sm">
                Complete your profile to view your details here.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/50 p-3 rounded-lg">
      {icon}
      <div>
        <p className="text-xs text-on-surface-variant">{label}</p>
        <p className="text-sm font-semibold text-on-surface capitalize truncate max-w-[160px]">{value ?? "—"}</p>
      </div>
    </div>
  );
}
