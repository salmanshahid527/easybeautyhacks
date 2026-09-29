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

/**
 * The WordPress hosts return transient 5xx errors during builds (prerendering). Retry those with a backoff.
 * Each retry sends an X-Retry-Attempt header so Next.js's request memoization doesn't hand back the
 * failed response again.
 */
async function fetchWithRetry(input: string, init?: RequestInit, attempts = 5): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    try {
      const headers = new Headers(init?.headers);
      if (attempt > 1) headers.set("X-Retry-Attempt", String(attempt));
      const res = await fetch(input, { ...init, headers });
      if (res.status < 500 || attempt >= attempts) return res;
    } catch (err) {
      if (attempt >= attempts) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** (attempt - 1)));
  }
}

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

  const res = await fetchWithRetry(url.toString(), {
    next: { revalidate: 43200 },
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    // Return empty array / null gracefully on 404
    if (res.status === 404) return [] as unknown as T;
    throw new Error(`WP API error ${res.status}: ${url.toString()}`);
  }

  return res.json() as Promise<T>;
}

export type WpPaginatedResult<T> = { data: T; totalPages: number; total: number };

export async function fetchWpPaginated<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<WpPaginatedResult<T>> {
  const url = new URL(`${apiBase()}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  const res = await fetchWithRetry(url.toString(), {
    next: { revalidate: 43200 },
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });
  if (!res.ok) {
    if (res.status === 404) return { data: [] as unknown as T, totalPages: 0, total: 0 };
    throw new Error(`WP API error ${res.status}: ${url.toString()}`);
  }
  const total = Number.parseInt(res.headers.get("X-WP-Total") ?? "0", 10);
  const totalPagesRaw = Number.parseInt(res.headers.get("X-WP-TotalPages") ?? "0", 10);
  const totalPages = Number.isFinite(totalPagesRaw) ? Math.max(0, totalPagesRaw) : 0;
  const data = (await res.json()) as T;
  return {
    data,
    totalPages,
    total: Number.isFinite(total) ? total : 0,
  };
}

export async function fetchWpClientPaginated<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<WpPaginatedResult<T>> {
  const url = new URL(`${apiBase()}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  const res = await fetchWithRetry(url.toString(), {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });
  if (!res.ok) {
    if (res.status === 404) return { data: [] as unknown as T, totalPages: 0, total: 0 };
    throw new Error(`WP API error ${res.status}`);
  }
  const total = Number.parseInt(res.headers.get("X-WP-Total") ?? "0", 10);
  const totalPagesRaw = Number.parseInt(res.headers.get("X-WP-TotalPages") ?? "0", 10);
  const totalPages = Number.isFinite(totalPagesRaw) ? Math.max(0, totalPagesRaw) : 0;
  const data = (await res.json()) as T;
  return {
    data,
    totalPages,
    total: Number.isFinite(total) ? total : 0,
  };
}

/** WordPress REST max for `per_page` on most hosts */
const WP_MAX_PER_PAGE = 100;

/** Safety cap — 100 × 500 = 50k items per collection */
const WP_COLLECTION_MAX_PAGES = 500;

type FetchWpCollectionOptions = {
  perPage?: number;
  /** Default 43200 (12 hours). Use `false` to skip Next fetch cache (good for sitemaps). */
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
  const revalidateOpt = options?.revalidate ?? 43200;
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

    const res = await fetchWithRetry(url.toString(), fetchInit);

    if (!res.ok) {
      if (page === 1 && res.status === 404) return [];
      // WordPress often returns 400 (not 404/[]) when `page` is beyond the last page,
      // especially with query params — treat as end of collection.
      if (page > 1 && (res.status === 400 || res.status === 404)) {
        break;
      }
      throw new Error(`WP API error ${res.status}: ${url.toString()}`);
    }

    const chunk = (await res.json()) as T[];
    if (!Array.isArray(chunk) || chunk.length === 0) break;
    all.push(...chunk);
    // Short page = no further pages — avoids a follow-up request that many hosts answer with 400.
    if (chunk.length < perPage) break;
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

  const res = await fetchWithRetry(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    if (res.status === 404) return [] as unknown as T;
    throw new Error(`WP API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}
