import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { OrganizationWebSiteJsonLd } from "@/components/seo/JsonLd";
import { getNavLinks } from "@/lib/wp/nav";
import { getCategories } from "@/lib/wp/categories";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/constants";

export const revalidate = 43200;

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `EasyBeautyHacks — Beauty Tips & Hacks`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "beauty",
    "skincare",
    "makeup",
    "hair care",
    "nail art",
    "wellness",
    "beauty tips",
    "beauty hacks",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `EasyBeautyHacks — Beauty Tips & Hacks`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Beauty Tips & Hacks`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `EasyBeautyHacks — Beauty Tips & Hacks`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [initialNavLinks, initialCategories] = await Promise.all([
    getNavLinks(),
    getCategories(),
  ]);

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
  const wpUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? "";
  let wpOrigin: string | null = null;
  try {
    if (wpUrl.startsWith("http")) wpOrigin = new URL(wpUrl).origin;
  } catch {
    // ignore
  }

  return (
    <html lang="en" suppressHydrationWarning >
      <head>
        <meta name="theme-color" content="#c4507a" />
        <meta name="p:domain_verify" content="cdc27d93222fbafe6bad2f6fa3db456a" />
        {wpOrigin && (
          <link rel="preconnect" href={wpOrigin} crossOrigin="anonymous" />
        )}
        <link    
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${nunitoSans.variable} antialiased min-h-screen flex flex-col`}
      >
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        <OrganizationWebSiteJsonLd />
        <Providers>
          <SiteHeader
            initialNavLinks={initialNavLinks}
            initialCategories={initialCategories}
          />
          <main className="flex-1 w-full overflow-x-hidden">{children}</main>
          <Footer initialCategories={initialCategories} />
        </Providers>
      </body>
    </html>
  );
}
