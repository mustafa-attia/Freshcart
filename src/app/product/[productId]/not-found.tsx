import Link from "next/link";
import { Container } from "@/components/layout/container";
import { focusRing, primaryButtonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function ProductNotFound() {
  return (
    <Container className="py-24">
      <h1 className="text-2xl font-semibold text-navy">Product not found</h1>
      <p className="mt-2 max-w-md text-sm text-copy">
        That product is not in the FreshCart catalog.
      </p>
      <Link href="/" className={cn(primaryButtonClass, focusRing, "mt-6")}>
        Back to home
      </Link>
    </Container>
  );
}
