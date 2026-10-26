import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { getCustomProducts, saveCustomProducts, getAllProducts } from "@/lib/products-store";
import type { CategoryId, Motif, Product, SellUnit, Tone } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const category = (formData.get("category") || "jewellery") as CategoryId;
    const priceRaw = formData.get("price");
    const unit = (formData.get("unit") || "dozen") as SellUnit;
    const moqRaw = formData.get("moq");
    const description = String(formData.get("description") || "").trim();
    const badge = String(formData.get("badge") || "").trim() || undefined;
    const promoted = formData.get("promoted") === "true" || badge === "Promoted" || badge === "Special Offer";
    const imageFile = formData.get("image") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const price = priceRaw && !isNaN(Number(priceRaw)) && Number(priceRaw) > 0 ? Number(priceRaw) : null;
    const moq = moqRaw && !isNaN(Number(moqRaw)) && Number(moqRaw) > 0 ? Number(moqRaw) : 1;
    const priceLabel = price ? `₹${price.toLocaleString("en-IN")} / ${unit}` : "Inquire for Wholesale Tier";

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
        const blob = await put(`products/${filename}`, imageFile, {
          access: "public",
        });
        imagePath = blob.url;
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
    const categoryPrefix = category.slice(0, 3).toUpperCase();
    const sku = `JMU-${categoryPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const toneMap: Record<CategoryId, Tone> = {
      jewellery: "gold",
      cosmetics: "rose",
      bags: "ink",
      hair: "plum",
      bangles: "emerald",
      festival: "saffron",
    };

    const motifMap: Record<CategoryId, Motif> = {
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
      unit,
      ...(description ? description.toLowerCase().split(/\s+/).slice(0, 10) : []),
    ];

    const newProduct: Product = {
      id,
      sku,
      name,
      category,
      keywords,
      moq,
      unit,
      price,
      priceLabel,
      tone: toneMap[category] || "gold",
      motif: motifMap[category] || "necklace",
      badge,
      description: description || undefined,
      promoted,
      image: imagePath,
    };

    const existingCustom = await getCustomProducts();
    await saveCustomProducts([newProduct, ...existingCustom]);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Failed to add product:", error);
    const message = error instanceof Error ? error.message : "Failed to save product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
