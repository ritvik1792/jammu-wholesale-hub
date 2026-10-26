"use client";

import { Modal } from "@/components/Modal";
import { ProductArt } from "@/components/ProductArt";
import { QtyStepper } from "@/components/QtyStepper";
import { useCatalog } from "@/context/CatalogContext";
import { moqLabel, unitPhrase } from "@/lib/format";
import type { Product } from "@/lib/types";
import { buildItemMessage, whatsappHref } from "@/lib/whatsapp";
import { Check, MessageCircle, Sparkles, Tag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addToEnquiry, cartQty, shop } = useCatalog();
  const inCart = product ? cartQty(product.id) : undefined;
  const [qty, setQty] = useState(inCart ?? (product?.moq ?? 1));

  if (!product) return null;

  const handleAdd = () => {
    addToEnquiry(product.id, qty);
  };

  return (
    <Modal open title={product.name} onClose={onClose}>
      <div className="grid gap-5">
        {/* Large Product Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-cream shadow-sm">
          {product.image ? (
            product.image.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 92vw, 480px"
                className="object-cover"
              />
            )
          ) : (
            <ProductArt tone={product.tone} motif={product.motif} />
          )}

          {/* Badge */}
          {product.badge ? (
            <span
              className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow ${
                product.badge.toLowerCase().includes("special")
                  ? "bg-amber-500 text-white"
                  : product.badge.toLowerCase().includes("promot")
                  ? "bg-maroon text-white"
                  : "bg-paper/95 text-maroon"
              }`}
            >
              {product.badge}
            </span>
          ) : null}

          <span className="absolute right-3 bottom-3 rounded-full bg-ink/65 px-2.5 py-1 font-mono text-[11px] tracking-wide text-white backdrop-blur">
            {product.sku}
          </span>
        </div>

        {/* Product Details */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif text-2xl font-bold text-maroon-deep">
              {product.name}
            </h3>
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink">
              {moqLabel(product.moq, product.unit)}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted">SKU: {product.sku}</p>

          {/* Price & Unit Details */}
          <div className="mt-3 rounded-2xl border border-line bg-[#fdfaf5] p-3.5">
            <p className="text-xs uppercase tracking-wider text-muted font-medium">Wholesale Rate</p>
            <p
              className={
                product.price == null
                  ? "text-base font-semibold text-maroon"
                  : "font-serif text-3xl font-bold text-maroon-deep mt-0.5"
              }
            >
              {product.priceLabel}
            </p>
            {product.unitsPerBox ? (
              <p className="mt-1 text-xs text-ink/80 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-gold" />
                Packaging: {product.unitsPerBox} units per {product.unit}
              </p>
            ) : null}
          </div>

          {/* Full Description */}
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
              Description &amp; Specifications
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/85 whitespace-pre-line">
              {product.description ||
                "Standard wholesale lot ready for counter display. Contact us directly on WhatsApp for live photos of current shade assortments and bulk booking."}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="border-t border-line pt-4 grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Order Quantity
            </span>
            <QtyStepper
              value={qty}
              min={product.moq}
              label={unitPhrase(qty, product.unit)}
              onChange={setQty}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-maroon px-4 text-sm font-semibold text-white hover:bg-maroon-deep transition"
            >
              {inCart ? (
                <>
                  <Check className="h-4 w-4" /> Updated in Enquiry
                </>
              ) : (
                "Add to Enquiry List"
              )}
            </button>

            <a
              href={whatsappHref(buildItemMessage(product, qty, shop))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-whatsapp/40 bg-[#f0faf2] px-4 text-sm font-semibold text-whatsapp hover:bg-whatsapp hover:text-white transition"
            >
              <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
