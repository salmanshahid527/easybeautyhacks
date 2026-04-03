"use client";

import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types";

interface RelatedPostsProps {
  posts: Post[];
  currentPostSlug: string;
}

export function RelatedPosts({ posts, currentPostSlug }: RelatedPostsProps) {
  // Filter out the current post and limit to 3-4 posts
  const relatedPosts = posts
    .filter((p) => p.slug !== currentPostSlug)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="w-full animate-fade-in-up">
      <div className="mb-10 animate-fade-in-down">
        <h2 className="font-display font-700 text-2xl lg:text-3xl text-foreground mb-2">
          Related Articles
        </h2>
        <p className="text-foreground-muted text-base lg:text-lg">
          Explore more topics in this category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 stagger-children">
        {relatedPosts.map((post) => (
          <Link
            key={post._id}
            href={`/${post.slug}`}
            className="group flex flex-col h-full overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary"
          >
            {/* Image Container - Hidden on Mobile */}
            {post.featuredImage && (
              <div className="hidden sm:block relative w-full h-40 sm:h-48 overflow-hidden bg-muted">
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            )}

            {/* Content Container */}
            <div className="flex flex-col flex-1 p-4 sm:p-6">
              {/* Category Badge */}
              {post.category && (
                <span className="inline-block w-fit mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                  {post.category.title}
                </span>
              )}

              {/* Title */}
              <h3 className="font-display font-600 text-lg lg:text-xl text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm text-foreground-muted line-clamp-2 flex-1 mb-4">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-foreground-muted pt-4 border-t border-border/30">
                {post.author?.name && <span>{post.author.name}</span>}
                {post.publishedAt && (
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
