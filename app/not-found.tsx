import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ArrowLeft, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
      <p className="font-display text-8xl font-bold text-primary-muted mb-2">404</p>
      <h1 className="font-display text-3xl font-semibold text-foreground mb-4">
        Oops! This page ran out of product.
      </h1>
      <p className="text-foreground-muted max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist. It might have moved or been removed.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-accent-foreground transition-colors"
        >
          <Home size={15} /> Go back home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground font-medium hover:border-primary hover:text-primary transition-colors"
        >
          <ArrowLeft size={15} /> Browse Blog
        </Link>
      </div>
    </Container>
  );
}
