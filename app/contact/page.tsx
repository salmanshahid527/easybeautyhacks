import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/wp/pages";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { Container } from "@/components/layout/Container";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/constants";
import { ContactForm } from "@/components/pages/ContactForm";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const desc = `Have a question or collaboration idea? Get in touch with the ${SITE_NAME} team.`;
  return {
    title: `Contact Us | ${SITE_NAME}`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/contact`,
      title: `Contact ${SITE_NAME}`,
      description: desc,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `Contact ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Contact ${SITE_NAME}`,
      description: desc,
    },
  };
}

export default async function ContactPage() {
  const page = await getPageBySlug("contact");
  return (
    <div className="section-gap">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <WpPageContent
            slug="contact"
            initialPage={page}
            emptyMessage={
              <div>
                <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-4">
                  Get in Touch
                </h1>
                <p className="text-foreground-muted">
                  Have a question or want to collaborate? We&apos;d love to hear from you.
                </p>
              </div>
            }
          />
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
