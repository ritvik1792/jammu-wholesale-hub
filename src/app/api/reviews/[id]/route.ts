import { NextResponse } from "next/server";
import { markReviewDeleted } from "@/lib/reviews-store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
