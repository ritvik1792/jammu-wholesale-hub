"use client";

import { CATEGORIES } from "@/lib/constants";
import { useCatalog } from "@/context/CatalogContext";
import { scrollToId } from "@/lib/format";
import { Search, ShoppingBag, X } from "lucide-react";

export function Header() {
  const { query, setQuery, category, selectCategory, itemCount, openDrawer } =
    useCatalog();

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 bg-maroon font-serif text-[11px] tracking-[0.14em] text-gold-bright">
            JWH
          </span>
          <span className="min-w-0">
            <span className="block truncate font-serif text-lg leading-none text-maroon-deep">
              Jammu Wholesale Hub
            </span>
            <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-muted">
              Raghunath Bazar · Jammu
            </span>
          </span>
        </a>
        <form
          className="relative ml-4 hidden min-w-0 flex-1 md:block"
          onSubmit={(event) => {
            event.preventDefault();
            scrollToId("catalog");
          }}
        >
          <SearchField query={query} setQuery={setQuery} />
        </form>
        <button
          type="button"
          onClick={openDrawer}
          aria-label={
            itemCount === 0
              ? "Open enquiry list"
              : `Open enquiry list, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
          }
          className="relative ml-auto inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-3 text-sm font-semibold text-white sm:px-4"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Enquiry</span>
          {itemCount > 0 ? (
            <span className="grid min-w-5 place-items-center rounded-full bg-gold-bright px-1.5 text-xs font-bold text-maroon-deep">
              {itemCount}
            </span>
          ) : null}
        </button>
      </div>
      <form
        className="mx-auto max-w-6xl px-4 pb-3 md:hidden"
        onSubmit={(event) => {
          event.preventDefault();
          scrollToId("catalog");
        }}
      >
        <SearchField query={query} setQuery={setQuery} />
      </form>
      <nav
        aria-label="Categories"
        className="chip-scroll mx-auto hidden max-w-6xl gap-2 overflow-x-auto px-4 pb-3 md:flex"
      >
        {CATEGORIES.map((item) => {
          const active = category === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectCategory(item.id)}
              className={`shrink-0 rounded-full px-3 py-2 text-sm ${
                active
                  ? "bg-maroon text-white"
                  : "border border-line bg-cream text-foreground"
              }`}
            >
              {item.short}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

function SearchField({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search payal, lipstick, SKU…"
        aria-label="Search products"
        enterKeyHint="search"
        className="w-full rounded-full border border-line bg-white py-3 pr-10 pl-10 text-base outline-none placeholder:text-muted/70 focus:border-gold"
      />
      {query ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setQuery("")}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
