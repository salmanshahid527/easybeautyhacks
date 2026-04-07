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
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden group"
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

      {/* Pinterest Button */}
      <a
        href="https://pinterest.com/easybeautyhacks"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Share on Pinterest"
        className={`
          absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8
          z-20
          w-12 h-12 md:w-14 md:h-14
          bg-[#E60023] hover:bg-[#C41E14]
          rounded-full
          flex items-center justify-center
          shadow-lg hover:shadow-2xl
          transition-all duration-300 ease-out
          opacity-0 sm:group-hover:opacity-100
          md:group-hover:opacity-100
          lg:opacity-100
          pointer-events-auto
          active:scale-95
          ring-2 ring-white/20 hover:ring-white/40
        `}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M12 6c-3.3 0-6 2.7-6 6 0 2.5 1.5 4.7 3.7 5.6-.1-1-.2-2.5 0-3.6l2.2-9.4c.1-.4.6-.8 1.1-.8s1 .4 1.1.8l2.2 9.4c.2 1.1.1 2.6 0 3.6 2.2-.9 3.7-3.1 3.7-5.6 0-3.3-2.7-6-6-6z" />
        </svg>
      </a>

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
