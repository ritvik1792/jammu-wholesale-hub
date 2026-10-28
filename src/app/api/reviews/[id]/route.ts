import { NextResponse } from "next/server";
import { markReviewDeleted, updateReview } from "@/lib/reviews-store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthorized = await getAdminSession();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const patch: { adminReply?: string; promoted?: boolean } = {};
    if ("adminReply" in body && typeof body.adminReply === "string") {
      patch.adminReply = body.adminReply;
    }
    if ("promoted" in body && typeof body.promoted === "boolean") {
      patch.promoted = body.promoted;
    }

    await updateReview(id, patch);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthorized = await getAdminSession();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await markReviewDeleted(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
