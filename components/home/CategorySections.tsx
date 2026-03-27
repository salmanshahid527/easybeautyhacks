"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PostCard } from "@/components/blog/PostCard";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import type { Category, Post } from "@/types";

interface CategorySectionsProps {
  categories: Category[];
  postsByCategoryId: Record<number, Post[]>;
}

export function CategorySections({
  categories,
  postsByCategoryId,
}: CategorySectionsProps) {
  const catsWithPosts = categories.filter(
    (cat) => (postsByCategoryId[cat.id]?.length ?? 0) > 0
  );

  if (!catsWithPosts.length) return null;

  return (
    <section className="section-gap bg-background">
      {catsWithPosts.map((cat, sectionIdx) => {
        const posts = postsByCategoryId[cat.id] ?? [];
        const isEven = sectionIdx % 2 === 0;

        return (
          <div
            key={cat._id}
            className={`mb-16 ${isEven ? "" : "bg-background-alt py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-2xl"}`}
          >
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="flex items-end justify-between mb-7"
              >
                <div>
                  <p className="overline text-primary mb-1.5">Beauty Tips</p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                    {cat.title}
                  </h2>
                </div>
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-primary transition-colors"
                >
                  More {cat.title} <ArrowRight size={14} />
                </Link>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {posts.slice(0, 4).map((post) => (
                  <motion.div key={post._id} variants={fadeUpVariant}>
                    <PostCard post={post} variant="compact" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
