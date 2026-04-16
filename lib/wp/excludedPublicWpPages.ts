/**
 * WordPress `pages` that should not be exposed on the headless site
 * (theme / starter content such as testimonials, portfolio “works”, etc.).
 * Posts can still use the same slug; only WP page resolution is skipped.
 */
const HEADLESS_EXCLUDED_WP_PAGE_SLUGS = new Set<string>([
  "testimonials",
  "testimonial",
  "works",
  "our-work",
  "our-works",
  "sample-page",
  "hello-world",
  "shop",
]);

export function isHeadlessExcludedWpPageSlug(slug: string): boolean {
  const s = slug.trim().toLowerCase();
  if (!s) return false;
  return HEADLESS_EXCLUDED_WP_PAGE_SLUGS.has(s);
}
