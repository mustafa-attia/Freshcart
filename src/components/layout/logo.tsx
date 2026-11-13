import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-fresh text-white shadow-[0_6px_14px_rgba(23,107,91,0.2)]">
        <ShoppingBag className="size-4" aria-hidden="true" />
      </span>
      <span
        className={cn(
          "font-heading text-xl font-bold tracking-tight",
          inverted ? "text-white" : "text-navy",
        )}
      >
        Fresh<span className={inverted ? "text-[#e5bd7c]" : "text-fresh"}>Cart</span>
      </span>
    </span>
  );
}
