"use client";

import { Field } from "@/components/Field";
import { Modal } from "@/components/Modal";
import { useCatalog } from "@/context/CatalogContext";
import { CATEGORIES, fieldClass } from "@/lib/constants";
import { createId } from "@/lib/format";
import { Check, Plus, Star } from "lucide-react";
import { useState, type FormEvent } from "react";

const REVIEW_SUGGESTIONS = [
  "Good response",
  "Good quality",
  "Competitive prices",
  "Fast dispatch",
  "Genuine wholesale rates",
  "Neat packaging",
  "Trustworthy supplier",
  "Wide variety",
];

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: "5 / 5 – Excellent",
  4: "4 / 5 – Very Good",
  3: "3 / 5 – Good",
  2: "2 / 5 – Fair",
  1: "1 / 5 – Needs Improvement",
};

export function ReviewModal() {
  const { reviewModalOpen } = useCatalog();
  if (!reviewModalOpen) return null;
  return <ReviewForm />;
}

function ReviewForm() {
  const { closeReviewModal, addReview, shop } = useCatalog();
  const [rating, setRating] = useState(5);
  const [name, setName] = useState(shop?.retailerName || "");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("not_selected");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectableCategories = CATEGORIES.filter((c) => c.id !== "all");

  const handleToggleSuggestion = (suggestion: string) => {
    const lower = comment.toLowerCase();
    const target = suggestion.toLowerCase();

    if (lower.includes(target)) {
      // Find and remove the suggestion
      const regex = new RegExp(
        `(^|[,.\\s])\\s*${suggestion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*([,.\\s]|$)`,
        "gi"
      );
      let updated = comment.replace(regex, "$1$2");
      // Clean up punctuation and spacing
      updated = updated
        .replace(/,\s*,+/g, ", ")
        .replace(/\s{2,}/g, " ")
        .replace(/^[,\s.]+/, "")
        .replace(/[,\s.]+$/, "");
      setComment(updated);
    } else {
      const trimmed = comment.trim();
      if (!trimmed) {
        setComment(suggestion);
      } else {
        const lastChar = trimmed.slice(-1);
        const separator = [".", "!", ",", "?"].includes(lastChar) ? " " : ", ";
        setComment(`${trimmed}${separator}${suggestion}`);
      }
    }
  };

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (rating < 1) next.rating = "Select a star rating.";
    if (name.trim().length < 2) next.name = "Enter your name.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addReview({
      id: createId("review"),
      reviewerName: name.trim(),
      shopName: shop?.shopName?.trim() || undefined,
      city: shop?.city?.trim() || undefined,
      productName: productName.trim() || undefined,
      category: category !== "not_selected" ? category : undefined,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      verified: true,
    });
  }

  return (
    <Modal open title="Write a Review" onClose={closeReviewModal}>
      <form onSubmit={onSubmit} className="grid gap-4">
        {/* Star Rating */}
        <div data-invalid={errors.rating ? "true" : undefined}>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Star rating *
            </p>
            <span className="text-xs font-semibold text-maroon-deep">
              {RATING_DESCRIPTIONS[rating] || `${rating} / 5`}
            </span>
          </div>
          <div role="radiogroup" aria-label="Star rating" className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                onClick={() => setRating(value)}
                className="grid h-11 w-11 place-items-center rounded-lg hover:bg-cream/60 transition"
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
              >
                <Star
                  className={
                    value <= rating ? "fill-gold text-gold" : "text-[#d9cbb8]"
                  }
                />
              </button>
            ))}
          </div>
          {errors.rating ? (
            <p className="mt-1.5 text-sm text-maroon">{errors.rating}</p>
          ) : null}
        </div>

        {/* Name */}
        <Field label="Your Name *" htmlFor="review-name" error={errors.name}>
          <input
            id="review-name"
            value={name}
            required
            placeholder="e.g. Ramesh Kumar, Sunita, etc."
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            className={fieldClass}
          />
        </Field>

        {/* Product Name & Category in a clean 2-column grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Product Name (Optional) */}
          <Field label="Product Name (Optional)" htmlFor="review-product">
            <input
              id="review-product"
              value={productName}
              placeholder="e.g. Antique Payal..."
              onChange={(event) => setProductName(event.target.value)}
              className={fieldClass}
            />
          </Field>

          {/* Category (Optional) */}
          <Field label="Category (Optional)" htmlFor="review-category">
            <select
              id="review-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={fieldClass}
            >
              <option value="not_selected">General review</option>
              {selectableCategories.map((c) => (
                <option key={c.id} value={c.label}>
                  {c.short} ({c.label})
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Quick Suggestions */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Quick Suggestions
            </span>
            <span className="text-[11px] text-muted">Tap to insert / remove</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {REVIEW_SUGGESTIONS.map((tag) => {
              const active = comment.toLowerCase().includes(tag.toLowerCase());
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleSuggestion(tag)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "bg-maroon text-white shadow-xs ring-1 ring-maroon"
                      : "border border-line bg-cream/50 text-ink/80 hover:border-gold hover:bg-cream"
                  }`}
                  aria-pressed={active}
                >
                  {active ? (
                    <Check className="h-3 w-3 shrink-0 stroke-[2.5]" />
                  ) : (
                    <Plus className="h-3 w-3 shrink-0 text-muted" />
                  )}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <Field
          label="Your Review (Optional)"
          htmlFor="review-comment"
          error={errors.comment}
        >
          <textarea
            id="review-comment"
            value={comment}
            rows={3}
            maxLength={600}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Tap suggestions above or write custom feedback (optional)..."
            className={fieldClass}
          />
        </Field>

        <p className="text-xs leading-5 text-muted">
          Your review will be published to the store and visible to other retailers.
        </p>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-maroon text-sm font-semibold text-white shadow-sm hover:bg-maroon-deep transition active:scale-[0.99]"
        >
          Submit Review
        </button>
      </form>
    </Modal>
  );
}
