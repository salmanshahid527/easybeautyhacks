import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/wp/pages";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { Container } from "@/components/layout/Container";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Mila",
    alternates: { canonical: `${SITE_URL}/about-mila` },
  };
}

export default async function AboutMilaPage() {
  const page = await getPageBySlug("about-mila");

  return (
    <div className="section-gap">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <WpPageContent
              slug="about-mila"
              initialPage={page}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}