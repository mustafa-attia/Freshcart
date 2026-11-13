"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroll";
import { focusRing, outlineLightButtonClass, whiteButtonClass } from "@/lib/styles";

const SLIDES = [
  {
    src: "/hero/produce-1.jpg",
    alt: "Refrigerated grocery shelves filled with lettuce, peppers, cucumbers, and squash",
    offer: "Free delivery on orders over EGP 500.",
  },
  {
    src: "/hero/produce-2.jpg",
    alt: "A market stall piled with tropical fruit, peppers, and root vegetables",
    offer: "Seasonal fruit and vegetables, packed the same day.",
  },
  {
    src: "/hero/produce-3.jpg",
    alt: "Fresh vegetables and fruit arranged around a wooden board",
    offer: "Browse categories and the live product catalog.",
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [paused]);

  function show(index: number) {
    setActive((index + SLIDES.length) % SLIDES.length);
  }

  function releasePause(event: React.FocusEvent<HTMLElement>) {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
      setPaused(false);
    }
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promotions"
      className="animate-rise-in relative mx-4 my-5 h-[31rem] overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_24px_70px_rgba(16,47,43,0.2)] sm:mx-6 sm:my-7 sm:h-[36rem] lg:mx-auto lg:max-w-[88rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={releasePause}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          show(active + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          show(active - 1);
        }
      }}
    >
      {SLIDES.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={index === active ? slide.alt : ""}
          fill
          priority={index === 0}
          sizes="100vw"
          className={cn(
            "object-cover motion-safe:transition-opacity motion-safe:duration-500",
            index === active ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={index === active ? undefined : true}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[#102f2b]/95 via-[#173a35]/70 to-[#173a35]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,transparent_5%,rgba(16,47,43,0.26)_70%)]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-page items-center px-8 sm:px-16 lg:px-20">
        <div className="max-w-2xl pb-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-[#e5bd7c]" /> A better kind of everyday
          </p>
          <h1 className="max-w-xl font-heading text-5xl font-medium leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
            The good things, brought to your door.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">{SLIDES[active].offer}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className={cn(whiteButtonClass, "h-12 px-6 shadow-lg transition-transform hover:-translate-y-0.5", focusRing)}
              onClick={() => scrollToSection("featured-products")}
            >
              Shop Now
            </button>
            <button
              type="button"
              className={cn(outlineLightButtonClass, "h-12 px-6 backdrop-blur-sm", focusRing)}
              onClick={() => scrollToSection("categories")}
            >
              Browse Categories
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={cn(
          "absolute top-1/2 left-4 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition hover:bg-white hover:text-navy sm:left-7",
          focusRing,
        )}
        aria-label="Previous slide"
        onClick={() => show(active - 1)}
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={cn(
          "absolute top-1/2 right-4 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition hover:bg-white hover:text-navy sm:right-7",
          focusRing,
        )}
        aria-label="Next slide"
        onClick={() => show(active + 1)}
      >
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>

      <div className="absolute right-8 bottom-7 z-10 flex gap-1.5 sm:right-14">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${index + 1} of ${SLIDES.length}`}
            aria-current={index === active ? "true" : undefined}
            className={cn(
              "h-2 rounded-full bg-white/70",
              index === active ? "w-6 bg-white" : "w-2",
              focusRing,
            )}
            onClick={() => show(index)}
          />
        ))}
      </div>
    </section>
  );
}
