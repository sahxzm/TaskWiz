"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Zap,
} from "lucide-react";
import { cn, getInitials, generateAvatarColor } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 bg-slate-900 border-r border-slate-800 transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-lg tracking-tight">TaskWiz</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ChevronDown
            size={16}
            className={cn("transition-transform duration-200", collapsed ? "-rotate-90" : "rotate-90")}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              <Icon size={18} className={cn(isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
              {!collapsed && <span>{label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick add */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <Link
            href="/tasks?new=true"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all border border-dashed border-slate-700 w-full"
          >
            <Plus size={16} />
            <span>New Task</span>
          </Link>
        </div>
      )}

      {/* User */}
      <div className="border-t border-slate-800 p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div
            className={cn(
              "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 text-white text-xs font-bold",
              generateAvatarColor(session?.user?.name || "U")
            )}
          >
            {getInitials(session?.user?.name || "U")}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{session?.user?.role}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-slate-500 hover:text-rose-400 transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
