"use client";

import { useState, useEffect } from "react";
import { User, Trash, Edit, CheckCircle2, XCircle, Shield } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingUser.id,
          name: editingUser.name,
          role: editingUser.role,
          kycStatus: editingUser.kycStatus,
          noteToUser: editingUser.noteToUser,
        }),
      });
      if (res.ok) {
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Users Management</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Manage all platform users and merchants.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container-low border-b border-outline-variant text-xs uppercase text-on-surface-variant font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">KYC Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center animate-pulse"
                  >
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-on-surface-variant"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold">{u.name}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          u.role === "MERCHANT"
                            ? "bg-primary-container text-on-primary-container"
                            : u.role === "SUPER_ADMIN"
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-surface-container-high text-on-surface"
                        }`}
                      >
                        {u.role === "MERCHANT" ? (
                          <BriefcaseIcon className="w-3.5 h-3.5" />
                        ) : u.role === "SUPER_ADMIN" ? (
                          <Shield className="w-3.5 h-3.5" />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          u.kycStatus === "VERIFIED"
                            ? "text-emerald-600"
                            : u.kycStatus === "REJECTED"
                              ? "text-error"
                              : "text-amber-600"
                        }`}
                      >
                        {u.kycStatus === "VERIFIED" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : u.kycStatus === "REJECTED" ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <ClockIcon className="w-4 h-4" />
                        )}
                        {u.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingUser(null);
          }}
        >
          <div className="bg-surface w-full  rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-on-surface">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-full hover:bg-surface-container"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form
              onSubmit={handleUpdate}
              className="p-5 flex flex-col gap-4 bg-surface-container-lowest"
            >
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full p-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full p-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="MERCHANT">Merchant</option>
                  <option value="SUPER_ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">
                  KYC Status
                </label>
                <select
                  value={editingUser.kycStatus}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      kycStatus: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary"
                >
                  <option value="PENDING">Pending</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">
                  Note to User (Optional)
                </label>
                <textarea
                  value={editingUser.noteToUser || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      noteToUser: e.target.value,
                    })
                  }
                  placeholder="Leave a message that will be delivered as a notification..."
                  className="w-full p-3 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary min-h-[80px]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-primary text-on-primary py-2.5 rounded-lg font-bold hover:opacity-90"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BriefcaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
