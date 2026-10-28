import type { Product } from "@/lib/types";

/**
 * Product catalogue is dynamically loaded and managed via /admin and persisted
 * in Vercel Blob / persistent storage. No hardcoded mock products.
 */
export const PRODUCTS: Product[] = [];

export const PRODUCT_MAP = new Map<string, Product>();

export const FEATURED_IDS: readonly string[] = [];
