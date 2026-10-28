import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { addCustomCategory, getAllCategories } from "@/lib/categories-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(
      { categories },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await getAdminSession();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const short = typeof body.short === "string" ? body.short.trim() : undefined;
    const description = typeof body.description === "string" ? body.description.trim() : undefined;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const category = await addCustomCategory({ name, short, description });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
