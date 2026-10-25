"use client";

import { Stars } from "@/components/Stars";
import { useCatalog } from "@/context/CatalogContext";
import { formatDate, formatRating } from "@/lib/format";
import type { ReviewFilter } from "@/lib/types";
import { BadgeCheck } from "lucide-react";
import { useState } from "react";

const FILTERS: { id: ReviewFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: 5, label: "5 star" },
  { id: 4, label: "4 star" },
  { id: 3, label: "3 star" },
  { id: 2, label: "2 star" },
  { id: 1, label: "1 star" },
];

export function Reviews() {
  const { reviews, ratingSummary, freshReviewId, openReviewModal } = useCatalog();
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [seenFreshId, setSeenFreshId] = useState<string | null>(null);

  if (freshReviewId && freshReviewId !== seenFreshId) {
    setSeenFreshId(freshReviewId);
    setFilter("all");
  }

  const visible = reviews.filter((review) =>
    filter === "all" ? true : Math.round(review.rating) === filter,
  );

  return (
    <section id="reviews" className="bg-paper py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          Retailer reviews
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-3xl text-maroon-deep sm:text-4xl">
            What J&amp;K shopkeepers say
          </h2>
          <button
            type="button"
            onClick={openReviewModal}
            className="inline-flex h-11 items-center rounded-full bg-maroon px-4 text-sm font-semibold text-white"
          >
            Write a Review
          </button>
        </div>

        <div className="mt-6 grid gap-6 rounded-3xl border border-line bg-cream p-5 md:grid-cols-[16rem_1fr] md:p-6">
          <div>
            <p className="font-serif text-5xl text-maroon-deep">
              {formatRating(ratingSummary.average)}
            </p>
            <div className="mt-2">
              <Stars value={ratingSummary.average} size={18} />
            </div>
            <p className="mt-2 text-sm font-medium">
              {formatRating(ratingSummary.average)} out of 5 stars
            </p>
            <p className="mt-1 text-sm text-muted">
              Based on {ratingSummary.count.toLocaleString("en-IN")} retailer reviews
            </p>
          </div>
          <div className="grid gap-2">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const count = ratingSummary.buckets[star];
              const width = (count / ratingSummary.count) * 100;
              return (
                <div key={star} className="grid grid-cols-[3.5rem_1fr_2.5rem] items-center gap-2 text-sm">
                  <span>{star} star</span>
                  <span className="h-2 overflow-hidden rounded-full bg-white">
                    <span
                      className="block h-full rounded-full bg-gold"
                      style={{ width: `${width}%` }}
                    />
                  </span>
                  <span className="text-right tabular-nums text-muted">
                    {Math.round(width)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="chip-scroll mt-5 flex gap-2 overflow-x-auto"
          role="tablist"
          aria-label="Filter reviews"
        >
          {FILTERS.map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(item.id)}
                className={`shrink-0 rounded-full px-3 py-2 text-sm ${
                  selected
                    ? "bg-maroon text-white"
                    : "border border-line bg-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="mt-6 text-sm text-muted">
            No {filter === "all" ? "" : `${filter}-star `}reviews yet.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {visible.map((review) => (
              <article
                key={review.id}
                className={`rounded-2xl border border-line bg-white p-4 ${
                  review.id === freshReviewId ? "ring-2 ring-gold" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {review.reviewerName} – {review.shopName}, {review.city}
                    </h3>
                    <p className="mt-2">
                      <Stars value={review.rating} />
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-muted" dateTime={review.date}>
                    {formatDate(review.date)}
                  </time>
                </div>
                <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-maroon">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                  {review.verified ? "Verified retailer" : "Wholesale retailer"}
                </p>
                <p className="mt-3 text-sm leading-6">{review.comment}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
