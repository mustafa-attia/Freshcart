import { Headset, ShieldCheck, Truck, Undo2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

const BENEFITS: { title: string; description: string; icon: LucideIcon; tint: string }[] = [
  {
    title: "Free Shipping",
    description: "On orders over EGP 500",
    icon: Truck,
    tint: "bg-[#e4eee6] text-fresh",
  },
  {
    title: "Secure Payment",
    description: "Protected payment details",
    icon: ShieldCheck,
    tint: "bg-[#e4eee6] text-fresh",
  },
  {
    title: "Easy Returns",
    description: "Returns on eligible items",
    icon: Undo2,
    tint: "bg-[#f4e4c9] text-[#815b2d]",
  },
  {
    title: "24/7 Support",
    description: "Phone and email support",
    icon: Headset,
    tint: "bg-[#eee9df] text-[#715f49]",
  },
];

export function ServiceBenefits({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <section className="bg-mint" aria-label="Service promises">
        <Container className="py-4">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <li key={benefit.title} className="flex min-w-0 items-center gap-3">
                <BenefitIcon benefit={benefit} small />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">{benefit.title}</p>
                  <p className="text-xs text-copy">{benefit.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-[#f3f0e8]" aria-label="Why shop with FreshCart">
      <Container className="py-8 sm:py-10">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <li
              key={benefit.title}
              className="flex h-full min-w-0 items-start gap-3 rounded-2xl border border-line/80 bg-white/80 p-5 shadow-[0_8px_24px_rgba(23,58,53,0.035)] transition-transform duration-300 hover:-translate-y-1"
            >
              <BenefitIcon benefit={benefit} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy">{benefit.title}</p>
                <p className="mt-1 text-sm text-copy">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function BenefitIcon({
  benefit,
  small = false,
}: {
  benefit: (typeof BENEFITS)[number];
  small?: boolean;
}) {
  const Icon = benefit.icon;
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        small ? "size-9" : "size-11",
        benefit.tint,
      )}
    >
      <Icon className={small ? "size-4" : "size-5"} aria-hidden="true" />
    </span>
  );
}
