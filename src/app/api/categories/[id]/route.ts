import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteCustomCategory } from "@/lib/categories-store";

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
    const success = await deleteCustomCategory(id);
    if (!success) {
      return NextResponse.json(
        { error: "Cannot delete built-in category or category not found" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
