"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Search } from "lucide-react";
import { useNavLinks } from "@/hooks/useNavLinks";
import { useCategories } from "@/hooks/useCategories";
import { MobileNav } from "./MobileNav";
import type { NavLink, Category } from "@/types";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  initialNavLinks?: NavLink[];
  initialCategories?: Category[];
}

export function SiteHeader({
  initialNavLinks,
  initialCategories,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: navLinks = initialNavLinks ?? [] } = useNavLinks(
    initialNavLinks ?? null
  );
  const { data: categories = initialCategories ?? [] } = useCategories(
    initialCategories
  );

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-card border-b border-border"
      )}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="EasyBeautyHacks"
              className="h-9 w-auto"
              width={180}
              height={36}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-lg text-foreground-muted hover:text-primary hover:bg-primary-muted transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </Link>

            {mounted && (
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="p-2 rounded-lg text-foreground-muted hover:text-primary hover:bg-primary-muted transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <MobileNav navLinks={navLinks} categories={categories} />
          </div>
        </div>
      </div>

      {/* Categories bar (desktop) */}
      {categories.length > 0 && (
        <div className="hidden lg:block border-t border-border bg-background-alt">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 h-10 overflow-x-auto scrollbar-hide">
              {categories.slice(0, 10).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="shrink-0 text-xs font-medium text-foreground-muted hover:text-primary transition-colors nav-link whitespace-nowrap"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
