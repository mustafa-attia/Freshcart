"use client";

import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroll";
import { Container } from "@/components/layout/container";
import { focusRing } from "@/lib/styles";

export function PromoBanners() {
  return (
    <section aria-label="Promotional offers">
      <Container className="grid grid-cols-1 gap-4 pb-2 md:grid-cols-2">
        <PromoBanner
          eyebrow="Weekend deal"
          title="Fresh Organic Fruits"
          offer="40% OFF"
          detail="Crisp seasonal fruit, packed for the week."
          action="Shop Now"
          className="bg-gradient-to-br from-[#176b5b] to-[#102f2b]"
          onClick={() => scrollToSection("featured-products")}
        />
        <PromoBanner
          eyebrow="Fresh pick"
          title="Exotic Vegetables"
          offer="25% OFF"
          detail="Colorful produce for the next market run."
          action="Explore Now"
          className="bg-gradient-to-br from-[#c89555] to-[#9c6245]"
          onClick={() => scrollToSection("categories")}
        />
      </Container>
    </section>
  );
}

function PromoBanner({
  eyebrow,
  title,
  offer,
  detail,
  action,
  className,
  onClick,
}: {
  eyebrow: string;
  title: string;
  offer: string;
  detail: string;
  action: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <article className={cn("group relative min-h-64 overflow-hidden rounded-[1.5rem] p-7 text-white shadow-[0_18px_40px_rgba(16,47,43,0.13)] transition-transform duration-300 hover:-translate-y-1 sm:p-9", className)}>
      <span className="pointer-events-none absolute -top-16 -right-8 size-56 rounded-full border border-white/15 transition-transform duration-700 group-hover:scale-110" />
      <span className="pointer-events-none absolute -top-8 -right-1 size-40 rounded-full border border-white/15" />
      <p className="text-[10px] font-bold tracking-[0.2em] text-white/75 uppercase">{eyebrow}</p>
      <h3 className="mt-4 font-heading text-3xl font-medium sm:text-4xl">{title}</h3>
      <p className="mt-1 font-heading text-2xl italic text-[#f3d9aa]">{offer}</p>
      <p className="mt-2 max-w-xs text-sm text-white/80">{detail}</p>
      <button
        type="button"
        className={cn(
          "mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-[#f3d9aa]",
          focusRing,
        )}
        onClick={onClick}
      >
        {action}
      </button>
    </article>
  );
}
