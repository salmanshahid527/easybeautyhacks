import Link from "next/link";
import { PostGrid } from "./PostGrid";
import { BlogPagination } from "./BlogPagination";
import type { Category, Post } from "@/types";
import { cn } from "@/lib/utils";
import { buildBlogListHref } from "@/lib/blogPagination";

interface BlogPostListProps {
  posts: Post[];
  total?: number;
  totalPages: number;
  page: number;
  categorySlug?: string;
  categories: Category[];
}

export function BlogPostList({
  posts,
  total,
  totalPages,
  page,
  categorySlug,
  categories,
}: BlogPostListProps) {
  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            !categorySlug
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground-muted hover:border-primary hover:text-primary"
          )}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={buildBlogListHref(1, cat.slug)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors capitalize",
              categorySlug === cat.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground-muted hover:border-primary hover:text-primary"
            )}
          >
            {cat.title}
          </Link>
        ))}
      </div>

      <p className="mb-6 text-sm" style={{ color: "var(--foreground-muted)" }}>
        {typeof total === "number"
          ? `${total} ${total === 1 ? "article" : "articles"}`
          : `${posts.length} on this page`}
        {categorySlug && (
          <>
            {" "}
            in{" "}
            <span className="font-semibold capitalize" style={{ color: "var(--primary)" }}>
              {categorySlug.replace(/-/g, " ")}
            </span>
          </>
        )}
      </p>

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p style={{ color: "var(--foreground-muted)" }}>No articles found. Check back soon!</p>
        </div>
      ) : (
        <PostGrid posts={posts} />
      )}

      {posts.length > 0 && (
        <BlogPagination page={page} totalPages={totalPages} categorySlug={categorySlug} />
      )}
    </div>
  );
}
