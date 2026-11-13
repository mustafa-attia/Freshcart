"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { ApiError, apiRequest, getToken, saveToken, unwrapApiData } from "@/lib/api";
import type { StoreUser } from "@/types/catalog";

type ToastTone = "success" | "error" | "info";
type ToastAction = { href: string; label: string };
type ToastMessage = {
  id: number;
  message: string;
  tone: ToastTone;
  action?: ToastAction;
};

type StoreContextValue = {
  user: StoreUser | null;
  cartCount: number;
  wishlistCount: number;
  setSession: (token: string, user: StoreUser) => void;
  updateUser: (user: StoreUser) => void;
  notify: (message: string, tone?: ToastTone, action?: ToastAction) => void;
  signOut: () => void;
  refreshCounts: () => Promise<void>;
};

const StoreContext = createContext<StoreContextValue | null>(null);
let nextToastId = 0;

function ToastViewport({
  toasts,
  dismiss,
}: {
  toasts: ToastMessage[];
  dismiss: (id: number) => void;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:top-6 sm:items-end"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon = toast.tone === "success" ? CheckCircle2 : toast.tone === "error" ? AlertCircle : Info;
        return (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className="pointer-events-auto flex w-full max-w-sm animate-rise-in items-start gap-3 rounded-2xl border border-line bg-white p-4 text-navy shadow-[0_20px_55px_rgba(16,47,43,0.2)]"
          >
            <Icon
              aria-hidden="true"
              className={toast.tone === "success" ? "mt-0.5 size-5 shrink-0 text-fresh" : toast.tone === "error" ? "mt-0.5 size-5 shrink-0 text-[#a34c3a]" : "mt-0.5 size-5 shrink-0 text-[#a8793e]"}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
              {toast.action ? (
                <Link
                  className="mt-1 inline-flex text-sm font-semibold text-fresh underline underline-offset-2"
                  href={toast.action.href}
                  onClick={() => dismiss(toast.id)}
                >
                  {toast.action.label}
                </Link>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-copy transition-colors hover:bg-mint hover:text-navy"
              onClick={() => dismiss(toast.id)}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ToastItemTimer({ id, dismiss }: { id: number; dismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(id), 5000);
    return () => window.clearTimeout(timer);
  }, [dismiss, id]);
  return null;
}

function countItems(value: unknown) {
  const data = unwrapApiData(value);
  if (!data || typeof data !== "object") return 0;
  const record = data as { products?: unknown };
  if (!Array.isArray(record.products)) return 0;
  return record.products.reduce((count, item) => {
    if (!item || typeof item !== "object") return count;
    const quantity = (item as { count?: unknown }).count;
    return count + (typeof quantity === "number" && quantity > 0 ? quantity : 1);
  }, 0);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoreUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((message: string, tone: ToastTone = "success", action?: ToastAction) => {
    const id = ++nextToastId;
    setToasts((current) => [...current.slice(-2), { id, message, tone, action }]);
  }, []);

  const refreshCounts = useCallback(async () => {
    if (!getToken()) {
      return;
    }

    const results = await Promise.allSettled([
      apiRequest<unknown>("/cart"),
      apiRequest<unknown>("/wishlist"),
    ]);
    const unauthorized = results.some(
      (result) => result.status === "rejected" &&
        result.reason instanceof ApiError &&
        result.reason.status === 401,
    );
    if (unauthorized) {
      saveToken(null);
      window.localStorage.removeItem("freshcart-user");
      setUser(null);
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    if (results[0].status === "fulfilled") {
      setCartCount(countItems(results[0].value));
    } else {
      console.error("Could not refresh the cart count.", results[0].reason);
    }
    if (results[1].status === "fulfilled") {
      setWishlistCount(countItems(results[1].value));
    } else {
      console.error("Could not refresh the wishlist count.", results[1].reason);
    }
  }, []);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("freshcart-user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as StoreUser;
        queueMicrotask(() => setUser(parsed));
      } catch {
        window.localStorage.removeItem("freshcart-user");
      }
    }
    const timer = window.setTimeout(() => void refreshCounts(), 0);
    return () => window.clearTimeout(timer);
  }, [refreshCounts]);

  const setSession = useCallback(
    (token: string, nextUser: StoreUser) => {
      saveToken(token);
      window.localStorage.setItem("freshcart-user", JSON.stringify(nextUser));
      setUser(nextUser);
      void refreshCounts();
    },
    [refreshCounts],
  );

  const updateUser = useCallback((nextUser: StoreUser) => {
    window.localStorage.setItem("freshcart-user", JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    saveToken(null);
    window.localStorage.removeItem("freshcart-user");
    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
  }, []);

  const value = useMemo(
    () => ({ user, cartCount, wishlistCount, setSession, updateUser, notify, signOut, refreshCounts }),
    [user, cartCount, wishlistCount, setSession, updateUser, notify, signOut, refreshCounts],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toasts.map((toast) => <ToastItemTimer key={toast.id} id={toast.id} dismiss={dismissToast} />)}
      <ToastViewport toasts={toasts} dismiss={dismissToast} />
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
