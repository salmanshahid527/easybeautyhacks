"use client";

import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/SmartImage";
import { SITE_NAME } from "@/lib/constants";

interface AuthorCardProps {
  name?: string;
  image?: string;
  bio?: string;
}

export function AuthorCard({ name, image, bio }: AuthorCardProps) {
  const authorName = name ?? SITE_NAME;

  // Real bio from the WordPress user profile only; never a made-up fallback.
  const authorBio = bio || "";

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 rounded-2xl bg-surface-warm border border-border w-full">
      {/* Author Image wrapper */}
      <div className="shrink-0">
        {image ? (
          <Image
            src={image}
            alt={authorName}
            width={96}
            height={96}
            className="rounded-full object-cover shadow-sm"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary-muted flex items-center justify-center shadow-sm">
            <span className="font-display text-4xl text-primary font-semibold uppercase">
              {authorName[0]}
            </span>
          </div>
        )}
      </div>

      {/* Author Details */}
      <div className="flex flex-col text-center sm:text-left justify-center h-full sm:pt-1">
        <span className="text-xs font-bold tracking-widest uppercase text-primary mb-1 block">
          Author
        </span>

        <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-2">
          {authorName}
        </h3>

        <p className="text-sm sm:text-base text-foreground-muted leading-relaxed max-w-2xl">
          {authorBio}
        </p>

        <Link
          href="/about"
          className="inline-block mt-3 text-sm font-semibold text-primary hover:underline"
        >
          About the author →
        </Link>
      </div>
    </div>
  );
}