import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategories } from "@/lib/catalog";
import { StorePage } from "@/components/storefront/store-components";
import { CatalogImage } from "@/components/home/catalog-image";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/styles";

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <StorePage eyebrow="Browse the catalog" title="Categories" description="Choose a category to explore its products.">
      <ul className="catalog-grid grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {categories.map((category) => (
          <li key={category._id}>
            <Link href={`/categories/${category._id}`} className={cn("surface-card group flex h-full flex-col overflow-hidden rounded-2xl border border-line transition-all duration-300 hover:-translate-y-1 hover:border-fresh/40 hover:shadow-[0_20px_44px_rgba(23,58,53,0.1)]", focusRing)}>
              <span className="relative aspect-[1.25] w-full overflow-hidden bg-[#f1eee5]">
                <CatalogImage src={category.image} alt="" sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </span>
              <span className="flex min-h-14 items-center justify-between gap-2 px-4 py-3 font-heading text-base font-semibold text-navy transition-colors group-hover:text-fresh sm:px-5 sm:text-lg">
                {category.name}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-[#c89555]" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </StorePage>
  );
}
