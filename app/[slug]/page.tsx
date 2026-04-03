import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/wp/pages";
import { getPostBySlug, getPostsForBlog, getRelatedPostsByCategory } from "@/lib/wp/post";
import { fetchWpCollectionAll } from "@/lib/wp/client";
import type { WpPage } from "@/lib/wp/types";
import type { Post } from "@/types";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { Container } from "@/components/layout/Container";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildPostMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, SLUG_TO_PATH } from "@/lib/constants";

export const revalidate = 60;

const RESERVED_FOR_STATIC_PARAMS = new Set([
  "about",
  "contact",
  "privacy",
  "shop",
  "blog",
  "search",
  "category",
]);

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const [posts, wpPages] = await Promise.all([
    getPostsForBlog(),
    fetchWpCollectionAll<WpPage>(
      "/pages",
      { status: "publish", orderby: "modified", order: "desc" },
      { revalidate: false },
    ),
  ]);
  const slugs = new Set<string>();
  for (const p of posts) {
    if (!RESERVED_FOR_STATIC_PARAMS.has(p.slug)) slugs.add(p.slug);
  }
  for (const wp of wpPages) {
    const s = wp.slug?.trim();
    if (s && !RESERVED_FOR_STATIC_PARAMS.has(s)) slugs.add(s);
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (page) {
    const path = SLUG_TO_PATH[slug] ?? `/${slug}`;
    const canonical = `${SITE_URL}${path}`;
    const desc =
      page.excerpt ||
      `${page.title} — ${SITE_NAME}: beauty tips, skincare, and makeup inspiration.`;

    return {
      title: page.title,
      description: desc,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title: page.title,
        description: desc,
        siteName: SITE_NAME,
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: page.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: page.title,
        description: desc,
      },
    };
  }

  const post = await getPostBySlug(slug);
  if (!post) return { title: `Not found | ${SITE_NAME}` };

  const meta = buildPostMetadata({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    imageUrl: post.featuredImage,
    publishedAt: post.publishedAt,
    modifiedAt: post.modifiedAt,
    authorName: post.author?.name,
    categoryTitle: post.category?.title,
  });

  if (post.featuredImage) {
    return {
      ...meta,
      other: {
        "link-preload-image": post.featuredImage,
      },
    };
  }

  return meta;
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (page) {
    return (
      <div className="section-gap">
        <Container>
          <WpPageContent slug={slug} initialPage={page} />
        </Container>
      </div>
    );
  }

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Fetch related posts if category exists
  const relatedPosts: Post[] = [];
  if (post.category?.id) {
    try {
      const posts = await getRelatedPostsByCategory(post.category.id, post.slug, 4);
      relatedPosts.push(...posts);
    } catch (err) {
      // Silently fail if we can't get related posts
      console.log("Could not fetch related posts:", err);
    }
  }

  const postUrl = `${SITE_URL}/${post.slug}`;
  const breadcrumbs = [
    { name: "Home", url: `${SITE_URL}/` },
    ...(post.category
      ? [{ name: post.category.title, url: `${SITE_URL}/category/${post.category.slug}` }]
      : [{ name: "Blog", url: `${SITE_URL}/blog` }]),
    { name: post.title, url: postUrl },
  ];

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        datePublished={post.publishedAt}
        dateModified={post.modifiedAt}
        authorName={post.author?.name}
        imageUrl={post.featuredImage}
        categoryTitle={post.category?.title}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <BlogPostView slug={slug} initialPost={post} relatedPosts={relatedPosts} />
    </>
  );
}
