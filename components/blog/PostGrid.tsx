"use client";

import { motion } from "framer-motion";
import { PostCard } from "./PostCard";
import { staggerContainer, fadeUpVariant } from "@/lib/animations";
import type { Post } from "@/types";
import { cn } from "@/lib/utils";

interface PostGridProps {
  posts: Post[];
  columns?: 2 | 3;
  className?: string;
}

export function PostGrid({ posts, columns = 3, className }: PostGridProps) {
  if (!posts.length) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "grid gap-6",
        columns === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2",
        className
      )}
    >
      {posts.map((post, i) => (
        <motion.div key={post._id} variants={fadeUpVariant}>
          <PostCard post={post} priority={i < 3} />
        </motion.div>
      ))}
    </motion.div>
  );
}
