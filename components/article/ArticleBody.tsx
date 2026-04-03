"use client";

import { removeFeaturedImageFromBody } from "@/lib/html";

interface ArticleBodyProps {
  html: string;
  featuredImageUrl?: string;
}

export function ArticleBody({ html, featuredImageUrl }: ArticleBodyProps) {
  // Remove ONLY the featured image from the beginning to avoid duplication with hero
  // In-content images are preserved for article flow
  const cleanedHtml = removeFeaturedImageFromBody(html, featuredImageUrl);

  return (
    <article className="prose-beauty max-w-full w-full">
      <div
        className="space-y-0 [&_p]:break-words [&_h2]:break-words [&_h3]:break-words [&_li]:break-words [&_a]:break-words"
        dangerouslySetInnerHTML={{ __html: cleanedHtml }}
      />
    </article>
  );
}
