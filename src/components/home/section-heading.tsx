import type { ReactNode } from "react";

export function SectionHeading({
  children,
  emphasis,
  action,
}: {
  children: string;
  emphasis: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
      <h2 className="flex min-w-0 items-center gap-3 font-heading text-2xl font-medium tracking-tight text-navy sm:text-3xl">
        <span className="h-px w-8 shrink-0 bg-[#c89555]" aria-hidden="true" />
        <span className="min-w-0">
          {children} <span className="italic text-fresh">{emphasis}</span>
        </span>
      </h2>
      {action}
    </div>
  );
}
