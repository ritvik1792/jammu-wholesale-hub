"use client";

import { BUSINESS } from "@/lib/constants";
import { useCatalog } from "@/context/CatalogContext";
import { MessageCircle, Phone, ShoppingBag } from "lucide-react";

export function MobileDock() {
  const {
    itemCount,
    openDrawer,
    drawerOpen,
    callbackOpen,
    reviewModalOpen,
    instantWhatsApp,
  } = useCatalog();

  if (drawerOpen || callbackOpen || reviewModalOpen) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${BUSINESS.callTel}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-maroon px-3 text-sm font-semibold text-white"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            Call Now
          </a>
          <button
            type="button"
            onClick={instantWhatsApp}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
            Chat on WhatsApp
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={openDrawer}
        aria-label={
          itemCount === 0
            ? "Open enquiry list"
            : `Open enquiry list, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
        }
        className="fixed right-4 bottom-24 z-40 hidden h-14 w-14 place-items-center rounded-full bg-maroon-deep text-gold-bright shadow-lg md:grid"
      >
        <ShoppingBag className="h-5 w-5" aria-hidden />
        {itemCount > 0 ? (
          <span className="absolute -top-1 -right-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-gold-bright px-1 text-xs font-bold text-maroon-deep">
            {itemCount}
          </span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={instantWhatsApp}
        className="fixed right-4 bottom-6 z-40 hidden h-14 items-center gap-2 rounded-full bg-whatsapp px-4 text-sm font-semibold text-white shadow-lg md:inline-flex"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        Chat on WhatsApp
      </button>
    </>
  );
}
