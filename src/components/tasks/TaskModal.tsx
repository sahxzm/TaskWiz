"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, MessageSquare, Clock, Flag, User, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatRelativeTime, STATUS_CONFIG, PRIORITY_CONFIG, isOverdue } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { TaskWithRelations } from "@/types";
import type { TaskStatus, TaskPriority, User as DbUser } from "@prisma/client";

interface TaskModalProps {
  task: TaskWithRelations;
  onClose: () => void;
  onUpdate: (updated: TaskWithRelations) => void;
}

export function TaskModal({ task: initialTask, onClose, onUpdate }: TaskModalProps) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Fetch full task with comments
  const { data } = useQuery<{ task: TaskWithRelations }>({
    queryKey: ["task", initialTask.id],
    queryFn: async () => {
      const res = await fetch(`/api/tasks/${initialTask.id}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    initialData: { task: initialTask },
  });

  const task = data?.task || initialTask;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
    onError: () => toast.error("Failed to delete task"),
  });

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });
      if (!res.ok) throw new Error("Failed");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["task", task.id] });
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3 p-6 border-b border-slate-800">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white leading-tight">{task.title}</h2>
            {task.project && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.project.color }} />
                <span className="text-sm text-slate-400">{task.project.name}</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Meta info grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</label>
                <div>
                  <StatusBadge status={task.status} />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</label>
                <div>
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>

              {/* Due date */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={11} /> Due Date
                </label>
                {task.dueDate ? (
                  <div className={`text-sm ${isOverdue(task.dueDate) && task.status !== "COMPLETED" ? "text-rose-400" : "text-slate-300"}`}>
                    {formatDate(task.dueDate)}
                  </div>
                ) : (
                  <div className="text-sm text-slate-600">No due date</div>
                )}
              </div>

              {/* Assignee */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <User size={11} /> Assignee
                </label>
                {task.assignee ? (
                  <div className="flex items-center gap-2 mt-1">
                    <UserAvatar name={task.assignee.name} avatar={task.assignee.avatar} size="sm" />
                    <span className="text-sm text-slate-300">{task.assignee.name}</span>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600 mt-1">Unassigned</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</label>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {task.description || <span className="text-slate-600 italic">No description provided.</span>}
              </p>
            </div>

            {/* Comments */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MessageSquare size={11} /> Comments ({task.comments?.length ?? 0})
              </label>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {task.comments?.length === 0 && (
                  <p className="text-sm text-slate-600 italic">No comments yet. Be the first!</p>
                )}
                {task.comments?.map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <UserAvatar name={c.author.name} avatar={c.author.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-800 rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-300">{c.author.name}</span>
                          <span className="text-xs text-slate-600">{formatRelativeTime(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-slate-300">{c.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim() || isSubmittingComment}
                  className="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors disabled:opacity-50"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Created by {task.createdBy?.name} · {formatRelativeTime(task.createdAt)}
          </div>
          <button
            onClick={() => deleteMutation.mutate()}
            className="flex items-center gap-1.5 text-sm text-rose-400 hover:text-rose-300 transition-colors"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
