import { getProducts } from "@/lib/catalog";
import { StorePage } from "@/components/storefront/store-components";
import { CatalogListing } from "@/components/storefront/catalog-listing";

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <StorePage
      eyebrow="FreshCart catalog"
      title="All products"
      description="Explore products across every category and brand."
    >
      <CatalogListing products={products} />
    </StorePage>
  );
}
