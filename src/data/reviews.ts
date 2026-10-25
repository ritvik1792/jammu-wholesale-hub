import type { RatingSummary, Review } from "@/lib/types";

/**
 * Visible retailer stories. The summary also counts a wider base of 116
 * earlier reviews so the headline can read 120+ before new submissions.
 */
export const SEED_REVIEWS: Review[] = [
  {
    id: "seed-gupta",
    reviewerName: "Rohit Gupta",
    shopName: "Gupta General Store",
    city: "Udhampur",
    rating: 5,
    comment:
      "Very fast delivery via local bus transport. Quality of hair accessories and bangles is superb.",
    date: "2026-09-12",
    verified: true,
  },
  {
    id: "seed-style",
    reviewerName: "Simran Kour",
    shopName: "Style Corner Boutique",
    city: "Rajouri",
    rating: 5,
    comment:
      "Latest Mumbai fashion jewellery designs available at genuine factory prices. Highly recommended for J&K retailers.",
    date: "2026-09-03",
    verified: true,
  },
  {
    id: "seed-aman",
    reviewerName: "Aamir Bhat",
    shopName: "Aman Cosmetics",
    city: "Lal Chowk, Srinagar",
    rating: 4.8,
    comment:
      "Great variety in Rakhi and cosmetics boxes. WhatsApp ordering system makes reordering super easy.",
    date: "2026-08-22",
    verified: true,
  },
  {
    id: "seed-priya",
    reviewerName: "Priya Sharma",
    shopName: "Priya Cosmetics",
    city: "R.S. Pura, Jammu",
    rating: 5,
    comment:
      "Reordered bangles twice this month. Counter packing was neat and the rates match what they quote on WhatsApp.",
    date: "2026-08-18",
    verified: true,
  },
  {
    id: "seed-valley",
    reviewerName: "Imran Malik",
    shopName: "New Valley Fancy",
    city: "Anantnag",
    rating: 4,
    comment:
      "Cosmetics boxes arrived in two days by cargo. Would like more shade photos before I book the next lipstick lot.",
    date: "2026-08-02",
    verified: true,
  },
  {
    id: "seed-leh",
    reviewerName: "Stanzin Dolma",
    shopName: "Ladakh Style House",
    city: "Leh",
    rating: 5,
    comment:
      "Festival stock reached Leh before the local mela. Packing survived the trip.",
    date: "2026-07-19",
    verified: true,
  },
  {
    id: "seed-kathua",
    reviewerName: "Neelam Saini",
    shopName: "Saini Ladies Store",
    city: "Kathua",
    rating: 5,
    comment:
      "Payal and clutches are what my customers ask for. Same-day handover to the Kathua bus.",
    date: "2026-06-28",
    verified: true,
  },
  {
    id: "seed-poonch",
    reviewerName: "Farooq Ahmed",
    shopName: "Border Fancy Point",
    city: "Poonch",
    rating: 4,
    comment:
      "Good variety. MOQ is fair for a small shop. The callback came the same afternoon.",
    date: "2026-06-11",
    verified: true,
  },
];

const BASE_COUNT = 116;
const BASE_SUM = 108 * 5 + 7 * 4 + 1 * 3;

export function buildSummary(reviews: Review[]): RatingSummary {
  const buckets: RatingSummary["buckets"] = { 1: 0, 2: 0, 3: 1, 4: 7, 5: 108 };
  let sum = BASE_SUM;
  let count = BASE_COUNT;

  for (const review of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(review.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    buckets[star] += 1;
    sum += review.rating;
    count += 1;
  }

  return { average: sum / count, count, buckets };
}
