import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildBlogListHref } from "@/lib/blogPagination";

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
