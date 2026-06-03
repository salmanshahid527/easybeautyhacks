export const BLOG_POSTS_PER_PAGE = 12;

export function buildBlogListHref(page: number, categorySlug?: string) {
  const sp = new URLSearchParams();
  if (categorySlug) sp.set("category", categorySlug);
  if (page > 1) sp.set("page", String(page));
  const q = sp.toString();
  return q ? `/blog?${q}` : "/blog";
}
