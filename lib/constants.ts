export const SITE_NAME = "EasyBeautyHacks";
export const SITE_DESCRIPTION = "Discover easy beauty hacks, skincare tips, makeup tutorials, and hair care secrets for every skin type and lifestyle.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://easybeautyhacks.com";

export const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=630&fit=crop&q=80";
export const LOGO_PATH = "/logo.svg";
export const FAVICON_PATH = "/favicon.svg";

export const POSTS_PER_PAGE = 12;
export const POSTS_PER_CATEGORY_HOME = 4;

export const CATEGORIES_HOME = ["skincare", "makeup", "hair-care", "nail-art", "wellness"];

export const NAV_PAGE_SLUGS = ["about", "contact", "privacy","disclaimer"];

export const SLUG_TO_PATH: Record<string, string> = {
  about: "/about",
  "about-us": "/about",
  contact: "/contact",
  "contact-us": "/contact",
  "privacy-policy": "/privacy",
  disclaimer: "/disclaimer",
};
export const SLUG_FALLBACKS: Record<string, string[]> = {
  about: ["about-us"],
  contact: ["contact-us"],
  privacy: ["privacy-policy"],
  disclaimer: ["disclaimer"]
};

export const SOCIAL = {
  pinterest: "https://www.pinterest.com/easybeautyhacks",
  instagram:"https://www.instagram.com/easy_beauty_hack/",
  facebook: "https://www.facebook.com/easybeautyhacks",
};
