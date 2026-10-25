import { BUSINESS } from "@/lib/constants";
import { GENERAL_ENQUIRY, whatsappHref } from "@/lib/whatsapp";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="visit" className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:py-14">
        <div>
          <p className="font-serif text-3xl text-gold-bright">{BUSINESS.name}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
            Wholesale artificial jewellery, cosmetics, purses, hair accessories,
            bangles, and festive stock for shops across Jammu &amp; Kashmir.
          </p>
          <address className="mt-5 grid gap-3 text-sm not-italic text-white/85">
            <p className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-bright" aria-hidden />
              <span>
                {BUSINESS.street}
                <br />
                {BUSINESS.locality}
              </span>
            </p>
            <p className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-bright" aria-hidden />
              <span>
                {BUSINESS.hours}
                <br />
                {BUSINESS.sundayHours}
              </span>
            </p>
            <p className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-bright" aria-hidden />
              <span>
                <a href={`tel:${BUSINESS.callTel}`} className="hover:text-gold-bright">
                  Call: {BUSINESS.callDisplay}
                </a>
                <br />
                <a
                  href={whatsappHref(GENERAL_ENQUIRY)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-bright"
                >
                  WhatsApp: {BUSINESS.whatsappDisplay}
                </a>
              </span>
            </p>
            <p className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-bright" aria-hidden />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-gold-bright">
                {BUSINESS.email}
              </a>
            </p>
          </address>
        </div>
        <a
          href={BUSINESS.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block min-h-56 overflow-hidden rounded-3xl border border-white/10 bg-[#2a211c]"
          aria-label="Open Raghunath Bazar, Jammu in Google Maps"
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(#6d5c52 1px, transparent 1px), linear-gradient(90deg, #6d5c52 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(242,220,171,0.18),transparent_55%)]" />
          <span className="absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-full place-items-center">
            <MapPin className="h-10 w-10 text-gold-bright" aria-hidden />
          </span>
          <span className="absolute right-4 bottom-4 left-4 rounded-2xl bg-ink/80 px-4 py-3 text-sm">
            <span className="block font-semibold">Raghunath Bazar showroom</span>
            <span className="mt-1 block text-white/70">Open in Google Maps</span>
          </span>
        </a>
      </div>
      <div className="border-t border-white/10 px-4 py-4 pb-28 text-center text-xs text-white/50 md:pb-6 flex flex-wrap items-center justify-center gap-4">
        <span>© {new Date().getFullYear()} {BUSINESS.name}. Wholesale rates for retailers.</span>
        <span>•</span>
        <a href="/admin" className="text-white/40 hover:text-gold-bright transition underline">
          Admin Portal
        </a>
      </div>
    </footer>
  );
}
