"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWpClient } from "@/lib/wp/client";
import { decodeHtmlEntities, stripHtml, processPostBody } from "@/lib/html";
import type { WpPage } from "@/lib/wp/types";
import type { Page } from "@/types";

async function fetchPage(slug: string): Promise<Page | null> {
  const data = await fetchWpClient<WpPage[]>("/pages", {
    slug,
    status: "publish",
  });
  if (!data[0]) return null;
  return {
    _id: String(data[0].id),
    title: decodeHtmlEntities(stripHtml(data[0].title.rendered)),
    slug: data[0].slug,
    content: processPostBody(data[0].content?.rendered),
    excerpt: decodeHtmlEntities(stripHtml(data[0].excerpt?.rendered ?? "")),
  };
}

export function usePage(slug: string, initialData?: Page | null) {
  const hasInitial = !!initialData;
  return useQuery({
    queryKey: ["page", slug],
    queryFn: () => fetchPage(slug),
    enabled: !!slug,
    initialData: initialData ?? undefined,
    initialDataUpdatedAt: hasInitial ? Date.now() : undefined,
    staleTime: hasInitial ? Infinity : 0,
  });
}
