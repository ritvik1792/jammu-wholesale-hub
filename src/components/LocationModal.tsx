"use client";

import { Modal } from "@/components/Modal";
import { useCatalog } from "@/context/CatalogContext";
import { BUSINESS } from "@/lib/constants";
import { scrollToId } from "@/lib/format";
import { Clock, ExternalLink, MapPin, Navigation, Phone, Shirt, Sparkles } from "lucide-react";

export function LocationModal() {
  const { locationModalOpen, closeLocationModal } = useCatalog();
  if (!locationModalOpen) return null;

  return (
    <Modal open title="Showroom Locations in Jammu" onClose={closeLocationModal}>
      <div className="grid gap-4 text-ink">
        <p className="text-xs leading-relaxed text-muted">
          Visit our wholesale showrooms in Jammu. Tap &ldquo;Open in Google Maps&rdquo; for live turn-by-turn navigation.
        </p>

        {/* Location 1: Main Showroom */}
        <div className="rounded-2xl border border-line bg-cream/50 p-4 transition hover:border-gold">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-maroon/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-maroon">
                <Sparkles className="h-2.5 w-2.5 text-maroon" /> Main Showroom
              </span>
              <h3 className="mt-1 font-serif text-lg font-bold text-maroon-deep">
                {BUSINESS.name}
              </h3>
            </div>
            <span className="rounded-full bg-gold-bright/30 px-2.5 py-0.5 text-[10px] font-bold text-maroon-deep">
              Jewellery &amp; Cosmetics
            </span>
          </div>

          <p className="mt-1 text-xs text-muted font-medium">
            Artificial Jewellery · Cosmetics · Purses · Hair Accessories · Bangles · Festive Rakhi
          </p>

          <address className="mt-3 grid gap-2 text-xs not-italic text-ink/85">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-maroon" />
              <span>
                <strong>Shop No. 1, JDA CC Complex</strong>, Old Hospital Road, Shalamar, Pakki Dhaki, Jammu, J&amp;K 180001
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Clock className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span>{BUSINESS.hours}</span>
            </div>
          </address>

          <div className="mt-3.5 flex flex-wrap gap-2">
            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-maroon px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-maroon-deep transition"
            >
              <Navigation className="h-3.5 w-3.5" />
              Open in Google Maps
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
            <a
              href={`tel:${BUSINESS.callTel}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink hover:border-gold hover:text-maroon transition"
            >
              <Phone className="h-3.5 w-3.5 text-maroon" />
              Call Showroom
            </a>
          </div>
        </div>

        {/* Location 2: Clothing Division */}
        <div className="rounded-2xl border border-line bg-cream/50 p-4 transition hover:border-gold">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-maroon-deep">
                <Shirt className="h-2.5 w-2.5 text-maroon" /> Clothing Division
              </span>
              <h3 className="mt-1 font-serif text-lg font-bold text-maroon-deep">
                {BUSINESS.clothingDivision.name}
              </h3>
            </div>
            <span className="rounded-full bg-maroon/10 px-2.5 py-0.5 text-[10px] font-bold text-maroon">
              Ready-Made Garments
            </span>
          </div>

          <p className="mt-1 text-xs text-muted font-medium">
            Wholesale Garments for Kids, Ladies &amp; Gents · Bulk lots &amp; Daily arrivals
          </p>

          <address className="mt-3 grid gap-2 text-xs not-italic text-ink/85">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-maroon" />
              <span>
                <strong>196, Chabeel Wali Gali</strong>, Near City Chowk, Kanak Mandi, Pakki Dhaki, Old Heritage City, Jammu, J&amp;K 180001
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Clock className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span>{BUSINESS.hours}</span>
            </div>
          </address>

          <div className="mt-3.5 flex flex-wrap gap-2">
            <a
              href={BUSINESS.clothingDivision.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gold-bright px-4 py-2 text-xs font-semibold text-maroon-deep shadow-xs hover:brightness-105 transition"
            >
              <Navigation className="h-3.5 w-3.5" />
              Open in Google Maps
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
            <a
              href={`tel:${BUSINESS.callTel}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink hover:border-gold hover:text-maroon transition"
            >
              <Phone className="h-3.5 w-3.5 text-maroon" />
              Call Showroom
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            closeLocationModal();
            scrollToId("visit");
          }}
          className="mt-1 text-center text-xs font-semibold text-maroon hover:underline"
        >
          View Full Store Details &amp; Interactive Map in Footer ↓
        </button>
      </div>
    </Modal>
  );
}
