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
import PinterestHover from "./PinterestHover";

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
  const cleanedBody = (post.body ?? "").split("Frequently Asked Questions")[0];
return (
  <article>
    <ArticleHero post={post} />

    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* Centered Main Content */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">

          <ShareButtons title={post.title} slug={post.slug} />

          {post.body && (
            <div className="mt-10">

           {/* pintrest-hover */}
              <PinterestHover targetContainerClass="article-rich-text-body" />
              <div className="article-rich-text-body">
            <ArticleBody   html={cleanedBody} featuredImageUrl={post.featuredImage} />
              </div>
              
          </div> 
          )}

          {/* FAQ */}
          {faqItems.length > 0 && (
            <div className="mt-16">
              <FAQAccordion items={faqItems} />
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <RelatedPosts posts={relatedPosts} currentPostSlug={slug} />
            </div>
          )}     

          {/* Author */}
          <div className="mt-16 pt-10 border-t border-border">
            <AuthorCard
              name={post.author?.name}
              image={post.author?.image}
              bio={(post.author as { description?: string } | undefined)?.description}
            />
          </div>
        </div>
      </div>

      {/* OPTIONAL: Sidebar (TOC) */}
      {post.body && (
        <div className="hidden xl:block fixed right-10 top-40 w-64">
          <TableOfContents html={post.body} />
        </div>
      )}

    </div>
  </article>
);
  
}
