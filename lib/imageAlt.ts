/**
 * Fill in missing/empty `alt` attributes on <img> tags inside WordPress post HTML.
 *
 * Alt text source, in order of preference:
 *   1. the image's <figcaption> (when the image sits inside a <figure>)
 *   2. the nearest preceding <h2>–<h4> heading
 *   3. the first following <h2>–<h4> heading
 * Existing non-empty alt text is never changed. Pure string transform, safe on server and client.
 */

const HEADING_RE = /<h([2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
const IMG_RE = /<img\b[^>]*>/gi;

function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8217;|&rsquo;/gi, "’")
    .replace(/&#8216;|&lsquo;/gi, "‘")
    .replace(/&#8220;|&ldquo;/gi, "“")
    .replace(/&#8221;|&rdquo;/gi, "”")
    .replace(/&#8211;|&ndash;/gi, "–")
    .replace(/&#8212;|&mdash;/gi, "—")
    .replace(/&#039;|&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function toAttr(text: string): string {
  const clipped = text.length > 125 ? `${text.slice(0, 122).trimEnd()}…` : text;
  return clipped.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hasUsableAlt(tag: string): boolean {
  const m = tag.match(/\balt\s*=\s*("([^"]*)"|'([^']*)')/i);
  if (!m) return false;
  return ((m[2] ?? m[3] ?? "").trim().length > 0);
}

export function addMissingImageAlts(html: string): string {
  if (!html || !/<img\b/i.test(html)) return html;

  const headings: { index: number; text: string }[] = [];
  for (const m of html.matchAll(HEADING_RE)) {
    const text = toPlainText(m[2]);
    if (text) headings.push({ index: m.index ?? 0, text });
  }

  return html.replace(IMG_RE, (tag: string, offset: number) => {
    if (hasUsableAlt(tag)) return tag;

    let altText = "";
    const after = html.slice(offset + tag.length, offset + tag.length + 1500);
    const figureEnd = after.search(/<\/figure>/i);
    const before = html.slice(Math.max(0, offset - 1500), offset);
    const insideFigure =
      figureEnd !== -1 &&
      !/<figure\b/i.test(after.slice(0, figureEnd)) &&
      before.toLowerCase().lastIndexOf("<figure") > before.toLowerCase().lastIndexOf("</figure>");
    if (insideFigure) {
      const cap = after.slice(0, figureEnd).match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i);
      if (cap) altText = toPlainText(cap[1]);
    }
    if (!altText) {
      const prev = headings.filter((h) => h.index < offset);
      const next = headings.find((h) => h.index > offset);
      altText = prev.length ? prev[prev.length - 1].text : next?.text ?? "";
    }
    if (!altText) return tag;

    const alt = toAttr(altText);
    if (/\balt\s*=/i.test(tag)) {
      return tag.replace(/\balt\s*=\s*("[^"]*"|'[^']*')/i, `alt="${alt}"`);
    }
    return tag.replace(/^<img\b/i, `<img alt="${alt}"`);
  });
}
