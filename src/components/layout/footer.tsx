"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { scrollToTop } from "@/lib/scroll";
import { SUPPORT_EMAIL, SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/store-info";
import { Container } from "./container";
import { Logo } from "./logo";
import { focusRing } from "@/lib/styles";
import Link from "next/link";

const PAYMENTS = ["Visa", "Mastercard", "Meeza", "Cash"];

export function Footer() {
  const [socialNote, setSocialNote] = useState<string | null>(null);

  const shopLinks = [
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Brands", href: "/brands" },
    { label: "Cart", href: "/cart" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Orders", href: "/orders" },
    { label: "Change password", href: "/change-password" },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-[-5rem] size-96 rounded-full border border-white/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-[-2rem] size-80 rounded-full border border-white/10" />
      <Container className="relative py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="min-w-0">
            <button
              type="button"
              className={cn("rounded-lg", focusRing)}
              aria-label="FreshCart, back to top"
              onClick={() => scrollToTop()}
            >
              <Logo inverted />
            </button>
            <p className="mt-5 max-w-md font-heading text-2xl leading-snug text-white/90">
              FreshCart brings grocery offers together with fashion, electronics, and home products from the live catalog.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/65">
              <li>
                <a className={cn("hover:text-white", focusRing)} href={`tel:${SUPPORT_PHONE_TEL}`}>
                  {SUPPORT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a className={cn("hover:text-white", focusRing)} href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
              <SocialButton label="Facebook" onClick={() => setSocialNote("FreshCart social profiles are not published.")} />
              <SocialButton label="Instagram" onClick={() => setSocialNote("FreshCart social profiles are not published.")} />
              <SocialButton label="YouTube" onClick={() => setSocialNote("FreshCart social profiles are not published.")} />
            </div>
            {socialNote ? (
              <p className="mt-2 text-xs text-white/70" role="status">
                {socialNote}
              </p>
            ) : null}
          </div>

          <div className="min-w-0">
            <h2 className="font-heading text-2xl text-white">Explore</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={cn("text-sm text-white/65 transition-colors hover:text-[#e5bd7c]", focusRing)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">© 2026 FreshCart. Prices are shown in EGP from the live catalog.</p>
          <ul aria-label="Payment methods" className="flex flex-wrap gap-2">
            {PAYMENTS.map((method) => (
              <li
                key={method}
                className="rounded-md border border-white/15 px-2 py-1 text-xs font-medium text-white/80"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

function SocialButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex size-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white/80 hover:bg-white/10",
        focusRing,
      )}
      onClick={onClick}
    >
      {label.slice(0, 1)}
    </button>
  );
}
