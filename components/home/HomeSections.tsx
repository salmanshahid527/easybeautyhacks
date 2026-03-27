"use client";

import { useFeaturedPosts } from "@/hooks/useFeaturedPosts";
import { useCategories } from "@/hooks/useCategories";
import { useAuthor } from "@/hooks/useAuthor";
import { usePostsForMultipleCategories } from "@/hooks/usePosts";
import { HeroParallax } from "./HeroParallax";
import { CategoryGrid } from "./CategoryGrid";
import { FeaturedPosts } from "./FeaturedPosts";
import { TrendingStrip } from "./TrendingStrip";
import { CategorySections } from "./CategorySections";
import { NewsletterCTA } from "./NewsletterCTA";
import { POSTS_PER_CATEGORY_HOME } from "@/lib/constants";
import type { Post, Category, Author } from "@/types";

interface HomeSectionsProps {
  initialData: {
    categories: Category[];
    featuredPosts: Post[];
    author: Author | null;
    postsByCategoryId: Record<number, Post[]>;
  };
}

export function HomeSections({ initialData }: HomeSectionsProps) {
  const { data: categories = [] } = useCategories(initialData.categories);
  const { data: featuredPosts = [] } = useFeaturedPosts(initialData.featuredPosts);
  const { data: author } = useAuthor(initialData.author);

  const categoryIds = categories.map((c) => c.id);
  const { data: postsByCategoryId = {} } = usePostsForMultipleCategories(
    categoryIds,
    POSTS_PER_CATEGORY_HOME,
    initialData.postsByCategoryId
  );

  // Build category image map for CategoryGrid (use first post image per category)
  const postImages: Record<string, string> = {};
  for (const cat of categories) {
    const firstPost = postsByCategoryId[cat.id]?.[0];
    if (firstPost?.featuredImage) {
      postImages[cat.slug] = firstPost.featuredImage;
    }
  }

  // Suppress unused variable warning
  void author;

  return (
    <>
      <HeroParallax featuredPosts={featuredPosts} />
      <CategoryGrid categories={categories} postImages={postImages} />
      <FeaturedPosts posts={featuredPosts} />
      <TrendingStrip posts={featuredPosts.slice(0, 4)} />
      <CategorySections
        categories={categories}
        postsByCategoryId={postsByCategoryId}
      />
      <NewsletterCTA />
    </>
  );
}
