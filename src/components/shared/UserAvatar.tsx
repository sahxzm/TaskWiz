"use client";

import { cn, getInitials, generateAvatarColor } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

export function UserAvatar({ name, avatar, size = "md", className }: UserAvatarProps) {
  if (avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt={name}
        className={cn("rounded-lg object-cover", sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold flex-shrink-0",
        generateAvatarColor(name),
        sizeMap[size],
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
