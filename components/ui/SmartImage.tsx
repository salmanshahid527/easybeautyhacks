"use client";

import { useMemo, useState } from "react";
import NextImage from "next/image";
import type { ComponentProps } from "react";

type SmartImageProps = ComponentProps<typeof NextImage>;

/**
 * Uses Next image optimization by default, but retries once with unoptimized
 * source when optimizer requests fail (e.g. quota/payment limits).
 */
export function SmartImage(props: SmartImageProps) {
  const [useUnoptimized, setUseUnoptimized] = useState(Boolean(props.unoptimized));
  const originalOnError = props.onError;

  const srcKey = useMemo(() => {
    const src = props.src;
    if (typeof src === "string") return src;
    return src?.src ?? "";
  }, [props.src]);

  return (
    <NextImage
      key={`${useUnoptimized ? "raw" : "opt"}:${srcKey}`}
      {...props}
      unoptimized={useUnoptimized}
      onError={(e) => {
        if (!useUnoptimized) {
          setUseUnoptimized(true);
          return;
        }
        originalOnError?.(e);
      }}
    />
  );
}
