import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/wp/pages";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { Container } from "@/components/layout/Container";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy",
    alternates: { canonical: `${SITE_URL}/privacy` },
  };
}

export default async function PrivacyPage() {
  const page = await getPageBySlug("privacy");
  return (
    <div className="section-gap">
  <Container>
    <div className="mx-auto max-w-3xl">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <WpPageContent  slug="privacy-policy" initialPage={page}/>
      </div>
    </div>
  </Container>
</div>



    
  );
}
