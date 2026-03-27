"use client";

import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { PostGrid } from "./PostGrid";
import { PostMasonry } from "./PostMasonry";
import { LayoutGrid, Columns } from "lucide-react";
import type { Post, Category } from "@/types";
import { cn } from "@/lib/utils";

interface PostListProps {
  initialPosts?: Post[];
  initialCategories?: Category[];
}

export function PostList({ initialPosts, initialCategories }: PostListProps) {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");

  const { data: allPosts = [] } = usePosts({ initialData: initialPosts });
  const { data: categories = [] } = useCategories(initialCategories);

  const filtered = activeCategorySlug
    ? allPosts.filter((p) => p.category?.slug === activeCategorySlug)
    : allPosts;

  return (
    <div>
      {/* Filter + view toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategorySlug(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              !activeCategorySlug
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-foreground-muted hover:border-primary hover:text-primary"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() =>
                setActiveCategorySlug(
                  activeCategorySlug === cat.slug ? null : cat.slug
                )
              }
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                activeCategorySlug === cat.slug
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground-muted hover:border-primary hover:text-primary"
              )}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "grid"
                ? "bg-primary-muted text-primary"
                : "text-foreground-muted hover:text-foreground"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("masonry")}
            className={cn(
              "p-2 rounded-lg transition-colors",
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

      {/* Results count */}
      <p className="text-sm text-foreground-muted mb-6">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {activeCategorySlug && (
          <> in <span className="text-primary font-medium capitalize">{activeCategorySlug.replace(/-/g, " ")}</span></>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-foreground-muted">No posts found. Check back soon!</p>
        </div>
      ) : viewMode === "grid" ? (
        <PostGrid posts={filtered} />
      ) : (
        <PostMasonry posts={filtered} />
      )}
    </div>
  );
}
