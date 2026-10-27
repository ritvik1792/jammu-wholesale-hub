import { CATEGORIES } from "@/lib/constants";
import type { CatalogCategory, Product } from "@/lib/types";

export function productMatches(
  product: Product,
  query: string,
  category: CatalogCategory,
) {
  if (category !== "all" && product.category !== category) return false;
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const categoryLabel =
    CATEGORIES.find((item) => item.id === product.category)?.label ?? "";
  const haystack = [
    product.name,
    product.sku || "",
    product.priceLabel,
    categoryLabel,
    ...product.keywords,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}
