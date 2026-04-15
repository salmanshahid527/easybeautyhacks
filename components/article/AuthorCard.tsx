import { SmartImage as Image } from "@/components/ui/SmartImage";
import { SITE_NAME } from "@/lib/constants";

interface AuthorCardProps {
  name?: string;
  image?: string;
  bio?: string;
}

export function AuthorCard({ name, image, bio }: AuthorCardProps) {
  const authorName = name ?? SITE_NAME;

  return (
    <div className="mt-10 p-6 rounded-2xl bg-surface-warm border border-border flex gap-5 items-start">
      <div className="shrink-0">
        {image ? (
          <Image
            src={image}
            alt={authorName}
            width={56}
            height={56}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary-muted flex items-center justify-center">
            <span className="font-display text-2xl text-primary font-semibold">
              {authorName[0]}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="overline text-primary mb-1">Written by</p>
        <h3 className="font-semibold text-foreground text-lg">{authorName}</h3>
        {bio && (
          <p className="text-sm text-foreground-muted mt-1.5 leading-relaxed line-clamp-3">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
}
