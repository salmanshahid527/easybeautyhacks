"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { SITE_NAME, SOCIAL } from "@/lib/constants";
import type { Category } from "@/types";
import { ExternalLink } from "lucide-react";



interface FooterProps {
  initialCategories?: Category[];
}

export function Footer({ initialCategories }: FooterProps) {
  const { data: categories = initialCategories ?? [] } = useCategories(
    initialCategories
  );

  const beautyCategories = [
    { title: "Skincare", slug: "skincare" },
    { title: "Makeup", slug: "makeup" },
    { title: "Hair Care", slug: "hair-care" },
    { title: "Nail Art", slug: "nail-art" },
    { title: "Wellness", slug: "wellness" },
  ];

  const footerCats = categories.length > 0 ? categories.slice(0, 6) : beautyCategories;

  return (
    <footer className="bg-foreground text-card pt-12 pb-6 mt-auto">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt={SITE_NAME}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-card/70 leading-relaxed mb-4">
              Beauty tips and hacks for every skin type and lifestyle.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="overline text-card/60 mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerCats.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-card/80 hover:text-primary transition-colors"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="overline text-card/60 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Disclaimer", href: "/disclaimer" },
                  { label: "Privacy Policy", href: "/privacy" },


              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-card/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-card/50">
            © {new Date().getFullYear()} EasyBeautyHacks. Beauty tips for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
}
