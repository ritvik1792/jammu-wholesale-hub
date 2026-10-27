import { BUSINESS } from "@/lib/constants";
import { formatINR, formatMobile, unitPhrase } from "@/lib/format";
import type { CartLine, Product, ShopDetails } from "@/lib/types";
import { hasErrors, resolvedCity, validateShop } from "@/lib/validate";

export function buildGeneralEnquiry(shop?: ShopDetails) {
  const name = shop?.retailerName?.trim() || shop?.shopName?.trim() || "";
  const notes = shop?.notes?.trim() || "";
  const lines = [
    `Hello ${BUSINESS.name},`,
    "",
    "I would like to enlist a wholesale query / enquiry:",
    "",
    `*Name:* ${name || "[Please enter your Name / Shop Name]"}`,
    `*Requirement:* ${notes || "[Please enter your Requirement / Items needed]"}`,
    shop?.city ? `*City:* ${resolvedCity(shop)}` : null,
    shop?.mobile?.trim() ? `*Mobile:* ${formatMobile(shop.mobile.trim())}` : null,
    "",
    "Please share wholesale catalog, rates and stock availability.",
  ].filter((line) => line !== null);

  return lines.join("\n");
}

export const GENERAL_ENQUIRY = [
  `Hello ${BUSINESS.name},`,
  "",
  "I would like to enlist a wholesale query / enquiry:",
  "",
  "*Name:* [Please enter your Name / Shop Name]",
  "*Requirement:* [Please enter your Requirement / Items needed]",
  "",
  "Please share wholesale catalog, rates and stock availability.",
].join("\n");

export function whatsappHref(message: string) {
  return `https://wa.me/${BUSINESS.whatsappE164}?text=${encodeURIComponent(message)}`;
}

export function mailtoHref(message: string, firm: string) {
  const subject = encodeURIComponent(
    firm.trim()
      ? `Wholesale enquiry — ${firm.trim()}`
      : `Wholesale enquiry — ${BUSINESS.name}`,
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
    line.product.sku ? `SKU: ${line.product.sku}` : null,
    `Qty: ${unitPhrase(line.quantity, line.product.unit)}`,
    `Rate: ${line.product.priceLabel}`,
    `Amount: ${amount}`,
  ]
    .filter(Boolean)
    .join("\n");
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
      ? `*Callback request — ${BUSINESS.name}*`
      : `*Wholesale Enquiry / Enlist Query — ${BUSINESS.name}*`,
    "",
    "*Customer & Requirement Details*",
    `*Name:* ${shop.retailerName.trim()}`,
    `*Requirement:* ${notes || "Wholesale stock as listed in the order items below"}`,
    `*Firm / Shop:* ${shop.shopName.trim()}`,
    `*City:* ${city}`,
    `*Mobile:* ${formatMobile(shop.mobile.trim())}`,
    "",
    kind === "callback" ? "*Please call me back about this order*" : "*Enlisted Items:*",
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
  const hasShop = !hasErrors(validateShop(shop));
  const retailerName = shop.retailerName.trim();
  const notes = shop.notes.trim();

  const lines = [
    `*Item Enquiry / Enlist Query — ${BUSINESS.name}*`,
    "",
    `*Enlisted Item:* ${product.name}`,
    product.sku ? `SKU: ${product.sku}` : null,
    `Qty: ${unitPhrase(quantity, product.unit)}`,
    `Rate: ${product.priceLabel}`,
    lineTotal == null ? "Amount: On request" : `Amount: ${formatINR(lineTotal)}`,
    "",
    "*Customer Details*",
    `*Name:* ${hasShop && retailerName ? retailerName : "[Please enter your Name / Shop Name]"}`,
    `*Requirement:* ${notes || `Wholesale order for ${unitPhrase(quantity, product.unit)} of ${product.name}${product.sku ? ` (${product.sku})` : ""}`}`,
  ].filter(Boolean);

  if (hasShop) {
    if (shop.shopName.trim()) lines.push(`*Firm / Shop:* ${shop.shopName.trim()}`);
    if (shop.city) lines.push(`*City:* ${resolvedCity(shop)}`);
    if (shop.mobile) lines.push(`*Mobile:* ${formatMobile(shop.mobile.trim())}`);
  }

  lines.push("", "Please confirm stock and the dispatch slot from Jammu.");
  return lines.join("\n");
}
