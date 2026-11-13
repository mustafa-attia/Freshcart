"use client";

import { useEffect } from "react";
import { focusRing, primaryButtonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-page flex-1 flex-col items-start justify-center gap-4 px-4 py-24">
      <h1 className="text-2xl font-semibold text-navy">This page could not be displayed</h1>
      <p className="max-w-md text-sm text-copy">
        Something unexpected stopped this page. You can try loading it again.
      </p>
      <button type="button" className={cn(primaryButtonClass, focusRing)} onClick={() => retry()}>
        Try again
      </button>
    </main>
  );
}
