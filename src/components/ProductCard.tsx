"use client";

import { ProductArt } from "@/components/ProductArt";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { QtyStepper } from "@/components/QtyStepper";
import { useCatalog } from "@/context/CatalogContext";
import { moqLabel, unitPhrase } from "@/lib/format";
import type { Product } from "@/lib/types";
import { buildItemMessage, whatsappHref } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { addToEnquiry, cartQty, shop } = useCatalog();
  const inCart = cartQty(product.id);
  const [qty, setQty] = useState(inCart ?? product.moq);
  const [trackedCart, setTrackedCart] = useState(inCart);
  const [detailOpen, setDetailOpen] = useState(false);

  if (trackedCart !== inCart) {
    setTrackedCart(inCart);
    if (inCart != null) setQty(inCart);
  }

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_12px_30px_rgba(67,16,24,0.05)] transition hover:shadow-lg">
        {/* Clickable Image to view description */}
        <div
          onClick={() => setDetailOpen(true)}
          className="relative aspect-[4/3] overflow-hidden cursor-pointer"
          title="Click to view details"
        >
          <div className="zoom-art relative h-full w-full transition duration-500 group-hover:scale-105">
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
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
              )
            ) : (
              <ProductArt tone={product.tone} motif={product.motif} />
            )}
          </div>
          {product.badge ? (
            <span
              className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] shadow-sm ${
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
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            {product.category === "brite-store" && (
              <span className="inline-block mb-1 rounded-full bg-maroon/10 border border-maroon/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-maroon">
                BRITE STORE{product.subcategory ? ` · ${product.subcategory}` : ""}
              </span>
            )}
            <h3
              onClick={() => setDetailOpen(true)}
              className="font-serif text-xl leading-tight text-maroon-deep cursor-pointer hover:text-gold transition"
              title="Click to view details"
            >
              {product.name}
            </h3>
            {product.description ? (
              <p
                onClick={() => setDetailOpen(true)}
                className="mt-1.5 text-xs leading-relaxed text-ink/75 line-clamp-2 cursor-pointer hover:text-ink transition"
                title="Click to read full description"
              >
                {product.description}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-ink">
              {moqLabel(product.moq, product.unit)}
            </span>
            {inCart ? (
              <span className="text-xs font-medium text-whatsapp">
                In list · {unitPhrase(inCart, product.unit)}
              </span>
            ) : null}
          </div>
          <p
            className={
              product.price == null
                ? "text-sm font-semibold text-maroon"
                : "font-serif text-2xl text-maroon-deep"
            }
          >
            {product.priceLabel}
          </p>
          <QtyStepper
            value={qty}
            min={product.moq}
            label={unitPhrase(qty, product.unit)}
            onChange={setQty}
          />
          <div className="mt-auto grid gap-2">
            <button
              type="button"
              onClick={() => addToEnquiry(product.id, qty)}
              className="inline-flex h-12 items-center justify-center rounded-full bg-maroon px-4 text-sm font-semibold text-white hover:bg-maroon-deep transition"
            >
              {inCart ? "Update Enquiry List" : "Add to Enquiry List"}
            </button>
            <a
              href={whatsappHref(buildItemMessage(product, qty, shop))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-whatsapp/30 px-4 py-2 text-center text-sm leading-5 font-semibold text-whatsapp hover:bg-whatsapp/10 transition"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </article>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailOpen ? product : null}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
