import { BUSINESS } from "@/lib/constants";
import { GENERAL_ENQUIRY, whatsappHref } from "@/lib/whatsapp";
import { Clock, ExternalLink, Mail, MapPin, Phone, Shirt, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer id="visit" className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* Top Header & Intro */}
        <div className="grid gap-6 md:grid-cols-2 md:items-end border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-bright/10 border border-gold-bright/30 px-3 py-1 text-xs font-semibold text-gold-bright">
              Wholesale Counters · Jammu
            </div>
            <p className="mt-3 font-serif text-3xl sm:text-4xl text-gold-bright">
              {BUSINESS.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Direct factory wholesale supply for retailers, boutiques, and counter resellers across
              Jammu &amp; Kashmir, Ladakh, Punjab, and Himachal Pradesh.
            </p>
          </div>

          {/* Quick Desk Contact */}
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <a
              href={`tel:${BUSINESS.callTel}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:border-gold-bright hover:text-gold-bright transition"
            >
              <Phone className="h-3.5 w-3.5 text-gold-bright" />
              Call: {BUSINESS.callDisplay}
            </a>
            <a
              href={whatsappHref(GENERAL_ENQUIRY)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-xs font-semibold text-white hover:brightness-110 transition shadow-sm"
            >
              WhatsApp Desk
            </a>
            <a
              href={`mailto:${BUSINESS.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/80 hover:text-white transition"
            >
              <Mail className="h-3.5 w-3.5 text-gold-bright" />
              {BUSINESS.email}
            </a>
          </div>
        </div>

        {/* Both Showroom Addresses */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-bright">
            Visit Our Showrooms in Jammu
          </p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {/* Location 1: Main Showroom */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur flex flex-col justify-between transition hover:border-gold-bright/40">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-bright/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-bright">
                    <Sparkles className="h-3 w-3" /> Main Showroom
                  </span>
                  <span className="text-[11px] font-mono text-white/50">Shalamar</span>
                </div>
                <h4 className="mt-3 font-serif text-xl font-bold text-white">
                  B.B. Gupta &amp; Bros.
                </h4>
                <p className="mt-1 text-xs font-medium text-gold-bright">
                  Artificial Jewellery, Cosmetics, Bangles &amp; Fancy Accessories
                </p>
                <div className="mt-4 flex gap-2.5 text-xs leading-relaxed text-white/80">
                  <MapPin className="h-4 w-4 shrink-0 text-gold-bright mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">{BUSINESS.street}</p>
                    <p className="text-white/70">{BUSINESS.locality}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2.5 text-xs text-white/70">
                  <Clock className="h-4 w-4 shrink-0 text-gold-bright mt-0.5" />
                  <p>{BUSINESS.hours} · {BUSINESS.sundayHours}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-bright/15 hover:bg-gold-bright hover:text-maroon-deep border border-gold-bright/30 px-3.5 py-2 text-xs font-semibold text-gold-bright transition w-full justify-center"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Open Shalamar Showroom on Google Maps
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            </div>

            {/* Location 2: BRITE STORE Clothing Showroom */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur flex flex-col justify-between transition hover:border-gold-bright/40">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-bright">
                    <Shirt className="h-3 w-3" /> Garments Showroom
                  </span>
                  <span className="text-[11px] font-mono text-white/50">Kanak Mandi</span>
                </div>
                <h4 className="mt-3 font-serif text-xl font-bold text-white">
                  BRITE STORE
                </h4>
                <p className="mt-1 text-xs font-medium text-gold-bright">
                  Ready-Made Clothing (Kids Wear, Ladies Suits &amp; Gents Collections)
                </p>
                <div className="mt-4 flex gap-2.5 text-xs leading-relaxed text-white/80">
                  <MapPin className="h-4 w-4 shrink-0 text-gold-bright mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">
                      {BUSINESS.clothingDivision.street}
                    </p>
                    <p className="text-white/70">{BUSINESS.clothingDivision.locality}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2.5 text-xs text-white/70">
                  <Clock className="h-4 w-4 shrink-0 text-gold-bright mt-0.5" />
                  <p>{BUSINESS.hours} · {BUSINESS.sundayHours}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <a
                  href={BUSINESS.clothingDivision.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-bright/15 hover:bg-gold-bright hover:text-maroon-deep border border-gold-bright/30 px-3.5 py-2 text-xs font-semibold text-gold-bright transition w-full justify-center"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Open Kanak Mandi Store on Google Maps
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 pb-28 text-center text-xs text-white/50 md:pb-6 flex flex-wrap items-center justify-center gap-4">
        <span>© {new Date().getFullYear()} {BUSINESS.name} &amp; BRITE STORE. Wholesale rates for retailers.</span>
        <span>•</span>
        <a href="/admin" className="text-white/40 hover:text-gold-bright transition underline">
          Admin Portal
        </a>
      </div>
    </footer>
  );
}
