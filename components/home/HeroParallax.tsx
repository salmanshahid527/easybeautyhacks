import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/SmartImage";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/types";

function isUnsplashUrl(src: string): boolean {
  return src.includes("images.unsplash.com");
}

function tightenUnsplashHeroUrl(src: string): string {
  if (!isUnsplashUrl(src)) return src;
  try {
    const u = new URL(src);
    u.searchParams.set("w", "800");
    u.searchParams.set("q", "72");
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", "crop");
    return u.toString();
  } catch {
    return src;
  }
}

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
  const featured = featuredPosts.find((p) => p.featuredImage);
  const heroImage = featured
    ? { src: featured.featuredImage!, alt: featured.title }
    : FALLBACK_IMAGES[0];
  const heroSrc = tightenUnsplashHeroUrl(heroImage.src);
  const heroUnoptimized = isUnsplashUrl(heroImage.src);

  return (
    <section className="relative flex min-h-[62vh] items-center overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-muted/60 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
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
          </div>

          <div className="relative h-[400px] hidden lg:block hero-fade-img">
            <div className="absolute inset-y-6 left-6 right-12 overflow-hidden rounded-[2rem] border-2 border-white/80 shadow-xl">
              <Image
                src={heroSrc}
                alt={heroImage.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 520px, 100vw"
                priority
                unoptimized={heroUnoptimized}
              />
            </div>
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
