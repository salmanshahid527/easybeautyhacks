import { PostGrid } from "./PostGrid";
import type { Post } from "@/types";

export function CategoryPostList({ posts }: { posts: Post[] }) {
  return (
    <div>
      <p className="mb-8 text-sm" style={{ color: "var(--foreground-muted)" }}>
        {posts.length} {posts.length === 1 ? "article" : "articles"}
      </p>

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p style={{ color: "var(--foreground-muted)" }}>No articles yet in this category.</p>
        </div>
      ) : (
        <PostGrid posts={posts} />
      )}
    </div>
  );
}
