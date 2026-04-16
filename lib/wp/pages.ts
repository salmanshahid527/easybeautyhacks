import { cache } from "react";
import { fetchWp, fetchWpCollectionAll } from "./client";
import { decodeHtmlEntities, stripHtml, processPostBody } from "@/lib/html";
import type { WpPage } from "./types";
import type { Page } from "@/types";
import { SLUG_FALLBACKS } from "@/lib/constants";
import { isHeadlessExcludedWpPageSlug } from "./excludedPublicWpPages";

/** WP pages that map 1:1 to app routes under `SITE_URL` */
const WP_PAGE_SLUGS_FOR_SITEMAP = ["about", "contact", "privacy"] as const;

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
  if (isHeadlessExcludedWpPageSlug(slug)) return null;

  const page = await fetchPageBySlug(slug);
  if (page) return page;

  const fallbacks = SLUG_FALLBACKS[slug] ?? [];
  for (const fallback of fallbacks) {
    if (isHeadlessExcludedWpPageSlug(fallback)) continue;
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

/** Last-modified for static app routes backed by WP pages (avoids listing orphan WP URLs) */
export async function getWpBackedStaticPagesForSitemap(): Promise<
  Array<{ path: string; lastModified: Date }>
> {
  const data = await fetchWpCollectionAll<WpPage>(
    "/pages",
    {
      status: "publish",
      orderby: "modified",
      order: "desc",
    },
    { revalidate: false }
  );
  const bySlug = new Map(data.map((p) => [p.slug, p]));
  const out: Array<{ path: string; lastModified: Date }> = [];
  for (const slug of WP_PAGE_SLUGS_FOR_SITEMAP) {
    const wp = bySlug.get(slug);
    if (!wp) continue;
    const raw = wp.modified ?? wp.date;
    out.push({
      path: `/${slug}`,
      lastModified: raw ? new Date(raw) : new Date(),
    });
  }
  return out;
}
