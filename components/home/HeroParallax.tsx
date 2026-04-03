"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/types";

// Curated fallback images (Unsplash — royalty-free) shown when WP has no posts yet
const FALLBACK_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    alt: "Beauty flat lay with cosmetics",
  },
  {
    src: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    alt: "Skincare routine products",
  },
  {
    src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    alt: "Makeup collection",
  },
];

interface HeroParallaxProps {
  featuredPosts: Post[];
}

export function HeroParallax({ featuredPosts }: HeroParallaxProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const wpImages = featuredPosts.slice(0, 3).filter((p) => p.featuredImage);
  const heroImages =
    wpImages.length > 0
      ? wpImages.map((p) => ({ src: p.featuredImage!, alt: p.title }))
      : FALLBACK_IMAGES;

  return (
    <section
      ref={ref}
      className="relative min-h-[62vh] overflow-hidden flex items-center bg-background"
    >
      {/* Background gradient blobs — parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-muted/60 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl translate-y-1/3 -translate-x-1/4" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text — CSS fade-up animations, parallax y via motion */}
          <motion.div style={{ y: textY }}>
            <p className="overline text-primary mb-4 hero-fade-1">
              Beauty Tips &amp; Hacks
            </p>

            <h1 className="font-display font-semibold leading-tight mb-6 hero-fade-2">
              <span className="block text-5xl sm:text-6xl lg:text-7xl text-foreground">
                Your Best Beauty
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl text-foreground">
                Starts Here
              </span>
            </h1>

            <p className="text-lg text-foreground leading-relaxed mb-8 max-w-md hero-fade-3">
              Easy tips for glowing skin, perfect makeup &amp; beautiful hair
            </p>

            <div className="flex flex-wrap gap-3 hero-fade-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-accent-foreground text-primary-foreground font-medium transition-all hover:shadow-[var(--shadow-brand)] hover:-translate-y-0.5"
              >
                Explore Tips
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/category/skincare"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary text-foreground hover:text-primary font-medium transition-all"
              >
                Browse Skincare
              </Link>
            </div>

            <p className="mt-6 text-xs text-foreground-subtle hero-fade-5">
              500+ tips · 5 categories · Updated weekly
            </p>
          </motion.div>

          {/* Image Collage */}
          <div className="relative h-[400px] hidden lg:block hero-fade-img">
            {heroImages.map((img, i) => {
              const transforms = [
                "rotate-[-2deg] translate-x-4",
                "rotate-[1.5deg] -translate-y-8 translate-x-12",
                "rotate-[-0.5deg] translate-y-4 -translate-x-4",
              ];
              const sizes = ["w-60 h-72", "w-52 h-64", "w-44 h-56"];
              const positions = [
                "top-0 left-0",
                "top-8 left-28",
                "top-28 left-12",
              ];
              const zIndexes = [10, 20, 30];

              return (
                <div
                  key={i}
                  className={`absolute ${positions[i]} ${sizes[i]} ${transforms[i]} rounded-2xl overflow-hidden border-2 border-white/80 shadow-xl`}
                  style={{ zIndex: zIndexes[i] }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="280px"
                    priority={i === 0}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z"
            fill="var(--background-alt)"
          />
        </svg>
      </div>
    </section>
  );
}
