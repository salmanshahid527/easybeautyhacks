"use client";

import { usePage } from "@/hooks/usePage";
import type { Page } from "@/types";

interface WpPageContentProps {
  slug: string;
  initialPage?: Page | null;
  emptyMessage?: React.ReactNode;
}

export function WpPageContent({
  slug,
  initialPage,
  emptyMessage,
}: WpPageContentProps) {
  const { data: page, isLoading, isError } = usePage(slug, initialPage);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 max-w-3xl">
        <div className="h-8 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>
    );
  }

  if (isError || !page) {
    return (
      <div className="text-foreground-muted">
        {emptyMessage ?? <p>Content not found.</p>}
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-8">
        {page.title}
      </h1>
      {page.content && (
        <div
          className="prose-beauty"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}
    </div>
  );
}
