
"use client";

import { SmartImage as Image } from "@/components/ui/SmartImage";
import { SITE_NAME } from "@/lib/constants";

interface AuthorCardProps {
  name?: string;
  image?: string;
  bio?: string;
}

export function AuthorCard({ name, image, bio }: AuthorCardProps) {
  const authorName = name ?? SITE_NAME;
  
  // Agar WordPress se bio na aaye, toh default humari decor site wali bio set ho jayegi
  const authorBio = bio || "Beauty content creator and chief editor at EasyBeautyHacks. Dedicated to testing and sharing the best DIY skincare treatments, makeup techniques, and time-saving hair hacks. Mila helps women elevate their daily beauty routines without spending a fortune.";

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 rounded-2xl bg-surface-warm border border-border w-full">
      {/* Author Image wrapper */}
      <div className="shrink-0">
        {image ? (
          <Image
            src={image}
            alt={authorName}
            width={96} // Herbeauty style: Size bada kar diya (96px)
            height={96}
            className="rounded-full object-cover shadow-sm"
          />
        ) : (
          /* Fallback initial letter placeholder */
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
      </div>
    </div>
  );
}