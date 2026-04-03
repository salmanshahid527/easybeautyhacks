const wpUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? "api.easybeautyhacks.com/wp-json";
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
 * Remove featured image from article body HTML.
 * Removes only the FIRST/FEATURED image at the beginning of the content.
 * Preserves all in-content images to maintain article flow.
 */
export function removeFeaturedImageFromBody(html: string, featuredImageUrl?: string): string {
  if (!html) return html;

  // Only remove the featured image at the START of the content
  // Remove figure tag with featured image from the beginning
  if (featuredImageUrl) {
    const escapedUrl = featuredImageUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
    // Remove ONLY the first figure containing the featured image URL at the start
    html = html.replace(
      new RegExp(`^\\s*<figure[^>]*>\\s*<img[^>]*src=["']${escapedUrl}["'][^>]*>[^<]*<\\/figure>\\s*`, "i"),
      ""
    );
    
    // If no figure, remove ONLY the first img tag at the start with this URL
    if (html !== removeFirstImageTag(html, escapedUrl)) {
      html = removeFirstImageTag(html, escapedUrl);
    }
  }

  // Also remove any img/figure tags at the very beginning of content (before first real paragraph)
  html = html.replace(/^\s*<figure[^>]*>\s*<img[^>]*>\s*<\/figure>\s*/i, "");
  html = html.replace(/^\s*<img[^>]*(src=["'][^"']*["'])[^>]*>\s*/i, "");
  
  return html;
}

/**
 * Helper: Remove only the FIRST img tag with matching URL.
 */
function removeFirstImageTag(html: string, escapedUrl: string): string {
  return html.replace(
    new RegExp(`^\\s*<img[^>]*src=["']${escapedUrl}["'][^>]*>\\s*`, "i"),
    ""
  );
}

/**
 * Extract FAQ items from HTML content (expects h3 tags followed by p tags).
 * Returns array of {question, answer} pairs.
 */
export function extractFAQFromHtml(html: string): Array<{ question: string; answer: string }> {
  const faqItems: Array<{ question: string; answer: string }> = [];
  
  // Match patterns like: <h3>Question?</h3><p>Answer text.</p>
  const h3Pattern = /<h3[^>]*>([^<]+)<\/h3>/gi;
  const pPattern = /<p[^>]*>([^<]+)<\/p>/gi;
  
  // Find all h3 and p tags
  const h3Matches = Array.from(html.matchAll(h3Pattern)).map(m => ({
    text: stripHtml(m[1]),
    index: m.index || 0
  }));
  
  const pMatches = Array.from(html.matchAll(pPattern)).map(m => ({
    text: stripHtml(m[1]),
    index: m.index || 0
  }));
  
  // Pair h3 (questions) with following p (answers)
  for (let i = 0; i < h3Matches.length; i++) {
    const question = h3Matches[i];
    // Find the next p tag that comes after this h3
    const nextP = pMatches.find(p => p.index > question.index);
    
    if (nextP && question.text && nextP.text) {
      faqItems.push({
        question: question.text,
        answer: nextP.text
      });
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
