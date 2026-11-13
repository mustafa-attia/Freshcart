import { cacheLife, cacheTag } from "next/cache";
import type {
  CatalogResult,
  Brand,
  Category,
  Product,
  ProductDetail,
  Review,
  Subcategory,
} from "@/types/catalog";

const CATALOG_API = "https://ecommerce.routemisr.com/api/v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function parseCategory(value: unknown): Category | null {
  if (!isRecord(value)) return null;
  const id = asString(value._id);
  const name = asString(value.name);
  if (!id || !name) return null;
  return {
    _id: id,
    name,
    slug: asString(value.slug),
    image: asString(value.image),
  };
}

function parseBrand(value: unknown) {
  if (!isRecord(value) || !asString(value.name)) {
    return { _id: "unknown", name: "FreshCart", slug: "freshcart", image: "" };
  }
  return {
    _id: asString(value._id, "unknown"),
    name: asString(value.name),
    slug: asString(value.slug),
    image: asString(value.image),
  };
}

function parseListedBrand(value: unknown): Brand | null {
  if (!isRecord(value)) return null;
  const id = asString(value._id);
  const name = asString(value.name);
  if (!id || !name) return null;
  return {
    _id: id,
    name,
    slug: asString(value.slug),
    image: asString(value.image),
  };
}

function parseProduct(value: unknown): Product | null {
  if (!isRecord(value) || typeof value.price !== "number") return null;
  const category = parseCategory(value.category);
  const id = asString(value._id);
  const title = asString(value.title);
  const imageCover = asString(value.imageCover);
  if (!category || !id || !title || !imageCover) return null;

  const sale =
    typeof value.priceAfterDiscount === "number" ? value.priceAfterDiscount : undefined;
  const onSale = sale != null && sale > 0 && sale < value.price;
  const images = Array.isArray(value.images)
    ? value.images.filter((item): item is string => typeof item === "string")
    : [];

  return {
    _id: id,
    title,
    slug: asString(value.slug),
    description: asString(value.description).replace(/\s+/g, " ").trim().slice(0, 500),
    quantity: typeof value.quantity === "number" ? value.quantity : 0,
    price: value.price,
    priceAfterDiscount: onSale ? sale : undefined,
    imageCover,
    images,
    category,
    brand: parseBrand(value.brand),
    ratingsAverage: typeof value.ratingsAverage === "number" ? value.ratingsAverage : 0,
    ratingsQuantity: typeof value.ratingsQuantity === "number" ? value.ratingsQuantity : 0,
    sold: typeof value.sold === "number" ? value.sold : 0,
  };
}

function readData(body: unknown) {
  if (!isRecord(body) || !Array.isArray(body.data)) {
    throw new Error("Catalog response was not a list");
  }
  return body.data;
}

async function fetchJson(path: string) {
  const response = await fetch(`${CATALOG_API}${path}`);
  if (!response.ok) {
    throw new Error(`Catalog request failed (${response.status})`);
  }
  return response.json() as Promise<unknown>;
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const first = await fetchJson("/products?limit=40&page=1");
  const metadata =
    isRecord(first) && isRecord(first.metadata) ? first.metadata : null;
  const pageCount =
    typeof metadata?.numberOfPages === "number" && metadata.numberOfPages > 0
      ? metadata.numberOfPages
      : 2;
  const remaining = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      fetchJson(`/products?limit=40&page=${index + 2}`),
    ),
  );
  const products = [first, ...remaining]
    .flatMap(readData)
    .map(parseProduct)
    .filter((product): product is Product => product !== null);

  const unique = new Map<string, Product>();
  for (const product of products) unique.set(product._id, product);
  const list = [...unique.values()];
  if (list.length === 0) throw new Error("Product catalog was empty");
  return list;
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  const body = await fetchJson("/categories");
  const categories = readData(body)
    .map(parseCategory)
    .filter((category): category is Category => category !== null);

  if (categories.length === 0) throw new Error("Category catalog was empty");
  return categories;
}

export async function getBrands(): Promise<Brand[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("brands");

  const body = await fetchJson("/brands");
  const brands = readData(body)
    .map(parseListedBrand)
    .filter((brand): brand is Brand => brand !== null);
  if (brands.length === 0) throw new Error("Brand catalog was empty");
  return brands;
}

export async function getCategory(id: string): Promise<Category | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories", `category:${id}`);

  if (!PRODUCT_ID.test(id)) return null;
  const body = await fetchJson(`/categories/${id}`);
  return parseCategory(isRecord(body) ? body.data : null);
}

export async function getBrand(id: string): Promise<Brand | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("brands", `brand:${id}`);

  if (!PRODUCT_ID.test(id)) return null;
  const body = await fetchJson(`/brands/${id}`);
  return parseListedBrand(isRecord(body) ? body.data : null);
}

export async function loadProducts(): Promise<CatalogResult<Product>> {
  try {
    return { items: await getProducts(), error: null };
  } catch {
    return {
      items: [],
      error: "We could not load products. Check the connection and try again.",
    };
  }
}

const PRODUCT_ID = /^[a-f\d]{24}$/i;

function parseSubcategories(value: unknown): Subcategory[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const id = asString(item._id);
    const name = asString(item.name);
    if (!id || !name) return [];
    return [{ _id: id, name, slug: asString(item.slug) }];
  });
}

function parseReviews(value: unknown): Review[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const id = asString(item._id);
    if (!id) return [];
    const user = isRecord(item.user) ? item.user : null;
    return [
      {
        _id: id,
        review: asString(item.review).trim(),
        rating: typeof item.rating === "number" ? item.rating : 0,
        userName: user ? asString(user.name, "Customer") : "Customer",
        createdAt: asString(item.createdAt),
      },
    ];
  });
}

function parseProductDetail(value: unknown): ProductDetail | null {
  const product = parseProduct(value);
  if (!product || !isRecord(value)) return null;
  return {
    ...product,
    description: asString(value.description).trim(),
    subcategory: parseSubcategories(value.subcategory),
    reviews: parseReviews(value.reviews).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

export async function getProduct(id: string): Promise<ProductDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${id}`);

  if (!PRODUCT_ID.test(id)) return null;

  const response = await fetch(`${CATALOG_API}/products/${id}`);
  if (response.status === 400 || response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Product request failed (${response.status})`);
  }

  const body = (await response.json()) as unknown;
  return parseProductDetail(isRecord(body) ? body.data : null);
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  const products = await getProducts();
  const others = products.filter((item) => item._id !== productId);
  const sameCategory = others.filter((item) => item.category._id === categoryId);
  const rest = others.filter((item) => item.category._id !== categoryId);
  return [...sameCategory, ...rest].slice(0, 12);
}

export async function loadCategories(): Promise<CatalogResult<Category>> {
  try {
    return { items: await getCategories(), error: null };
  } catch {
    return {
      items: [],
      error: "We could not load categories. Check the connection and try again.",
    };
  }
}

export async function loadBrands(): Promise<CatalogResult<Brand>> {
  try {
    return { items: await getBrands(), error: null };
  } catch {
    return {
      items: [],
      error: "We could not load brands. Check the connection and try again.",
    };
  }
}
