"use client";

import { usePostsByCategory } from "@/hooks/usePosts";
import { PostGrid } from "./PostGrid";
import { PostMasonry } from "./PostMasonry";
import { useState } from "react";
import { LayoutGrid, Columns } from "lucide-react";
import type { Post, Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryArchiveProps {
  category: Category;
  initialPosts?: Post[];
}

export function CategoryArchive({ category, initialPosts }: CategoryArchiveProps) {
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const { data: posts = [], isLoading } = usePostsByCategory(
    category.id,
    initialPosts
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-muted animate-pulse">
            <div className="aspect-[16/10] bg-muted-foreground/10" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-muted-foreground/10 rounded w-1/3" />
              <div className="h-5 bg-muted-foreground/10 rounded w-3/4" />
              <div className="h-3 bg-muted-foreground/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-foreground-muted">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "grid" ? "bg-primary-muted text-primary" : "text-foreground-muted hover:text-foreground"
            )}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("masonry")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "masonry" ? "bg-primary-muted text-primary" : "text-foreground-muted hover:text-foreground"
            )}
          >
            <Columns size={18} />
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-foreground-muted">No posts yet in this category.</p>
        </div>
      ) : viewMode === "grid" ? (
        <PostGrid posts={posts} />
      ) : (
        <PostMasonry posts={posts} />
      )}
    </div>
  );
}
