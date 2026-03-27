import { cache } from "react";
import { fetchWp } from "./client";
import { mapWpUserToAuthor } from "./map";
import type { WpUser } from "./types";
import type { Author } from "@/types";

export const getAuthor = cache(async function (): Promise<Author | null> {
  const data = await fetchWp<WpUser[]>("/users", { per_page: 1 });
  if (!data[0]) return null;
  return mapWpUserToAuthor(data[0]);
});
