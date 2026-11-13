import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailSkeleton } from "@/components/product/product-detail-skeleton";
import { ProductDetailView } from "@/components/product/product-detail";
import { getProduct, getRelatedProducts } from "@/lib/catalog";
import type { Product } from "@/types/catalog";

type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProduct(productId);
  if (!product) return { title: "Product not found | FreshCart" };

  const description = product.description.replace(/\s+/g, " ").trim().slice(0, 160);
  return {
    title: `${product.title} | FreshCart`,
    description: description || `Buy ${product.title} on FreshCart.`,
  };
}

export default function Page({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductRoute params={params} />
    </Suspense>
  );
}

async function ProductRoute({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = await getProduct(productId);
  if (!product) notFound();

  let related: Product[] = [];
  try {
    related = await getRelatedProducts(product._id, product.category._id);
  } catch {
    related = [];
  }

  return <ProductDetailView product={product} related={related} />;
}
