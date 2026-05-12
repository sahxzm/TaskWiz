"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Zap,
  Plus,
} from "lucide-react";
import { cn, getInitials, generateAvatarColor } from "@/lib/utils";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  const pageTitle = mobileNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  )?.label || "TaskWiz";

  return (
    <>
      <header className="sticky top-0 z-20 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center px-4 lg:px-6 gap-4">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Page title */}
        <h1 className="text-lg font-semibold text-white lg:hidden">{pageTitle}</h1>

        {/* Search — desktop */}
        <div className="hidden lg:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search tasks, projects..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          {/* New task quick action */}
          <Link
            href="/tasks?new=true"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
          >
            <Plus size={15} />
            <span>New Task</span>
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-800 transition-all"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold",
                  generateAvatarColor(session?.user?.name || "U")
                )}
              >
                {getInitials(session?.user?.name || "U")}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white leading-tight">{session?.user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{session?.user?.role?.toLowerCase()}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setShowUserMenu(false)}>
                  <User size={14} /> Profile
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setShowUserMenu(false)}>
                  <Settings size={14} /> Settings
                </Link>
                <hr className="border-slate-700 my-1" />
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-slate-800 transition-colors w-full text-left"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">TaskWiz</span>
              <button className="ml-auto text-slate-400" onClick={() => setShowMobileMenu(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {mobileNavItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setShowMobileMenu(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* User */}
            <div className="border-t border-slate-800 p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold", generateAvatarColor(session?.user?.name || "U"))}>
                  {getInitials(session?.user?.name || "U")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
                  <p className="text-xs text-slate-500">{session?.user?.email}</p>
                </div>
                <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-slate-500 hover:text-rose-400 transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
