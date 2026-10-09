import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildBlogListHref } from "@/lib/blogPagination";

/** First, last and the pages around the current one, so every list page is a few clicks from the first. */
function pageWindow(page: number, totalPages: number): number[] {
  const wanted = new Set([1, totalPages, page - 2, page - 1, page, page + 1, page + 2]);
  return [...wanted].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
}

export function BlogPagination({
  page,
  totalPages,
  categorySlug,
}: {
  page: number;
  totalPages: number;
  categorySlug?: string;
}) {
  if (totalPages <= 1) return null;
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pagination">
      {prevPage != null ? (
        <Link
          href={buildBlogListHref(prevPage, categorySlug)}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
          style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--foreground-muted)" }}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm opacity-40" aria-disabled>
          <ChevronLeft className="h-4 w-4" /> Previous
        </span>
      )}

      <span className="px-2 text-sm" style={{ color: "var(--foreground-muted)" }}>
        Page {page} of {totalPages}
      </span>

      {pageWindow(page, totalPages).map((n) =>
        n === page ? (
          <span
            key={n}
            aria-current="page"
            className="inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-2 text-sm font-semibold"
            style={{ background: "var(--card)", color: "var(--foreground)" }}
          >
            {n}
          </span>
        ) : (
          <Link
            key={n}
            href={buildBlogListHref(n, categorySlug)}
            className="inline-flex min-w-9 items-center justify-center rounded-lg border px-2 py-2 text-sm font-medium transition-colors"
            style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--foreground-muted)" }}
            aria-label={`Page ${n}`}
          >
            {n}
          </Link>
        )
      )}

      {nextPage != null ? (
        <Link
          href={buildBlogListHref(nextPage, categorySlug)}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
          style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--foreground-muted)" }}
          aria-label="Next page"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm opacity-40" aria-disabled>
          Next <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
