"use client";

import { useState } from "react";
import { Apple, Check, Mail, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { focusRing, primaryButtonClass } from "@/lib/styles";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PILLS = ["Weekly offers", "No spam", "Unsubscribe anytime"];

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [appNote, setAppNote] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setConfirmed(null);
      setError("Enter your email address.");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setConfirmed(null);
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setConfirmed(value);
  }

  return (
    <section id="newsletter" className="scroll-mt-24 py-8 sm:py-10" aria-labelledby="newsletter-heading">
      <Container>
        <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-[2rem] border border-line bg-[#e7eee6] p-5 sm:p-8 lg:grid-cols-2 lg:gap-8 lg:p-10">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-fresh uppercase">
              <span className="flex size-7 items-center justify-center rounded-full bg-white text-fresh">
                <Mail className="size-3.5" aria-hidden="true" />
              </span>
              Newsletter
            </p>
            <h2 id="newsletter-heading" className="mt-3 font-heading text-3xl font-medium leading-tight tracking-tight text-navy sm:text-4xl">
              A little goodness, <span className="italic text-fresh">delivered.</span>
            </h2>
            <p className="mt-2 max-w-md text-sm text-copy sm:text-base">
              Seasonal offers and new arrivals, kept for this browser only until a mailing service is connected.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {PILLS.map((pill) => (
                <li
                  key={pill}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-navy"
                >
                  <Check className="size-3 text-fresh" aria-hidden="true" />
                  {pill}
                </li>
              ))}
            </ul>
            <form className="mt-5" onSubmit={onSubmit} noValidate>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                  placeholder="Enter your email"
                  aria-invalid={error ? true : undefined}
                  aria-describedby="newsletter-note"
                  className="h-11 min-w-0 flex-1 rounded-full border border-line bg-white px-4 text-sm text-navy outline-none placeholder:text-copy focus-visible:border-fresh focus-visible:ring-2 focus-visible:ring-fresh/30"
                />
                <button type="submit" className={cn(primaryButtonClass, "h-11", focusRing)}>
                  Subscribe
                </button>
              </div>
              {error ? (
                <p className="mt-2 text-sm text-rose-700" role="alert">
                  {error}
                </p>
              ) : null}
              {confirmed ? (
                <p className="mt-2 text-sm text-fresh-dark" role="status">
                  Saved {confirmed} on this device. Nothing was sent to a server, so this is not a live subscription.
                </p>
              ) : null}
              <p id="newsletter-note" className="mt-3 text-xs text-copy">
                We only check the address in your browser. No mailing list is connected.
              </p>
            </form>
          </div>

          <div className="relative flex min-w-0 flex-col justify-center overflow-hidden rounded-[1.5rem] bg-ink p-6 text-white sm:p-8">
            <span aria-hidden="true" className="pointer-events-none absolute -right-12 -bottom-24 size-64 rounded-full border border-white/10" />
            <p className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
              Coming soon
            </p>
            <h3 className="mt-4 font-heading text-3xl font-medium">Shop faster, live better.</h3>
            <p className="mt-2 text-sm text-white/75">
              Browse deals and keep your cart on your phone. The FreshCart app is not available for download yet.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 text-sm font-medium hover:bg-white/15",
                  focusRing,
                )}
                onClick={() => setAppNote("The FreshCart app is not available for download.")}
              >
                <Apple className="size-4" aria-hidden="true" />
                App Store
              </button>
              <button
                type="button"
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 text-sm font-medium hover:bg-white/15",
                  focusRing,
                )}
                onClick={() => setAppNote("The FreshCart app is not available for download.")}
              >
                <Play className="size-4" aria-hidden="true" />
                Google Play
              </button>
            </div>
            {appNote ? (
              <p className="mt-3 text-sm text-white/80" role="status">
                {appNote}
              </p>
            ) : null}
            <p className="mt-4 flex items-center gap-1 text-sm text-white/70">
              <Star className="size-4 text-amber-300" aria-hidden="true" />
              Not yet rated
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
