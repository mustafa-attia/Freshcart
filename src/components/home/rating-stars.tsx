import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  count,
}: {
  value: number;
  count?: number;
}) {
  const rounded = Math.round(value);
  return (
    <p className="flex items-center gap-1 text-xs text-copy">
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5
        {count != null ? ` from ${count} reviews` : ""}
      </span>
      <span className="flex" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              "size-3.5",
              index < rounded ? "fill-amber-400 text-amber-400" : "text-zinc-300",
            )}
          />
        ))}
      </span>
      {count != null ? <span aria-hidden="true">({count})</span> : null}
    </p>
  );
}
