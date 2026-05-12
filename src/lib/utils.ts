import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isAfter } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "No date";
  return format(new Date(date), "MMM d, yyyy");
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isOverdue(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  return isAfter(new Date(), new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateAvatarColor(name: string): string {
  const colors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-blue-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export const PROJECT_COLORS = [
  { label: "Violet", value: "#8b5cf6" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Emerald", value: "#10b981" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Pink", value: "#ec4899" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Indigo", value: "#6366f1" },
];

export const PROJECT_ICONS = ["📁", "🚀", "💡", "🎯", "⚡", "🔥", "💎", "🌟", "🛠️", "📊"];

export const STATUS_CONFIG = {
  TODO: { label: "To Do", color: "text-slate-400", bg: "bg-slate-400/10", dot: "bg-slate-400" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
  COMPLETED: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
};

export const PRIORITY_CONFIG = {
  LOW: { label: "Low", color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/30" },
  MEDIUM: { label: "Medium", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
  HIGH: { label: "High", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/30" },
};
