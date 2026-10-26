import { promises as fs } from "fs";
import path from "path";
import { list, put } from "@vercel/blob";
import { PRODUCTS as SEED_PRODUCTS } from "@/data/products";
import type { Product } from "@/lib/types";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/custom-products.json");
const DELETED_FILE_PATH = path.join(process.cwd(), "src/data/deleted-products.json");

export async function getDeletedProductIds(): Promise<string[]> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "data/deleted-products.json" });
      const target = blobs.find((b) => b.pathname === "data/deleted-products.json");
      if (target) {
        const res = await fetch(target.downloadUrl, { cache: "no-store" });
        if (res.ok) {
          const parsed = await res.json();
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch {}
    return [];
  }

  try {
    const raw = await fs.readFile(DELETED_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

export async function getCustomProducts(): Promise<Product[]> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "data/custom-products.json" });
      const target = blobs.find((b) => b.pathname === "data/custom-products.json");
      if (target) {
        const res = await fetch(target.downloadUrl, { cache: "no-store" });
        if (res.ok) {
          const parsed = await res.json();
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch {}
    return [];
  }

  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

export async function saveCustomProducts(products: Product[]): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put("data/custom-products.json", JSON.stringify(products, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  if (process.env.VERCEL === "1") {
    throw new Error(
      "Vercel Blob storage is not connected! Go to your Vercel Dashboard -> Storage -> Create Database -> Select Blob, and click Connect."
    );
  }

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(products, null, 2), "utf-8");
}

export async function markProductDeleted(id: string): Promise<void> {
  const deleted = await getDeletedProductIds();
  if (!deleted.includes(id)) {
    const nextDeleted = [...deleted, id];
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await put("data/deleted-products.json", JSON.stringify(nextDeleted, null, 2), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
    } else if (process.env.VERCEL !== "1") {
      await fs.writeFile(DELETED_FILE_PATH, JSON.stringify(nextDeleted, null, 2), "utf-8");
    }
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
