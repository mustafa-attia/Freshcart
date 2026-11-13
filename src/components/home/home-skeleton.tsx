import { Container } from "@/components/layout/container";
import { SectionHeading } from "./section-heading";

export function CategoryGridSkeleton() {
  return (
    <section id="categories" className="scroll-mt-32 py-8 sm:py-10" aria-busy="true">
      <Container>
        <SectionHeading emphasis="Category">Shop by</SectionHeading>
        <div>
          <p className="sr-only">Loading categories</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="loading-shimmer h-32 rounded-2xl border border-line" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ProductGridSkeleton() {
  return (
    <section id="featured-products" className="scroll-mt-32 py-8 sm:py-10" aria-busy="true">
      <Container>
        <SectionHeading emphasis="Products">Featured</SectionHeading>
        <div>
          <p className="sr-only">Loading products</p>
          <div className="loading-shimmer mb-4 h-5 w-24 rounded-full" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-4">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="loading-shimmer aspect-[3/4] rounded-2xl border border-line" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
