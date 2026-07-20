import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/wp/pages";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { Container } from "@/components/layout/Container";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/constants";

export const revalidate = 43200;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("disclaimer");

  const desc =
    page?.excerpt ??
    `Read the disclaimer for ${SITE_NAME} to understand the limitations and usage of the information provided on our website.`;

  return {
    title: page?.title ?? `Disclaimer | ${SITE_NAME}`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/disclaimer` },

    openGraph: {
      type: "website",
      url: `${SITE_URL}/disclaimer`,
      title: page?.title ?? `Disclaimer | ${SITE_NAME}`,
      description: desc,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `Disclaimer ${SITE_NAME}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: page?.title ?? `Disclaimer | ${SITE_NAME}`,
      description: desc,
    },
  };
}

export default async function DisclaimerPage() {
  const page = await getPageBySlug("disclaimer");

  return (
    <div className="section-gap">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none">

            <WpPageContent
              slug="disclaimer"
              initialPage={page}
            />

          </div>
        </div>
      </Container>
    </div>
  );
}