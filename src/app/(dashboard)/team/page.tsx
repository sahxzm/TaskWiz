"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Mail, Shield, CheckSquare } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";

export default function TeamPage() {
  const { data, isLoading } = useQuery<{ users: any[] }>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const users = data?.users || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-slate-400 text-sm mt-0.5">{users.length} member{users.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Members", value: users.length, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Admins", value: users.filter((u) => u.role === "ADMIN").length, icon: Shield, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Members", value: users.filter((u) => u.role === "MEMBER").length, icon: CheckSquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Members list */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-base font-semibold text-white">All Members</h2>
        </div>

        {isLoading ? (
          <div className="p-5"><TableSkeleton /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={Users} title="No team members" description="Invite people to collaborate with you." />
        ) : (
          <div className="divide-y divide-slate-800">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/40 transition-colors">
                <UserAvatar name={user.name} avatar={user.avatar} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Mail size={10} /> {user.email}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  user.role === "ADMIN"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}>
                  {user.role === "ADMIN" ? "👑 Admin" : "Member"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
