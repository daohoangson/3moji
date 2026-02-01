export default function TopicDetailLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-emerald-50">
      {/* Header skeleton */}
      <header className="sticky top-0 z-20 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
          <div className="w-12" />
        </div>
      </header>

      {/* Content skeleton */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Topic header skeleton */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 h-24 w-24 animate-pulse rounded-full bg-slate-200 sm:h-28 sm:w-28" />
          <div className="mb-2 h-10 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-6 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Learning goals skeleton */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-4 h-6 w-36 animate-pulse rounded bg-slate-200" />
          <div className="space-y-3">
            {[1, 2, 3].map((goal) => (
              <div key={goal} className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-slate-200" />
                <div className="h-5 flex-1 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Word preview skeleton */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-slate-200" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((word) => (
              <div
                key={word}
                className="h-8 w-16 animate-pulse rounded-full bg-slate-200"
              />
            ))}
          </div>
        </div>

        {/* Button skeleton */}
        <div className="flex justify-center">
          <div className="h-16 w-56 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
