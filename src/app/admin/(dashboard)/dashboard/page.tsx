"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, CheckCircle2, Clock } from "lucide-react";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [uRes, jRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/jobs")
        ]);
        
        if (uRes.ok) {
          const uData = await uRes.json();
          setUsers(uData.data || []);
        }
        if (jRes.ok) {
          const jData = await jRes.json();
          setJobs(jData.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-on-surface-variant animate-pulse">Loading dashboard data...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Admin Dashboard</h1>
        <p className="text-on-surface-variant mt-2">Overview of users and requests across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary-container text-on-primary-container p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2"><Users className="w-6 h-6 opacity-80" /> <h3 className="font-semibold">Total Users</h3></div>
          <div className="text-4xl font-black">{users.length}</div>
        </div>
        <div className="bg-secondary-container text-on-secondary-container p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2"><Briefcase className="w-6 h-6 opacity-80" /> <h3 className="font-semibold">Total Requests</h3></div>
          <div className="text-4xl font-black">{jobs.length}</div>
        </div>
        <div className="bg-tertiary-container text-on-tertiary-container p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2"><CheckCircle2 className="w-6 h-6 opacity-80" /> <h3 className="font-semibold">Completed Jobs</h3></div>
          <div className="text-4xl font-black">{jobs.filter(j => j.status === 'COMPLETED' || j.status === 'CONFIRMED').length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-bold text-lg text-on-surface">Recent Users</h3>
          </div>
          <div className="divide-y divide-outline-variant">
            {users.slice(0, 10).map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-on-surface">{u.fullName || "Unnamed"}</div>
                  <div className="text-xs text-on-surface-variant">{u.email}</div>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-surface-container font-medium border border-outline-variant capitalize">{u.role.toLowerCase()}</div>
              </div>
            ))}
            {users.length === 0 && <div className="p-6 text-center text-sm text-on-surface-variant">No users found.</div>}
          </div>
        </section>

        {/* Recent Requests */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-bold text-lg text-on-surface">Recent Requests</h3>
          </div>
          <div className="divide-y divide-outline-variant">
            {jobs.slice(0, 10).map((j) => (
              <div key={j.id} className="p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm text-on-surface">{j.serviceName}</div>
                    <div className="text-xs text-on-surface-variant">NGN {j.amount.toLocaleString()}</div>
                  </div>
                  <div className="text-xs px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-medium capitalize">
                    {j.status.toLowerCase()}
                  </div>
                </div>
                <div className="text-xs text-on-surface-variant mt-1">
                  Customer: <span className="font-medium">{j.customer?.fullName || 'Unknown'}</span>
                  {j.merchant && <><br/>Merchant: <span className="font-medium">{j.merchant.fullName}</span></>}
                </div>
              </div>
            ))}
            {jobs.length === 0 && <div className="p-6 text-center text-sm text-on-surface-variant">No requests found.</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
