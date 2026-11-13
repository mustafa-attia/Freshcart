import { ShieldCheck, Star, Truck, type LucideIcon } from "lucide-react";

const REASONS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Premium Quality",
    description: "Premium quality products sourced from trusted suppliers.",
    icon: Star,
  },
  {
    title: "Fast Delivery",
    description: "Same-day delivery available in most areas.",
    icon: Truck,
  },
  {
    title: "Secure Shopping",
    description: "Your data and payments are completely secure.",
    icon: ShieldCheck,
  },
];

export function SignupWelcome() {
  return (
    <div className="min-w-0">
      <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
        Welcome to <span className="text-fresh">FreshCart</span>
      </h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-copy sm:text-base">
        Join thousands of happy customers who enjoy fresh groceries delivered right to their
        doorstep.
      </p>

      <ul className="mt-8 flex flex-col gap-5">
        {REASONS.map((reason) => {
          const Icon = reason.icon;
          return (
            <li key={reason.title} className="flex min-w-0 items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mint text-fresh">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy">{reason.title}</p>
                <p className="mt-0.5 text-sm text-copy">{reason.description}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <figure className="mt-8 rounded-xl border border-line bg-white p-4 shadow-sm">
        <figcaption className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mint text-sm font-semibold text-fresh">
            SJ
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-navy">Sarah Johnson</span>
            <span className="mt-0.5 flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} className="size-3.5 fill-current" aria-hidden="true" />
              ))}
            </span>
          </span>
        </figcaption>
        <blockquote className="mt-3 text-sm leading-relaxed text-copy italic">
          “FreshCart has transformed my shopping experience. The quality of the products is
          outstanding, and the delivery is always on time. Highly recommend!”
        </blockquote>
      </figure>
    </div>
  );
}
