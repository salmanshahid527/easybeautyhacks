import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/wp/pages";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { Container } from "@/components/layout/Container";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/constants";

export const revalidate = 43200;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about");
  const desc = page?.excerpt ?? `Learn about ${SITE_NAME} — your go-to source for beauty tips, skincare advice, makeup tutorials and hair care hacks.`;
  return {
    title: page?.title ?? `About Us | ${SITE_NAME}`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/about` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/about`,
      title: page?.title ?? `About ${SITE_NAME}`,
      description: desc,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `About ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: page?.title ?? `About ${SITE_NAME}`,
      description: desc,
    },
  };
}

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  return (

    <div className="section-gap">
  <Container>
    <div className="mx-auto max-w-3xl">
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <WpPageContent slug="about"  initialPage={page}  />

      </div>
    </div>
  </Container>
</div>
    
  );
}
