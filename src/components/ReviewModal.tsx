"use client";

import { Field } from "@/components/Field";
import { Modal } from "@/components/Modal";
import { useCatalog } from "@/context/CatalogContext";
import { CATEGORIES, fieldClass } from "@/lib/constants";
import { createId } from "@/lib/format";
import { Star } from "lucide-react";
import { useState, type FormEvent } from "react";

export function ReviewModal() {
  const { reviewModalOpen } = useCatalog();
  if (!reviewModalOpen) return null;
  return <ReviewForm />;
}

function ReviewForm() {
  const { closeReviewModal, addReview } = useCatalog();
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("not_selected");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectableCategories = CATEGORIES.filter((c) => c.id !== "all");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (rating < 1) next.rating = "Select a star rating.";
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (comment.trim().length < 6) {
      next.comment = "Please write a short review note.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addReview({
      id: createId("review"),
      reviewerName: name.trim(),
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
      <form onSubmit={onSubmit} className="grid gap-3.5">
        {/* Star Rating */}
        <div data-invalid={errors.rating ? "true" : undefined}>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Star rating *
          </p>
          <div role="radiogroup" aria-label="Star rating" className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                onClick={() => setRating(value)}
                className="grid h-11 w-11 place-items-center"
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

        {/* Product Name (Optional) */}
        <Field label="Product Name (Optional)" htmlFor="review-product">
          <input
            id="review-product"
            value={productName}
            placeholder="e.g. Antique Payal, Kundan Bridal Set..."
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
            <option value="not_selected">Not selected (General review)</option>
            {selectableCategories.map((c) => (
              <option key={c.id} value={c.label}>
                {c.short} ({c.label})
              </option>
            ))}
          </select>
        </Field>

        {/* Comment */}
        <Field label="Your Review *" htmlFor="review-comment" error={errors.comment}>
          <textarea
            id="review-comment"
            value={comment}
            rows={4}
            maxLength={600}
            required
            onChange={(event) => setComment(event.target.value)}
            placeholder="Tell us about the quality, factory rates, packing, or delivery speed..."
            className={fieldClass}
          />
        </Field>

        <p className="text-xs leading-5 text-muted">
          Your review will be published to the store and visible to other retailers.
        </p>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-maroon text-sm font-semibold text-white hover:bg-maroon-deep transition"
        >
          Submit Review
        </button>
      </form>
    </Modal>
  );
}
