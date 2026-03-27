"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWpClient } from "@/lib/wp/client";
import { mapWpPostToPost } from "@/lib/wp/map";
import type { WpPost } from "@/lib/wp/types";
import type { Post } from "@/types";

async function fetchSearchResults(query: string): Promise<Post[]> {
  if (!query.trim()) return [];
  const data = await fetchWpClient<WpPost[]>("/posts", {
    _embed: 1,
    search: query,
    per_page: 20,
    status: "publish",
  });
  return data.map(mapWpPostToPost);
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    enabled: query.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
