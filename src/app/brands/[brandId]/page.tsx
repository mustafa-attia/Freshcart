import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getBrand, getBrands, getProducts } from "@/lib/catalog";
import { StorePage } from "@/components/storefront/store-components";
import { CatalogListing } from "@/components/storefront/catalog-listing";

type Props = {
  params: Promise<{ brandId: string }>;
};

export default function BrandPage({ params }: Props) {
  return (
    <Suspense fallback={<StorePage title="Loading brand..."><p>Loading products...</p></StorePage>}>
      <BrandRoute params={params} />
    </Suspense>
  );
}

async function BrandRoute({ params }: Props) {
  const { brandId } = await params;
  const [brand, brands, allProducts] = await Promise.all([
    getBrand(brandId),
    getBrands(),
    getProducts(),
  ]);
  const selected = brand ?? brands.find((item) => item._id === brandId) ?? null;
  if (!selected) notFound();
  const products = allProducts.filter((product) => product.brand._id === selected._id);
  return (
    <StorePage eyebrow="Brand" title={selected.name} description={`Products from ${selected.name}.`}>
      <CatalogListing products={products} />
    </StorePage>
  );
}
