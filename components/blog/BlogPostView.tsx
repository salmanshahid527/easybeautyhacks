"use client";

import { usePost } from "@/hooks/usePosts";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleBody } from "@/components/article/ArticleBody";
import { TableOfContents } from "@/components/article/TableOfContents";
import { AuthorCard } from "@/components/article/AuthorCard";
import { ShareButtons } from "@/components/article/ShareButtons";
import type { PostDetail } from "@/types";

interface BlogPostViewProps {
  slug: string;
  initialPost?: PostDetail | null;
}

export function BlogPostView({ slug, initialPost }: BlogPostViewProps) {
  const { data: post, isLoading } = usePost(slug, initialPost);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[50vh] bg-muted" />
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 py-8 space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-foreground-muted">Post not found.</p>
      </div>
    );
  }

  return (
    <article>
      <ArticleHero post={post} />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10 lg:gap-16">
          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-[720px]">
            <ShareButtons title={post.title} slug={post.slug} />

            {post.body && (
              <div className="mt-8">
                <ArticleBody html={post.body} />
              </div>
            )}

            <AuthorCard
              name={post.author?.name}
              image={post.author?.image}
            />
          </div>

          {/* Sidebar TOC (desktop only) */}
          {post.body && (
            <aside className="hidden lg:block w-60 xl:w-72 shrink-0">
              <TableOfContents html={post.body} />
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
