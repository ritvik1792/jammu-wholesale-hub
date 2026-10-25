"use client";

import { Modal } from "@/components/Modal";
import { useCatalog } from "@/context/CatalogContext";
import { BUSINESS } from "@/lib/constants";
import { formatMobile, unitPhrase } from "@/lib/format";
import { resolvedCity } from "@/lib/validate";
import { whatsappHref } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export function CallbackModal() {
  const { callbackOpen, closeCallback, shop, lines, callbackMessage } = useCatalog();
  const city = resolvedCity(shop);

  return (
    <Modal open={callbackOpen} title="Callback requested" onClose={closeCallback}>
      <p className="text-sm leading-6 text-muted">
        The {BUSINESS.name} desk in Jammu can ring{" "}
        <span className="font-semibold text-foreground">{shop.retailerName.trim()}</span>{" "}
        at {shop.shopName.trim()}, {city}, on {formatMobile(shop.mobile.trim())}.
        Send this note on WhatsApp so the request reaches the counter.
      </p>
      {lines.length > 0 ? (
        <ul className="mt-4 grid gap-2 rounded-2xl bg-cream p-3 text-sm">
          {lines.map((line) => (
            <li key={line.product.id} className="flex justify-between gap-3">
              <span>
                {line.product.name}
                <span className="block text-xs text-muted">{line.product.sku}</span>
              </span>
              <span className="shrink-0 font-medium">
                {unitPhrase(line.quantity, line.product.unit)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-2xl bg-cream p-3 text-sm text-muted">
          No items were attached. Mention what you want to stock when they call.
        </p>
      )}
      <div className="mt-5 grid gap-2">
        <a
          href={whatsappHref(callbackMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Send callback on WhatsApp
        </a>
        <button
          type="button"
          onClick={closeCallback}
          className="inline-flex h-11 items-center justify-center text-sm font-semibold text-maroon"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
