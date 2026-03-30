"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { formatDateTimeShort, readTime } from "@/lib/utils";
import type { PostDetail } from "@/types";

interface ArticleHeroProps {
  post: PostDetail;
}

export function ArticleHero({ post }: ArticleHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Featured image with parallax */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt ?? post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-muted to-muted" />
          )}
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Article meta — bleeds over the image bottom */}
      <div className="relative -mt-16 mx-auto max-w-[800px] px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-foreground-subtle mb-5">
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
          <span className="text-foreground-muted truncate max-w-[200px]">
            {post.title}
          </span>
        </nav>

        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-block mb-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-accent-foreground transition-colors"
          >
            {post.category.title}
          </Link>
        )}

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-5">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-foreground-muted text-lg leading-relaxed mb-6">
            {post.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted pb-6 border-b border-border">
          {post.author && (
            <span className="font-medium text-foreground">{post.author.name}</span>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <time dateTime={post.publishedAt}>
              {formatDateTimeShort(post.publishedAt)}
            </time>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            {readTime(post.body)}
          </div>
        </div>
      </div>
    </section>
  );
}
