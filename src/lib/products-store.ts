import { promises as fs } from "fs";
import path from "path";
import { PRODUCTS as SEED_PRODUCTS } from "@/data/products";
import type { Product } from "@/lib/types";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/custom-products.json");
const DELETED_FILE_PATH = path.join(process.cwd(), "src/data/deleted-products.json");

export async function getDeletedProductIds(): Promise<string[]> {
  try {
    const raw = await fs.readFile(DELETED_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

export async function getCustomProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

export async function saveCustomProducts(products: Product[]): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(products, null, 2), "utf-8");
}

export async function markProductDeleted(id: string): Promise<void> {
  const deleted = await getDeletedProductIds();
  if (!deleted.includes(id)) {
    await fs.writeFile(DELETED_FILE_PATH, JSON.stringify([...deleted, id], null, 2), "utf-8");
  }
  const custom = await getCustomProducts();
  await saveCustomProducts(custom.filter((p) => p.id !== id));
}

export async function getAllProducts(): Promise<Product[]> {
  const custom = await getCustomProducts();
  const deleted = await getDeletedProductIds();
  const all = [...custom, ...SEED_PRODUCTS];
  return all.filter((p) => !deleted.includes(p.id));
}
