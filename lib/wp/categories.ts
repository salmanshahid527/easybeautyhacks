import { cache } from "react";
import { fetchWp, fetchWpCollectionAll } from "./client";
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

/** All non-empty categories (paginated) — for sitemap */
export async function getAllCategoriesForSitemap(): Promise<Category[]> {
  const data = await fetchWpCollectionAll<WpCategory>(
    "/categories",
    {
      orderby: "count",
      order: "desc",
      hide_empty: true,
    },
    { revalidate: false }
  );
  return data.map(mapWpCategoryToCategory);
}

export const getCategoryBySlug = cache(async function (
  slug: string
): Promise<Category | null> {
  const data = await fetchWp<WpCategory[]>("/categories", { slug });
  if (!data[0]) return null;
  return mapWpCategoryToCategory(data[0]);
});
