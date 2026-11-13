"use client";

function motion(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: motion(), block: "start" });
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: motion() });
}
