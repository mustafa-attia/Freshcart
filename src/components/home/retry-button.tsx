"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { focusRing, primaryButtonClass } from "@/lib/styles";

export function RetryButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className={cn(primaryButtonClass, focusRing)}
      onClick={() => router.refresh()}
    >
      Try again
    </button>
  );
}
