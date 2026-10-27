"use client";

import { FEATURED_IDS } from "@/data/products";
import { useCatalog } from "@/context/CatalogContext";
import { scrollToId } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { useMemo } from "react";

export function Hero() {
  const { selectCategory, instantWhatsApp, products } = useCatalog();
  const featured = useMemo(() => {
    const productMap = new Map(products.map((p) => [p.id, p]));
    return FEATURED_IDS.map((id) => productMap.get(id)).filter(
      (product): product is Product => product != null,
    );
  }, [products]);

  return (
    <section className="relative overflow-hidden bg-maroon-deep text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 100% 0%, rgba(242,220,171,0.28), transparent 42%), repeating-linear-gradient(-45deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 13px)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:py-14 lg:grid-cols-[1.35fr_0.75fr] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-bright">
            Wholesale counter · Jammu
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-[1.7rem] leading-[1.15] text-white sm:text-4xl lg:text-5xl">
            Jammu&apos;s Leading{" "}
            <span className="text-gold-bright">Wholesale</span> Supplier for
            Artificial Jewellery, Cosmetics &amp; Fashion Accessories
          </h1>
          <p className="mt-4 max-w-xl text-sm font-medium text-gold-bright sm:text-base">
            Direct Factory Rates | Daily New Designs | Fast Dispatch Across J&amp;K
          </p>
          <p className="mt-3 hidden max-w-xl text-sm leading-6 text-white/75 sm:block">
            Built for retail shopkeepers, boutique owners, and reseller networks
            across Jammu, the Kashmir valley, Leh, Punjab, and Himachal Pradesh.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
            <button
              type="button"
              onClick={() => selectCategory("all")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold-bright px-5 text-sm font-semibold text-maroon-deep"
            >
              Browse Catalog
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={instantWhatsApp}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Enlist Query on WhatsApp
            </button>
            <button
              type="button"
              onClick={() => scrollToId("reviews")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold text-white"
            >
              <Star className="h-4 w-4" aria-hidden />
              Customer Reviews
            </button>
          </div>
        </div>
        <aside className="rounded-3xl border border-white/15 bg-white/8 p-4 backdrop-blur-sm sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-bright">
            On the counter today
          </p>
          <ul className="mt-2 divide-y divide-white/10">
            {featured.map((product) => (
              <li key={product.id} className="flex items-start justify-between gap-3 py-3">
                <span>
                  <span className="block text-sm font-medium">{product.name}</span>
                </span>
                <span className="shrink-0 text-right text-sm font-semibold text-gold-bright">
                  {product.priceLabel}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => selectCategory("all")}
            className="mt-2 text-sm font-semibold text-gold-bright underline-offset-4 hover:underline"
          >
            Open the full catalogue
          </button>
        </aside>
      </div>
    </section>
  );
}
