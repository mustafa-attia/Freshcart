import { ProductCard } from "@/components/home/product-card";
import type { Product } from "@/types/catalog";

export function RelatedProducts({ products }: { products: Product[] }) {
  const visible = products.slice(0, 5);
  if (visible.length === 0) return null;

  return (
    <section className="mt-10 min-w-0" aria-label="You may also like">
      <h2 className="mb-5 flex min-w-0 items-center gap-2.5 text-lg font-semibold tracking-tight text-navy sm:text-xl">
        <span className="h-5 w-1 shrink-0 rounded-full bg-fresh" aria-hidden="true" />
        <span className="min-w-0">You May Also Like</span>
      </h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-4">
        {visible.map((product) => (
          <li key={product._id} className="min-w-0">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
