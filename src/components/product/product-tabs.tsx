"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, Star } from "lucide-react";
import { RatingStars } from "@/components/home/rating-stars";
import { FREE_SHIPPING_NOTE } from "@/lib/store-info";
import type { ProductSpec } from "@/lib/product";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "@/types/catalog";

const TABS = [
  { id: "details", label: "Product Details" },
  { id: "reviews", label: "Reviews" },
  { id: "shipping", label: "Shipping & Returns" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const FEATURES = [
  "Premium Quality Product",
  "100% Authentic Guarantee",
  "Fast & Secure Packaging",
  "Quality Tested",
];

const reviewDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return reviewDate.format(date);
}

export function ProductTabs({
  product,
  prose,
  specs,
}: {
  product: ProductDetail;
  prose: string;
  specs: ProductSpec[];
}) {
  const [active, setActive] = useState<TabId>("details");
  const reviewCount = Math.max(product.reviews.length, product.ratingsQuantity);
  const subcategory = product.subcategory.map((item) => item.name).join(", ");
  const facts = [
    { label: "Category", value: product.category.name },
    subcategory ? { label: "Subcategory", value: subcategory } : null,
    { label: "Brand", value: product.brand.name },
    { label: "Items Sold", value: product.sold.toLocaleString("en-US") },
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = TABS.findIndex((tab) => tab.id === active);
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = TABS[(index + direction + TABS.length) % TABS.length];
      setActive(next.id);
      document.getElementById(`tab-${next.id}`)?.focus();
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next = event.key === "Home" ? TABS[0] : TABS[TABS.length - 1];
      setActive(next.id);
      document.getElementById(`tab-${next.id}`)?.focus();
    }
  }

  return (
    <section className="mt-8" aria-label="More about this product">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex gap-1 overflow-x-auto border-b border-line"
        onKeyDown={onTabKeyDown}
      >
        {TABS.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium",
                selected ? "border-fresh text-fresh" : "border-transparent text-copy hover:text-navy",
                focusRing,
              )}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
            >
              {tab.id === "reviews" ? (
                <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              ) : null}
              {tab.id === "reviews" ? `Reviews (${reviewCount})` : tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="pt-6"
        tabIndex={0}
      >
        {active === "details" ? (
          <div>
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-navy">
              <span className="h-5 w-1 shrink-0 rounded-full bg-fresh" aria-hidden="true" />
              About this Product
            </h2>
            {prose ? (
              <p className="mt-3 max-w-prose text-sm leading-relaxed whitespace-pre-line text-copy">
                {prose}
              </p>
            ) : specs.length > 0 ? (
              <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.label} className="min-w-0">
                    <dt className="text-xs text-copy">{spec.label}</dt>
                    <dd className="text-sm font-medium text-navy">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-copy">No description is available for this product.</p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <section className="min-w-0 rounded-lg bg-zinc-50 p-4">
                <h3 className="text-sm font-semibold text-navy">Product Information</h3>
                <dl className="mt-2">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-start justify-between gap-4 border-b border-line py-2 text-sm last:border-b-0"
                    >
                      <dt className="text-copy">{fact.label}</dt>
                      <dd className="min-w-0 text-right font-medium text-navy">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section className="min-w-0 rounded-lg bg-zinc-50 p-4">
                <h3 className="text-sm font-semibold text-navy">Key Features</h3>
                <ul className="mt-3 space-y-2.5">
                  {FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-navy">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-mint text-fresh">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        ) : null}

        {active === "reviews" ? (
          product.reviews.length === 0 ? (
            <p className="text-sm text-copy">No written reviews yet.</p>
          ) : (
            <ul className="space-y-3">
              {product.reviews.map((review) => {
                const date = formatReviewDate(review.createdAt);
                return (
                  <li key={review._id} className="rounded-lg border border-line p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-navy">{review.userName}</p>
                      {date ? (
                        <time className="text-xs text-copy" dateTime={review.createdAt}>
                          {date}
                        </time>
                      ) : null}
                    </div>
                    <div className="mt-1">
                      <RatingStars value={review.rating} />
                    </div>
                    {review.review ? (
                      <p className="mt-2 text-sm leading-relaxed text-copy">{review.review}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )
        ) : null}

        {active === "shipping" ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <li className="min-w-0 rounded-lg bg-zinc-50 p-4">
              <h3 className="text-sm font-semibold text-navy">Free delivery</h3>
              <p className="mt-1 text-sm leading-relaxed text-copy">{FREE_SHIPPING_NOTE}.</p>
            </li>
            <li className="min-w-0 rounded-lg bg-zinc-50 p-4">
              <h3 className="text-sm font-semibold text-navy">30-day returns</h3>
              <p className="mt-1 text-sm leading-relaxed text-copy">
                Eligible items can be returned within 30 days.
              </p>
            </li>
            <li className="min-w-0 rounded-lg bg-zinc-50 p-4">
              <h3 className="text-sm font-semibold text-navy">Secure payment</h3>
              <p className="mt-1 text-sm leading-relaxed text-copy">
                Checkout payments are protected from the moment an order is placed.
              </p>
            </li>
          </ul>
        ) : null}
      </div>
    </section>
  );
}
