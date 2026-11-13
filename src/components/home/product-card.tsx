import { discountPercent } from "@/lib/product";
import type { Product } from "@/types/catalog";
import { CatalogImage } from "./catalog-image";
import { PriceTag } from "./price-tag";
import { RatingStars } from "./rating-stars";
import Link from "next/link";
import { ProductActions } from "@/components/storefront/product-actions";
import { ArrowUpRight } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const percent = discountPercent(product);

  return (
    <article className="group surface-card relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line/80 transition-all duration-500 hover:-translate-y-1.5 hover:border-fresh/30 hover:shadow-[0_24px_54px_rgba(23,58,53,0.13)]">
      <div className="relative aspect-square overflow-hidden bg-[radial-gradient(ellipse_at_50%_42%,#fffefa_0%,#f1eee5_72%)]">
        <span className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <CatalogImage
            src={product.imageCover}
            alt=""
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover"
          />
        </span>
        {percent ? (
          <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-[#a34c3a] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
            -{percent}%
          </span>
        ) : null}
        <span className="pointer-events-none absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-fresh opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-4 sm:px-5">
        <p className="truncate text-[10px] font-bold tracking-[0.16em] text-fresh uppercase">{product.category.name}</p>
        <Link
          href={`/product/${product._id}`}
          className="mt-1 line-clamp-2 min-h-11 font-heading text-base font-semibold leading-snug text-navy transition-colors group-hover:text-fresh sm:text-lg"
        >
          {product.title}
        </Link>
        <div className="mt-2">
          <RatingStars
            value={product.ratingsAverage}
            count={product.ratingsQuantity}
          />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-line/80 pt-4">
          <PriceTag product={product} stacked />
          <div className="shrink-0">
            {product.quantity > 0 ? <ProductActions productId={product._id} compact /> : null}
          </div>
        </div>
        {product.quantity <= 0 ? (
          <div className="mt-2 border-t border-line/80 pt-3">
            <p className="text-xs font-semibold tracking-wide text-[#a34c3a] uppercase">
              Currently unavailable
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
