"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Users, CheckSquare, BarChart3 } from "lucide-react";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatRelativeTime } from "@/lib/utils";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ProjectWithMembers } from "@/types";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params);

  const { data, isLoading } = useQuery<{ project: ProjectWithMembers & { tasks: any[]; activity: any[] } }>({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error("Failed to load project");
      return res.json();
    },
  });

  const project = data?.project;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="grid lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-slate-400">Project not found</p>
        <Link href="/projects" className="mt-3 text-indigo-400 text-sm hover:text-indigo-300">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const tasks = project.tasks || [];
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todoCount = tasks.filter((t) => t.status === "TODO").length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/projects" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Projects
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-sm text-white font-medium">{project.name}</span>
      </div>

      {/* Project Header */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${project.color}33, ${project.color}11)`, border: `1px solid ${project.color}33` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{project.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <p className="text-slate-400 text-sm mt-1">{project.description || "No description"}</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {project.members.map((m) => (
              <UserAvatar key={m.id} name={m.user.name} avatar={m.user.avatar} size="md" className="ring-2 ring-slate-950" />
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-6 mt-5">
          {[
            { label: "Total", value: tasks.length, icon: CheckSquare },
            { label: "Todo", value: todoCount, icon: BarChart3 },
            { label: "In Progress", value: inProgressCount, icon: BarChart3 },
            { label: "Done", value: completedCount, icon: CheckSquare },
            { label: "Members", value: project.members.length, icon: Users },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Progress</span><span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%`, backgroundColor: project.color }}
            />
          </div>
        </div>
      </div>

      {/* Kanban board with project filter */}
      <KanbanBoard projectId={id} />

      {/* Activity feed */}
      {project.activity && project.activity.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {project.activity.map((log: any) => (
              <div key={log.id} className="flex items-start gap-2.5">
                <UserAvatar name={log.user.name} avatar={log.user.avatar} size="sm" />
                <div>
                  <p className="text-xs text-slate-300">
                    <span className="font-medium">{log.user.name}</span>{" "}
                    <span className="text-slate-400">{log.message}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{formatRelativeTime(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
