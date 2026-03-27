import { cache } from "react";
import { fetchWp } from "./client";
import { decodeHtmlEntities, stripHtml, processPostBody } from "@/lib/html";
import type { WpPage } from "./types";
import type { Page } from "@/types";
import { SLUG_FALLBACKS } from "@/lib/constants";

function mapWpPageToPage(wp: WpPage): Page {
  return {
    _id: String(wp.id),
    title: decodeHtmlEntities(stripHtml(wp.title.rendered)),
    slug: wp.slug,
    content: processPostBody(wp.content?.rendered),
    excerpt: decodeHtmlEntities(stripHtml(wp.excerpt?.rendered ?? "")),
  };
}

async function fetchPageBySlug(slug: string): Promise<Page | null> {
  const data = await fetchWp<WpPage[]>("/pages", { slug, status: "publish" });
  if (!data[0]) return null;
  return mapWpPageToPage(data[0]);
}

export const getPageBySlug = cache(async function (
  slug: string
): Promise<Page | null> {
  const page = await fetchPageBySlug(slug);
  if (page) return page;

  const fallbacks = SLUG_FALLBACKS[slug] ?? [];
  for (const fallback of fallbacks) {
    const p = await fetchPageBySlug(fallback);
    if (p) return p;
  }
  return null;
});

export const getAllPages = cache(async function (): Promise<Page[]> {
  const data = await fetchWp<WpPage[]>("/pages", {
    per_page: 100,
    status: "publish",
    orderby: "menu_order",
    order: "asc",
  });
  return data.map(mapWpPageToPage);
});
