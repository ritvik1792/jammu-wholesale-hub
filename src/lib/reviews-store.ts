import { promises as fs } from "fs";
import path from "path";
import { list, put } from "@vercel/blob";
import { SEED_REVIEWS } from "@/data/reviews";
import type { Review } from "@/lib/types";

const REVIEWS_FILE_PATH = path.join(process.cwd(), "src/data/user-reviews.json");
const DELETED_REVIEWS_PATH = path.join(process.cwd(), "src/data/deleted-reviews.json");

export async function getDeletedReviewIds(): Promise<string[]> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "data/deleted-reviews.json" });
      const target = blobs.find((b) => b.pathname === "data/deleted-reviews.json");
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
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch {}
    return [];
  }

  try {
    const raw = await fs.readFile(DELETED_REVIEWS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

export async function getStoredReviews(): Promise<Review[]> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "data/user-reviews.json" });
      const target = blobs.find((b) => b.pathname === "data/user-reviews.json");
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
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch {}
    return [];
  }

  try {
    const raw = await fs.readFile(REVIEWS_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

export async function saveStoredReviews(reviews: Review[]): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put("data/user-reviews.json", JSON.stringify(reviews, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  if (process.env.VERCEL === "1") {
    return;
  }

  await fs.writeFile(REVIEWS_FILE_PATH, JSON.stringify(reviews, null, 2), "utf-8");
}

export async function updateReview(
  id: string,
  patch: { adminReply?: string; promoted?: boolean }
): Promise<void> {
  const user = await getStoredReviews();
  const exists = user.some((r) => r.id === id);

  if (exists) {
    const updated = user.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          ...(patch.adminReply !== undefined && {
            adminReply: patch.adminReply.trim() || undefined,
            adminReplyDate: patch.adminReply.trim() ? new Date().toISOString() : undefined,
          }),
          ...(patch.promoted !== undefined && {
            promoted: patch.promoted,
          }),
        };
      }
      return r;
    });
    await saveStoredReviews(updated);
  }
}

export async function updateReviewReply(id: string, replyText: string): Promise<void> {
  await updateReview(id, { adminReply: replyText });
}

export async function toggleReviewPromote(id: string, promoted: boolean): Promise<void> {
  await updateReview(id, { promoted });
}

export async function markReviewDeleted(id: string): Promise<void> {
  const deleted = await getDeletedReviewIds();
  if (!deleted.includes(id)) {
    const nextDeleted = [...deleted, id];
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await put("data/deleted-reviews.json", JSON.stringify(nextDeleted, null, 2), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
    } else if (process.env.VERCEL !== "1") {
      await fs.writeFile(DELETED_REVIEWS_PATH, JSON.stringify(nextDeleted, null, 2), "utf-8");
    }
  }
  const user = await getStoredReviews();
  await saveStoredReviews(user.filter((r) => r.id !== id));
}

export async function getAllReviews(): Promise<Review[]> {
  const user = await getStoredReviews();
  const deleted = await getDeletedReviewIds();
  const userIds = new Set(user.map((u) => u.id));
  const nonOverriddenSeeds = SEED_REVIEWS.filter((s) => !userIds.has(s.id));
  const combined = [...user, ...nonOverriddenSeeds];
  const active = combined.filter((r) => !deleted.includes(r.id));

  // Promoted reviews always come to the top, then sorted by most recent date
  return active.sort((a, b) => {
    if (a.promoted && !b.promoted) return -1;
    if (!a.promoted && b.promoted) return 1;
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });
}
