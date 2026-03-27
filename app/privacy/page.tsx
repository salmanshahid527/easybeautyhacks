import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/wp/pages";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { Container } from "@/components/layout/Container";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 60;

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
        <WpPageContent slug="privacy" initialPage={page} />
      </Container>
    </div>
  );
}
