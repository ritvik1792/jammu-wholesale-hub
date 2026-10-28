import { NextResponse } from "next/server";
import { getCustomProducts, saveCustomProducts, markProductDeleted } from "@/lib/products-store";
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
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await markProductDeleted(id);
    return NextResponse.json(
      { success: true, id },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Failed to delete product:", error);
    const message = error instanceof Error ? error.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 500 });
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
          const nextPrice = body.price !== undefined ? (body.price ? Number(body.price) : null) : p.price;
          const nextUnit = body.unit !== undefined ? body.unit : p.unit;
          const nextUnitsPerBox =
            body.unitsPerBox !== undefined
              ? (body.unitsPerBox ? Number(body.unitsPerBox) : undefined)
              : p.unitsPerBox;

          let priceLabel = p.priceLabel;
          if (nextPrice && nextUnitsPerBox && Number(nextUnitsPerBox) > 1) {
            const perUnit = Math.round((Number(nextPrice) / Number(nextUnitsPerBox)) * 100) / 100;
            priceLabel = `₹${Number(nextPrice).toLocaleString("en-IN")} / ${nextUnit} (${nextUnitsPerBox} pcs · ₹${perUnit}/pc)`;
          } else if (nextPrice) {
            priceLabel = `₹${Number(nextPrice).toLocaleString("en-IN")} / ${nextUnit}`;
          }

          return {
            ...p,
            ...body,
            price: nextPrice,
            unit: nextUnit,
            unitsPerBox: nextUnitsPerBox,
            priceLabel: body.priceLabel || priceLabel,
            category: body.category !== undefined ? body.category : p.category,
            subcategory: body.subcategory !== undefined ? body.subcategory : p.subcategory,
            badge: body.badge !== undefined ? body.badge : p.badge,
            promoted: body.promoted !== undefined ? body.promoted : p.promoted,
          };
        }
        return p;
      });
      await saveCustomProducts(updated);
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Failed to update product:", error);
    const message = error instanceof Error ? error.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
