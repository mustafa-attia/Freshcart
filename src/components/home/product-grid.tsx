import { Container } from "@/components/layout/container";
import { loadProducts } from "@/lib/catalog";
import type { Product } from "@/types/catalog";
import { ProductCard } from "./product-card";
import { RetryButton } from "./retry-button";
import { SectionHeading } from "./section-heading";

export async function ProductGrid() {
  const { items, error } = await loadProducts();

  return (
    <section id="featured-products" className="scroll-mt-32 py-8 sm:py-10">
      <Container>
        <SectionHeading emphasis="Products">Featured</SectionHeading>
        <ProductList products={items} error={error} />
      </Container>
    </section>
  );
}

function ProductList({
  products,
  error,
}: {
  products: Product[];
  error: string | null;
}) {
  if (error) {
    return (
      <div className="rounded-lg border border-line bg-zinc-50 px-4 py-10 text-center">
        <p className="text-sm text-navy">{error}</p>
        <div className="mt-4 flex justify-center">
          <RetryButton />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-line px-4 py-10 text-center text-sm text-copy">
        No products are available right now.
      </p>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-copy">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>
      <ul className="catalog-grid grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-4">
        {products.map((product) => (
          <li key={product._id} className="min-w-0">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </>
  );
}
