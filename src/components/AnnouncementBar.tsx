import { BUSINESS } from "@/lib/constants";
import { GENERAL_ENQUIRY, whatsappHref } from "@/lib/whatsapp";
import { MessageCircle, Phone } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-maroon-deep text-gold-bright">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-[12px] sm:text-sm">
        <a
          href={`tel:${BUSINESS.callTel}`}
          className="inline-flex items-center gap-1.5 font-medium hover:text-white"
        >
          <Phone className="h-3.5 w-3.5" aria-hidden />
          Call Us: {BUSINESS.callDisplay}
        </a>
        <span className="hidden text-white/30 sm:inline" aria-hidden>
          |
        </span>
        <a
          href={whatsappHref(GENERAL_ENQUIRY)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium hover:text-white"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          WhatsApp &amp; Queries: {BUSINESS.whatsappDisplay}
        </a>
      </div>
    </div>
  );
}
