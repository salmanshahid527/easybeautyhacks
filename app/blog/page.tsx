import type { Metadata } from "next";
import { BLOG_POSTS_PER_PAGE } from "@/lib/blogPagination";
import { getLatestPostForBlogMeta, getPostsForBlogPage } from "@/lib/wp/post";
import { getCategories } from "@/lib/wp/categories";
import { PostList } from "@/components/blog/PostList";
import { Container } from "@/components/layout/Container";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { buildOgImage } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const latest = await getLatestPostForBlogMeta();
  const firstImage = latest?.featuredImage;

  return {
    title: "Beauty Blog — Tips & Hacks",
    description: `Browse all beauty articles on ${SITE_NAME}. Skincare, makeup, hair care, nail art and more.`,
    alternates: { canonical: `${SITE_URL}/blog` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/blog`,
      title: `Beauty Blog — Tips & Hacks | ${SITE_NAME}`,
      description: `Browse all beauty articles on ${SITE_NAME}. Skincare, makeup, hair care, nail art and more.`,
      siteName: SITE_NAME,
      images: [{ url: buildOgImage(firstImage), width: 1200, height: 630, alt: `${SITE_NAME} Blog` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Beauty Blog — Tips & Hacks | ${SITE_NAME}`,
      description: `Browse all beauty articles on ${SITE_NAME}.`,
      images: [buildOgImage(firstImage)],
    },
  };
}

type BlogPageProps = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const categorySlug = sp.category?.trim() || undefined;
  const initialCategories = await getCategories();
  const categoryId =
    categorySlug && initialCategories.length > 0
      ? initialCategories.find((c) => c.slug === categorySlug)?.id
      : undefined;
  const initialBlogPage = await getPostsForBlogPage({
    page,
    perPage: BLOG_POSTS_PER_PAGE,
    categoryId,
  });

  return (
    <div className="section-gap">
      <Container>
        {/* Header */}
        <div className="mb-10">
          <p className="overline text-primary mb-3">All Articles</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground">
            Beauty Blog
          </h1>
          <p className="text-foreground-muted mt-3 max-w-xl">
            Discover easy beauty tips and hacks for every skin type.
          </p>
        </div>

        <PostList initialBlogPage={initialBlogPage} initialCategories={initialCategories} />
      </Container>
    </div>
  );
}
