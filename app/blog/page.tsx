import type { Metadata } from "next";
import { getPostsForBlog } from "@/lib/wp/post";
import { getCategories } from "@/lib/wp/categories";
import { PostList } from "@/components/blog/PostList";
import { Container } from "@/components/layout/Container";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { buildOgImage } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPostsForBlog();
  const firstImage = posts[0]?.featuredImage;

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

export default async function BlogPage() {
  const [initialPosts, initialCategories] = await Promise.all([
    getPostsForBlog(),
    getCategories(),
  ]);

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

        <PostList
          initialPosts={initialPosts}
          initialCategories={initialCategories}
        />
      </Container>
    </div>
  );
}
