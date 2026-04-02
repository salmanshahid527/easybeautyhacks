"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { usePosts, type BlogPostsQueryData } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { PostGrid } from "./PostGrid";
import { PostMasonry } from "./PostMasonry";
import { BlogPagination, buildBlogListHref } from "./BlogPagination";
import { LayoutGrid, Columns } from "lucide-react";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import { BLOG_POSTS_PER_PAGE } from "@/lib/blogPagination";

interface PostListProps {
  initialBlogPage?: BlogPostsQueryData;
  initialCategories?: Category[];
}

export function PostList({ initialBlogPage, initialCategories }: PostListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const searchParams = useSearchParams();
  const rawPage = searchParams.get("page");
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);
  const categorySlug = searchParams.get("category")?.trim() || undefined;
  const categoryId =
    categorySlug && initialCategories?.length
      ? initialCategories.find((c) => c.slug === categorySlug)?.id
      : undefined;

  const { data, isLoading } = usePosts({
    page,
    perPage: BLOG_POSTS_PER_PAGE,
    categoryId,
    initialData: initialBlogPage,
  });
  const { data: categories = [] } = useCategories(initialCategories);

  const posts = data?.posts ?? [];
  const total = data?.total;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
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

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-lg p-2 transition-colors",
              viewMode === "grid"
                ? "bg-primary-muted text-primary"
                : "text-foreground-muted hover:text-foreground"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("masonry")}
            className={cn(
              "rounded-lg p-2 transition-colors",
              viewMode === "masonry"
                ? "bg-primary-muted text-primary"
                : "text-foreground-muted hover:text-foreground"
            )}
            aria-label="Masonry view"
          >
            <Columns size={18} />
          </button>
        </div>
      </div>

      <p className="mb-6 text-sm text-foreground-muted">
        {typeof total === "number"
          ? `${total} ${total === 1 ? "article" : "articles"}`
          : `${posts.length} on this page`}
        {categorySlug ? (
          <>
            {" "}
            in{" "}
            <span className="font-medium capitalize text-primary">
              {categorySlug.replace(/-/g, " ")}
            </span>
          </>
        ) : null}
      </p>

      {isLoading ? (
        <div className="py-16 text-center text-foreground-muted">Loading…</div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-foreground-muted">No posts found. Check back soon!</p>
        </div>
      ) : viewMode === "grid" ? (
        <PostGrid posts={posts} />
      ) : (
        <PostMasonry posts={posts} />
      )}

      {!isLoading && posts.length > 0 ? (
        <BlogPagination page={page} totalPages={totalPages} categorySlug={categorySlug} />
      ) : null}
    </div>
  );
}
