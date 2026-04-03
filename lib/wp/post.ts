import { cache } from "react";
import { BLOG_POSTS_PER_PAGE } from "@/lib/blogPagination";
import { fetchWp, fetchWpCollectionAll, fetchWpPaginated } from "./client";
import { mapWpPostToPost, mapWpPostToPostDetail } from "./map";
import { processPostBody } from "@/lib/html";
import type { WpPost } from "./types";
import type { Post, PostDetail } from "@/types";

export const getPostBySlug = cache(async function (
  slug: string
): Promise<PostDetail | null> {
  const data = await fetchWp<WpPost[]>("/posts", {
    slug,
    per_page: 1,
    _embed: 1,
  });
  if (!data[0]) return null;
  const detail = mapWpPostToPostDetail(data[0]);
  detail.body = processPostBody(detail.body, detail.featuredImage);
  return detail;
});

/** All posts (paginated walk) — for static params / sitemap-style lists only. */
export const getPostsForBlog = cache(async function (): Promise<Post[]> {
  const data = await fetchWp<WpPost[]>("/posts", {
    _embed: 1,
    per_page: 50,
    orderby: "date",
    order: "desc",
    status: "publish",
  });
  return data.map(mapWpPostToPost);
});

export type BlogPostsPage = {
  posts: Post[];
  totalPages: number;
  total: number;
};

export const getLatestPostForBlogMeta = cache(async function (): Promise<Post | null> {
  const data = await fetchWp<WpPost[]>("/posts", {
    _embed: 1,
    per_page: 1,
    orderby: "date",
    order: "desc",
    status: "publish",
  });
  const wp = data[0];
  return wp ? mapWpPostToPost(wp) : null;
});

export const getPostsForBlogPage = cache(async function (options: {
  page: number;
  perPage?: number;
  categoryId?: number;
}): Promise<BlogPostsPage> {
  const perPage = options.perPage ?? BLOG_POSTS_PER_PAGE;
  const page = Math.max(1, options.page);
  try {
    const params: Record<string, string | number | boolean> = {
      _embed: 1,
      per_page: perPage,
      page,
      orderby: "date",
      order: "desc",
      status: "publish",
    };
    if (options.categoryId != null) {
      params.categories = options.categoryId;
    }
    const { data, totalPages, total } = await fetchWpPaginated<WpPost[]>("/posts", params);
    const posts = Array.isArray(data) ? data.map(mapWpPostToPost) : [];
    return { posts, totalPages, total };
  } catch {
    return { posts: [], totalPages: 0, total: 0 };
  }
});

/** Every published post (paginated) — lightweight fields for sitemap */
export async function getAllPublishedPostsForSitemap(): Promise<
  Array<{ slug: string; modifiedAt: string; publishedAt: string }>
> {
  type Row = Pick<WpPost, "slug" | "date" | "modified">;
  const rows = await fetchWpCollectionAll<Row>(
    "/posts",
    {
      status: "publish",
      orderby: "date",
      order: "desc",
    },
    { revalidate: false }
  );
  const seen = new Set<string>();
  const out: Array<{ slug: string; modifiedAt: string; publishedAt: string }> =
    [];
  for (const wp of rows) {
    const slug = wp.slug?.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push({
      slug,
      publishedAt: wp.date,
      modifiedAt: wp.modified ?? wp.date,
    });
  }
  return out;
}

export const getFeaturedPosts = cache(async function (): Promise<Post[]> {
  const data = await fetchWp<WpPost[]>("/posts", {
    _embed: 1,
    per_page: 6,
    orderby: "date",
    order: "desc",
    status: "publish",
  });
  return data.map(mapWpPostToPost);
});

export const getPostsForCategoryBySlug = cache(async function (
  categorySlug: string
): Promise<Post[]> {
  // First get category ID
  const catData = await fetchWp<Array<{ id: number }>>("/categories", {
    slug: categorySlug,
  });
  if (!catData[0]) return [];

  const data = await fetchWp<WpPost[]>("/posts", {
    _embed: 1,
    categories: catData[0].id,
    per_page: 50,
    orderby: "date",
    order: "desc",
    status: "publish",
  });
  return data.map(mapWpPostToPost);
});

export const getPostsForMultipleCategories = cache(async function (
  categoryIds: number[],
  limitPerCategory: number
): Promise<Record<number, Post[]>> {
  if (categoryIds.length === 0) return {};

  const maxPosts = Math.min(categoryIds.length * limitPerCategory * 3, 100);
  const data = await fetchWp<WpPost[]>("/posts", {
    _embed: 1,
    per_page: maxPosts,
    orderby: "date",
    order: "desc",
    status: "publish",
  });

  const idSet = new Set(categoryIds);
  const result: Record<number, Post[]> = {};
  const countByCategory: Record<number, number> = {};

  for (const id of categoryIds) {
    result[id] = [];
    countByCategory[id] = 0;
  }

  for (const wp of data) {
    for (const cid of wp.categories) {
      if (idSet.has(cid) && (countByCategory[cid] ?? 0) < limitPerCategory) {
        result[cid] = result[cid] ?? [];
        result[cid].push(mapWpPostToPost(wp));
        countByCategory[cid] = (countByCategory[cid] ?? 0) + 1;
      }
    }
  }

  return result;
});

/** Get related posts by category ID (excluding the current post) */
export const getRelatedPostsByCategory = cache(async function (
  categoryId: number,
  currentPostSlug: string,
  limit: number = 4
): Promise<Post[]> {
  const data = await fetchWp<WpPost[]>("/posts", {
    _embed: 1,
    categories: categoryId,
    per_page: limit + 5,
    orderby: "date",
    order: "desc",
    status: "publish",
  });
  
  return data
    .filter((wp) => wp.slug !== currentPostSlug)
    .slice(0, limit)
    .map(mapWpPostToPost);
});

export async function searchPosts(query: string): Promise<Post[]> {
  if (!query.trim()) return [];
  const data = await fetchWp<WpPost[]>("/posts", {
    _embed: 1,
    search: query,
    per_page: 20,
    status: "publish",
  });
  return data.map(mapWpPostToPost);
}
