// Expected format: https://example.com/wp-json
const apiUrl =
  (process.env.NEXT_PUBLIC_WP_API_URL ?? "http://easybeautyhacks.com/wp-json")
    .replace(/\/$/, "");
const apiBase = `${apiUrl}/wp/v2`;

export async function fetchWp<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = new URL(`${apiBase}${path}`);

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

/** Client-side only fetch (no ISR cache) — used inside React Query queryFn */
export async function fetchWpClient<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = new URL(`${apiBase}${path}`);

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
