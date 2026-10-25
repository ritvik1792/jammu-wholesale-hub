import type { SellUnit } from "@/lib/types";

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function unitPhrase(quantity: number, unit: SellUnit) {
  if (unit === "dozen") return `${quantity} Dozen`;
  return `${quantity} ${quantity === 1 ? "Box" : "Boxes"}`;
}

export function moqLabel(moq: number, unit: SellUnit) {
  return `Min Order: ${unitPhrase(moq, unit)}`;
}

export function formatMobile(digits: string) {
  if (digits.length !== 10) return digits;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function formatDate(iso: string) {
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatRating(value: number) {
  return value.toFixed(1);
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
}
