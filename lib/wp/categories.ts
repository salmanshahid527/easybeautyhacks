import { cache } from "react";
import { fetchWp } from "./client";
import { mapWpCategoryToCategory } from "./map";
import type { WpCategory } from "./types";
import type { Category } from "@/types";

export const getCategories = cache(async function (): Promise<Category[]> {
  const data = await fetchWp<WpCategory[]>("/categories", {
    per_page: 100,
    orderby: "count",
    order: "desc",
    hide_empty: true,
  });
  return data.map(mapWpCategoryToCategory);
});

export const getCategoryBySlug = cache(async function (
  slug: string
): Promise<Category | null> {
  const data = await fetchWp<WpCategory[]>("/categories", { slug });
  if (!data[0]) return null;
  return mapWpCategoryToCategory(data[0]);
});
