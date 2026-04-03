"use client";

import { useEffect, useState } from "react";
import { usePost } from "@/hooks/usePosts";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleBody } from "@/components/article/ArticleBody";
import { TableOfContents } from "@/components/article/TableOfContents";
import { AuthorCard } from "@/components/article/AuthorCard";
import { ShareButtons } from "@/components/article/ShareButtons";
import { RelatedPosts } from "@/components/article/RelatedPosts";
import { FAQAccordion, type FAQItem } from "@/components/article/FAQAccordion";
import { extractFAQFromHtml } from "@/lib/html";
import type { PostDetail, Post } from "@/types";

interface BlogPostViewProps {
  slug: string;
  initialPost?: PostDetail | null;
  relatedPosts?: Post[];
}

export function BlogPostView({ slug, initialPost, relatedPosts = [] }: BlogPostViewProps) {
  const { data: post, isLoading } = usePost(slug, initialPost);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    if (post?.body) {
      const items = extractFAQFromHtml(post.body);
      setFaqItems(items);
    }
  }, [post?.body]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[50vh] bg-muted" />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">
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

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12">
          {/* Main content */}
          <div className="lg:col-span-8">
            <ShareButtons title={post.title} slug={post.slug} />

            {post.body && (
              <div className="mt-10 lg:mt-12">
                <ArticleBody html={post.body} featuredImageUrl={post.featuredImage} />
              </div>
            )}

            {/* FAQ Section */}
            {faqItems.length > 0 && (
              <div className="mt-14 lg:mt-16">
                <FAQAccordion items={faqItems} />
              </div>
            )}

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-14 lg:mt-16">
                <RelatedPosts posts={relatedPosts} currentPostSlug={slug} />
              </div>
            )}

            <div className="mt-14 lg:mt-16 pt-10 lg:pt-12 border-t border-border">
              <AuthorCard
                name={post.author?.name}
                image={post.author?.image}
              />
            </div>
          </div>

          {/* Sidebar TOC (desktop only) */}
          {post.body && (
            <aside className="hidden lg:block lg:col-span-4 sticky top-8 h-fit">
              <TableOfContents html={post.body} />
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
