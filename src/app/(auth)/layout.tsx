import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Authentication" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-purple-950">
        <div className="absolute inset-0">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500/20 rounded-full blur-2xl animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-pulse [animation-delay:2s]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">TW</span>
              </div>
              <span className="text-white font-bold text-xl">TaskWiz</span>
            </Link>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Manage tasks like a{" "}
                <span className="gradient-text">wizard</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Collaborate, organize, and ship faster with your team on one beautiful platform.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {[
                { icon: "🚀", label: "Kanban boards that actually work" },
                { icon: "👥", label: "Real-time team collaboration" },
                { icon: "📊", label: "Analytics and progress tracking" },
                { icon: "🔐", label: "Role-based access control" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-slate-300">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-500 text-sm">© 2026 TaskWiz. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">TW</span>
            </div>
            <span className="text-white font-bold text-xl">TaskWiz</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
