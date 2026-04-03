export default function Loading() {
  return (
    <div className="section-gap">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header skeleton */}
        <div className="mb-10 space-y-3">
          <div className="h-3 w-24 rounded-full bg-muted/40 animate-pulse" />
          <div className="h-8 w-64 rounded-lg bg-muted/40 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-lg bg-muted/30 animate-pulse" />
        </div>

        {/* Card grid skeleton — 6 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-border/40 bg-card"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-muted/30 animate-pulse" />
              {/* Text placeholders */}
              <div className="p-4 space-y-2">
                <div className="h-3 w-16 rounded-full bg-muted/40 animate-pulse" />
                <div className="h-5 w-3/4 rounded-lg bg-muted/40 animate-pulse" />
                <div className="h-3 w-full rounded-lg bg-muted/30 animate-pulse" />
                <div className="h-3 w-2/3 rounded-lg bg-muted/30 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
