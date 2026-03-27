import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostsForBlog } from "@/lib/wp/post";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildPostMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 60;

/** Pre-render all published posts at build time for SEO */
export async function generateStaticParams() {
  const posts = await getPostsForBlog();
  return posts.map((post) => ({ slug: post.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

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

  // Preload featured image
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const breadcrumbs = [
    { name: "Home", url: `${SITE_URL}/` },
    ...(post.category
      ? [{ name: post.category.title, url: `${SITE_URL}/category/${post.category.slug}` }]
      : [{ name: "Blog", url: `${SITE_URL}/blog` }]),
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
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
      <BlogPostView slug={slug} initialPost={post} />
    </>
  );
}
