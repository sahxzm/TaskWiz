import Link from "next/link";
import {
  Zap, CheckCircle2, Users, BarChart3, Lock, ArrowRight, Star,
  KanbanSquare, Bell, Shield, Sparkles
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskWiz — Modern Team Task Manager",
  description: "Manage your team's tasks, track progress, and collaborate in real-time with TaskWiz — the modern SaaS task management platform.",
};

const FEATURES = [
  { icon: KanbanSquare, title: "Kanban Boards", desc: "Visual drag-and-drop boards to track work at every stage.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: Users, title: "Team Collaboration", desc: "Invite teammates, assign tasks, and stay in sync.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Beautiful charts and insights to measure your team's output.", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Bell, title: "Smart Notifications", desc: "Never miss a deadline or update with real-time alerts.", color: "text-rose-400", bg: "bg-rose-500/10" },
  { icon: Shield, title: "Role-Based Access", desc: "Admins, members — everyone gets the right level of access.", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Lock, title: "Secure by Design", desc: "JWT sessions, bcrypt passwords, and protected API routes.", color: "text-blue-400", bg: "bg-blue-500/10" },
];

const TESTIMONIALS = [
  { name: "Sarah K.", role: "Product Lead at Framer", text: "TaskWiz transformed how our team collaborates. The Kanban board is chef's kiss 🤌", avatar: "SK" },
  { name: "Marcus R.", role: "CTO at Buildify", text: "Finally a task manager that doesn't feel like enterprise software from 2010.", avatar: "MR" },
  { name: "Priya M.", role: "Designer at Loom", text: "The UI is absolutely gorgeous. Our team actually enjoys using it daily now.", avatar: "PM" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">TaskWiz</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/25"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-600 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-56 h-56 bg-violet-600 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-pink-600 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
            <Sparkles size={14} />
            <span>Modern SaaS Task Manager — Built for Teams</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold leading-tight">
            Manage tasks like
            <br />
            <span className="gradient-text">a wizard ✨</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            TaskWiz brings your team&apos;s work into one beautiful, powerful platform.
            Kanban boards, real-time collaboration, analytics — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-lg transition-all shadow-2xl shadow-indigo-500/30 hover:scale-105"
            >
              Start for Free <ArrowRight size={20} />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-lg transition-all border border-slate-700"
            >
              Sign In
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2">
            {[
              { icon: CheckCircle2, text: "Free to start" },
              { icon: CheckCircle2, text: "No credit card" },
              { icon: CheckCircle2, text: "Unlimited tasks" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5 text-sm text-slate-400">
                <item.icon size={14} className="text-emerald-400" />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard preview mockup */}
        <div className="relative z-10 max-w-5xl mx-auto mt-16">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl shadow-black/50">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 mx-3 px-3 py-1 rounded bg-slate-900 text-xs text-slate-500 text-center">
                app.taskwiz.io/dashboard
              </div>
            </div>
            {/* Fake dashboard */}
            <div className="p-5 space-y-4 bg-slate-950">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total Tasks", value: "48", color: "from-indigo-500/20 to-violet-500/10" },
                  { label: "Completed", value: "24", color: "from-emerald-500/20 to-teal-500/10" },
                  { label: "In Progress", value: "8", color: "from-blue-500/20 to-cyan-500/10" },
                  { label: "Overdue", value: "3", color: "from-rose-500/20 to-orange-500/10" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl bg-gradient-to-br ${s.color} border border-slate-800 p-3`}>
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["To Do", "In Progress", "Completed"].map((col, i) => (
                  <div key={col} className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
                    <div className="text-xs font-semibold text-slate-400">{col}</div>
                    {Array.from({ length: [3, 2, 4][i] }).map((_, j) => (
                      <div key={j} className="rounded-lg bg-slate-800 h-12 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything your team needs</h2>
            <p className="text-slate-400 text-lg">From solo projects to enterprise teams — TaskWiz scales with you.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all group">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon size={22} className={f.color} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Loved by teams worldwide</h2>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="ml-2 text-slate-400 text-sm">4.9/5 from 500+ teams</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-slate-300 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-12 shadow-2xl shadow-indigo-500/20">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to work smarter?</h2>
            <p className="text-indigo-200 text-lg mb-8">Join thousands of teams who ship faster with TaskWiz.</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-lg hover:bg-indigo-50 transition-colors shadow-xl"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-md flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-slate-400 text-sm font-medium">TaskWiz</span>
          </div>
          <p className="text-slate-600 text-sm">© 2026 TaskWiz. Built with ❤️ by Sahil Singh.</p>
        </div>
      </footer>
    </div>
  );
}
