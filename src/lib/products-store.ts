import { promises as fs } from "fs";
import path from "path";
import { list, put } from "@vercel/blob";
import { PRODUCTS as SEED_PRODUCTS } from "@/data/products";
import type { Product } from "@/lib/types";

// In-memory sets to guarantee instant consistency across repeated calls in the same worker/container
let memoryDeletedIds: Set<string> | null = null;
let memoryCustomProducts: Product[] | null = null;

function getStoragePath(filename: string): string {
  // If running in Vercel serverless without blob token, /tmp is the only writable directory
  if (process.env.VERCEL === "1") {
    return path.join("/tmp", filename);
  }
  return path.join(process.cwd(), "src/data", filename);
}

export async function getDeletedProductIds(): Promise<string[]> {
  if (memoryDeletedIds) {
    return Array.from(memoryDeletedIds);
  }

  // 1. If Vercel Blob is configured
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "data/deleted-products.json" });
      const target = blobs.find((b) => b.pathname === "data/deleted-products.json");
      if (target) {
        // Cache bust the public CDN URL to guarantee latest content
        const res = await fetch(`${target.downloadUrl}?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        if (res.ok) {
          const parsed = await res.json();
          if (Array.isArray(parsed)) {
            memoryDeletedIds = new Set(parsed);
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn("Could not read deleted products from Blob, falling back to local:", err);
    }
  }

  // 2. Local filesystem / /tmp fallback
  const candidates = [
    getStoragePath("deleted-products.json"),
    path.join(process.cwd(), "src/data/deleted-products.json"),
  ];

  for (const filePath of candidates) {
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryDeletedIds = new Set(parsed);
        return parsed;
      }
    } catch {}
  }

  memoryDeletedIds = new Set();
  return [];
}

export async function saveDeletedProductIds(ids: string[]): Promise<void> {
  const uniqueIds = Array.from(new Set(ids));
  memoryDeletedIds = new Set(uniqueIds);

  const jsonStr = JSON.stringify(uniqueIds, null, 2);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put("data/deleted-products.json", jsonStr, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return;
    } catch (err) {
      console.error("Failed to write deleted products to Vercel Blob:", err);
    }
  }

  try {
    const filePath = getStoragePath("deleted-products.json");
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, jsonStr, "utf-8");
  } catch (err) {
    console.warn("Could not write deleted products to disk:", err);
  }
}

export async function getCustomProducts(): Promise<Product[]> {
  if (memoryCustomProducts) {
    return memoryCustomProducts;
  }

  // 1. If Vercel Blob is configured
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "data/custom-products.json" });
      const target = blobs.find((b) => b.pathname === "data/custom-products.json");
      if (target) {
        // Cache bust the public CDN URL to guarantee latest content
        const res = await fetch(`${target.downloadUrl}?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        if (res.ok) {
          const parsed = await res.json();
          if (Array.isArray(parsed)) {
            memoryCustomProducts = parsed;
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn("Could not read custom products from Blob, falling back to local:", err);
    }
  }

  // 2. Local filesystem / /tmp fallback
  const candidates = [
    getStoragePath("custom-products.json"),
    path.join(process.cwd(), "src/data/custom-products.json"),
  ];

  for (const filePath of candidates) {
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryCustomProducts = parsed;
        return parsed;
      }
    } catch {}
  }

  memoryCustomProducts = [];
  return [];
}

export async function saveCustomProducts(products: Product[]): Promise<void> {
  // Always filter out any deleted products before saving to prevent resurrection
  const deleted = await getDeletedProductIds();
  const cleanProducts = products.filter((p) => !deleted.includes(p.id));

  memoryCustomProducts = cleanProducts;
  const jsonStr = JSON.stringify(cleanProducts, null, 2);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put("data/custom-products.json", jsonStr, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return;
    } catch (err) {
      console.error("Failed to write custom products to Vercel Blob:", err);
    }
  }

  try {
    const filePath = getStoragePath("custom-products.json");
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, jsonStr, "utf-8");
  } catch (err) {
    console.warn("Could not write custom products to disk:", err);
  }
}

export async function markProductDeleted(id: string): Promise<void> {
  // 1. Add to deleted IDs list
  const currentDeleted = await getDeletedProductIds();
  const nextDeleted = Array.from(new Set([...currentDeleted, id]));
  await saveDeletedProductIds(nextDeleted);

  // 2. Remove permanently from custom products
  const currentCustom = await getCustomProducts();
  const nextCustom = currentCustom.filter((p) => p.id !== id);
  await saveCustomProducts(nextCustom);
}

export async function getAllProducts(): Promise<Product[]> {
  const deleted = await getDeletedProductIds();
  const custom = await getCustomProducts();
  const customIds = new Set(custom.map((p) => p.id));
  const remainingSeeds = SEED_PRODUCTS.filter((s) => !customIds.has(s.id));
  const all = [...custom, ...remainingSeeds];
  // Strictly filter out any deleted products
  return all.filter((p) => !deleted.includes(p.id));
}
