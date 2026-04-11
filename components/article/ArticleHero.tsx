"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { formatDateTimeShort, readTime } from "@/lib/utils";
import type { PostDetail } from "@/types";

interface ArticleHeroProps {
  post: PostDetail;
}

export function ArticleHero({ post }: ArticleHeroProps) {
  return (
    <section className="relative bg-linear-to-br from-primary-muted via-background to-background overflow-hidden">
      {/* Featured Image Background */}
      {post.featuredImage && (
        <div className="absolute inset-0 opacity-15">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Subtle accent decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-muted/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -ml-36 -mb-36" />
      </div>

      {/* Article meta content */}
      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-foreground-subtle mb-5 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          {post.category && (
            <>
              <Link
                href={`/category/${post.category.slug}`}
                className="hover:text-primary transition-colors"
              >
                {post.category.title}
              </Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-foreground-muted truncate">
            {post.title}
          </span>
        </nav>

        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm animate-fade-in-down"
          >
            {post.category.title}
          </Link>
        )}

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-4 max-w-4xl animate-fade-in-up">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-base sm:text-lg lg:text-xl text-foreground-muted leading-relaxed mb-8 max-w-3xl animate-fade-in-up" style={{animationDelay: '100ms'}}>
            {post.excerpt}
          </p>
        )}

        {post.featuredImage ? (
          <div
            className="relative mt-2 mb-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-lg aspect-16/10 max-h-[min(70vw,440px)] sm:max-h-[440px] animate-fade-in-up"
            style={{ animationDelay: "120ms" }}
          >
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
              priority
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-6 text-sm text-foreground-muted pt-6 border-t border-border/50 animate-slide-up" style={{animationDelay: '150ms'}}>
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.image && (
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="font-medium text-foreground">{post.author.name}</span>
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
