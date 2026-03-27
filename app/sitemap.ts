import type { MetadataRoute } from "next";
import { getPostsForBlog } from "@/lib/wp/post";
import { getCategories } from "@/lib/wp/categories";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    getPostsForBlog(),
    getCategories(),
  ]);

  // Static pages: use a fixed date so Google doesn't crawl them on every sitemap refresh
  const sitelaunchDate = new Date("2026-03-01");
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                    lastModified: sitelaunchDate, changeFrequency: "daily",   priority: 1 },
    { url: `${SITE_URL}/blog`,          lastModified: sitelaunchDate, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/shop`,          lastModified: sitelaunchDate, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/about`,         lastModified: sitelaunchDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`,       lastModified: sitelaunchDate, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`,       lastModified: sitelaunchDate, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    // Prefer modifiedAt — Google uses this for content freshness signals
    lastModified: post.modifiedAt
      ? new Date(post.modifiedAt)
      : post.publishedAt
        ? new Date(post.publishedAt)
        : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
