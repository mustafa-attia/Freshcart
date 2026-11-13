"use client";

import { useState } from "react";
import { Minus, Plus, Share2, Zap } from "lucide-react";
import { formatEgpAmount } from "@/lib/product";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ProductActions } from "@/components/storefront/product-actions";
import { useStore } from "@/components/storefront/store-provider";

export function ProductPurchase({
  productId,
  title,
  unitPrice,
  stock,
}: {
  productId: string;
  title: string;
  unitPrice: number;
  stock: number;
}) {
  const router = useRouter();
  const { refreshCounts, notify } = useStore();
  const available = Math.max(0, stock);
  const [quantity, setQuantity] = useState(available > 0 ? 1 : 0);
  const [notice, setNotice] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const inStock = available > 0;
  const total = unitPrice * quantity;

  function changeQuantity(next: number) {
    if (!inStock) return;
    setQuantity(Math.min(available, Math.max(1, next)));
  }

  async function share() {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setNotice("Product link copied.");
    } catch {
      setNotice("Copy the address bar to share this product.");
    }
  }

  async function buyNow() {
    setBuying(true);
    setNotice(null);
    try {
      await apiRequest("/cart", { method: "POST", body: { productId } });
      if (quantity > 1) {
        await apiRequest(`/cart/${productId}`, {
          method: "PUT",
          body: { count: quantity },
        });
      }
      await refreshCounts();
      router.push("/checkout");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not start checkout.", "error");
    } finally {
      setBuying(false);
    }
  }

  return (
    <div className="mt-5">
      <p className="text-sm font-medium text-navy" id="quantity-label">
        Quantity
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <div
          className="inline-flex h-11 items-center rounded-full border border-line bg-white"
          role="group"
          aria-labelledby="quantity-label"
        >
          <button
            type="button"
            className={cn(
              "flex size-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-mint disabled:cursor-not-allowed disabled:opacity-40",
              focusRing,
            )}
            aria-label="Decrease quantity"
            disabled={!inStock || quantity <= 1}
            onClick={() => changeQuantity(quantity - 1)}
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="min-w-8 text-center text-sm font-semibold text-navy tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            className={cn(
              "flex size-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-mint disabled:cursor-not-allowed disabled:opacity-40",
              focusRing,
            )}
            aria-label="Increase quantity"
            disabled={!inStock || quantity >= available}
            onClick={() => changeQuantity(quantity + 1)}
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm text-copy">
          {available.toLocaleString("en-US")} available
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4">
        <p className="text-sm text-copy">Total Price</p>
        <p className="text-lg font-semibold text-fresh">
          {inStock ? formatEgpAmount(total, true) : "Unavailable"}
        </p>
      </div>

      <div className="mt-4">
        <ProductActions productId={productId} quantity={quantity} />
        <button
          type="button"
          className={cn(
            "mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50",
            focusRing,
          )}
          disabled={!inStock || buying}
          onClick={() => void buyNow()}
        >
          <Zap className="size-4" aria-hidden="true" />
          {buying ? "Starting checkout..." : "Buy Now"}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center">
        <span />
        <span />
        <button
          type="button"
          className={cn(
            "flex size-10 items-center justify-center justify-self-end rounded-lg border border-line text-copy hover:text-navy",
            focusRing,
          )}
          aria-label="Share product"
          onClick={() => void share()}
        >
          <Share2 className="size-4" aria-hidden="true" />
        </button>
      </div>

      {notice ? (
        <p className="mt-2 text-center text-sm text-navy" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
