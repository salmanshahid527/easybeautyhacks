"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { PostGrid } from "./PostGrid";

export function SearchView() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const { data: results = [], isLoading, isFetching } = useSearch(debouncedQuery);

  const isSearching = isLoading || isFetching;
  const hasQuery = debouncedQuery.trim().length >= 2;

  return (
    <div>
      {/* Search input */}
      <div className="mb-10">
        <p className="overline text-primary mb-3">Search</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-6">
          Find Beauty Tips
        </h1>
        <div className="relative max-w-2xl">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for skincare, makeup, hair care..."
            autoFocus
            className="w-full pl-13 pr-12 py-4 rounded-2xl border border-border bg-background text-foreground placeholder:text-foreground-subtle text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {isSearching && hasQuery && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-muted animate-pulse">
              <div className="aspect-[16/10] bg-muted-foreground/10" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-muted-foreground/10 rounded w-1/3" />
                <div className="h-5 bg-muted-foreground/10 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSearching && hasQuery && results.length > 0 && (
        <>
          <p className="text-sm text-foreground-muted mb-6">
            {results.length} {results.length === 1 ? "result" : "results"} for{" "}
            <span className="text-primary font-medium">&ldquo;{debouncedQuery}&rdquo;</span>
          </p>
          <PostGrid posts={results} />
        </>
      )}

      {!isSearching && hasQuery && results.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-2xl mb-3">🔍</p>
          <p className="text-foreground font-medium mb-2">No results found</p>
          <p className="text-foreground-muted text-sm">
            Try searching for &ldquo;skincare&rdquo;, &ldquo;makeup&rdquo;, or &ldquo;hair care&rdquo;
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {["Skincare", "Makeup", "Hair Care", "Nail Art", "Wellness"].map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-4 py-1.5 rounded-full border border-border text-sm text-foreground-muted hover:border-primary hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {!hasQuery && (
        <div className="py-8 text-center text-foreground-muted">
          <p>Start typing to search for beauty tips and hacks...</p>
        </div>
      )}
    </div>
  );
}
