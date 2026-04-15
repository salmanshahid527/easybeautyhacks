"use client";

import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/SmartImage";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";

const FALLBACK_GRADIENT = [
  "from-primary-muted to-muted",
  "from-secondary/20 to-muted",
  "from-accent to-muted",
  "from-primary-muted/70 to-secondary/10",
  "from-muted to-background-alt",
  "from-foreground/5 to-primary-muted/30",
];

// Fallback Unsplash images per beauty category slug
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  skincare: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  makeup: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
  "hair-care": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  "nail-art": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
  wellness: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
};

interface CategoryGridProps {
  categories: Category[];
  postImages?: Record<string, string>; // categorySlug → imageUrl
}

function CategoryCell({
  category,
  imageUrl,
  tall = false,
  gradientClass,
  index,
}: {
  category?: Category;
  imageUrl?: string;
  tall?: boolean;
  gradientClass: string;
  index: number;
}) {
  const href = category ? `/category/${category.slug}` : "/blog";
  const label = category ? category.title : "View All";

  // Use provided image, then category fallback, then gradient
  const displayImage =
    imageUrl ||
    (category ? CATEGORY_FALLBACK_IMAGES[category.slug] : undefined);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-xl group cursor-pointer ${tall ? "row-span-2" : ""}`}
    >
      <Link href={href} className="block h-full">
        <div className="relative w-full h-full min-h-[200px]">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="overline text-white/70 mb-1">
              {category?.count ? `${category.count} tips` : ""}
            </p>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-white text-xl sm:text-2xl">
                {label}
              </h3>
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                <ArrowRight size={14} className="text-white" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoryGrid({ categories, postImages = {} }: CategoryGridProps) {
  const cats = categories.slice(0, 5);

  return (
    <section className="py-16 bg-background-alt">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="overline text-primary mb-2">Browse by Category</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
              Find Your Beauty Style
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-primary transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-[200px]">
          {cats.map((cat, idx) => (
            <div key={cat._id} className="col-span-1">
              <CategoryCell
                category={cat}
                imageUrl={postImages[cat.slug]}
                gradientClass={FALLBACK_GRADIENT[idx % FALLBACK_GRADIENT.length]}
                index={idx}
              />
            </div>
          ))}

          {/* View All cell */}
          <div className="col-span-1">
            <CategoryCell
              gradientClass="from-primary/20 to-primary-muted/30"
              index={cats.length}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
