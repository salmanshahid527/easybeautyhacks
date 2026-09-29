import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface ArticleJsonLdProps {
  title: string;
  description?: string;
  slug: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
  categoryTitle?: string;
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  authorName,
  imageUrl,
  categoryTitle,
}: ArticleJsonLdProps) {
  const url = `${SITE_URL}/${slug}`;
  const absoluteImage =
    imageUrl?.startsWith("http") ? imageUrl : imageUrl ? `${SITE_URL}${imageUrl}` : undefined;

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: authorName
      ? { "@type": "Person", name: authorName, url: `${SITE_URL}/about` }
      : { "@type": "Organization", name: SITE_NAME },
    image: absoluteImage ? [absoluteImage] : undefined,
    articleSection: categoryTitle,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
