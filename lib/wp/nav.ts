import { fetchWp } from "./client";
import { decodeHtmlEntities, stripHtml } from "@/lib/html";
import { SLUG_TO_PATH, NAV_PAGE_SLUGS } from "@/lib/constants";
import type { WpPage } from "./types";
import type { NavLink } from "@/types";

const STATIC_PREFIX: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

export async function getNavLinks(): Promise<NavLink[]> {
  try {
    const data = await fetchWp<WpPage[]>("/pages", {
      per_page: 100,
      status: "publish",
      orderby: "menu_order",
      order: "asc",
    });

    const extras: NavLink[] = data
      .filter((p) => NAV_PAGE_SLUGS.includes(p.slug))
      .map((p) => ({
        label: decodeHtmlEntities(stripHtml(p.title.rendered)),
        href: SLUG_TO_PATH[p.slug] ?? `/${p.slug}`,
      }));

    return [...STATIC_PREFIX, ...extras];
  } catch {
    return STATIC_PREFIX;
  }
}
