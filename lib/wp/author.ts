import { cache } from "react";
import { fetchWp } from "./client";
import { mapWpUserToAuthor } from "./map";
import type { WpUser } from "./types";
import type { Author } from "@/types";

export const getAuthor = cache(async function (): Promise<Author | null> {
  // /wp/v2/users is blocked at Cloudflare (user-enumeration rule), so read the
  // author embedded in the latest post instead. Embeds are resolved inside WordPress.
  const posts = await fetchWp<{ _embedded?: { author?: WpUser[] } }[]>("/posts", {
    per_page: 1,
    _embed: "author",
    _fields: "id,_links,_embedded",
  });
  const user = posts[0]?._embedded?.author?.[0];
  if (!user?.name) return null;
  return mapWpUserToAuthor(user);
});
