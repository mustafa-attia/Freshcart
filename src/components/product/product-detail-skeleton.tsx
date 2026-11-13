import { Container } from "@/components/layout/container";

export function ProductDetailSkeleton() {
  return (
    <div aria-busy="true">
      <p className="sr-only">Loading product</p>
      <Container className="py-5 sm:py-8">
        <div className="loading-shimmer h-4 w-64 rounded-full" />
        <div className="surface-card mt-4 grid grid-cols-1 gap-6 rounded-[1.75rem] border border-line p-4 sm:p-6 lg:grid-cols-5 lg:gap-8 lg:p-8">
          <div className="loading-shimmer aspect-square rounded-2xl lg:col-span-2" />
          <div className="space-y-3 lg:col-span-3">
            <div className="loading-shimmer h-6 w-40 rounded-full" />
            <div className="loading-shimmer h-10 w-4/5 rounded-lg" />
            <div className="loading-shimmer h-8 w-32 rounded-lg" />
            <div className="loading-shimmer h-16 w-full rounded-xl" />
            <div className="loading-shimmer h-12 w-full rounded-full" />
          </div>
        </div>
      </Container>
    </div>
  );
}
