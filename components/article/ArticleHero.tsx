"use client";

import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { formatDateTimeShort, readTime } from "@/lib/utils";
import type { PostDetail } from "@/types";

interface ArticleHeroProps {
  post: PostDetail;
}

export function ArticleHero({ post }: ArticleHeroProps) {
  return (
    <section 
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{
        backgroundImage: post.featuredImage 
          ? `url('${post.featuredImage}')` 
          : 'linear-gradient(135deg, var(--color-primary-muted), var(--color-background))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />

      {/* Article meta content */}
      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-white/80 mb-5 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          {post.category && (
            <>
              <Link
                href={`/category/${post.category.slug}`}
                className="hover:text-white transition-colors"
              >
                {post.category.title}
              </Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-white/70 truncate">
            {post.title}
          </span>
        </nav>

        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/80 transition-colors shadow-sm"
          >
            {post.category.title}
          </Link>
        )}

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 max-w-4xl drop-shadow-lg">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed mb-8 max-w-3xl drop-shadow">
            {post.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 text-sm text-white/80 pt-6 border-t border-white/20">
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.image && (
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="font-medium text-white">{post.author.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            <time dateTime={post.publishedAt}>
              {formatDateTimeShort(post.publishedAt)}
            </time>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            {readTime(post.body)}
          </div>
        </div>
      </div>
    </section>
  );
}
