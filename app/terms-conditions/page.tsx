import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/wp/pages";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { Container } from "@/components/layout/Container";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 43200;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms & Conditions",
    alternates: { canonical: `${SITE_URL}/terms-conditions` },
  };
}

export default async function TermsConditionsPage() {
  const page = await getPageBySlug("terms-conditions");

  return (
    <div className="section-gap">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <WpPageContent
              slug="terms-conditions"
              initialPage={page}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}