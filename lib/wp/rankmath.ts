/**
 * Rank Math headless SEO integration.
 * Calls `rankmath/v1/getHead` to retrieve the meta description
 * configured in Rank Math for a given post URL.
 *
 * The `url` query param must be the **public canonical** permalink (same as
 * `post.link` in WordPress), not the headless API host.
 *
 * Requires "Headless CMS Support" enabled in Rank Math → General → Others.
 */

import { cache } from "react";
import { SITE_URL } from "@/lib/constants";

function getRankMathApiOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_WP_API_URL?.trim().replace(/\/$/, "") ?? "";
  const base = raw.replace(/\/wp-json$/i, "");
  if (base) return base;
  return SITE_URL.replace(/\/+$/, "");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#8217;/g, "\u2019");
}

function parseDescriptionFromHead(html: string): string | undefined {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*\/?>/i,
    /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["'][^>]*\/?>/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) {
      const t = decodeEntities(m[1]).trim();
      if (t) return t.replace(/\s+/g, " ");
    }
  }
  return undefined;
}

async function fetchRankMathDescriptionImpl(
  slug: string,
  timeoutMs = 8000,
): Promise<string | undefined> {
  const apiOrigin = getRankMathApiOrigin();
  const siteBase = SITE_URL.replace(/\/+$/, "");
  const cleanSlug = slug.replace(/^\/+/, "").replace(/\/+$/, "");
  const permalink = `${siteBase}/${cleanSlug}/`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const candidates = [apiOrigin];
    try {
      const perm = new URL(permalink);
      const publicOrigin = `${perm.protocol}//${perm.host}`;
      if (publicOrigin !== apiOrigin) candidates.push(publicOrigin);
    } catch {
      /* keep api origin only */
    }

    for (const origin of candidates) {
      const u = new URL(`${origin}/wp-json/rankmath/v1/getHead`);
      u.searchParams.set("url", permalink);
      const res = await fetch(u.toString(), {
        next: { revalidate: 300 },
        signal: ctrl.signal,
      });
      if (!res.ok) continue;
      const body = (await res.json()) as { success?: boolean; head?: string };
      if (!body.success || typeof body.head !== "string") continue;
      return parseDescriptionFromHead(body.head);
    }
    return undefined;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

export const fetchRankMathDescription = cache(fetchRankMathDescriptionImpl);
