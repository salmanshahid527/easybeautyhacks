import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { getCategories } from "@/lib/wp/categories";
import { getFeaturedPosts, getPostsForMultipleCategories } from "@/lib/wp/post";
import { getAuthor } from "@/lib/wp/author";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, POSTS_PER_CATEGORY_HOME } from "@/lib/constants";
import { AdUnit } from "@/components/ads/AdUnit";


export const revalidate = 43200;

export const metadata: Metadata = {
  title: `${SITE_NAME} — Beauty Tips & Hacks`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const [categories, featuredPosts, author] = await Promise.all([
    getCategories(),
    getFeaturedPosts(),
    getAuthor(),
  ]);

  const categoryIds = categories.map((c) => c.id);
  const postsByCategoryId = await getPostsForMultipleCategories(
    categoryIds,
    POSTS_PER_CATEGORY_HOME
  );

  return (

    <>
      {/* Desktop banner — top */}
      <AdUnit unit="banner728x90" />
      {/* Mobile banner — top */}
      <AdUnit unit="banner320x50" />
    <HomeSections
      initialData={{ categories, featuredPosts, author, postsByCategoryId }}
    />

    {/* Native Banner — before footer */}
      <AdUnit unit="nativeBanner" />
    </>
  );
}
