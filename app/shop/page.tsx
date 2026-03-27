import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/wp/pages";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { Container } from "@/components/layout/Container";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Beauty Shop | EasyBeautyHacks",
    alternates: { canonical: `${SITE_URL}/shop` },
  };
}

export default async function ShopPage() {
  const page = await getPageBySlug("shop");
  return (
    <div className="section-gap">
      <Container>
        <WpPageContent
          slug="shop"
          initialPage={page}
          emptyMessage={
            <div>
              <h1 className="font-display text-4xl font-semibold text-foreground mb-4">Beauty Shop</h1>
              <p className="text-foreground-muted">Coming soon! Check back later for our favourite beauty product picks.</p>
            </div>
          }
        />
      </Container>
    </div>
  );
}
