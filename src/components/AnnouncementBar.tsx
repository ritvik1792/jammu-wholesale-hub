"use client";

import { useCatalog } from "@/context/CatalogContext";
import { BUSINESS } from "@/lib/constants";
import { GENERAL_ENQUIRY, whatsappHref } from "@/lib/whatsapp";
import { MapPin, MessageCircle, Phone } from "lucide-react";

export function AnnouncementBar() {
  const { openLocationModal } = useCatalog();

  return (
    <div className="bg-maroon-deep text-gold-bright">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2 text-center text-[12px] sm:text-sm">
        <a
          href={`tel:${BUSINESS.callTel}`}
          className="inline-flex items-center gap-1.5 font-medium hover:text-white transition"
        >
          <Phone className="h-3.5 w-3.5" aria-hidden />
          <span>Call Us: {BUSINESS.callDisplay}</span>
        </a>
        <span className="hidden text-white/30 sm:inline" aria-hidden>
          |
        </span>
        <a
          href={whatsappHref(GENERAL_ENQUIRY)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium hover:text-white transition"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          <span>WhatsApp &amp; Queries: {BUSINESS.whatsappDisplay}</span>
        </a>
        <span className="hidden text-white/30 sm:inline" aria-hidden>
          |
        </span>
        <button
          type="button"
          onClick={openLocationModal}
          className="inline-flex items-center gap-1.5 font-medium text-gold-bright hover:text-white transition cursor-pointer"
          aria-label="Get showroom locations in Jammu"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-bright" aria-hidden />
          <span className="underline underline-offset-4 decoration-gold-bright/60 hover:decoration-white">
            Get Location: Shalamar &amp; Kanak Mandi, Jammu
          </span>
        </button>
      </div>
    </div>
  );
}
