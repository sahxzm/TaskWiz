"use client";

import { useSearchParams } from "next/navigation";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import type { Metadata } from "next";

export default function TasksPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">All Tasks</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage and track all your tasks across projects</p>
      </div>
      <KanbanBoard />
    </div>
  );
}
