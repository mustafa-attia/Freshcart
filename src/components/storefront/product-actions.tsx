"use client";

import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { ApiError, apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/styles";
import { useStore } from "./store-provider";

export function ProductActions({
  productId,
  quantity = 1,
  compact = false,
}: {
  productId: string;
  quantity?: number;
  compact?: boolean;
}) {
  const { refreshCounts, notify } = useStore();
  const [pending, setPending] = useState<"cart" | "wishlist" | null>(null);

  async function add(kind: "cart" | "wishlist") {
    setPending(kind);
    try {
      await apiRequest(`/` + kind, {
        method: "POST",
        body: { productId },
      });
      if (kind === "cart" && quantity > 1) {
        await apiRequest(`/cart/${productId}`, {
          method: "PUT",
          body: { count: quantity },
        });
      }
      await refreshCounts();
      notify(kind === "cart" ? "Added to your cart." : "Added to your wishlist.");
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "The request could not be completed.",
        "error",
        error instanceof ApiError && error.status === 401 ? { href: "/login", label: "Sign in" } : undefined,
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <div className={cn("flex gap-2", compact ? "mt-0 flex-wrap" : "mt-4 grid grid-cols-2")}>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => void add("cart")}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-full bg-fresh px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-fresh-dark hover:shadow-md disabled:opacity-60",
          focusRing,
          compact && "size-10 shrink-0 px-0 shadow-none hover:shadow-md",
        )}
        aria-label={compact ? "Add to cart" : undefined}
      >
        <ShoppingCart className="size-4" aria-hidden="true" />
        {!compact ? (pending === "cart" ? "Adding..." : "Add to Cart") : null}
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => void add("wishlist")}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-sm font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-fresh/40 hover:bg-mint disabled:opacity-60",
          focusRing,
          compact && "size-10 shrink-0 px-0",
        )}
        aria-label={compact ? "Add to wishlist" : undefined}
      >
        <Heart className="size-4" aria-hidden="true" />
        {!compact ? (pending === "wishlist" ? "Saving..." : "Wishlist") : null}
      </button>
    </div>
  );
}
