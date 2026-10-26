import { NextResponse } from "next/server";
import { getCustomProducts, saveCustomProducts, markProductDeleted } from "@/lib/products-store";
import { PRODUCTS as SEED_PRODUCTS } from "@/data/products";
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
    await markProductDeleted(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

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
    const custom = await getCustomProducts();
    const isCustom = custom.some((p) => p.id === id);

    if (isCustom) {
      const updated = custom.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...body,
            badge: body.badge !== undefined ? body.badge : p.badge,
            promoted: body.promoted !== undefined ? body.promoted : p.promoted,
          };
        }
        return p;
      });
      await saveCustomProducts(updated);
    } else {
      // If updating a seed product, copy it into custom products with updated values
      const seed = SEED_PRODUCTS.find((p) => p.id === id);
      if (seed) {
        const updatedSeed = {
          ...seed,
          ...body,
          badge: body.badge !== undefined ? body.badge : seed.badge,
          promoted: body.promoted !== undefined ? body.promoted : seed.promoted,
        };
        await saveCustomProducts([updatedSeed, ...custom.filter((p) => p.id !== id)]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
