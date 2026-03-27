"use client";

import { useMemo } from "react";
import { useActiveHeading } from "@/hooks/useActiveHeading";
import { cn } from "@/lib/utils";

interface HeadingItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  html: string;
}

function extractHeadings(html: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]) as 2 | 3,
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ""),
    });
  }
  return headings;
}

export function TableOfContents({ html }: TableOfContentsProps) {
  const headings = useMemo(() => extractHeadings(html), [html]);
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const activeId = useActiveHeading(ids);

  if (headings.length < 2) return null;

  return (
    <nav className="sticky top-24 space-y-1" aria-label="Table of contents">
      <p className="overline text-foreground-subtle mb-3">In this article</p>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={cn(
            "block text-sm py-1 transition-all duration-200 border-l-2",
            heading.level === 3 ? "pl-5" : "pl-3",
            activeId === heading.id
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-foreground-muted hover:text-foreground hover:border-border"
          )}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(heading.id)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
