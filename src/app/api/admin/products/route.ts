import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import {
  getCustomProducts,
  saveCustomProducts,
  getAllProducts,
  getDeletedProductIds,
} from "@/lib/products-store";
import { getAdminSession } from "@/lib/auth";
import type { CategoryId, Motif, Product, SellUnit, Tone } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(
      { products },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await getAdminSession();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const category = (formData.get("category") || "jewellery") as CategoryId;
    const subcategoryRaw = formData.get("subcategory");
    const priceRaw = formData.get("price");
    const unit = (formData.get("unit") || "dozen") as SellUnit;
    const moqRaw = formData.get("moq");
    const unitsPerBoxRaw = formData.get("unitsPerBox");
    const description = String(formData.get("description") || "").trim();
    const badge = String(formData.get("badge") || "").trim() || undefined;
    const promoted =
      formData.get("promoted") === "true" ||
      badge === "Promoted" ||
      badge === "Special Offer";
    const imageFile = formData.get("image") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const subcategory =
      category === "brite-store" && subcategoryRaw
        ? String(subcategoryRaw).trim().toLowerCase()
        : undefined;

    if (category === "brite-store") {
      if (!subcategory || !["kids", "ladies", "gents"].includes(subcategory)) {
        return NextResponse.json(
          { error: "Please select a valid subcategory for BRITE STORE (Kids, Ladies, or Gents)." },
          { status: 400 }
        );
      }
    }

    const price =
      priceRaw && !isNaN(Number(priceRaw)) && Number(priceRaw) > 0
        ? Number(priceRaw)
        : null;
    const moq =
      moqRaw && !isNaN(Number(moqRaw)) && Number(moqRaw) > 0 ? Number(moqRaw) : 1;
    const unitsPerBox =
      unitsPerBoxRaw && !isNaN(Number(unitsPerBoxRaw)) && Number(unitsPerBoxRaw) > 0
        ? Number(unitsPerBoxRaw)
        : undefined;

    let priceLabel = price
      ? `₹${price.toLocaleString("en-IN")} / ${unit}`
      : "Inquire for Wholesale Tier";
    if (price && unitsPerBox && unitsPerBox > 1) {
      const perUnit = Math.round((price / unitsPerBox) * 100) / 100;
      priceLabel = `₹${price.toLocaleString("en-IN")} / ${unit} (${unitsPerBox} pcs · ₹${perUnit}/pc)`;
    }

    let imagePath: string | undefined = undefined;

    if (imageFile && imageFile.size > 0) {
      const ext = path.extname(imageFile.name) || ".jpg";
      const sanitizedName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .slice(0, 30);
      const filename = `${sanitizedName}-${Date.now()}${ext}`;

      // If running on Vercel with Vercel Blob configured
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const blob = await put(`products/${filename}`, imageFile, {
            access: "public",
          });
          imagePath = blob.url;
        } catch (blobErr: unknown) {
          const errMsg = blobErr instanceof Error ? blobErr.message : String(blobErr);
          if (errMsg.includes("private store")) {
            return NextResponse.json(
              {
                error:
                  "Your Vercel Blob store is configured with 'Private' access. Product images require 'Public' access so store customers can view them. In Vercel -> Storage, delete the store, create a new Blob store with 'Public' access selected, and click Connect.",
              },
              { status: 400 }
            );
          }
          throw blobErr;
        }
      } else if (process.env.VERCEL === "1") {
        throw new Error(
          "Vercel Blob storage is not connected yet! In your Vercel Dashboard, go to Storage -> Create Database -> Select Blob, and click Connect."
        );
      } else {
        // Fallback to local public/products folder
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), "public/products");

        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, filename), buffer);
        imagePath = `/products/${filename}`;
      }
    }

    const id = `prod-${Date.now().toString(36)}`;

    const toneMap: Record<CategoryId, Tone> = {
      "brite-store": "navy",
      jewellery: "gold",
      cosmetics: "rose",
      bags: "ink",
      hair: "plum",
      bangles: "emerald",
      festival: "saffron",
    };

    const motifMap: Record<CategoryId, Motif> = {
      "brite-store": "clothing",
      jewellery: "necklace",
      cosmetics: "makeup",
      bags: "handbag",
      hair: "hair",
      bangles: "bangles",
      festival: "bridal",
    };

    const keywords = [
      ...name.toLowerCase().split(/\s+/),
      category,
      subcategory || "",
      unit,
      ...(description ? description.toLowerCase().split(/\s+/).slice(0, 10) : []),
    ];

    // SKU is completely omitted/optional per requirements
    const newProduct: Product = {
      id,
      name,
      category,
      subcategory,
      keywords,
      moq,
      unit,
      price,
      priceLabel,
      tone: toneMap[category] || "navy",
      motif: motifMap[category] || "clothing",
      badge,
      description: description || undefined,
      promoted,
      unitsPerBox,
      image: imagePath,
    };

    // Ensure previously deleted products stay permanently deleted when uploading a new product
    const existingCustom = await getCustomProducts();
    const deleted = await getDeletedProductIds();
    const cleanExisting = existingCustom.filter((p) => !deleted.includes(p.id));

    await saveCustomProducts([newProduct, ...cleanExisting]);

    return NextResponse.json(
      { success: true, product: newProduct },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Failed to add product:", error);
    const message = error instanceof Error ? error.message : "Failed to save product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
