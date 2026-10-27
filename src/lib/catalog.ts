import { CATEGORIES } from "@/lib/constants";
import type { CatalogCategory, Product } from "@/lib/types";

export function productMatches(
  product: Product,
  query: string,
  category: CatalogCategory,
  subcategory?: string | null,
) {
  if (category !== "all" && product.category !== category) return false;
  if (
    category === "brite-store" &&
    subcategory &&
    subcategory !== "all" &&
    product.subcategory !== subcategory
  ) {
    return false;
  }
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const categoryLabel =
    CATEGORIES.find((item) => item.id === product.category)?.label ?? "";
  const haystack = [
    product.name,
    product.priceLabel,
    categoryLabel,
    product.subcategory || "",
    ...product.keywords,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}
