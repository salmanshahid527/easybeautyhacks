"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="overline text-primary mb-4">Something went wrong</p>
      <h1 className="font-display text-4xl font-semibold mb-4">
        We hit a snag
      </h1>
      <p className="text-muted max-w-md mb-8">
        An unexpected error occurred. Please try again or return to the home
        page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted/30 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
