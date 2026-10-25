import { BUSINESS } from "@/lib/constants";
import { formatINR, formatMobile, unitPhrase } from "@/lib/format";
import type { CartLine, Product, ShopDetails } from "@/lib/types";
import { hasErrors, resolvedCity, validateShop } from "@/lib/validate";

export const GENERAL_ENQUIRY = [
  "Hello Jammu Wholesale Hub,",
  "I run a retail shop and want wholesale rates, MOQ, and today's new designs.",
  "Please reply with availability for jewellery, cosmetics, and fancy items.",
].join("\n");

export function whatsappHref(message: string) {
  return `https://wa.me/${BUSINESS.whatsappE164}?text=${encodeURIComponent(message)}`;
}

export function mailtoHref(message: string, firm: string) {
  const subject = encodeURIComponent(
    firm.trim()
      ? `Wholesale enquiry — ${firm.trim()}`
      : "Wholesale enquiry — Jammu Wholesale Hub",
  );
  return `mailto:${BUSINESS.email}?subject=${subject}&body=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string) {
  const href = whatsappHref(message);
  const opened = window.open(href, "_blank", "noopener,noreferrer");
  if (!opened) window.location.href = href;
}

function lineBlock(line: CartLine, index: number) {
  const amount =
    line.lineTotal == null ? "On request" : formatINR(line.lineTotal);
  return [
    `${index + 1}. ${line.product.name}`,
    `SKU: ${line.product.sku}`,
    `Qty: ${unitPhrase(line.quantity, line.product.unit)}`,
    `Rate: ${line.product.priceLabel}`,
    `Amount: ${amount}`,
  ].join("\n");
}

export function buildEnquiryMessage(input: {
  shop: ShopDetails;
  city: string;
  lines: CartLine[];
  kind: "order" | "callback";
}) {
  const { shop, city, lines, kind } = input;
  const priced = lines.reduce((sum, line) => sum + (line.lineTotal ?? 0), 0);
  const hasPriced = lines.some((line) => line.lineTotal != null);
  const notes = shop.notes.trim();
  const items = lines.length
    ? lines.map(lineBlock).join("\n\n")
    : "No items added yet. Please call me to discuss stock.";

  return [
    kind === "callback"
      ? "*Callback request — Jammu Wholesale Hub*"
      : "*New wholesale enquiry — Jammu Wholesale Hub*",
    "",
    "*Shop details*",
    `Name: ${shop.retailerName.trim()}`,
    `Firm: ${shop.shopName.trim()}`,
    `City: ${city}`,
    `Mobile: ${formatMobile(shop.mobile.trim())}`,
    notes ? `Notes: ${notes}` : null,
    "",
    kind === "callback" ? "*Please call me back about this order*" : "*Order list*",
    items,
    "",
    hasPriced
      ? `*Estimated total:* ${formatINR(priced)}`
      : "*Estimated total:* On request",
    "Indicative wholesale rates. Final bill after stock check. GST and freight extra.",
    "",
    "Please confirm availability and dispatch.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function buildItemMessage(product: Product, quantity: number, shop: ShopDetails) {
  const lineTotal = product.price == null ? null : product.price * quantity;
  const lines = [
    `*Item enquiry — ${product.name}*`,
    `SKU: ${product.sku}`,
    `Qty: ${unitPhrase(quantity, product.unit)}`,
    `Rate: ${product.priceLabel}`,
    lineTotal == null ? "Amount: On request" : `Amount: ${formatINR(lineTotal)}`,
    "",
  ];

  if (!hasErrors(validateShop(shop))) {
    lines.push(
      "*Shop details*",
      `Name: ${shop.retailerName.trim()}`,
      `Firm: ${shop.shopName.trim()}`,
      `City: ${resolvedCity(shop)}`,
      `Mobile: ${formatMobile(shop.mobile.trim())}`,
      "",
    );
  } else {
    lines.push("I will share my shop name, city, and mobile on this chat.", "");
  }

  lines.push("Please confirm stock and the dispatch slot from Jammu.");
  return lines.join("\n");
}
