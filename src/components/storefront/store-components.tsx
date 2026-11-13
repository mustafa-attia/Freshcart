import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function StorePage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Container className="py-9 sm:py-14">
      <header className="animate-rise-in mb-8 border-b border-line pb-6 sm:mb-10 sm:pb-8">
        {eyebrow ? (
          <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-fresh uppercase">
            <span aria-hidden="true" className="h-px w-7 bg-[#c89555]" />{eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 font-heading text-4xl font-medium tracking-tight text-navy sm:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-base leading-relaxed text-copy">{description}</p> : null}
      </header>
      {children}
    </Container>
  );
}

export function Notice({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "error" | "success";
}) {
  return (
    <p
      role="status"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm shadow-sm",
        tone === "error" && "border-rose-200 bg-rose-50 text-rose-800",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "neutral" && "border-line bg-zinc-50 text-copy",
      )}
    >
      {children}
    </p>
  );
}

export function EmptyState({
  title,
  detail,
  href,
  linkText,
}: {
  title: string;
  detail: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className=    "rounded-3xl border border-dashed border-line bg-white/70 px-5 py-16 text-center shadow-[0_18px_50px_rgba(23,58,53,0.04)]">
      <h2 className="text-lg font-semibold text-navy">{title}</h2>
      <p className="mt-2 text-sm text-copy">{detail}</p>
      {href && linkText ? (
        <Link
          href={href}
          className={cn("mt-4 inline-flex rounded-full bg-fresh px-4 py-2 text-sm font-semibold text-white hover:bg-fresh-dark", focusRing)}
        >
          {linkText}
        </Link>
      ) : null}
    </div>
  );
}

export function FormField({
  label,
  name,
  type = "text",
  required = true,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
      {label}
      <input
        className="h-12 rounded-xl border border-line bg-white px-4 font-normal outline-none transition focus:border-fresh focus:ring-4 focus:ring-fresh/10"
        name={name}
        type={type}
        required={required}
        minLength={type === "password" ? 8 : undefined}
        autoComplete={autoComplete}
      />
    </label>
  );
}

export const formButtonClass = cn(
  "inline-flex h-12 items-center justify-center rounded-full bg-fresh px-6 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(23,107,91,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-fresh-dark hover:shadow-[0_12px_24px_rgba(23,107,91,0.24)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
  focusRing,
);
