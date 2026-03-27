import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, DEFAULT_OG_IMAGE } from "./constants";

export function getSiteUrl() {
  return SITE_URL;
}

export function buildAbsoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildOgImage(imageUrl?: string | null): string {
  const url = imageUrl ?? DEFAULT_OG_IMAGE;
  return buildAbsoluteUrl(url);
}

export function buildPostMetadata({
  title,
  description,
  slug,
  imageUrl,
  publishedAt,
  modifiedAt,
  authorName,
  categoryTitle,
}: {
  title: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  publishedAt?: string;
  modifiedAt?: string;
  authorName?: string;
  categoryTitle?: string;
}): Metadata {
  const canonical = `${SITE_URL}/blog/${slug}`;
  const ogImage = buildOgImage(imageUrl);

  return {
    title,
    description: description ?? SITE_DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description: description ?? SITE_DESCRIPTION,
      siteName: SITE_NAME,
      publishedTime: publishedAt,
      modifiedTime: modifiedAt ?? publishedAt,
      authors: authorName ? [authorName] : undefined,
      section: categoryTitle,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? SITE_DESCRIPTION,
      images: [ogImage],
    },
  };
}

export function buildCategoryMetadata({
  title,
  description,
  slug,
  imageUrl,
}: {
  title: string;
  description?: string;
  slug: string;
  imageUrl?: string;
}): Metadata {
  const canonical = `${SITE_URL}/category/${slug}`;
  const ogImage = buildOgImage(imageUrl);
  const metaTitle = `${title} Beauty Tips & Inspiration`;
  const metaDesc = description || `Browse our collection of ${title} beauty tips on ${SITE_NAME}.`;

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: metaTitle,
      description: metaDesc,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
    },
  };
}
