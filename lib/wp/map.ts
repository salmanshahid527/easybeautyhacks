import type { WpPost, WpCategory, WpUser } from "./types";
import type { Post, PostDetail, Category, Author } from "@/types";
import { decodeHtmlEntities, stripHtml, rewriteWpUrlsToSiteUrl } from "@/lib/html";

export function mapWpPostToPost(wp: WpPost): Post {
  const category = wp._embedded?.["wp:term"]?.[0]?.[0];
  const featuredMedia = wp._embedded?.["wp:featuredmedia"]?.[0];
  const author = wp._embedded?.author?.[0];

  return {
    _id: String(wp.id),
    title: decodeHtmlEntities(stripHtml(wp.title.rendered)),
    slug: wp.slug,
    excerpt: decodeHtmlEntities(stripHtml(wp.excerpt?.rendered ?? "")),
    category: category
      ? { title: category.name, slug: category.slug }
      : undefined,
    featuredImage: featuredMedia?.source_url,
    featuredImageAlt: featuredMedia?.alt_text,
    featured: !!wp.sticky,
    publishedAt: wp.date,
    author: author
      ? { name: author.name, image: author.avatar_urls?.[96] ?? author.avatar_urls?.[48] }
      : undefined,
    modifiedAt: wp.modified ?? wp.date,
  };
}

export function mapWpPostToPostDetail(wp: WpPost): PostDetail {
  const base = mapWpPostToPost(wp);
  const author = wp._embedded?.author?.[0];

  return {
    ...base,
    body: wp.content?.rendered
      ? rewriteWpUrlsToSiteUrl(wp.content.rendered)
      : undefined,
    author: author
      ? {
          name: author.name,
          image: author.avatar_urls?.[96] ?? author.avatar_urls?.[48],
        }
      : undefined,
    modifiedAt: wp.modified ?? wp.date,
  };
}

export function mapWpCategoryToCategory(wp: WpCategory): Category {
  return {
    _id: String(wp.id),
    id: wp.id,
    title: decodeHtmlEntities(wp.name),
    slug: wp.slug,
    description: wp.description,
    count: wp.count,
  };
}

export function mapWpUserToAuthor(wp: WpUser): Author {
  return {
    _id: String(wp.id),
    name: wp.name,
    bio: wp.description ? rewriteWpUrlsToSiteUrl(wp.description) : undefined,
    image: wp.avatar_urls?.[96] ?? wp.avatar_urls?.[48],
  };
}
