export interface WpPost {
  id: number;
  date: string;
  modified?: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  sticky?: boolean;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text?: string;
      media_details?: { width?: number; height?: number };
    }>;
    "wp:term"?: Array<
      Array<{ id: number; name: string; slug: string }>
    >;
    author?: Array<{
      id: number;
      name: string;
      avatar_urls?: { 24?: string; 48?: string; 96?: string };
    }>;
  };
}

export interface WpCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
}

export interface WpUser {
  id: number;
  name: string;
  description: string;
  avatar_urls?: { 24?: string; 48?: string; 96?: string };
  meta?: Record<string, unknown>;
}

export interface WpPage {
  id: number;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  menu_order?: number;
}

export interface WpSiteSettings {
  name?: string;
  description?: string;
  url?: string;
}
