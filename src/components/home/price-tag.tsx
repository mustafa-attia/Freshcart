import { cn } from "@/lib/utils";
import { formatEgp, isOnSale, salePrice } from "@/lib/product";
import type { Product } from "@/types/catalog";

export function PriceTag({
  product,
  stacked = false,
  className,
}: {
  product: Product;
  stacked?: boolean;
  className?: string;
}) {
  const current = salePrice(product);
  const onSale = isOnSale(product);

  if (stacked) {
    return (
      <div className={cn("min-h-10 min-w-0", className)}>
        <p className="text-sm font-semibold text-fresh">{formatEgp(current)}</p>
        {onSale ? (
          <p className="text-xs text-copy line-through">{formatEgp(product.price)}</p>
        ) : null}
      </div>
    );
  }

  return (
    <p className={cn("text-sm", className)}>
      <span className="font-semibold text-fresh">{formatEgp(current)}</span>
      {onSale ? (
        <span className="ml-2 text-xs text-copy line-through">{formatEgp(product.price)}</span>
      ) : null}
    </p>
  );
}
