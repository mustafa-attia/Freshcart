import type { Product } from "@/types/catalog";

const egpFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const egpExact = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEgp(amount: number) {
  return `EGP ${egpFormat.format(amount)}`;
}

export function formatEgpAmount(amount: number, decimals = false) {
  return `${(decimals ? egpExact : egpFormat).format(amount)} EGP`;
}

export type ProductSpec = {
  label: string;
  value: string;
};

export function describeProduct(description: string): { prose: string; specs: ProductSpec[] } {
  const normalized = description.replace(/\r\n/g, "\n").trim();
  if (!normalized) return { prose: "", specs: [] };

  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const specs = lines.flatMap((line) => {
    const [label, ...rest] = line
      .split("\t")
      .map((part) => part.trim())
      .filter(Boolean);
    if (!label || rest.length === 0) return [];
    return [{ label, value: rest.join(" ") }];
  });

  if (lines.length > 0 && specs.length === lines.length) {
    return { prose: "", specs };
  }

  return {
    prose: normalized.replace(/[ \t]+\n/g, "\n").replace(/[ \t]{2,}/g, " "),
    specs: [],
  };
}

export function galleryImages(product: Product) {
  return [...new Set([product.imageCover, ...product.images].filter(Boolean))];
}

export function isOnSale(product: Product) {
  return (
    product.priceAfterDiscount != null &&
    product.priceAfterDiscount > 0 &&
    product.priceAfterDiscount < product.price
  );
}

export function salePrice(product: Product) {
  return isOnSale(product) ? (product.priceAfterDiscount as number) : product.price;
}

export function discountPercent(product: Product) {
  if (!isOnSale(product) || product.priceAfterDiscount == null) return null;
  const percent = Math.round(
    ((product.price - product.priceAfterDiscount) / product.price) * 100,
  );
  return percent > 0 ? percent : null;
}
