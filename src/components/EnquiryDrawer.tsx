"use client";

import { CitySelect } from "@/components/CitySelect";
import { Field } from "@/components/Field";
import { ProductArt } from "@/components/ProductArt";
import { QtyStepper } from "@/components/QtyStepper";
import { useCatalog } from "@/context/CatalogContext";
import { fieldClass } from "@/lib/constants";
import { formatINR, unitPhrase } from "@/lib/format";
import { mailtoHref, whatsappHref } from "@/lib/whatsapp";
import { Mail, MessageCircle, Trash2, X } from "lucide-react";

export function EnquiryDrawer() {
  const {
    drawerOpen,
    closeDrawer,
    lines,
    itemCount,
    estimate,
    hasPricedLines,
    hasInquireLines,
    setCartQty,
    removeFromCart,
    clearCart,
    shop,
    setShop,
    shopErrors,
    prepareEnquiry,
    enquiryMessage,
    requestCallback,
    selectCategory,
  } = useCatalog();

  if (!drawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end bg-ink/60"
      onClick={closeDrawer}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        className="animate-slide-in flex h-dvh w-full max-w-md flex-col bg-paper shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <div>
            <h2 id="enquiry-title" className="font-serif text-2xl text-maroon-deep">
              Enquiry list
            </h2>
            <p className="text-sm text-muted">
              {itemCount === 0
                ? "No items yet"
                : `${itemCount} ${itemCount === 1 ? "design" : "designs"} selected`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close enquiry list"
            className="grid h-10 w-10 place-items-center rounded-full border border-line"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {lines.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
              <p className="font-serif text-xl text-maroon-deep">
                Your enquiry list is empty
              </p>
              <p className="mt-2 text-sm text-muted">
                Add dozen or box lots from the catalogue, then send them in one
                WhatsApp message.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  selectCategory("all");
                }}
                className="mt-4 inline-flex h-11 items-center rounded-full bg-maroon px-4 text-sm font-semibold text-white"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <ul className="grid gap-3">
              {lines.map((line) => (
                <li
                  key={line.product.id}
                  className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-2xl border border-line p-3"
                >
                  <div className="h-[4.5rem] overflow-hidden rounded-xl">
                    <ProductArt tone={line.product.tone} motif={line.product.motif} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold leading-tight">{line.product.name}</p>
                        <p className="mt-1 text-xs text-muted">SKU: {line.product.sku}</p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${line.product.name}`}
                        onClick={() => removeFromCart(line.product.id)}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-maroon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <QtyStepper
                        value={line.quantity}
                        min={line.product.moq}
                        label={unitPhrase(line.quantity, line.product.unit)}
                        onChange={(quantity) => setCartQty(line.product.id, quantity)}
                      />
                      <p className="text-sm font-semibold text-maroon-deep">
                        {line.lineTotal == null ? "On request" : formatINR(line.lineTotal)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-semibold text-muted underline-offset-4 hover:underline"
                >
                  Clear list
                </button>
              </li>
            </ul>
          )}

          <form
            className="mt-6 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!prepareEnquiry()) return;
              openAnchor(whatsappHref(enquiryMessage));
            }}
          >
            <h3 className="font-serif text-xl text-maroon-deep">Shop details</h3>
            <Field label="Shopkeeper name" htmlFor="retailer-name" error={shopErrors.retailerName}>
              <input
                id="retailer-name"
                autoComplete="name"
                value={shop.retailerName}
                onChange={(event) => setShop({ retailerName: event.target.value })}
                placeholder="Rahul Sharma"
                className={fieldClass}
              />
            </Field>
            <Field label="Shop / firm name" htmlFor="shop-name" error={shopErrors.shopName}>
              <input
                id="shop-name"
                autoComplete="organization"
                value={shop.shopName}
                onChange={(event) => setShop({ shopName: event.target.value })}
                placeholder="Priya Cosmetics"
                className={fieldClass}
              />
            </Field>
            <CitySelect
              id="city"
              label="City / district"
              city={shop.city}
              otherCity={shop.otherCity}
              error={shopErrors.city}
              onCity={(city) => setShop({ city })}
              onOther={(otherCity) => setShop({ otherCity })}
            />
            <Field label="Mobile number" htmlFor="mobile" error={shopErrors.mobile}>
              <input
                id="mobile"
                inputMode="numeric"
                autoComplete="tel"
                value={shop.mobile}
                onChange={(event) =>
                  setShop({
                    mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                placeholder="10-digit mobile"
                className={fieldClass}
              />
            </Field>
            <Field label="Notes" htmlFor="notes">
              <textarea
                id="notes"
                value={shop.notes}
                maxLength={300}
                rows={3}
                onChange={(event) => setShop({ notes: event.target.value })}
                placeholder="Need Rakhi stock before Saturday. Send by Kathua bus."
                className={fieldClass}
              />
            </Field>
            <button type="submit" className="sr-only">
              Send Enquiry on WhatsApp
            </button>
          </form>
        </div>

        <div className="border-t border-line bg-paper px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted">Estimated total</span>
            <span className="font-serif text-2xl text-maroon-deep">
              {hasPricedLines ? formatINR(estimate) : "On request"}
            </span>
          </div>
          {hasInquireLines ? (
            <p className="mb-3 text-xs leading-5 text-muted">
              Lines marked on request are left out of this total.
            </p>
          ) : (
            <p className="mb-3 text-xs leading-5 text-muted">
              Indicative rates. GST and freight extra. This list stays on this phone.
            </p>
          )}
          <div className="grid gap-2">
            <a
              href={whatsappHref(enquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                if (!prepareEnquiry()) event.preventDefault();
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Send Enquiry on WhatsApp
            </a>
            <a
              href={mailtoHref(enquiryMessage, shop.shopName)}
              onClick={(event) => {
                if (!prepareEnquiry()) event.preventDefault();
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Email this enquiry
            </a>
            <button
              type="button"
              onClick={requestCallback}
              className="inline-flex h-11 items-center justify-center text-sm font-semibold text-maroon"
            >
              Submit Request Callback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function openAnchor(href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.click();
}
