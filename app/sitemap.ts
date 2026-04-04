import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllCategoriesForSitemap } from "@/lib/wp/categories";
import { getWpBackedStaticPagesForSitemap } from "@/lib/wp/pages";
import { getAllPublishedPostsForSitemap } from "@/lib/wp/post";

/** Google’s limit per sitemap file */
const MAX_URLS_PER_SITEMAP = 50_000;

/** Served on-demand so production builds do not require WordPress during `next build` */
export const dynamic = "force-dynamic";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, wpBacked] = await Promise.all([
    getAllPublishedPostsForSitemap(),
    getAllCategoriesForSitemap(),
    getWpBackedStaticPagesForSitemap(),
  ]);

  const wpModByPath = new Map(
    wpBacked.map((e) => [e.path, e.lastModified] as const)
  );

  const sitelaunchDate = new Date("2026-03-01");
  const feedFreshness =
    posts[0]?.modifiedAt ?? posts[0]?.publishedAt
      ? new Date(posts[0].modifiedAt ?? posts[0].publishedAt)
      : sitelaunchDate;

  const staticDefs: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
    priority: number;
    lastModified: Date;
  }> = [
    {
      path: "/",
      changeFrequency: "daily",
      priority: 1,
      lastModified: feedFreshness,
    },
    {
      path: "/blog",
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: feedFreshness,
    },
    {
      path: "/about",
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: wpModByPath.get("/about") ?? sitelaunchDate,
    },
    {
      path: "/contact",
      changeFrequency: "monthly",
      priority: 0.4,
      lastModified: wpModByPath.get("/contact") ?? sitelaunchDate,
    },
    {
      path: "/privacy",
      changeFrequency: "yearly",
      priority: 0.3,
      lastModified: wpModByPath.get("/privacy") ?? sitelaunchDate,
    },
  ];

  const staticPages: MetadataRoute.Sitemap = staticDefs.map((d) => ({
    url: d.path === "/" ? SITE_URL : `${SITE_URL}${d.path}`,
    lastModified: d.lastModified,
    changeFrequency: d.changeFrequency,
    priority: d.priority,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: sitelaunchDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  /** Individual articles — `/{slug}` (WordPress post name permalinks) */
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/${post.slug}`,
    lastModified: new Date(post.modifiedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const combined = [...staticPages, ...postPages, ...categoryPages];

  if (combined.length > MAX_URLS_PER_SITEMAP) {
    throw new Error(
      `Sitemap has ${combined.length} URLs (max ${MAX_URLS_PER_SITEMAP}). Split with generateSitemaps or trim content.`
    );
  }

  return combined;
}
