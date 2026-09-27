"use client";

import { removeFeaturedImageFromBody } from "@/lib/html";
import { addMissingImageAlts } from "@/lib/imageAlt";

interface ArticleBodyProps {
  html: string;
  featuredImageUrl?: string;
}

export function ArticleBody({ html, featuredImageUrl }: ArticleBodyProps) {
  // Remove ONLY the featured image from the beginning to avoid duplication with hero
  // In-content images are preserved for article flow
  const cleanedHtml = addMissingImageAlts(removeFeaturedImageFromBody(html, featuredImageUrl));

  return (
    <article className="prose-beauty max-w-full w-full">
      <div
        className="article-prose-inner mx-auto w-full max-w-2xl space-y-0 px-0 sm:px-1 [&_p]:wrap-break-word [&_h2]:wrap-break-word [&_h3]:wrap-break-word [&_li]:wrap-break-word [&_a]:wrap-break-word"
        dangerouslySetInnerHTML={{ __html: cleanedHtml }}
      />
    </article>
  );
}
