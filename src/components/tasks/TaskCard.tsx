"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageSquare, Clock, GripVertical, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn, formatDate, isOverdue } from "@/lib/utils";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { TaskWithRelations } from "@/types";

interface TaskCardProps {
  task: TaskWithRelations;
  onClick?: () => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onClick, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const markDoneMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t: any) =>
            t.id === task.id ? { ...t, status: "COMPLETED" } : t
          ),
        };
      });
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) queryClient.setQueryData(["tasks"], context.previousTasks);
      toast.error("Failed to mark as done");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onSuccess: () => {
      toast.success("Task marked as done! 🎉");
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== "COMPLETED";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-slate-900 border rounded-xl p-3.5 group cursor-pointer transition-all duration-150",
        "hover:border-slate-600 hover:shadow-lg hover:shadow-black/20",
        isSortableDragging
          ? "opacity-40 border-dashed border-indigo-500"
          : "border-slate-800",
        isDragging && "shadow-2xl shadow-black/40 rotate-2"
      )}
      onClick={onClick}
    >
      {/* Header row */}
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-slate-700 hover:text-slate-400 transition-colors cursor-grab active:cursor-grabbing flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(
              "text-sm font-medium leading-snug",
              task.status === "COMPLETED" ? "line-through text-slate-500" : "text-slate-200"
            )}>
              {task.title}
            </p>
            {session?.user?.id === task.assigneeId && task.status !== "COMPLETED" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markDoneMutation.mutate();
                }}
                disabled={markDoneMutation.isPending}
                className="text-slate-600 hover:text-emerald-400 transition-colors flex-shrink-0 disabled:opacity-50"
                title="Mark as done"
              >
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
          {task.project && (
            <div className="flex items-center gap-1 mt-1">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: task.project.color }}
              />
              <span className="text-xs text-slate-500 truncate">{task.project.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <PriorityBadge priority={task.priority} />

        {task.dueDate && (
          <span className={cn(
            "flex items-center gap-1 text-xs",
            overdue ? "text-rose-400" : "text-slate-500"
          )}>
            <Clock size={10} />
            {formatDate(task.dueDate)}
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {(task._count?.comments ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MessageSquare size={10} />
              {task._count?.comments}
            </span>
          )}
          {task.assignee && (
            <UserAvatar name={task.assignee.name} avatar={task.assignee.avatar} size="sm" />
          )}
        </div>
      </div>
    </div>
  );
}
