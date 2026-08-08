"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { X, Send } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface JobChatProps {
  jobId: string;
  receiverId: string;
  jobName: string;
  onClose: () => void;
}

export default function JobChat({
  jobId,
  receiverId,
  jobName,
  onClose,
}: JobChatProps) {
  const { user } = useSelector((s: RootState) => s.auth);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat?jobId=${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const supabase = createClient();
    // Use a broadcast channel — works without enabling DB Realtime on the table
    const channel = supabase
      .channel(`chat-${jobId}`)
      .on("broadcast", { event: "new-message" }, ({ payload }) => {
        // Only add if it's not already shown (avoid duplicate with optimistic)
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (m) => m.id !== "temp" && m.id === payload.id
          );
          if (isDuplicate) return prev;
          // Replace optimistic temp message if it exists
          const withoutTemp = prev.filter((m) => m.id !== "temp");
          return [...withoutTemp, payload];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const content = newMessage;
    setNewMessage("");
    // Optimistic UI — show immediately with temp id
    const tempMsg = {
      id: "temp",
      senderId: user.id,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, receiverId, content }),
      });

      if (res.ok) {
        const data = await res.json();
        const savedMsg = data.data;

        // Replace temp with real saved message in our own state
        setMessages((prev) =>
          prev.map((m) => (m.id === "temp" ? savedMsg : m))
        );

        // Broadcast the real message to the other party's channel
        const supabase = createClient();
        await supabase.channel(`chat-${jobId}`).send({
          type: "broadcast",
          event: "new-message",
          payload: savedMsg,
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface w-full md:w-1/2 h-[600px] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <div>
            <h3 className="font-bold text-lg text-on-surface">Chat</h3>
            <p className="text-xs text-on-surface-variant">{jobName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-surface-container-lowest">
          {loading ? (
            <div className="text-center text-sm text-on-surface-variant my-auto animate-pulse">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-sm text-on-surface-variant my-auto">
              No messages yet. Say hello!
            </div>
          ) : (
            messages.map((m, i) => {
              const isMe = m.senderId === user?.id;
              return (
                <div
                  key={m.id || i}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? "bg-primary text-on-primary rounded-br-sm" : "bg-surface-container-high text-on-surface rounded-bl-sm"}`}
                  >
                    {m.content}
                    <div
                      className={`text-[10px] mt-1 ${isMe ? "text-on-primary/70 text-right" : "text-on-surface-variant"}`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="p-3 bg-surface-container-low border-t border-outline-variant flex gap-2 items-center"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2.5 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
