const wpUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://easybeautyhacks.com";

/** Decode common HTML entities */
export function decodeHtmlEntities(text: string): string {
  return text
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

/** Full pipeline: sanitize → rewrite URLs → force HTTPS → lazy-load images */
export function processPostBody(html: string | undefined): string | undefined {
  if (!html?.trim()) return html;
  const sanitized = sanitizeHtmlForProse(html);
  const rewritten = rewriteWpUrlsToSiteUrl(sanitized);
  const httpsed = forceHttpsForImgSrc(rewritten);
  return addLazyLoadingToProseImages(httpsed);
}
