import type { ReactNode } from "react";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { Footer } from "./footer";
import { Header } from "./header";
import { StoreProvider } from "@/components/storefront/store-provider";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex min-h-full flex-1 flex-col bg-background text-navy">
        <a
          href="#main"
          className={cn(
            "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2",
            focusRing,
          )}
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
      </div>
    </StoreProvider>
  );
}
