/**
 * Rank Math headless SEO integration.
 * Calls `rankmath/v1/getHead` to retrieve the meta description
 * configured in Rank Math for a given post URL.
 *
 * Requires "Headless CMS Support" enabled in Rank Math → General → Others.
 */

function getWpRoot(): string {
  const raw = process.env.NEXT_PUBLIC_WP_API_URL?.trim().replace(/\/$/, "") ?? "";
  return raw.replace(/\/wp-json$/i, "") || "https://easybeautyhacks.com";
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

export async function fetchRankMathDescription(
  slug: string,
  timeoutMs = 8000,
): Promise<string | undefined> {
  const wpRoot = getWpRoot();
  const permalink = `${wpRoot}/${slug}/`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const u = new URL(`${wpRoot}/wp-json/rankmath/v1/getHead`);
    u.searchParams.set("url", permalink);
    const res = await fetch(u.toString(), {
      next: { revalidate: 300 },
      signal: ctrl.signal,
    });
    if (!res.ok) return undefined;
    const body = (await res.json()) as { success?: boolean; head?: string };
    if (!body.success || typeof body.head !== "string") return undefined;
    return parseDescriptionFromHead(body.head);
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}
