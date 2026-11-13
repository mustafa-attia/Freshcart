"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CatalogImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="absolute inset-0 flex items-center justify-center bg-zinc-50 px-3 text-center text-xs text-copy">
        {alt ? <span className="sr-only">{alt}</span> : null}
        <span aria-hidden="true">Image unavailable</span>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      className={cn("object-contain", className)}
      onError={() => setFailed(true)}
    />
  );
}
