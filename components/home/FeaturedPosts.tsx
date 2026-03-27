"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostGrid } from "@/components/blog/PostGrid";
import type { Post } from "@/types";
import { motion } from "framer-motion";
import { fadeUpVariant } from "@/lib/animations";

interface FeaturedPostsProps {
  posts: Post[];
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="section-gap bg-background">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="overline text-primary mb-2">Editor&apos;s Picks</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
              Trending Beauty Tips
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-primary transition-colors"
          >
            See all posts <ArrowRight size={14} />
          </Link>
        </motion.div>

        <PostGrid posts={posts.slice(0, 6)} />

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            See all posts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
