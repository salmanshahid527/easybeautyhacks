"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWpClient } from "@/lib/wp/client";
import { mapWpUserToAuthor } from "@/lib/wp/map";
import type { WpUser } from "@/lib/wp/types";
import type { Author } from "@/types";

async function fetchAuthor(): Promise<Author | null> {
  const data = await fetchWpClient<WpUser[]>("/users", { per_page: 1 });
  if (!data[0]) return null;
  return mapWpUserToAuthor(data[0]);
}

export function useAuthor(initialData?: Author | null) {
  const hasInitial = !!initialData;
  return useQuery({
    queryKey: ["author"],
    queryFn: fetchAuthor,
    initialData: initialData ?? undefined,
    initialDataUpdatedAt: hasInitial ? Date.now() : undefined,
    staleTime: hasInitial ? Infinity : 0,
  });
}
