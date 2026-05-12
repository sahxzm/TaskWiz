"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, FolderKanban, MoreHorizontal, Pencil, Trash2, Users, CheckSquare, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import type { ProjectWithMembers } from "@/types";

const CARD_GRADIENTS = [
  "from-pink-600 to-rose-700",
  "from-amber-500 to-orange-600",
  "from-indigo-600 to-violet-700",
  "from-emerald-600 to-teal-700",
  "from-purple-600 to-pink-700",
  "from-blue-600 to-cyan-700",
  "from-rose-600 to-pink-700",
  "from-teal-600 to-emerald-700",
];

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithMembers | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const isAdmin = session?.user?.role === "ADMIN";

  const { data, isLoading } = useQuery<{ projects: ProjectWithMembers[] }>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const projects = data?.projects || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditingProject(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/25"
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start organizing tasks and collaborating with your team."
          action={
            isAdmin ? (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
              >
                <Plus size={16} /> Create Project
              </button>
            ) : (
              <p className="text-sm font-medium text-slate-500 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                Only admins can create projects
              </p>
            )
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => {
            const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
            return (
              <div
                key={project.id}
                className="relative group rounded-2xl overflow-hidden"
              >
                {/* Colorful header */}
                <div className={cn("bg-gradient-to-br p-5 pb-8 relative", gradient)}>
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {/* Menu */}
                  <div className="relative z-10 flex items-start justify-between">
                    <span className="text-3xl">{project.icon}</span>
                    <div className="relative">
                      {isAdmin && (
                        <button
                          onClick={(e) => { e.preventDefault(); setOpenMenuId(openMenuId === project.id ? null : project.id); }}
                          className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      )}
                      {openMenuId === project.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                          <button
                            onClick={(e) => { e.preventDefault(); setEditingProject(project); setShowModal(true); setOpenMenuId(null); }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); deleteMutation.mutate(project.id); setOpenMenuId(null); }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-slate-800 transition-colors w-full"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative z-10 mt-3">
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    <p className="text-white/70 text-sm mt-1 line-clamp-1">{project.description || "No description"}</p>
                  </div>

                  {/* Members row */}
                  <div className="relative z-10 flex items-center gap-2 mt-3">
                    <div className="flex -space-x-1">
                      {project.members.slice(0, 4).map((m) => (
                        <UserAvatar key={m.id} name={m.user.name} avatar={m.user.avatar} size="sm" className="ring-2 ring-white/30" />
                      ))}
                      {project.members.length > 4 && (
                        <div className="w-6 h-6 rounded-lg bg-black/30 flex items-center justify-center text-white text-xs ring-2 ring-white/30">
                          +{project.members.length - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-white/60 text-xs">{project.members.length} member{project.members.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Card footer */}
                <div className="bg-slate-900 border border-slate-800 border-t-0 rounded-b-2xl px-5 py-4 -mt-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <CheckSquare size={14} />
                        {project._count?.tasks ?? 0} tasks
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {project.members.length}
                      </span>
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                    >
                      Open <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add new card */}
          {isAdmin && (
            <button
              onClick={() => { setEditingProject(null); setShowModal(true); }}
              className="rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 p-8 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-indigo-400 transition-all group cursor-pointer min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                <Plus size={24} className="group-hover:text-indigo-400 transition-colors" />
              </div>
              <span className="text-sm font-medium">New Project</span>
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <ProjectFormModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingProject(null); }}
        project={editingProject}
      />
    </div>
  );
}
