import { NextResponse } from "next/server";
import { getAllReviews, getStoredReviews, saveStoredReviews } from "@/lib/reviews-store";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const reviews = await getAllReviews();
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewerName, shopName, city, productName, category, rating, comment } = body;

    if (!reviewerName || !rating) {
      return NextResponse.json(
        { error: "Name and rating are required" },
        { status: 400 }
      );
    }

    const newReview: Review = {
      id: `rev-${Date.now().toString(36)}`,
      reviewerName: String(reviewerName).trim(),
      shopName: shopName ? String(shopName).trim() : undefined,
      city: city ? String(city).trim() : undefined,
      productName: productName ? String(productName).trim() : undefined,
      category: category && category !== "not_selected" ? String(category).trim() : undefined,
      rating: Math.max(1, Math.min(5, Number(rating))),
      comment: comment ? String(comment).trim() : "",
      date: new Date().toISOString(),
      verified: false,
    };

    const existing = await getStoredReviews();
    await saveStoredReviews([newReview, ...existing]);

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("Failed to post review:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
