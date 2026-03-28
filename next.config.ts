import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* Fix PostCSS/Tailwind path resolution on Hostinger and similar hosts */
const _dirname = path.dirname(fileURLToPath(import.meta.url));

const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? "";
// WordPress "base" URL used for images/rewrites (no trailing /wp-json)
const wpBaseUrl = wpApiUrl ? wpApiUrl.replace(/\/wp-json\/?$/, "") : "";

let wpHostname = "easybeautyhacks.com";
try {
  if (wpBaseUrl.startsWith("http")) wpHostname = new URL(wpBaseUrl).hostname;
} catch {
  // ignore
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://easybeautyhacks.com";
let siteHostname = "easybeautyhacks.com";
try {
  if (siteUrl.startsWith("http")) siteHostname = new URL(siteUrl).hostname;
} catch {
  // ignore
}

/** Allow http + https so dev / plain-HTTP API hosts work with next/image */
function pushWpImageHosts(
  patterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>,
  seen: Set<string>,
  hostname: string
) {
  if (!hostname || seen.has(hostname)) return;
  seen.add(hostname);
  patterns.push(
    { protocol: "https", hostname, pathname: "/**" },
    { protocol: "http", hostname, pathname: "/**" }
  );
  if (!hostname.startsWith("www.")) {
    pushWpImageHosts(patterns, seen, `www.${hostname}`);
  }
}

const imageHostSeen = new Set<string>();
const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];
pushWpImageHosts(remotePatterns, imageHostSeen, wpHostname);
pushWpImageHosts(remotePatterns, imageHostSeen, siteHostname);
remotePatterns.push(
  { protocol: "https", hostname: "secure.gravatar.com", pathname: "/**" },
  { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
  { protocol: "https", hostname: "*.hostingersite.com", pathname: "/**" },
  { protocol: "https", hostname: "*.wordpress.com", pathname: "/**" }
);

const nextConfig: NextConfig = {
  outputFileTracingRoot: _dirname,
  images: {
    remotePatterns,
  },
  async rewrites() {
    if (!wpBaseUrl) return [];
    return [
      {
        source: "/wp-content/:path*",
        destination: `${wpBaseUrl}/wp-content/:path*`,
      },
    ];
  },
};

export default nextConfig;
