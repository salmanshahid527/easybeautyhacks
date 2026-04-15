"use client";

import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/SmartImage";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatDateTimeShort } from "@/lib/utils";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import type { Post } from "@/types";

interface TrendingStripProps {
  posts: Post[];
}

export function TrendingStrip({ posts }: TrendingStripProps) {
  const [useUnoptimizedById, setUseUnoptimizedById] = useState<Record<string, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  if (!posts.length) return null;

  return (
    <section className="section-gap bg-surface-warm">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="overline text-primary mb-2">What&apos;s Hot</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
              Trending Now
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-primary transition-colors"
          >
            More tips <ArrowRight size={14} />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {posts.slice(0, 4).map((post, i) => (
            <motion.div key={post._id} variants={fadeUpVariant}>
              <Link href={`/${post.slug}`} className="group relative block">
                {/* Ranking number */}
                <span
                  className="absolute -top-4 -left-2 font-display font-bold text-7xl leading-none select-none pointer-events-none z-0"
                  style={{ color: "var(--primary-muted)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative z-10 flex gap-3 items-start pt-6">
                  {/* Thumbnail */}
                  <div className="shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-muted">
                    {post.featuredImage && !failedImages[post._id] ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        width={80}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized={Boolean(useUnoptimizedById[post._id])}
                        onError={() => {
                          if (!useUnoptimizedById[post._id]) {
                            // Retry once with direct remote URL when optimizer fails (e.g. 402 quota).
                            setUseUnoptimizedById((prev) => ({ ...prev, [post._id]: true }));
                            return;
                          }
                          setFailedImages((prev) => ({ ...prev, [post._id]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-muted" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    {post.category && (
                      <p className="overline text-secondary mb-1">
                        {post.category.title}
                      </p>
                    )}
                    <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-foreground-subtle mt-1">
                      {post.author?.name ? `By ${post.author.name} · ` : ""}
                      {formatDateTimeShort(post.publishedAt)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
