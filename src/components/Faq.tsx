"use client";

import { FAQS } from "@/data/faqs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  return (
    <section id="faq" className="bg-cream py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          Before you order
        </p>
        <h2 className="mt-2 font-serif text-3xl text-maroon-deep sm:text-4xl">
          Questions from the counter
        </h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-paper">
          {FAQS.map((item) => {
            const open = openId === item.id;
            const panelId = `faq-${item.id}`;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  id={`${panelId}-button`}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                >
                  <span className="font-semibold">{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-maroon transition ${open ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {open ? (
                  <div id={panelId} role="region" aria-labelledby={`${panelId}-button`} className="px-4 pb-4">
                    <p className="text-sm leading-6 text-muted">{item.answer}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
