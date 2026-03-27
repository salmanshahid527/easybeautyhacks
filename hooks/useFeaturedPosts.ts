"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWpClient } from "@/lib/wp/client";
import { mapWpPostToPost } from "@/lib/wp/map";
import type { WpPost } from "@/lib/wp/types";
import type { Post } from "@/types";

async function fetchFeaturedPosts(): Promise<Post[]> {
  const data = await fetchWpClient<WpPost[]>("/posts", {
    _embed: 1,
    per_page: 6,
    orderby: "date",
    order: "desc",
    status: "publish",
  });
  return data.map(mapWpPostToPost);
}

export function useFeaturedPosts(initialData?: Post[]) {
  const hasInitial = initialData !== undefined;
  return useQuery({
    queryKey: ["posts", "featured"],
    queryFn: fetchFeaturedPosts,
    initialData: hasInitial ? initialData : undefined,
    initialDataUpdatedAt: hasInitial ? Date.now() : undefined,
    staleTime: hasInitial ? Infinity : 0,
  });
}
