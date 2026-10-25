"use client";

import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, CATEGORY_BLURB } from "@/lib/constants";
import { productMatches } from "@/lib/catalog";
import { useCatalog } from "@/context/CatalogContext";

export function Catalog() {
  const { products, query, setQuery, category, setCategory } = useCatalog();
  const visible = products
    .filter((product) => productMatches(product, query, category))
    .sort((a, b) => {
      const getPriority = (p: typeof a) => {
        const badgeLower = (p.badge || "").toLowerCase();
        if (badgeLower.includes("special") || badgeLower.includes("offer")) return 2;
        if (p.promoted || badgeLower.includes("promot")) return 1;
        return 0;
      };
      return getPriority(b) - getPriority(a);
    });
  const active = CATEGORIES.find((item) => item.id === category);

  return (
    <section id="catalog" className="bg-cream py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          Catalogue
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-3xl text-maroon-deep sm:text-4xl">
            {active?.label ?? "All Products"}
          </h2>
          <p className="text-sm text-muted">
            {visible.length} {visible.length === 1 ? "design" : "designs"}
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          {CATEGORY_BLURB[category]} Prices are indicative factory rates for
          retailers. GST and freight are extra.
        </p>
        <div className="sticky top-[var(--header-h)] z-30 -mx-4 mt-5 border-y border-line/80 bg-cream/95 px-4 py-3 backdrop-blur">
          <div
            className="chip-scroll flex gap-2 overflow-x-auto"
            role="tablist"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((item) => {
              const selected = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setCategory(item.id)}
                  className={`shrink-0 rounded-full px-3 py-2 text-left text-sm ${
                    selected
                      ? "bg-maroon text-white"
                      : "border border-line bg-paper text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
        {visible.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper px-5 py-10 text-center">
            <p className="font-serif text-2xl text-maroon-deep">No matching designs</p>
            <p className="mt-2 text-sm text-muted">
              Try payal, clutch, rakhi, lipstick, or a SKU such as JMU-JWL-0102.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="mt-4 inline-flex h-11 items-center rounded-full bg-maroon px-4 text-sm font-semibold text-white"
            >
              Show all products
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
