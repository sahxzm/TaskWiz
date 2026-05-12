"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { PROJECT_COLORS, PROJECT_ICONS } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { ProjectWithMembers } from "@/types";
import type { User as DbUser } from "@prisma/client";

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  project?: ProjectWithMembers | null;
}

export function ProjectFormModal({ open, onClose, project }: ProjectFormModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [color, setColor] = useState(project?.color || PROJECT_COLORS[0].value);
  const [icon, setIcon] = useState(project?.icon || PROJECT_ICONS[0]);
  const [memberIds, setMemberIds] = useState<string[]>(project?.members?.map(m => m.userId) || []);
  const [isLoading, setIsLoading] = useState(false);

  const { data: usersData } = useQuery<{ users: DbUser[] }>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: open,
  });

  // Reset form when modal opens
  useState(() => {
    if (open) {
      setName(project?.name || "");
      setDescription(project?.description || "");
      setColor(project?.color || PROJECT_COLORS[0].value);
      setIcon(project?.icon || PROJECT_ICONS[0]);
      setMemberIds(project?.members?.map(m => m.userId) || []);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Project name is required"); return; }

    setIsLoading(true);
    try {
      const url = project ? `/api/projects/${project.id}` : "/api/projects";
      const method = project ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, color, icon, memberIds }),
      });

      if (!res.ok) {
        const json = await res.json();
        toast.error(json.error || "Failed to save project");
        return;
      }

      toast.success(project ? "Project updated!" : "Project created!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex-shrink-0">
          <h2 className="text-lg font-bold text-white">
            {project ? "Edit Project" : "New Project"}
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {project ? "Update your project details" : "Create a new project for your team"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Icon picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                    icon === ic
                      ? "bg-indigo-500/20 ring-2 ring-indigo-500"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this project about?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Color</label>
            <div className="flex gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    color === c.value ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Assign Members</label>
            <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl bg-slate-800/60 border border-slate-700 p-2">
              {usersData?.users?.map((user) => {
                const isOwner = Boolean(user.id === session?.user?.id || (project && project.ownerId === user.id));
                const isSelected = Boolean(memberIds.includes(user.id) || isOwner);
                
                return (
                  <label
                    key={user.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "bg-indigo-500/10" : "hover:bg-slate-700/50"
                    } ${isOwner ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-200">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    {isOwner ? (
                      <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">Owner</span>
                    ) : (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMemberIds((prev) => [...prev, user.id]);
                          } else {
                            setMemberIds((prev) => prev.filter((id) => id !== user.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-all disabled:opacity-70"
            >
              {isLoading ? "Saving..." : project ? "Update" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
