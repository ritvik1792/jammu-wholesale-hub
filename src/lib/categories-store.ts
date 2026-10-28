import { promises as fs } from "fs";
import path from "path";
import { list, put } from "@vercel/blob";
import { CATEGORIES as DEFAULT_CATEGORIES } from "@/lib/constants";
import type { CategoryItem } from "@/lib/types";

let memoryCustomCategories: CategoryItem[] | null = null;

function getStoragePath(filename: string): string {
  if (process.env.VERCEL === "1") {
    return path.join("/tmp", filename);
  }
  return path.join(process.cwd(), "src/data", filename);
}

export async function getCustomCategories(): Promise<CategoryItem[]> {
  if (memoryCustomCategories) {
    return memoryCustomCategories;
  }

  // 1. Vercel Blob if token available
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "data/custom-categories.json" });
      const target = blobs.find((b) => b.pathname === "data/custom-categories.json");
      if (target) {
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
            memoryCustomCategories = parsed;
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn("Could not read custom categories from Blob, falling back to local:", err);
    }
  }

  // 2. Local filesystem / /tmp fallback
  const candidates = [
    getStoragePath("custom-categories.json"),
    path.join(process.cwd(), "src/data/custom-categories.json"),
  ];

  for (const filePath of candidates) {
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryCustomCategories = parsed;
        return parsed;
      }
    } catch {}
  }

  memoryCustomCategories = [];
  return [];
}

export async function saveCustomCategories(categories: CategoryItem[]): Promise<void> {
  memoryCustomCategories = categories;
  const jsonStr = JSON.stringify(categories, null, 2);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put("data/custom-categories.json", jsonStr, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return;
    } catch (err) {
      console.error("Failed to write custom categories to Vercel Blob:", err);
    }
  }

  try {
    const filePath = getStoragePath("custom-categories.json");
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, jsonStr, "utf-8");
  } catch (err) {
    console.warn("Could not write custom categories to disk:", err);
  }
}

export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function addCustomCategory(params: {
  name: string;
  short?: string;
  description?: string;
}): Promise<CategoryItem> {
  const custom = await getCustomCategories();
  const label = params.name.trim();
  const short = params.short?.trim() || label.split(/[\s(&,-]+/)[0] || label;
  let baseId = slugifyCategory(label);
  if (!baseId) {
    baseId = `cat-${Date.now().toString(36)}`;
  }

  // Ensure unique ID
  let id = baseId;
  let counter = 1;
  const existingIds = new Set([
    ...DEFAULT_CATEGORIES.map((c) => c.id),
    ...custom.map((c) => c.id),
  ]);

  while (existingIds.has(id)) {
    id = `${baseId}-${counter}`;
    counter++;
  }

  const newCategory: CategoryItem = {
    id,
    label,
    short,
    description: params.description?.trim() || undefined,
    isCustom: true,
  };

  const updated = [...custom, newCategory];
  await saveCustomCategories(updated);
  return newCategory;
}

export async function deleteCustomCategory(id: string): Promise<boolean> {
  const custom = await getCustomCategories();
  const index = custom.findIndex((c) => c.id === id);
  if (index === -1) {
    return false;
  }
  const updated = custom.filter((c) => c.id !== id);
  await saveCustomCategories(updated);
  return true;
}

export async function getAllCategories(): Promise<CategoryItem[]> {
  const custom = await getCustomCategories();
  const defaultList: CategoryItem[] = DEFAULT_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    short: c.short,
    isCustom: false,
  }));

  // Append custom categories after built-in ones
  return [...defaultList, ...custom];
}
