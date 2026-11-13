import { Container } from "@/components/layout/container";
import { loadCategories } from "@/lib/catalog";
import type { Category } from "@/types/catalog";
import { CatalogImage } from "./catalog-image";
import { RetryButton } from "./retry-button";
import { SectionHeading } from "./section-heading";
import Link from "next/link";

export async function CategoryGrid() {
  const { items, error } = await loadCategories();

  return (
    <section id="categories" className="scroll-mt-32 py-8 sm:py-10">
      <Container>
        <SectionHeading emphasis="Category">Shop by</SectionHeading>
        <CategoryList categories={items} error={error} />
      </Container>
    </section>
  );
}

function CategoryList({
  categories,
  error,
}: {
  categories: Category[];
  error: string | null;
}) {
  if (error) {
    return (
      <div className="rounded-lg border border-line bg-zinc-50 px-4 py-8 text-center">
        <p className="text-sm text-navy">{error}</p>
        <div className="mt-4 flex justify-center">
          <RetryButton />
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-lg border border-line px-4 py-8 text-center text-sm text-copy">
        No categories are available right now.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => (
        <li key={category._id} className="min-w-0">
          <Link
            href={`/categories/${category._id}`}
            className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-line/80 bg-white/80 px-2 py-5 text-center shadow-[0_8px_24px_rgba(23,58,53,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-fresh/40 hover:bg-white hover:shadow-[0_16px_34px_rgba(23,58,53,0.09)]"
          >
            <span className="relative size-16 overflow-hidden rounded-full border border-line bg-[#f1eee5] transition-transform duration-300 group-hover:scale-105">
              <CatalogImage
                src={category.image}
                alt=""
                sizes="64px"
                className="object-cover"
              />
            </span>
            <h3 className="line-clamp-2 text-xs font-semibold text-navy sm:text-sm">
              {category.name}
            </h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
