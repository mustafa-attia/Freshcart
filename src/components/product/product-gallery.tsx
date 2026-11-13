"use client";

import { useState } from "react";
import { CatalogImage } from "@/components/home/catalog-image";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function ProductGallery({ title, images }: { title: string; images: string[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? "";

  return (
    <div className="min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-[#f1eee5]">
        <span className="absolute inset-4 sm:inset-6">
          <CatalogImage
            key={current}
            src={current}
            alt={title}
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority={active === 0}
          />
        </span>
      </div>

      {images.length > 1 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {images.map((src, index) => {
            const selected = index === active;
            return (
              <li key={src} className="shrink-0">
                <button
                  type="button"
                  className={cn(
                    "relative size-16 overflow-hidden rounded-xl border bg-white sm:size-20",
                    selected ? "border-2 border-fresh" : "border-line hover:border-fresh/50",
                    focusRing,
                  )}
                  aria-label={`Show image ${index + 1} of ${images.length}`}
                  aria-pressed={selected}
                  onClick={() => setActive(index)}
                >
                  <span className="absolute inset-1">
                    <CatalogImage src={src} alt="" sizes="80px" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
