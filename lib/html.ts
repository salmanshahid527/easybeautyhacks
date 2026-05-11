const wpUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? "api.easybeautyhacks.com/wp-json";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://easybeautyhacks.com";



function decodeNumericHtmlEntities(text: string): string {
  return text
    .replace(/&amp;#(\d{1,7});/g, "&#$1;")
    .replace(/&amp;#x([0-9a-f]{1,6});/gi, "&#x$1;")
    .replace(/&#(\d{1,7});/g, (_, dec) => {
      const n = Number.parseInt(dec, 10);
      if (!Number.isFinite(n) || n < 1 || n > 0x10ffff) return _;
      try {
        return String.fromCodePoint(n);
      } catch {
        return _;
      }
    })
    .replace(/&#x([0-9a-f]{1,6});/gi, (_, hex) => {
      const n = Number.parseInt(hex, 16);
      if (!Number.isFinite(n) || n < 1 || n > 0x10ffff) return _;
      try {
        return String.fromCodePoint(n);
      } catch {
        return _;
      }
    });
}

/** Decode common HTML entities */
export function decodeHtmlEntities(text: string): string {
  const named = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#8212;/g, "\u2014")
    .replace(/&nbsp;/g, " ");
  return decodeNumericHtmlEntities(named);
}

/** Strip all HTML tags */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/** Rewrite WordPress backend URLs to the frontend site URL */
export function rewriteWpUrlsToSiteUrl(html: string): string {
  if (!wpUrl || !html) return html;
  try {
    const wpOrigin = new URL(wpUrl).origin;
    return html
      .replace(new RegExp(wpOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), siteUrl)
      .replace(new RegExp(`//${new URL(wpUrl).hostname}`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), `//${new URL(siteUrl).hostname}`);
  } catch {
    return html;
  }
}

/** Force HTTPS for img src and srcset */
export function forceHttpsForImgSrc(html: string): string {
  return html
    .replace(/(<img[^>]+src=")http:\/\//gi, '$1https://')
    .replace(/(<img[^>]+srcset="[^"]*?)http:\/\//gi, '$1https://');
}

/** Sanitize HTML — removes dangerous tags and event handlers */
export function sanitizeHtmlForProse(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
    .replace(/\s+on\w+="[^"]*"/gi, "")
    .replace(/\s+on\w+='[^']*'/gi, "");
}

/**
 * WordPress often serves the same file with different host (api vs public), HTTPS, or
 * `-1200x800` size suffixes in content vs featured media URL. Compare by normalized path.
 */
function normalizeImageKey(raw: string): string {
  let u = decodeHtmlEntities(raw).trim();
  if (!u) return "";
  if (u.startsWith("//")) u = `https:${u}`;
  try {
    const baseHost = new URL(siteUrl).hostname;
    const parsed = new URL(u, `https://${baseHost}`);
    let path = parsed.pathname;
    path = path.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, "");
    return path.toLowerCase();
  } catch {
    return u
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/-\d+x\d+(?=\.[a-z0-9]+($|\?))/i, "")
      .toLowerCase();
  }
}

function collectImgUrlsFromTag(tag: string): string[] {
  const urls: string[] = [];
  const srcM = tag.match(/\bsrc=["']([^"']+)["']/i);
  if (srcM?.[1]) urls.push(decodeHtmlEntities(srcM[1]));
  const srcsetM = tag.match(/\bsrcset=["']([^"']+)["']/i);
  if (srcsetM?.[1]) {
    for (const part of srcsetM[1].split(",")) {
      const piece = part.trim().split(/\s+/)[0];
      if (piece) urls.push(decodeHtmlEntities(piece));
    }
  }
  return urls;
}

function chunkContainsFeaturedImage(chunk: string, featuredKey: string): boolean {
  if (!featuredKey) return false;
  const imgTags = chunk.match(/<img\b[^>]*>/gi) ?? [];
  for (const tag of imgTags) {
    for (const url of collectImgUrlsFromTag(tag)) {
      if (normalizeImageKey(url) === featuredKey) return true;
    }
  }
  return false;
}

/**
 * Remove featured image from article body HTML (leading blocks only).
 * Handles Gutenberg `wp-block-image`, `<figure>`, `<p><img></p>`, and bare `<img>`.
 * Does not remove later in-content images.
 */
export function removeFeaturedImageFromBody(html: string, featuredImageUrl?: string): string {
  if (!html) return html;

  let featured = featuredImageUrl?.trim();
  if (featured) {
    featured = rewriteWpUrlsToSiteUrl(featured);
    if (/^http:\/\//i.test(featured)) featured = featured.replace(/^http:/i, "https:");
  }
  const featuredKey = featured ? normalizeImageKey(featured) : "";

  let out = html;
  const maxPasses = 12;

  for (let pass = 0; pass < maxPasses; pass++) {
    out = out.replace(/^\s*(?:<!--[\s\S]*?-->\s*)+/, "");
    const leading = /^\s*/.exec(out)?.[0] ?? "";
    const rest = out.slice(leading.length);
    if (!rest.startsWith("<")) break;

    const blockPatterns: RegExp[] = [
      /^(<div\b[^>]*\bwp-block-image\b[^>]*>\s*(?:<figure\b[^>]*>[\s\S]*?<\/figure>\s*)<\/div>\s*)/i,
      /^(<figure\b[^>]*>[\s\S]*?<\/figure>\s*)/i,
      /^(<p\b[^>]*>\s*<img\b[^>]*\/>\s*<\/p>\s*)/i,
      /^(<p\b[^>]*>\s*<img\b[^>]*>\s*<\/p>\s*)/i,
      /^(<img\b[^>]*>\s*)/i,
    ];

    let removed = false;
    for (const re of blockPatterns) {
      const m = rest.match(re);
      if (!m?.[1]) continue;
      const chunk = m[1];
      if (featuredKey && chunkContainsFeaturedImage(chunk, featuredKey)) {
        out = leading + rest.slice(m[0].length);
        removed = true;
        break;
      }
    }
    if (!removed) break;
  }

  return out;
}

/**
 * Extract FAQ items from HTML content (expects h3 tags followed by p tags).
 * Returns array of {question, answer} pairs.
 */

function getFaqSection(html: string): string {
  // This regex will now match both 'Frequently Asked Questions' and 'FAQs'.
  const match = html.match(/(Frequently Asked Questions|FAQs)[\s\S]*?(?=<h2|Related Articles|$)/i);
  return match ? match[0] : "";
}

export function extractFAQFromHtml(html: string) {
  const faqHtml = getFaqSection(html);
  const faqItems: Array<{ question: string; answer: string }> = [];

  // Continue execution only upon finding the section
  if (!faqHtml) return [];

  const h3Pattern = /<h3[^>]*>([^<]+)<\/h3>/gi;
  const pPattern = /<p[^>]*>([^<]+)<\/p>/gi;

  const h3Matches = Array.from(faqHtml.matchAll(h3Pattern));
  const pMatches = Array.from(faqHtml.matchAll(pPattern));

  for (let i = 0; i < h3Matches.length; i++) {
    const questionText = stripHtml(h3Matches[i][1]);
    
    // Sirf wo headings uthayein jin mein "?" ho (Steps ko filter karne ke liye)
    if (questionText.includes("?")) {
      const h3Index = h3Matches[i].index || 0;
      // Is H3 ke baad wala pehla Paragraph dhundo
      const nextP = pMatches.find(p => (p.index || 0) > h3Index);

      if (nextP) {
        faqItems.push({
          question: questionText,
          answer: stripHtml(nextP[1]),
        });
      }
    }
  }

  return faqItems;
}

/**
 * Add loading="lazy" and decoding="async" to all prose images except the
 * first (which may be above the fold and should load eagerly).
 */
export function addLazyLoadingToProseImages(html: string): string {
  let count = 0;
  return html.replace(/<img(\s[^>]*)>/gi, (_match, attrs: string) => {
    count++;
    if (count === 1) {
      const cleaned = attrs
        .replace(/\s+loading="[^"]*"/gi, "")
        .replace(/\s+decoding="[^"]*"/gi, "");
      return `<img${cleaned} loading="eager" decoding="async">`;
    }
    const cleaned = attrs
      .replace(/\s+loading="[^"]*"/gi, "")
      .replace(/\s+decoding="[^"]*"/gi, "");
    return `<img${cleaned} loading="lazy" decoding="async">`;
  });
}



/** Full pipeline: sanitize → rewrite URLs → force HTTPS → remove featured image → lazy-load images */
export function processPostBody(html: string | undefined, featuredImageUrl?: string): string | undefined {
  if (!html?.trim()) return html;
  const sanitized = sanitizeHtmlForProse(html);
  const rewritten = rewriteWpUrlsToSiteUrl(sanitized);
  const httpsed = forceHttpsForImgSrc(rewritten);
  const noFeatured = removeFeaturedImageFromBody(httpsed, featuredImageUrl);
return addLazyLoadingToProseImages(noFeatured);
}
