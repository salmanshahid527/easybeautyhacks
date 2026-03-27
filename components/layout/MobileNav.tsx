"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { NavLink, Category } from "@/types";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  navLinks: NavLink[];
  categories: Category[];
}

export function MobileNav({ navLinks, categories }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-md text-foreground-muted hover:text-primary transition-colors"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-lg flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="EasyBeautyHacks" className="h-8 w-auto" />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-md text-foreground-muted hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-primary-muted hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}

          {categories.length > 0 && (
            <>
              <div className="pt-4 pb-2">
                <p className="overline text-foreground-subtle px-3">Categories</p>
              </div>
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground-muted hover:bg-primary-muted hover:text-primary transition-colors"
                >
                  {cat.title}
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
    </>
  );
}
