"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWpClient } from "@/lib/wp/client";
import { mapWpCategoryToCategory } from "@/lib/wp/map";
import type { WpCategory } from "@/lib/wp/types";
import type { Category } from "@/types";

async function fetchCategories(): Promise<Category[]> {
  const data = await fetchWpClient<WpCategory[]>("/categories", {
    per_page: 100,
    orderby: "count",
    order: "desc",
    hide_empty: true,
  });
  return data.map(mapWpCategoryToCategory);
}

export function useCategories(initialData?: Category[]) {
  const hasInitial = initialData !== undefined;
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    initialData: hasInitial ? initialData : undefined,
    initialDataUpdatedAt: hasInitial ? Date.now() : undefined,
    staleTime: hasInitial ? Infinity : 0,
  });
}
