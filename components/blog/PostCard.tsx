"use client";

import { useState } from "react";
import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/SmartImage";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { formatDateTimeShort, readTime, cn } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  priority?: boolean;
  className?: string;
  variant?: "default" | "featured" | "compact";
}

export function PostCard({
  post,
  priority = false,
  className,
  variant = "default",
}: PostCardProps) {
  const [useUnoptimized, setUseUnoptimized] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(post.featuredImage) && !imageFailed;

  return (
    <article
      className={cn(
        "group bg-card rounded-xl overflow-hidden border border-border card-hover img-zoom shadow-sm h-full flex flex-col",
        className
      )}
    >
      <Link href={`/${post.slug}`} className="block">
        {/* Image Container */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted rounded-xl",
            variant === "featured" ? "aspect-[16/9]" : "aspect-[16/10]"
          )}
        >
          {showImage ? (
            <>
              {/*  PINTEREST BUTTON  */}
                <div className="absolute top-3 right-3 z-20 transition-opacity duration-200 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Card open nahi hoga
                    e.stopPropagation(); // Click sirf button par kaam karega
                    window.open("https://www.pinterest.com/easybeautyhacks/", "_blank");
                  }}
                  className="bg-red-600 text-white p-2 rounded-full shadow-md flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.372 0 0 5.373 0 12c0 5.084 3.163 9.406 7.622 11.095-.105-.945-.2-2.395.042-3.429.218-.936 1.404-5.964 1.404-5.964s-.358-.716-.358-1.775c0-1.662.964-2.902 2.165-2.902 1.02 0 1.512.767 1.512 1.684 0 1.026-.654 2.558-.99 3.981-.283 1.196.602 2.17 1.784 2.17 2.14 0 3.786-2.257 3.786-5.516 0-2.878-2.066-4.886-5.019-4.886-3.426 0-5.44 2.568-5.44 5.224 0 1.034.397 2.145.893 2.747.098.119.112.223.083.344-.09.374-.293 1.193-.331 1.361-.052.22-.17.268-.396.162-1.482-.687-2.406-2.843-2.406-4.58 0-3.731 2.71-7.159 7.814-7.159 4.096 0 7.281 2.92 7.281 6.811 0 4.063-2.561 7.337-6.11 7.337-1.194 0-2.316-.62-2.7-1.352l-.735 2.805c-.265 1.012-.985 2.283-1.467 3.057C9.72 23.947 10.847 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                </button>
              </div>

              <Image
                src={post.featuredImage!}
                alt={post.featuredImageAlt ?? post.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={priority}
                unoptimized={useUnoptimized}
                onError={() => {
                  if (!useUnoptimized) {
                    setUseUnoptimized(true);
                    return;
                  }
                  setImageFailed(true);
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-muted to-muted flex items-center justify-center">
              <span className="font-display text-4xl text-primary/30">✦</span>
            </div>
          )}

          {/* Category badge */}
          {post.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-muted text-primary z-10">
              {post.category.title}
            </span>
          )}

        </div>
      </Link>

      {/* Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="overline text-foreground-muted hover:text-primary transition-colors mb-2 block"
          >
            {post.category.title}
          </Link>
        )}

        <Link href={`/${post.slug}`}>
          <h3
            className={cn(
              "font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2",
              variant === "featured" ? "text-2xl" : "text-xl"
            )}
          >
            {post.title}
          </h3>
        </Link>

        {variant !== "compact" && post.excerpt && (
          <p className="text-sm text-foreground-muted line-clamp-2 leading-relaxed mb-4">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto gap-2">
          <div className="flex items-center gap-1.5 text-xs text-foreground-subtle flex-1 min-w-0">
            {post.author?.name ? (
              <>
                <User size={11} className="shrink-0" />
                <span className="truncate">{post.author.name}</span>
              </>
            ) : null}
          </div>
          <Link
            href={`/${post.slug}`}
            className="shrink-0 whitespace-nowrap inline-flex items-center gap-1 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-3 py-1.5 transition-all duration-200"
          >
            Read more
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </article>
  );
}