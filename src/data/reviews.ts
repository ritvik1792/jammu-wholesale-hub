import type { RatingSummary, Review } from "@/lib/types";

/**
 * Reviews storage initialization. All reviews are dynamically stored and managed
 * via Vercel Blob / local persistent storage without hardcoded fake entries.
 */
export const SEED_REVIEWS: Review[] = [];

export function buildSummary(reviews: Review[]): RatingSummary {
  const buckets: RatingSummary["buckets"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  if (!reviews || reviews.length === 0) {
    return { average: 5, count: 0, buckets };
  }

  let sum = 0;
  for (const review of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(review.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    buckets[star] += 1;
    sum += Number(review.rating) || 5;
  }

  const average = Math.round((sum / reviews.length) * 10) / 10;
  return { average, count: reviews.length, buckets };
}
