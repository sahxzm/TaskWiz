import { cn, PRIORITY_CONFIG } from "@/lib/utils";
import type { TaskPriority } from "@prisma/client";
import { AlertCircle, ArrowDown, Minus } from "lucide-react";

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

const icons = {
  HIGH: AlertCircle,
  MEDIUM: Minus,
  LOW: ArrowDown,
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  const Icon = icons[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
        config.bg,
        config.color,
        config.border,
        className
      )}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
}
