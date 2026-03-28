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

/** Safety cap — 100 × 500 = 50k items per collection */
const WP_COLLECTION_MAX_PAGES = 500;

type FetchWpCollectionOptions = {
  perPage?: number;
  /** Default 3600. Use `false` to skip Next fetch cache (good for sitemaps). */
  revalidate?: number | false;
};

/**
 * Walk every page of a collection using `page` + `per_page`.
 * Continues while a full page is returned — does not rely on `X-WP-TotalPages`
 * (often stripped by proxies), which previously stopped after one page.
 */
export async function fetchWpCollectionAll<T>(
  path: string,
  baseParams?: Record<string, string | number | boolean | undefined>,
  options?: FetchWpCollectionOptions
): Promise<T[]> {
  const perPage = Math.min(
    Math.max(1, options?.perPage ?? WP_MAX_PER_PAGE),
    WP_MAX_PER_PAGE
  );
  const revalidateOpt = options?.revalidate ?? 3600;
  const all: T[] = [];
  let page = 1;

  while (page <= WP_COLLECTION_MAX_PAGES) {
    const url = new URL(`${apiBase()}${path}`);
    const params = { ...baseParams, page, per_page: perPage };
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const fetchInit: RequestInit & { next?: { revalidate: number } } = {
      headers: { Accept: "application/json" },
    };
    if (revalidateOpt === false) {
      fetchInit.cache = "no-store";
    } else {
      fetchInit.next = { revalidate: revalidateOpt };
    }

    const res = await fetch(url.toString(), fetchInit);

    if (!res.ok) {
      if (res.status === 404 && page === 1) return [];
      throw new Error(`WP API error ${res.status}: ${url.toString()}`);
    }

    const chunk = (await res.json()) as T[];
    if (!Array.isArray(chunk) || chunk.length === 0) break;
    all.push(...chunk);
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
