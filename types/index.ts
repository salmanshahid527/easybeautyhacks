export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: { title: string; slug: string };
  featuredImage?: string;
  featuredImageAlt?: string;
  featured?: boolean;
  publishedAt?: string;
  author?: { name: string; image?: string };
  /** ISO date of last WP modification — used for sitemap lastModified */
  modifiedAt?: string;
}

export interface PostDetail extends Post {
  body?: string;
  modifiedAt?: string;
}

export interface Category {
  _id: string;
  id: number;
  title: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface Author {
  _id: string;
  name: string;
  bio?: string;
  image?: string;
  instagram?: string;
  pinterest?: string;
  facebook?: string;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
}

export interface NavLink {
  label: string;
  href: string;
}
