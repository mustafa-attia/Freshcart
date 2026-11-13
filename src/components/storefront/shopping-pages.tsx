"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { apiRequest, unwrapApiData } from "@/lib/api";
import { formatEgpAmount, salePrice } from "@/lib/product";
import type { Product } from "@/types/catalog";
import { CatalogImage } from "@/components/home/catalog-image";
import { useStore } from "./store-provider";
import { EmptyState, Notice, StorePage } from "./store-components";

type LineItem = { product: Product; count: number; unitPrice: number };

function object(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : null;
}

function priceValue(value: unknown): number | null {
  const price = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(price) && price >= 0 ? price : null;
}

function toProduct(value: unknown, line: Record<string, unknown>): Product | null {
  const raw = object(value);
  if (!raw) return null;
  const id = raw._id ?? raw.id ?? line.productId ?? line.product;
  const title = raw.title ?? raw.name ?? line.productName;
  if (typeof id !== "string" || typeof title !== "string") return null;
  const category = object(raw.category);
  const brand = object(raw.brand);
  const price = priceValue(raw.price) ?? priceValue(line.price) ?? priceValue(line.priceAfterDiscount) ?? 0;
  const priceAfterDiscount = priceValue(raw.priceAfterDiscount) ?? priceValue(line.priceAfterDiscount);
  const images = Array.isArray(raw.images)
    ? raw.images.filter((image): image is string => typeof image === "string")
    : [];
  const imageCover = typeof raw.imageCover === "string"
    ? raw.imageCover
    : typeof raw.image === "string"
      ? raw.image
      : images[0] ?? "";
  return {
    _id: id,
    title,
    slug: typeof raw.slug === "string" ? raw.slug : "",
    description: typeof raw.description === "string" ? raw.description : "",
    quantity: typeof raw.quantity === "number" ? raw.quantity : 0,
    price,
    priceAfterDiscount: priceAfterDiscount ?? undefined,
    imageCover,
    images,
    category: {
      _id: typeof category?._id === "string" ? category._id : "",
      name: typeof category?.name === "string" ? category.name : "General",
      slug: typeof category?.slug === "string" ? category.slug : "",
      image: typeof category?.image === "string" ? category.image : "",
    },
    brand: {
      _id: typeof brand?._id === "string" ? brand._id : "",
      name: typeof brand?.name === "string" ? brand.name : "",
      slug: typeof brand?.slug === "string" ? brand.slug : "",
      image: typeof brand?.image === "string" ? brand.image : "",
    },
    ratingsAverage: typeof raw.ratingsAverage === "number" ? raw.ratingsAverage : 0,
    ratingsQuantity: typeof raw.ratingsQuantity === "number" ? raw.ratingsQuantity : 0,
    sold: typeof raw.sold === "number" ? raw.sold : 0,
  };
}

function toLineItems(data: unknown): LineItem[] {
  const unwrapped = unwrapApiData(data);
  const root = object(unwrapped);
  const container = object(root?.cart) ?? object(root?.wishlist) ?? root;
  const rawItems = Array.isArray(unwrapped)
    ? unwrapped
    : Array.isArray(container?.products)
      ? container.products
      : Array.isArray(root?.items)
        ? root.items
        : [];
  const items = rawItems.flatMap((entry) => {
    const line = object(entry);
    if (!line) return [];
    const product = toProduct(object(line.product) ?? line, line);
    if (!product) return [];
    const count = typeof line.count === "number" && line.count > 0
      ? line.count
      : typeof line.quantity === "number" && line.quantity > 0
        ? line.quantity
        : 1;
    const unitPrice = priceValue(line.price) ?? salePrice(product);
    return [{ product, count, unitPrice }];
  });
  if (rawItems.length > 0 && items.length === 0) {
    throw new Error("The cart contains items that could not be displayed. Please reload or try again.");
  }
  return items;
}

export function ShoppingPage({ mode }: { mode: "cart" | "wishlist" }) {
  const { user, refreshCounts } = useStore();
  const router = useRouter();
  const [items, setItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<unknown>(mode === "cart" ? "/cart" : "/wishlist");
      setItems(toLineItems(result));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load your items.");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    apiRequest<unknown>(mode === "cart" ? "/cart" : "/wishlist")
      .then((result) => {
        if (active) {
          setItems(toLineItems(result));
          setError(null);
        }
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Could not load your items.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user, mode]);

  async function update(productId: string, count?: number) {
    setPendingId(productId);
    setError(null);
    try {
      if (count === undefined) {
        await apiRequest(`/${mode}/${productId}`, { method: "DELETE" });
      } else {
        await apiRequest(`/cart/${productId}`, { method: "PUT", body: { count } });
      }
      await Promise.all([load(), refreshCounts()]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update your items.");
    } finally {
      setPendingId(null);
    }
  }

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.count, 0);

  return (
    <StorePage
      eyebrow="Your FreshCart"
      title={mode === "cart" ? "Shopping cart" : "Your wishlist"}
      description={mode === "cart" ? "Review quantities and continue to secure checkout." : "Your saved products, all in one place."}
    >
      {!user ? (
        <Notice tone="neutral">
          Please <Link className="font-semibold text-fresh underline" href="/login">sign in</Link> to view your {mode}.
        </Notice>
      ) : loading ? (
        <p className="py-12 text-center text-sm text-copy">Loading {mode}...</p>
      ) : error ? (
        <Notice tone="error">{error}</Notice>
      ) : items.length === 0 ? (
        <EmptyState
          title={mode === "cart" ? "Your cart is empty" : "Your wishlist is empty"}
          detail={mode === "cart" ? "Browse the catalog and add something you love." : "Save products to find them here later."}
          href="/products"
          linkText="Browse products"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <ul className="surface-card divide-y divide-line rounded-2xl border border-line/80 shadow-[0_12px_36px_rgba(23,58,53,0.05)]">
            {items.map(({ product, count, unitPrice }) => (
              <li key={product._id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap sm:p-5">
                <Link href={`/product/${product._id}`} className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-[#f1eee5]">
                  <CatalogImage src={product.imageCover} alt={product.title} sizes="80px" className="p-2" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${product._id}`} className="line-clamp-2 font-semibold text-navy hover:text-fresh">
                    {product.title}
                  </Link>
                  <p className="mt-1 text-sm text-fresh">{formatEgpAmount(unitPrice)}</p>
                </div>
                {mode === "cart" ? (
                  <div className="flex h-10 items-center rounded-full border border-line bg-white">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={pendingId === product._id || count <= 1}
                      className="grid size-9 place-items-center rounded-full transition-colors hover:bg-mint disabled:opacity-40"
                      onClick={() => void update(product._id, count - 1)}
                    ><Minus className="size-4" /></button>
                    <span className="min-w-8 text-center text-sm">{count}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={pendingId === product._id || (product.quantity > 0 && count >= product.quantity)}
                      className="grid size-9 place-items-center rounded-full transition-colors hover:bg-mint disabled:opacity-40"
                      onClick={() => void update(product._id, count + 1)}
                    ><Plus className="size-4" /></button>
                  </div>
                ) : null}
                <button
                  type="button"
                  aria-label={mode === "cart" ? "Remove from cart" : "Remove from wishlist"}
                  disabled={pendingId === product._id}
                  className="grid size-9 place-items-center rounded-md text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                  onClick={() => void update(product._id)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          {mode === "cart" ? (
            <aside className="surface-card h-fit rounded-2xl border border-line p-5 shadow-[0_12px_36px_rgba(23,58,53,0.05)]">
              <h2 className="font-heading text-2xl font-medium">Order summary</h2>
              <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
                <span>Subtotal</span><strong>{formatEgpAmount(total, true)}</strong>
              </div>
              <p className="mt-2 text-xs text-copy">Shipping and taxes are calculated at checkout.</p>
              <button
                type="button"
                className="mt-5 h-12 w-full rounded-full bg-fresh px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(23,107,91,0.18)] transition-all hover:-translate-y-0.5 hover:bg-fresh-dark"
                onClick={() => router.push("/checkout")}
              >
                Continue to checkout
              </button>
            </aside>
          ) : null}
        </div>
      )}
    </StorePage>
  );
}

type OrderRecord = {
  _id?: string;
  createdAt?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  paymentMethodType?: string;
  totalOrderPrice?: number;
  status?: string;
};

function ordersFrom(data: unknown): OrderRecord[] {
  const root = object(data);
  const list = Array.isArray(data) ? data : Array.isArray(root?.orders) ? root.orders : [];
  return list.flatMap((entry) => {
    const order = object(entry);
    if (!order) return [];
    return [{
      _id: typeof order._id === "string" ? order._id : undefined,
      createdAt: typeof order.createdAt === "string" ? order.createdAt : undefined,
      isPaid: typeof order.isPaid === "boolean" ? order.isPaid : undefined,
      isDelivered: typeof order.isDelivered === "boolean" ? order.isDelivered : undefined,
      paymentMethodType: typeof order.paymentMethodType === "string" ? order.paymentMethodType : undefined,
      totalOrderPrice: typeof order.totalOrderPrice === "number" ? order.totalOrderPrice : undefined,
      status: typeof order.status === "string" ? order.status : undefined,
    }];
  });
}

export function OrdersPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    let active = true;
    apiRequest<unknown>(`/orders/user/${encodeURIComponent(user._id)}`)
      .then((response) => {
        if (active) setOrders(ordersFrom(unwrapApiData(response)));
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Could not load orders.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user]);

  return (
    <StorePage eyebrow="Your account" title="Orders" description="Review your recent purchases and payment status.">
      {!user ? (
        <Notice>Please <Link className="font-semibold text-fresh underline" href="/login">sign in</Link> to view your orders.</Notice>
      ) : loading ? (
        <p className="py-12 text-center text-sm text-copy">Loading orders...</p>
      ) : error ? (
        <Notice tone="error">{error}</Notice>
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" detail="Your completed purchases will appear here." href="/products" linkText="Start shopping" />
      ) : (
        <ul className="space-y-3">
          {orders.map((order, index) => (
            <li key={order._id ?? index} className="surface-card rounded-2xl border border-line p-5 shadow-[0_12px_36px_rgba(23,58,53,0.05)] sm:p-6">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-heading text-xl font-semibold">Order {order._id ? `#${order._id.slice(-8)}` : `#${index + 1}`}</h2>
                  <p className="mt-1 text-sm text-copy">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Date unavailable"}</p>
                </div>
                {order.totalOrderPrice != null ? <strong className="text-fresh">{formatEgpAmount(order.totalOrderPrice, true)}</strong> : null}
              </div>
              <p className="mt-3 text-sm text-copy">
                Payment: {order.paymentMethodType ?? "Unknown"} · {order.isPaid ? "Paid" : "Payment pending"} · {order.isDelivered ? "Delivered" : "Not delivered"}
                {order.status ? ` · ${order.status}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </StorePage>
  );
}

export function CheckoutPage() {
  const { user, refreshCounts } = useStore();
  const [items, setItems] = useState<LineItem[]>([]);
  const [cartId, setCartId] = useState("");
  const [payment, setPayment] = useState<"cash" | "online">("cash");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }
    apiRequest<unknown>("/cart")
      .then((response) => {
        const data = object(unwrapApiData(response));
        const cart = object(data?.cart) ?? data;
        setCartId(typeof cart?._id === "string" ? cart._id : "");
        setItems(toLineItems(response));
      })
      .catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Could not load cart."))
      .finally(() => setLoading(false));
  }, [user]);

  async function placeOrder(form: FormEvent<HTMLFormElement>) {
    form.preventDefault();
    if (!cartId) {
      setMessage("Your cart has no checkout id. Please reload your cart and try again.");
      return;
    }
    setMessage(null);
    const formData = new FormData(form.currentTarget);
    const shippingAddress = {
      details: String(formData.get("details") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
    };
    if (Object.values(shippingAddress).some((value) => !value)) {
      setMessage("Enter your delivery details, phone number, and city.");
      return;
    }

    setPending(true);
    try {
      if (payment === "cash") {
        await apiRequest(`/orders/${cartId}`, { method: "POST", body: { shippingAddress } });
        await refreshCounts();
        router.push("/orders");
      } else {
        const checkoutUrl = new URLSearchParams({ url: window.location.origin });
        const result = await apiRequest<unknown>(
          `/orders/checkout-session/${encodeURIComponent(cartId)}?${checkoutUrl}`,
          { method: "POST", body: { shippingAddress } },
        );
        const data = object(unwrapApiData(result)) ?? object(result);
        const session = object(data?.session);
        const url = typeof session?.url === "string" ? session.url : typeof data?.url === "string" ? data.url : null;
        if (!url) throw new Error("The payment session did not include a redirect URL.");
        const redirect = new URL(url);
        if (redirect.protocol !== "https:" && redirect.protocol !== "http:") {
          throw new Error("The payment session returned an invalid redirect URL.");
        }
        window.location.assign(redirect.toString());
      }
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Could not place your order.");
    } finally {
      setPending(false);
    }
  }

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.count, 0);

  return (
    <StorePage eyebrow="Checkout" title="Delivery and payment" description="Enter your delivery details and choose how to pay.">
      {!user ? (
        <Notice>Please <Link className="font-semibold text-fresh underline" href="/login">sign in</Link> before checking out.</Notice>
      ) : loading ? (
        <p className="py-12 text-center text-sm text-copy">Loading checkout...</p>
      ) : items.length === 0 ? (
        <EmptyState title="Your cart is empty" detail="Add products before starting checkout." href="/products" linkText="Browse products" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <form className="surface-card flex flex-col gap-4 rounded-2xl border border-line p-5 shadow-[0_12px_36px_rgba(23,58,53,0.05)] sm:p-6" onSubmit={(event) => void placeOrder(event)}>
            <h2 className="font-heading text-2xl font-medium">Shipping address</h2>
            <FormInput label="Delivery details" name="details" autoComplete="address-line1" />
            <FormInput label="Phone number" name="phone" type="tel" autoComplete="tel" defaultValue={user.phone ?? ""} />
            <FormInput label="City" name="city" autoComplete="address-level2" />
            <fieldset className="mt-2">
              <legend className="text-sm font-semibold">Payment method</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm transition-colors has-[:checked]:border-fresh has-[:checked]:bg-mint/60"><input className="accent-fresh" type="radio" name="payment" checked={payment === "cash"} onChange={() => setPayment("cash")} /> Cash on delivery</label>
                <label className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm transition-colors has-[:checked]:border-fresh has-[:checked]:bg-mint/60"><input className="accent-fresh" type="radio" name="payment" checked={payment === "online"} onChange={() => setPayment("online")} /> Pay online</label>
              </div>
            </fieldset>
            {message ? <Notice tone="error">{message}</Notice> : null}
            <button type="submit" disabled={pending} className="h-12 rounded-full bg-fresh px-6 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(23,107,91,0.18)] transition-all hover:-translate-y-0.5 hover:bg-fresh-dark disabled:opacity-60">
              {pending ? "Processing..." : payment === "cash" ? "Place cash order" : "Continue to online payment"}
            </button>
          </form>
          <aside className="surface-card h-fit rounded-2xl border border-line p-5 shadow-[0_12px_36px_rgba(23,58,53,0.05)] sm:p-6">
            <h2 className="font-heading text-2xl font-medium">Order summary</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map(({ product, count, unitPrice }) => (
                <li key={product._id} className="flex justify-between gap-3">
                  <span className="line-clamp-2">{product.title} × {count}</span>
                  <span className="shrink-0">{formatEgpAmount(unitPrice * count)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-line pt-4">
              <span>Total</span><strong>{formatEgpAmount(total, true)}</strong>
            </div>
          </aside>
        </div>
      )}
    </StorePage>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
      {label}
      <input
        className="h-12 rounded-xl border border-line bg-[#faf8f3] px-4 font-normal outline-none transition focus:border-fresh focus:bg-white focus:ring-4 focus:ring-fresh/10"
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required
      />
    </label>
  );
}
