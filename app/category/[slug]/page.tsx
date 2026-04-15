import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SmartImage as Image } from "@/components/ui/SmartImage";
import { getCategoryBySlug, getCategories } from "@/lib/wp/categories";
import { getPostsForCategoryBySlug } from "@/lib/wp/post";
import { CategoryArchive } from "@/components/blog/CategoryArchive";
import { Container } from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildCategoryMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 60;

/** Pre-render all non-empty categories at build time */
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsForCategoryBySlug(slug),
  ]);
  if (!category) return { title: "Category Not Found" };

  return buildCategoryMetadata({
    title: category.title,
    description: category.description,
    slug: category.slug,
    imageUrl: posts[0]?.featuredImage,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, initialPosts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsForCategoryBySlug(slug),
  ]);

  if (!category) notFound();

  const heroImage = initialPosts[0]?.featuredImage;

  const breadcrumbs = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: category.title, url: `${SITE_URL}/category/${category.slug}` },
  ];

  return (
    <>
    <BreadcrumbJsonLd items={breadcrumbs} />
    <div>
      {/* Hero strip */}
      <section className="relative h-[40vh] min-h-[280px] overflow-hidden flex items-end">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${category.title} beauty tips and hacks`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-muted to-background-alt" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

        <Container className="relative z-10 pb-8">
          <p className="overline text-white/70 mb-2">Beauty Tips</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-white/70 mt-2 max-w-xl">{category.description}</p>
          )}
        </Container>
      </section>

      {/* Posts */}
      <div className="section-gap">
        <Container>
          <CategoryArchive
            category={category}
            initialPosts={initialPosts}
          />
        </Container>
      </div>
    </div>
    </>
  );
}
