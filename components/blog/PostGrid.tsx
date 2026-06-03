import { PostCard } from "./PostCard";
import type { Post } from "@/types";
import { cn } from "@/lib/utils";

interface PostGridProps {
  posts: Post[];
  columns?: 2 | 3;
  className?: string;
}

export function PostGrid({ posts, columns = 3, className }: PostGridProps) {
  if (!posts.length) return null;

  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2",
        className
      )}
    >
      {posts.map((post, i) => (
        <div key={post._id} className="h-full">
          <PostCard post={post} priority={i < 3} />
        </div>
      ))}
    </div>
  );
}
