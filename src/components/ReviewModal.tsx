"use client";

import { CitySelect } from "@/components/CitySelect";
import { Field } from "@/components/Field";
import { Modal } from "@/components/Modal";
import { useCatalog } from "@/context/CatalogContext";
import { fieldClass } from "@/lib/constants";
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
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [city, setCity] = useState("");
  const [otherCity, setOtherCity] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (rating < 1) next.rating = "Select a star rating.";
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (shopName.trim().length < 2) next.shopName = "Enter the shop name.";
    const place = city === "Other" ? otherCity.trim() : city.trim();
    if (place.length < 2) next.city = "Enter the city or district.";
    if (comment.trim().length < 12) {
      next.comment = "Write a short note for other retailers.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addReview({
      id: createId("review"),
      reviewerName: name.trim(),
      shopName: shopName.trim(),
      city: place,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      verified: false,
    });
  }

  return (
    <Modal open title="Write a Review" onClose={closeReviewModal}>
      <form onSubmit={onSubmit} className="grid gap-3">
        <div data-invalid={errors.rating ? "true" : undefined}>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Star rating
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
        <Field label="Retailer name" htmlFor="review-name" error={errors.name}>
          <input
            id="review-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            className={fieldClass}
          />
        </Field>
        <Field label="Shop name" htmlFor="review-shop" error={errors.shopName}>
          <input
            id="review-shop"
            value={shopName}
            onChange={(event) => setShopName(event.target.value)}
            autoComplete="organization"
            className={fieldClass}
          />
        </Field>
        <CitySelect
          id="review-city"
          label="City / location in J&K"
          city={city}
          otherCity={otherCity}
          error={errors.city}
          onCity={setCity}
          onOther={setOtherCity}
        />
        <Field label="Review" htmlFor="review-comment" error={errors.comment}>
          <textarea
            id="review-comment"
            value={comment}
            rows={4}
            maxLength={600}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Rates, packing, and how fast the parcel reached your shop."
            className={fieldClass}
          />
        </Field>
        <p className="text-xs leading-5 text-muted">
          Your review shows on this phone straight away and stays saved here.
        </p>
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-maroon text-sm font-semibold text-white"
        >
          Submit Review
        </button>
      </form>
    </Modal>
  );
}
