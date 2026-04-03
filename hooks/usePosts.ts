"use client";

import { useQuery } from "@tanstack/react-query";
import { BLOG_POSTS_PER_PAGE } from "@/lib/blogPagination";
import { fetchWpClient, fetchWpClientPaginated } from "@/lib/wp/client";
import { mapWpPostToPost, mapWpPostToPostDetail } from "@/lib/wp/map";
import { processPostBody } from "@/lib/html";
import type { WpPost } from "@/lib/wp/types";
import type { Post, PostDetail } from "@/types";

export type BlogPostsQueryData = { posts: Post[]; totalPages: number; total: number };

async function fetchPostsForBlogPage(options: {
  page: number;
  perPage: number;
  categoryId?: number;
}): Promise<BlogPostsQueryData> {
  try {
    const params: Record<string, string | number | boolean> = {
      _embed: 1,
      per_page: options.perPage,
      page: options.page,
      orderby: "date",
      order: "desc",
      status: "publish",
    };
    if (options.categoryId != null) {
      params.categories = options.categoryId;
    }
    const { data, totalPages, total } = await fetchWpClientPaginated<WpPost[]>("/posts", params);
    const posts = Array.isArray(data) ? data.map(mapWpPostToPost) : [];
    return { posts, totalPages, total };
  } catch {
    return { posts: [], totalPages: 0, total: 0 };
  }
}

async function fetchPostsForCategory(
  categoryId: number
): Promise<Post[]> {
  const data = await fetchWpClient<WpPost[]>("/posts", {
    _embed: 1,
    categories: categoryId,
    per_page: 50,
    orderby: "date",
    order: "desc",
    status: "publish",
  });
  return data.map(mapWpPostToPost);
}

async function fetchPostBySlug(slug: string): Promise<PostDetail | null> {
  const data = await fetchWpClient<WpPost[]>("/posts", {
    slug,
    per_page: 1,
    _embed: 1,
  });
  if (!data[0]) return null;
  const detail = mapWpPostToPostDetail(data[0]);
  detail.body = processPostBody(detail.body, detail.featuredImage);
  return detail;
}

async function fetchPostsForMultipleCategories(
  categoryIds: number[],
  limitPerCategory: number
): Promise<Record<number, Post[]>> {
  if (!categoryIds.length) return {};
  const maxPosts = Math.min(categoryIds.length * limitPerCategory * 3, 100);
  const data = await fetchWpClient<WpPost[]>("/posts", {
    _embed: 1,
    per_page: maxPosts,
    orderby: "date",
    order: "desc",
    status: "publish",
  });

  const idSet = new Set(categoryIds);
  const result: Record<number, Post[]> = {};
  const count: Record<number, number> = {};
  for (const id of categoryIds) { result[id] = []; count[id] = 0; }

  for (const wp of data) {
    for (const cid of wp.categories) {
      if (idSet.has(cid) && (count[cid] ?? 0) < limitPerCategory) {
        result[cid].push(mapWpPostToPost(wp));
        count[cid] = (count[cid] ?? 0) + 1;
      }
    }
  }
  return result;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function usePosts(options?: {
  page?: number;
  perPage?: number;
  categoryId?: number;
  initialData?: BlogPostsQueryData;
}) {
  const page = Math.max(1, options?.page ?? 1);
  const perPage = options?.perPage ?? BLOG_POSTS_PER_PAGE;
  const categoryId = options?.categoryId;
  const initialData = options?.initialData;
  const hasInitial = initialData !== undefined && initialData !== null;
  const cacheKey = categoryId != null ? `cat:${categoryId}` : "all";
  return useQuery({
    queryKey: ["posts", "blog", cacheKey, page, perPage],
    queryFn: () => fetchPostsForBlogPage({ page, perPage, categoryId }),
    initialData: hasInitial ? initialData : undefined,
    initialDataUpdatedAt: hasInitial ? Date.now() : undefined,
    staleTime: hasInitial ? Infinity : 0,
  });
}

export function usePost(slug: string | null, initialData?: PostDetail | null) {
  const hasInitial = !!initialData;
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug,
    initialData: initialData ?? undefined,
    initialDataUpdatedAt: hasInitial ? Date.now() : undefined,
    staleTime: hasInitial ? Infinity : 0,
  });
}

export function usePostsByCategory(
  categoryId: number | null,
  initialData?: Post[]
) {
  const hasInitial = !!initialData && !!categoryId;
  return useQuery({
    queryKey: ["posts", "category", categoryId],
    queryFn: () => fetchPostsForCategory(categoryId!),
    enabled: !!categoryId,
    initialData: hasInitial ? initialData : undefined,
    initialDataUpdatedAt: hasInitial ? Date.now() : undefined,
    staleTime: hasInitial ? Infinity : 0,
  });
}

export function usePostsForMultipleCategories(
  categoryIds: number[],
  limitPerCategory: number,
  initialData?: Record<number, Post[]> | null
) {
  const stableIds = [...categoryIds].sort((a, b) => a - b);
  const hasInitial = !!initialData && stableIds.length > 0;
  return useQuery({
    queryKey: ["posts", "categories-batch", stableIds, limitPerCategory],
    queryFn: () => fetchPostsForMultipleCategories(stableIds, limitPerCategory),
    enabled: stableIds.length > 0,
    initialData: hasInitial ? initialData : undefined,
    initialDataUpdatedAt: hasInitial ? Date.now() : undefined,
    staleTime: hasInitial ? Infinity : 0,
  });
}
