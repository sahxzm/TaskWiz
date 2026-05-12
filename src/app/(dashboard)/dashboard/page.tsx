"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  TrendingUp,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";
import { formatRelativeTime, formatDate, isOverdue } from "@/lib/utils";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { DashboardStats, ActivityLogEntry, ProjectWithMembers, TaskWithRelations } from "@/types";

// Stat card gradient configs
const STAT_CARDS = [
  {
    key: "totalTasks" as const,
    label: "Total Tasks",
    icon: CheckCircle2,
    gradient: "from-indigo-500/20 to-violet-500/10",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/20",
  },
  {
    key: "completedTasks" as const,
    label: "Completed",
    icon: TrendingUp,
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
  },
  {
    key: "overdueTasks" as const,
    label: "Overdue",
    icon: AlertTriangle,
    gradient: "from-rose-500/20 to-orange-500/10",
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/20",
  },
  {
    key: "activeProjects" as const,
    label: "Projects",
    icon: FolderKanban,
    gradient: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/20",
  },
];

const PROJECT_CARD_GRADIENTS = [
  "from-pink-600 to-rose-700",
  "from-amber-500 to-orange-600",
  "from-indigo-600 to-violet-700",
  "from-emerald-600 to-teal-700",
  "from-purple-600 to-pink-700",
  "from-blue-600 to-cyan-700",
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const markDoneMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Task marked as done! 🎉");
      queryClient.invalidateQueries({ queryKey: ["tasks-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => toast.error("Failed to mark task as done"),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery<{
    stats: DashboardStats;
    recentActivity: ActivityLogEntry[];
  }>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    refetchInterval: 30_000,
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery<{
    projects: ProjectWithMembers[];
  }>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const { data: tasksData, isLoading: tasksLoading } = useQuery<{
    tasks: TaskWithRelations[];
  }>({
    queryKey: ["tasks-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
  });

  const stats = statsData?.stats;
  const recentActivity = statsData?.recentActivity || [];
  const projects = projectsData?.projects || [];
  const tasks = tasksData?.tasks || [];

  // My tasks = assigned to me or created by me (limit 5)
  const myTasks = tasks
    .filter(
      (t) =>
        t.assigneeId === session?.user?.id ||
        t.createdById === session?.user?.id
    )
    .slice(0, 5);

  const completionRate =
    stats && stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 shadow-2xl shadow-indigo-500/20">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back 👋</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {session?.user?.name?.split(" ")[0]}&apos;s Workspace
            </h2>
            <p className="text-indigo-200 text-sm mt-2">
              You have{" "}
              <span className="text-white font-semibold">
                {tasks.filter((t) => t.status === "IN_PROGRESS").length}
              </span>{" "}
              tasks in progress today
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{completionRate}%</div>
              <div className="text-indigo-200 text-xs">Complete</div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="white" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${completionRate * 0.942} 94.2`}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mt-5">
          <div className="flex justify-between text-xs text-indigo-200 mb-1">
            <span>Overall Progress</span>
            <span>{completionRate}% of {stats?.totalTasks || 0} tasks</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="relative z-10 flex gap-3 mt-5">
          <Link
            href="/tasks?new=true"
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors shadow"
          >
            <Plus size={15} /> New Task
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/projects"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/30 transition-colors border border-white/30"
            >
              <FolderKanban size={15} /> View Projects
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className={`bg-gradient-to-br ${card.gradient} border border-slate-800 rounded-2xl p-5 relative overflow-hidden`}
          >
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
              <card.icon size={20} className={card.iconColor} />
            </div>
            {statsLoading ? (
              <div className="h-8 bg-slate-800/60 rounded animate-pulse mb-1" />
            ) : (
              <div className="text-3xl font-bold text-white mb-1">
                {stats?.[card.key] ?? 0}
              </div>
            )}
            <p className="text-sm text-slate-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {projectsLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
              <FolderKanban size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No projects yet</p>
              <Link href="/projects" className="mt-3 inline-flex items-center gap-1 text-indigo-400 text-sm hover:text-indigo-300">
                <Plus size={14} /> Create your first project
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((project, i) => {
                const gradient = PROJECT_CARD_GRADIENTS[i % PROJECT_CARD_GRADIENTS.length];
                const projectTasks = tasks.filter((t) => t.projectId === project.id);
                const completed = projectTasks.filter((t) => t.status === "COMPLETED").length;
                const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer group`}
                  >
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
                        backgroundSize: "30px 30px",
                      }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl">{project.icon}</span>
                        <div className="flex -space-x-1">
                          {project.members.slice(0, 3).map((m) => (
                            <UserAvatar key={m.id} name={m.user.name} avatar={m.user.avatar} size="sm" className="ring-2 ring-white/30" />
                          ))}
                          {project.members.length > 3 && (
                            <div className="w-6 h-6 rounded-lg bg-black/30 flex items-center justify-center text-white text-xs ring-2 ring-white/30">
                              +{project.members.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                      <h3 className="font-bold text-white text-lg leading-tight">{project.name}</h3>
                      <p className="text-white/70 text-xs mt-1 line-clamp-1">{project.description || "No description"}</p>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-white/70 mb-1.5">
                          <span>{completed}/{projectTasks.length} tasks</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full">
                          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Quote card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-3 right-4 text-6xl text-slate-700 font-serif leading-none">&quot;</div>
            <p className="text-slate-300 text-sm leading-relaxed relative z-10 italic">
              Until we can manage time, we can manage nothing else.
            </p>
            <p className="text-slate-500 text-xs mt-2 font-semibold">— Peter Drucker</p>
          </div>
        </div>

        {/* Right column: My Tasks + Activity */}
        <div className="space-y-4">
          {/* My Tasks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">My Tasks</h2>
              <Link href="/tasks" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                All <ArrowRight size={12} />
              </Link>
            </div>

            {tasksLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-800/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : myTasks.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 size={28} className="text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">All caught up! 🎉</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/50 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium truncate ${task.status === "COMPLETED" ? "line-through text-slate-500" : "text-slate-200"}`}>
                            {task.title}
                          </p>
                          {session?.user?.id === task.assigneeId && task.status !== "COMPLETED" && (
                            <button
                              onClick={() => markDoneMutation.mutate(task.id)}
                              disabled={markDoneMutation.isPending}
                              className="text-slate-500 hover:text-emerald-400 transition-colors flex-shrink-0 disabled:opacity-50"
                              title="Mark as done"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{task.project?.name}</p>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <PriorityBadge priority={task.priority} />
                      {task.dueDate && (
                        <span className={`text-xs flex items-center gap-1 ${isOverdue(task.dueDate) ? "text-rose-400" : "text-slate-500"}`}>
                          <Clock size={10} />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/tasks?new=true"
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all text-sm"
            >
              <Plus size={14} /> Add new task
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-slate-400" />
              <h2 className="text-base font-semibold text-white">Activity</h2>
            </div>

            {statsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2 animate-pulse">
                    <div className="w-6 h-6 rounded-lg bg-slate-800 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-slate-800 rounded w-3/4" />
                      <div className="h-2 bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5">
                    <UserAvatar name={log.user.name} avatar={log.user.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300">
                        <span className="font-medium">{log.user.name}</span>{" "}
                        <span className="text-slate-400">{log.message}</span>
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{formatRelativeTime(log.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
