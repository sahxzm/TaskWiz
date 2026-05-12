"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Save, User, Bell, Palette } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      
      if (!res.ok) throw new Error("Failed to save");
      
      await update({ name: name.trim() });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <User size={16} className="text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Profile</h2>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <UserAvatar name={session?.user?.name || "U"} size="lg" />
          <div>
            <p className="text-sm text-white font-medium">{session?.user?.name}</p>
            <p className="text-xs text-slate-500">{session?.user?.email}</p>
            <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-md font-medium ${
              session?.user?.role === "ADMIN"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}>
              {session?.user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={session?.user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors disabled:opacity-70"
          >
            <Save size={15} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell size={16} className="text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Notifications</h2>
        </div>
        {[
          { label: "Task assignments", desc: "When someone assigns a task to you" },
          { label: "Comments", desc: "When someone comments on your tasks" },
          { label: "Due date reminders", desc: "24 hours before a task is due" },
          { label: "Project updates", desc: "When a project you're in is updated" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-slate-300">{item.label}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500" />
            </label>
          </div>
        ))}
      </div>

      {/* Appearance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Palette size={16} className="text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Appearance</h2>
        </div>
        <p className="text-sm text-slate-400">Use the sun/moon toggle in the header to switch between light and dark mode.</p>
      </div>
    </div>
  );
}
