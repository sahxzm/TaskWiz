export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-800/60 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 bg-slate-800 rounded w-2/3" />
          <div className="h-3 bg-slate-800 rounded w-1/3" />
        </div>
      </div>
      <div className="h-8 bg-slate-800 rounded" />
      <div className="h-2 bg-slate-800 rounded" />
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 animate-pulse">
      <div className="h-4 bg-slate-800 rounded w-3/4" />
      <div className="h-3 bg-slate-800 rounded w-1/2" />
      <div className="flex items-center gap-2 mt-3">
        <div className="h-5 bg-slate-800 rounded-md w-14" />
        <div className="h-5 bg-slate-800 rounded-md w-16" />
        <div className="ml-auto w-6 h-6 rounded-lg bg-slate-800" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-800/50 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}
