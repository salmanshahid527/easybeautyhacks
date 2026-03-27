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

const nextConfig: NextConfig = {
  outputFileTracingRoot: _dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: wpHostname, pathname: "/**" },
      { protocol: "https", hostname: `www.${wpHostname}`, pathname: "/**" },
      { protocol: "https", hostname: "secure.gravatar.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "*.hostingersite.com", pathname: "/**" },
      { protocol: "https", hostname: "*.wordpress.com", pathname: "/**" },
    ],
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
