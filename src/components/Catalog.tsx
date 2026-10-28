"use client";

import { ProductCard } from "@/components/ProductCard";
import { BRITE_SUBCATEGORIES, CATEGORIES, CATEGORY_BLURB } from "@/lib/constants";
import { productMatches } from "@/lib/catalog";
import { useCatalog } from "@/context/CatalogContext";

export function Catalog() {
  const {
    products,
    categories,
    query,
    setQuery,
    category,
    setCategory,
    subcategory,
    setSubcategory,
  } = useCatalog();

  const visible = products
    .filter((product) => productMatches(product, query, category, subcategory))
    .sort((a, b) => {
      const getPriority = (p: typeof a) => {
        const badgeLower = (p.badge || "").toLowerCase();
        if (badgeLower.includes("special") || badgeLower.includes("offer")) return 2;
        if (p.promoted || badgeLower.includes("promot")) return 1;
        return 0;
      };
      return getPriority(b) - getPriority(a);
    });

  const active =
    categories.find((item) => item.id === category) ||
    CATEGORIES.find((item) => item.id === category);
  const activeSub = BRITE_SUBCATEGORIES.find(
    (s) => s.id === (subcategory || "all")
  );

  const briteProducts = products.filter((p) => p.category === "brite-store");
  const kidsCount = briteProducts.filter((p) => p.subcategory === "kids").length;
  const ladiesCount = briteProducts.filter((p) => p.subcategory === "ladies").length;
  const gentsCount = briteProducts.filter((p) => p.subcategory === "gents").length;

  return (
    <section id="catalog" className="bg-cream py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          Catalogue
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-3xl text-maroon-deep sm:text-4xl">
            {category === "brite-store" && subcategory && subcategory !== "all"
              ? `BRITE STORE · ${activeSub?.label || "Clothing"}`
              : active?.label ?? "All Products"}
          </h2>
          <p className="text-sm text-muted">
            {visible.length} {visible.length === 1 ? "design" : "designs"}
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          {category === "brite-store" && activeSub
            ? activeSub.description
            : CATEGORY_BLURB[category]}{" "}
          Prices are indicative factory rates for retailers. GST and freight are extra.
        </p>

        {/* Main Category Filter Bar */}
        <div className="sticky top-[var(--header-h)] z-30 -mx-4 mt-5 border-y border-line/80 bg-cream/95 px-4 py-3 backdrop-blur">
          <div
            className="chip-scroll flex gap-2 overflow-x-auto"
            role="tablist"
            aria-label="Filter by category"
          >
            {categories.map((item) => {
              const selected = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setCategory(item.id)}
                  className={`shrink-0 rounded-full px-3 py-2 text-left text-sm font-medium transition ${
                    selected
                      ? "bg-maroon text-white shadow-sm"
                      : "border border-line bg-paper text-foreground hover:border-gold"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* BRITE STORE Subcategories Banner & Filters */}
        {category === "brite-store" && (
          <div className="mt-5 rounded-3xl border border-gold/30 bg-paper p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <div className="inline-flex items-center gap-2">
                  <span className="rounded-full bg-maroon px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-bright">
                    BRITE STORE
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Ready-Made Clothing Department
                  </span>
                </div>
                <h3 className="mt-1 font-serif text-xl text-maroon-deep sm:text-2xl">
                  {activeSub?.label || "All Ready-Made Garments"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCategory("all")}
                className="inline-flex items-center gap-1 rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-medium text-maroon hover:border-maroon transition"
              >
                ← All B.B. Gupta Categories
              </button>
            </div>

            {/* Subcategory Pills: Kids, Ladies, Gents */}
            <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="BRITE STORE Subcategories">
              {BRITE_SUBCATEGORIES.map((sub) => {
                const isSelected = (subcategory || "all") === sub.id;
                const count =
                  sub.id === "all"
                    ? briteProducts.length
                    : sub.id === "kids"
                    ? kidsCount
                    : sub.id === "ladies"
                    ? ladiesCount
                    : gentsCount;

                return (
                  <button
                    key={sub.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSubcategory(sub.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-maroon text-white shadow-sm ring-2 ring-gold/40"
                        : "border border-line bg-cream text-ink hover:border-gold"
                    }`}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        isSelected ? "bg-white/20 text-white" : "bg-paper text-muted border border-line"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted">
              {activeSub?.description}
            </p>
          </div>
        )}

        {/* Product Grid or Empty State */}
        {visible.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper px-5 py-10 text-center">
            <p className="font-serif text-2xl text-maroon-deep">No matching designs</p>
            <p className="mt-2 text-sm text-muted">
              {category === "brite-store"
                ? "No products found in this clothing subcategory yet. Try selecting 'All Clothing'."
                : "Try payal, clutch, rakhi, kurti, shirt, or jewellery."}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {category === "brite-store" && subcategory !== "all" ? (
                <button
                  type="button"
                  onClick={() => setSubcategory("all")}
                  className="inline-flex h-10 items-center rounded-full bg-gold px-4 text-xs font-semibold text-maroon-deep"
                >
                  Show all BRITE STORE clothing
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
                className="inline-flex h-10 items-center rounded-full bg-maroon px-4 text-xs font-semibold text-white"
              >
                Show all products
              </button>
            </div>
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
