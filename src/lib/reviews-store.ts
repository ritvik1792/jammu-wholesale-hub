import { promises as fs } from "fs";
import path from "path";
import { SEED_REVIEWS } from "@/data/reviews";
import type { Review } from "@/lib/types";

const REVIEWS_FILE_PATH = path.join(process.cwd(), "src/data/user-reviews.json");
const DELETED_REVIEWS_PATH = path.join(process.cwd(), "src/data/deleted-reviews.json");

export async function getDeletedReviewIds(): Promise<string[]> {
  try {
    const raw = await fs.readFile(DELETED_REVIEWS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

export async function getStoredReviews(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(REVIEWS_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

export async function saveStoredReviews(reviews: Review[]): Promise<void> {
  await fs.writeFile(REVIEWS_FILE_PATH, JSON.stringify(reviews, null, 2), "utf-8");
}

export async function markReviewDeleted(id: string): Promise<void> {
  const deleted = await getDeletedReviewIds();
  if (!deleted.includes(id)) {
    await fs.writeFile(DELETED_REVIEWS_PATH, JSON.stringify([...deleted, id], null, 2), "utf-8");
  }
  const user = await getStoredReviews();
  await saveStoredReviews(user.filter((r) => r.id !== id));
}

export async function getAllReviews(): Promise<Review[]> {
  const user = await getStoredReviews();
  const deleted = await getDeletedReviewIds();
  const all = [...user, ...SEED_REVIEWS];
  return all
    .filter((r) => !deleted.includes(r.id))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
