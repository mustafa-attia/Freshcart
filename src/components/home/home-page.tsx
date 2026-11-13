import { Suspense } from "react";
import { CategoryGrid } from "./category-grid";
import { HeroCarousel } from "./hero-carousel";
import { CategoryGridSkeleton, ProductGridSkeleton } from "./home-skeleton";
import { NewsletterSection } from "./newsletter-section";
import { ProductGrid } from "./product-grid";
import { PromoBanners } from "./promo-banners";
import { ServiceBenefits } from "./service-benefits";

export function HomePage() {
  return (
    <>
      <HeroCarousel />
      <ServiceBenefits />
      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoryGrid />
      </Suspense>
      <PromoBanners />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
      <NewsletterSection />
    </>
  );
}
