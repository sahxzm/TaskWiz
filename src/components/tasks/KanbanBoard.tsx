"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  closestCorners,
} from "@dnd-kit/core";
import { Plus, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { TaskCard } from "./TaskCard";
import { KanbanColumn } from "./KanbanColumn";
import { TaskModal } from "./TaskModal";
import { TaskFormModal } from "./TaskFormModal";
import type { TaskWithRelations } from "@/types";
import { STATUS_CONFIG } from "@/lib/utils";
import type { TaskStatus } from "@prisma/client";

const COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "COMPLETED"];

interface KanbanBoardProps {
  projectId?: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<TaskWithRelations | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStatus, setCreateStatus] = useState<TaskStatus>("TODO");
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const queryKey = projectId ? ["tasks", projectId] : ["tasks"];
  const queryUrl = projectId ? `/api/tasks?projectId=${projectId}` : "/api/tasks";

  const { data, isLoading } = useQuery<{ tasks: TaskWithRelations[] }>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(queryUrl);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  // Keep local tasks in sync
  useEffect(() => {
    if (data?.tasks) setTasks(data.tasks);
  }, [data?.tasks]);

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<TaskWithRelations>) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: () => {
      toast.error("Failed to update task");
      if (data?.tasks) setTasks(data.tasks); // revert
    },
  });

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.position - b.position);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const overColumn = COLUMNS.find((c) => c === overId);
    const overTask = tasks.find((t) => t.id === overId);
    const targetStatus = overColumn || (overTask ? overTask.status : null);

    if (targetStatus && activeTask.status !== targetStatus) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: targetStatus as TaskStatus } : t
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const originalTask = activeTask;
    setActiveTask(null);
    if (!over || !originalTask) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const overColumn = COLUMNS.find((c) => c === overId);
    const overTask = tasks.find((t) => t.id === overId);
    const targetStatus = overColumn || (overTask ? overTask.status : originalTask.status);

    if (originalTask.status !== targetStatus || activeId !== overId) {
      updateTaskMutation.mutate({ id: activeId, status: targetStatus });
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setCreateStatus(status);
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {COLUMNS.map((status) => {
            const count = tasksByStatus(status).length;
            const config = STATUS_CONFIG[status];
            return (
              <div key={status} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                {config.label} ({count})
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <SlidersHorizontal size={14} />
            Filter
          </button>
          <button
            onClick={() => handleAddTask("TODO")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
          >
            <Plus size={15} /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus(status)}
              isLoading={isLoading}
              onAddTask={() => handleAddTask(status)}
              onTaskClick={(task) => setSelectedTask(task)}
            />
          ))}
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeTask && (
            <div className="rotate-3 opacity-90">
              <TaskCard task={activeTask} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Task detail modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updated) => {
            setTasks((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
            queryClient.invalidateQueries({ queryKey });
          }}
        />
      )}

      {/* Create task modal */}
      {showCreateModal && (
        <TaskFormModal
          defaultStatus={createStatus}
          defaultProjectId={projectId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({ queryKey });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            toast.success("Task created!");
          }}
        />
      )}
    </div>
  );
}
