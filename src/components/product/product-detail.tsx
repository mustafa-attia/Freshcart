import Link from "next/link";
import { ShieldCheck, Truck, Undo2, type LucideIcon } from "lucide-react";
import { RatingStars } from "@/components/home/rating-stars";
import { ServiceBenefits } from "@/components/home/service-benefits";
import { Container } from "@/components/layout/container";
import {
  describeProduct,
  discountPercent,
  formatEgpAmount,
  galleryImages,
  isOnSale,
  salePrice,
} from "@/lib/product";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { Product, ProductDetail } from "@/types/catalog";
import { ProductGallery } from "./product-gallery";
import { ProductPurchase } from "./product-purchase";
import { ProductTabs } from "./product-tabs";
import { RelatedProducts } from "./related-products";

const PERKS: { title: string; detail: string; icon: LucideIcon }[] = [
  { title: "Free Delivery", detail: "Order over 500 EGP", icon: Truck },
  { title: "30 Days Return", detail: "Money back", icon: Undo2 },
  { title: "Secure Payment", detail: "100% Protected", icon: ShieldCheck },
];

export function ProductDetailView({
  product,
  related,
}: {
  product: ProductDetail;
  related: Product[];
}) {
  const images = galleryImages(product);
  const { prose, specs } = describeProduct(product.description);
  const current = salePrice(product);
  const onSale = isOnSale(product);
  const percent = discountPercent(product);
  const inStock = product.quantity > 0;
  const summary = prose || specs.map((spec) => `${spec.label}: ${spec.value}`).join(". ");
  const crumbs = [product.category.name, product.subcategory[0]?.name].filter(
    (name, index, list): name is string => Boolean(name) && list.indexOf(name) === index,
  );

  return (
    <div className="overflow-x-clip bg-background">
      <Container className="py-5 sm:py-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-copy">
            <li>
              <Link href="/" className={cn("rounded-sm hover:text-fresh", focusRing)}>
                Home
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb} className="flex min-w-0 items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="truncate">{crumb}</span>
              </li>
            ))}
            <li className="flex min-w-0 items-center gap-2">
              <span aria-hidden="true">/</span>
              <span className="max-w-48 truncate font-medium text-navy sm:max-w-md" aria-current="page">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>

        <article className="surface-card mt-5 rounded-[1.75rem] border border-line p-4 shadow-[0_18px_50px_rgba(23,58,53,0.06)] sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
            <div className="min-w-0 lg:col-span-2">
              <ProductGallery title={product.title} images={images} />
            </div>

            <div className="min-w-0 lg:col-span-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-fresh px-2.5 py-0.5 text-xs font-medium text-fresh">
                  {product.category.name}
                </span>
                <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-copy">
                  {product.brand.name}
                </span>
              </div>

              <h1 className="mt-3 font-heading text-3xl font-medium tracking-tight text-navy sm:text-4xl">
                {product.title}
              </h1>

              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-2xl font-bold text-fresh">{formatEgpAmount(current)}</span>
                {onSale ? (
                  <span className="text-sm text-copy line-through">
                    {formatEgpAmount(product.price)}
                  </span>
                ) : null}
                {percent ? (
                  <span className="rounded-md bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
                    Save {percent}%
                  </span>
                ) : null}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <RatingStars value={product.ratingsAverage} />
                <p className="text-sm text-copy">
                  <span className="font-medium text-navy">{product.ratingsAverage.toFixed(1)}</span>{" "}
                  ({product.ratingsQuantity}{" "}
                  {product.ratingsQuantity === 1 ? "review" : "reviews"})
                </p>
              </div>

              <p
                className={cn(
                  "mt-3 flex items-center gap-2 text-sm font-medium",
                  inStock ? "text-fresh" : "text-rose-700",
                )}
              >
                <span
                  className={cn("size-2 rounded-full", inStock ? "bg-fresh" : "bg-rose-600")}
                  aria-hidden="true"
                />
                {inStock ? "In Stock" : "Out of stock"}
              </p>

              {summary ? (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-copy">{summary}</p>
              ) : null}

              <ProductPurchase
                productId={product._id}
                title={product.title}
                unitPrice={current}
                stock={product.quantity}
              />

              <ul className="mt-5 grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-3">
                {PERKS.map((perk) => {
                  const Icon = perk.icon;
                  return (
                    <li key={perk.title} className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint text-fresh">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-navy">{perk.title}</span>
                        <span className="block text-xs text-copy">{perk.detail}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </article>

        <ProductTabs product={product} prose={prose} specs={specs} />
        <RelatedProducts products={related} />
      </Container>
      <ServiceBenefits compact />
    </div>
  );
}
