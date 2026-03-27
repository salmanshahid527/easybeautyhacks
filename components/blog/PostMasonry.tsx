"use client";

import { motion } from "framer-motion";
import { PostCard } from "./PostCard";
import { fadeUpVariant } from "@/lib/animations";
import type { Post } from "@/types";

interface PostMasonryProps {
  posts: Post[];
}

export function PostMasonry({ posts }: PostMasonryProps) {
  if (!posts.length) return null;

  return (
    <div
      className="columns-1 sm:columns-2 lg:columns-3 gap-6"
      style={{ columnFill: "balance" }}
    >
      {posts.map((post, i) => (
        <motion.div
          key={post._id}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="break-inside-avoid mb-6"
        >
          <PostCard post={post} priority={i < 3} />
        </motion.div>
      ))}
    </div>
  );
}
