import { cn, STATUS_CONFIG } from "@/lib/utils";
import type { TaskStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full pulse-dot", config.dot)} />
      {config.label}
    </span>
  );
}
