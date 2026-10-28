"use client";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CallbackModal } from "@/components/CallbackModal";
import { Catalog } from "@/components/Catalog";
import { EnquiryDrawer } from "@/components/EnquiryDrawer";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LocationModal } from "@/components/LocationModal";
import { MobileDock } from "@/components/MobileDock";
import { ReviewModal } from "@/components/ReviewModal";
import { Reviews } from "@/components/Reviews";
import { Trust } from "@/components/Trust";
import { useCatalog } from "@/context/CatalogContext";
import { useEffect, useRef, type ReactNode } from "react";

export function HomePage() {
  const { toast, openDrawer, dismissToast } = useCatalog();

  return (
    <div id="top">
      <a
        href="#catalog"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2"
      >
        Skip to catalogue
      </a>
      <StickyChrome>
        <AnnouncementBar />
        <Header />
      </StickyChrome>
      <main>
        <Hero />
        <Catalog />
        <Reviews />
        <Trust />
        <Faq />
      </main>
      <Footer />
      <MobileDock />
      <EnquiryDrawer />
      <CallbackModal />
      <ReviewModal />
      <LocationModal />
      {toast ? (
        <div className="fixed bottom-28 left-1/2 z-50 w-[min(92vw,24rem)] -translate-x-1/2 md:bottom-24">
          {toast.action === "drawer" ? (
            <button
              type="button"
              onClick={() => {
                dismissToast();
                openDrawer();
              }}
              className="w-full rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white shadow-lg"
            >
              {toast.message}
            </button>
          ) : (
            <p
              role="status"
              className="rounded-full bg-ink px-4 py-3 text-center text-sm font-semibold text-white shadow-lg"
            >
              {toast.message}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function StickyChrome({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const write = () => {
      document.documentElement.style.setProperty("--header-h", `${node.offsetHeight}px`);
    };
    write();
    const observer = new ResizeObserver(write);
    observer.observe(node);
    window.addEventListener("resize", write);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", write);
    };
  }, []);

  return (
    <div ref={ref} className="sticky top-0 z-40">
      {children}
    </div>
  );
}
