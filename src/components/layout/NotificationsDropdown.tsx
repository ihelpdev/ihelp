"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data || []);
        setUnreadCount((data.data || []).filter((n: any) => !n.read).length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // In a real app we'd poll or use websockets here
    const intv = setInterval(fetchNotifs, 15000);
    return () => clearInterval(intv);
  }, []);

  const markAsRead = async (id?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { id } : {})
      });
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => { setOpen(!open); if (unreadCount > 0 && !open) markAsRead(); }}
        className="relative p-2 rounded-full text-on-surface hover:bg-surface-container transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface-container-low"></span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant shadow-xl rounded-2xl z-[70] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <h3 className="font-bold text-on-surface">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={() => markAsRead()} className="text-xs font-semibold text-primary hover:underline">Mark all read</button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-on-surface-variant text-sm animate-pulse">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-on-surface-variant text-sm">No notifications yet.</div>
              ) : (
                <div className="divide-y divide-outline-variant">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-4 flex gap-3 ${!n.read ? 'bg-primary/5' : ''}`}>
                      <div className="mt-0.5 shrink-0">
                         <CheckCircle2 className={`w-5 h-5 ${!n.read ? 'text-primary' : 'text-on-surface-variant'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm ${!n.read ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>{n.title}</h4>
                        <p className={`text-xs mt-0.5 ${!n.read ? 'text-on-surface-variant' : 'text-on-surface-variant/80'}`}>{n.message}</p>
                        <div className="text-[10px] text-on-surface-variant mt-2">
                          {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
