// Expected format: https://api.example.com/wp-json (trailing slash optional)
function wpApiRoot(): string {
  const v = process.env.NEXT_PUBLIC_WP_API_URL?.trim().replace(/\/$/, "") ?? "";
  if (!v) {
    throw new Error(
      "Set NEXT_PUBLIC_WP_API_URL to your WordPress REST root (e.g. https://api.example.com/wp-json)"
    );
  }
  return v;
}

const apiBase = () => `${wpApiRoot()}/wp/v2`;

export async function fetchWp<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = new URL(`${apiBase()}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    // Return empty array / null gracefully on 404
    if (res.status === 404) return [] as unknown as T;
    throw new Error(`WP API error ${res.status}: ${url.toString()}`);
  }

  return res.json() as Promise<T>;
}

/** WordPress REST max for `per_page` on most hosts */
const WP_MAX_PER_PAGE = 100;

/**
 * Walk every page of a collection using `page` + `per_page` and `X-WP-TotalPages`.
 * Omits `_embed` by default — use for sitemaps and bulk lists.
 */
export async function fetchWpCollectionAll<T>(
  path: string,
  baseParams?: Record<string, string | number | boolean | undefined>,
  options?: { revalidate?: number; perPage?: number }
): Promise<T[]> {
  const perPage = Math.min(
    Math.max(1, options?.perPage ?? WP_MAX_PER_PAGE),
    WP_MAX_PER_PAGE
  );
  const revalidate = options?.revalidate ?? 3600;
  const all: T[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = new URL(`${apiBase()}${path}`);
    const params = { ...baseParams, page, per_page: perPage };
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const res = await fetch(url.toString(), {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      if (res.status === 404 && page === 1) return [];
      throw new Error(`WP API error ${res.status}: ${url.toString()}`);
    }

    const tp = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);
    totalPages = Number.isFinite(tp) && tp > 0 ? tp : 1;

    const chunk = (await res.json()) as T[];
    if (!Array.isArray(chunk)) break;
    all.push(...chunk);
    if (chunk.length === 0) break;
    page += 1;
  }

  return all;
}

/** Client-side only fetch (no ISR cache) — used inside React Query queryFn */
export async function fetchWpClient<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = new URL(`${apiBase()}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    if (res.status === 404) return [] as unknown as T;
    throw new Error(`WP API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}
