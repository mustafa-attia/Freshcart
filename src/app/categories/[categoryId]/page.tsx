import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getProducts } from "@/lib/catalog";
import { StorePage } from "@/components/storefront/store-components";
import { CatalogListing } from "@/components/storefront/catalog-listing";

type Props = {
  params: Promise<{ categoryId: string }>;
};

export default function CategoryPage({ params }: Props) {
  return (
    <Suspense fallback={<StorePage title="Loading category..."><p>Loading products...</p></StorePage>}>
      <CategoryRoute params={params} />
    </Suspense>
  );
}

async function CategoryRoute({ params }: Props) {
  const { categoryId } = await params;
  const [category, categories, allProducts] = await Promise.all([
    getCategory(categoryId),
    getCategories(),
    getProducts(),
  ]);
  const selected = category ?? categories.find((item) => item._id === categoryId) ?? null;
  if (!selected) notFound();
  const products = allProducts.filter((product) => product.category._id === selected._id);
  return (
    <StorePage eyebrow="Category" title={selected.name} description={`Products in ${selected.name}.`}>
      <CatalogListing products={products} />
    </StorePage>
  );
}
