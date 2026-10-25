import { BadgeCheck, Sparkles, Store, Truck, type LucideIcon } from "lucide-react";

const POINTS: { icon: LucideIcon; title: string; copy: string }[] = [
  {
    icon: BadgeCheck,
    title: "Factory Direct Prices",
    copy: "Dozen and box rates meant for resale, printed on every design. No retail markup on this counter.",
  },
  {
    icon: Sparkles,
    title: "Daily New Stock",
    copy: "Fresh artificial jewellery, cosmetics, and fancy lots land in the Jammu godown through the week.",
  },
  {
    icon: Truck,
    title: "Local J&K Transport Dispatch",
    copy: "Parcels handed to bus and cargo services for the valley, Leh, and neighbouring Punjab and Himachal towns.",
  },
  {
    icon: Store,
    title: "Showroom Visit Welcome",
    copy: "Inspect colour, finish, and packing at Raghunath Bazar before you book a lot for your shop.",
  },
];

export function Trust() {
  return (
    <section id="why-us" className="bg-maroon-deep py-10 text-white md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-bright">
          For retailers
        </p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Why Partner With Us?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <article
                key={point.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <Icon className="h-5 w-5 text-gold-bright" aria-hidden />
                <h3 className="mt-3 font-serif text-2xl">{point.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">{point.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
