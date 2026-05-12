"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { TaskCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { STATUS_CONFIG } from "@/lib/utils";
import type { TaskStatus } from "@prisma/client";
import type { TaskWithRelations } from "@/types";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: TaskWithRelations[];
  isLoading?: boolean;
  onAddTask: () => void;
  onTaskClick: (task: TaskWithRelations) => void;
}

export function KanbanColumn({ status, tasks, isLoading, onAddTask, onTaskClick }: KanbanColumnProps) {
  const config = STATUS_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className={`rounded-2xl border transition-all ${isOver ? "border-indigo-500/50 bg-indigo-500/5" : "border-slate-800 bg-slate-900/50"}`}>
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className="text-sm font-semibold text-slate-300">{config.label}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${config.bg} ${config.color}`}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Tasks */}
      <div ref={setNodeRef} className="p-3 space-y-2 min-h-[300px]">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <TaskCardSkeleton key={i} />)
        ) : (
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))}
          </SortableContext>
        )}

        {!isLoading && tasks.length === 0 && (
          <button
            onClick={onAddTask}
            className="w-full py-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-slate-500 text-slate-600 hover:text-slate-400 text-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Add task
          </button>
        )}
      </div>
    </div>
  );
}
