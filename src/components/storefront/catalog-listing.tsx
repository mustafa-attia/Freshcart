"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/home/product-card";
import type { Product } from "@/types/catalog";
import { EmptyState } from "./store-components";

export function CatalogListing({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = products.filter((product) =>
      `${product.title} ${product.brand.name} ${product.category.name}`.toLowerCase().includes(normalized),
    );
    if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
    if (sort === "rating") filtered.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
    return filtered;
  }, [products, query, sort]);

  return (
    <>
      <div className="mb-6 grid gap-3 rounded-2xl border border-line bg-white/70 p-3 shadow-sm sm:grid-cols-[minmax(0,1fr)_12rem]">
        <label className="sr-only" htmlFor="catalog-search">Search products</label>
        <input
          id="catalog-search"
          className="h-12 rounded-xl border border-line bg-[#faf8f3] px-4 text-sm outline-none transition focus:border-fresh focus:bg-white focus:ring-4 focus:ring-fresh/10"
          placeholder="Search products, brands, categories..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <label className="sr-only" htmlFor="catalog-sort">Sort products</label>
        <select
          id="catalog-sort"
          className="h-12 rounded-xl border border-line bg-[#faf8f3] px-4 text-sm outline-none transition focus:border-fresh focus:ring-4 focus:ring-fresh/10"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
      <p className="mb-4 text-sm text-copy">{visible.length} products</p>
      {visible.length ? (
        <ul className="catalog-grid grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-4">
          {visible.map((product) => (
            <li key={product._id} className="min-w-0">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No products found" detail="Try changing your search or filters." />
      )}
    </>
  );
}
