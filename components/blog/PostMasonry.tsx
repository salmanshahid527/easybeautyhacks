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
      className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      style={{}}
    >
      {posts.map((post, i) => (
        <motion.div
          key={post._id}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="h-full"
        >
          <PostCard post={post} priority={i < 3} />
        </motion.div>
      ))}
    </div>
  );
}
