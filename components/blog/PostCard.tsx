import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { formatDateShort, readTime, cn } from "@/lib/utils";
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
  return (
    <article
      className={cn(
        "group bg-card rounded-xl overflow-hidden border border-border card-hover img-zoom shadow-sm",
        className
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted rounded-xl",
            variant === "featured" ? "aspect-[16/9]" : "aspect-[16/10]"
          )}
        >
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt ?? post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-muted to-muted flex items-center justify-center">
              <span className="font-display text-4xl text-primary/30">✦</span>
            </div>
          )}

          {/* Category badge */}
          {post.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-muted text-primary">
              {post.category.title}
            </span>
          )}

          {/* Read time */}
          {post.excerpt && (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-card/90 text-foreground-muted backdrop-blur-sm">
              <Clock size={10} />
              {readTime(post.excerpt)}
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 sm:p-5">
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="overline text-foreground-muted hover:text-primary transition-colors mb-2 block"
          >
            {post.category.title}
          </Link>
        )}

        <Link href={`/blog/${post.slug}`}>
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-foreground-subtle">
            <Calendar size={11} />
            <time dateTime={post.publishedAt}>{formatDateShort(post.publishedAt)}</time>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-medium text-secondary hover:text-primary transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
