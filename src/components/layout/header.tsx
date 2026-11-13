"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToTop } from "@/lib/scroll";
import {
  FREE_SHIPPING_NOTE,
  SUPPORT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_TEL,
} from "@/lib/store-info";
import { Container } from "./container";
import { Logo } from "./logo";
import { focusRing } from "@/lib/styles";
import Link from "next/link";
import { useStore } from "@/components/storefront/store-provider";

const iconButtonClass = cn(
  "relative flex size-10 items-center justify-center rounded-full border border-line bg-white/70 text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-fresh/40 hover:bg-mint",
  focusRing,
);

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const { cartCount, wishlistCount, user, signOut } = useStore();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)");
    const closeIfDesktop = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener("change", closeIfDesktop);
    return () => media.removeEventListener("change", closeIfDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    menuRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  function goHome() {
    setMenuOpen(false);
    scrollToTop();
  }

  const links = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Brands", href: "/brands" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-background/90 shadow-[0_8px_28px_rgba(23,58,53,0.04)] backdrop-blur-xl">
      <div className="bg-ink text-xs tracking-wide text-white/85">
        <Container className="flex h-9 items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-2 truncate"><span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#e5bd7c]" />{FREE_SHIPPING_NOTE}</p>
          <div className="hidden shrink-0 items-center gap-4 text-white/70 sm:flex">
            <a
              className={cn("transition-colors hover:text-white", focusRing)}
              href={`tel:${SUPPORT_PHONE_TEL}`}
            >
              {SUPPORT_PHONE_DISPLAY}
            </a>
            <a
              className={cn("transition-colors hover:text-white", focusRing)}
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </Container>
      </div>

      <Container className="py-3.5">
        <div className="flex items-center gap-3 lg:gap-5">
          <Link
            href="/"
            className={cn("shrink-0 rounded-lg", focusRing)}
            aria-label="FreshCart home"
            onClick={goHome}
          >
            <Logo />
          </Link>

          <nav
            aria-label="Main"
            className="ml-auto hidden items-center gap-1 rounded-full bg-white/70 p-1 lg:flex"
          >
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.label}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-copy transition-colors hover:bg-mint hover:text-navy",
                  focusRing,
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <HeaderIcon href="/wishlist" label="Wishlist" count={wishlistCount}>
              <Heart className="size-5" aria-hidden="true" />
            </HeaderIcon>
            <HeaderIcon href="/cart" label="Cart" count={cartCount}>
              <ShoppingBag className="size-5" aria-hidden="true" />
            </HeaderIcon>
            <Link
              href={user ? "/profile" : "/login"}
              className={cn("hidden rounded-full px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-mint lg:block", focusRing)}
            >
              {user ? "My account" : "Login"}
            </Link>
            {user ? (
              <button
                type="button"
                className={cn("hidden rounded-full px-3 py-2 text-sm text-copy transition-colors hover:text-navy lg:block", focusRing)}
                onClick={signOut}
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/signup"
                className={cn("hidden rounded-full bg-fresh px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(23,107,91,0.2)] transition-all hover:-translate-y-0.5 hover:bg-fresh-dark lg:block", focusRing)}
              >
                Sign up
              </Link>
            )}
          </div>

          <button
            type="button"
            className={cn(iconButtonClass, "lg:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
          </button>
        </div>

        <nav
          id="mobile-nav"
          ref={menuRef}
          aria-label="Mobile"
          hidden={!menuOpen}
          className="mt-3 rounded-2xl border border-line bg-white p-3 shadow-xl lg:hidden"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    "block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-navy transition-colors hover:bg-mint hover:text-fresh",
                    focusRing,
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={user ? "/profile" : "/login"}
                className={cn("block py-2 text-sm font-medium text-navy", focusRing)}
                onClick={() => setMenuOpen(false)}
              >
                {user ? `Hello, ${user.name}` : "Login"}
              </Link>
            </li>
            {user ? (
              <li>
                <button
                  type="button"
                  className={cn("py-2 text-sm text-copy", focusRing)}
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                >
                  Sign out
                </button>
              </li>
            ) : (
              <li>
                <Link
                  href="/signup"
                  className={cn("block py-2 text-sm font-medium text-fresh", focusRing)}
                  onClick={() => setMenuOpen(false)}
                >
                  Create account
                </Link>
              </li>
            )}
            <li className="sm:hidden">
              <a
                className={cn("block py-2 text-sm text-copy", focusRing)}
                href={`tel:${SUPPORT_PHONE_TEL}`}
              >
                {SUPPORT_PHONE_DISPLAY}
              </a>
            </li>
            <li className="sm:hidden">
              <a
                className={cn("block py-2 text-sm text-copy", focusRing)}
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}

function HeaderIcon({
  href,
  label,
  count,
  children,
}: {
  href: string;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(iconButtonClass, "size-9")}
      aria-label={count ? `${label}, ${count} items` : label}
    >
      {children}
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-fresh px-1 text-[10px] leading-4 text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
