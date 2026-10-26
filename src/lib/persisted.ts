import { PRODUCT_MAP } from "@/data/products";
import { EMPTY_SHOP, MAX_QTY } from "@/lib/constants";
import type { Review, ShopDetails } from "@/lib/types";

export interface PersistedState {
  shop: ShopDetails;
  cart: Record<string, number>;
  reviews: Review[];
}

const STORAGE = {
  shop: "jwh-shop-details",
  cart: "jwh-enquiry-cart",
  reviews: "jwh-user-reviews",
} as const;

export const SERVER_PERSISTED: PersistedState = {
  shop: EMPTY_SHOP,
  cart: {},
  reviews: [],
};

let snapshot: PersistedState = SERVER_PERSISTED;
let didRead = false;
const listeners = new Set<() => void>();

function isStoredReview(value: unknown): value is Review {
  if (!value || typeof value !== "object") return false;
  const review = value as Partial<Review>;
  return (
    typeof review.id === "string" &&
    typeof review.reviewerName === "string" &&
    typeof review.comment === "string" &&
    typeof review.rating === "number" &&
    review.rating >= 1 &&
    review.rating <= 5 &&
    typeof review.date === "string"
  );
}

function readStorage(): PersistedState {
  const next: PersistedState = {
    shop: EMPTY_SHOP,
    cart: {},
    reviews: [],
  };

  try {
    const shopRaw = localStorage.getItem(STORAGE.shop);
    if (shopRaw) {
      const parsed = JSON.parse(shopRaw) as Partial<ShopDetails>;
      next.shop = {
        ...EMPTY_SHOP,
        ...parsed,
        mobile: String(parsed.mobile ?? "")
          .replace(/\D/g, "")
          .slice(0, 10),
      };
    }

    const cartRaw = localStorage.getItem(STORAGE.cart);
    if (cartRaw) {
      const parsed = JSON.parse(cartRaw) as Record<string, unknown>;
      for (const [id, qty] of Object.entries(parsed)) {
        const product = PRODUCT_MAP.get(id);
        const quantity = typeof qty === "number" ? qty : Number(qty);
        if (product && Number.isFinite(quantity) && quantity >= product.moq) {
          next.cart[id] = Math.min(MAX_QTY, Math.floor(quantity));
        }
      }
    }

    const reviewRaw = localStorage.getItem(STORAGE.reviews);
    if (reviewRaw) {
      const parsed = JSON.parse(reviewRaw) as unknown;
      if (Array.isArray(parsed)) {
        next.reviews = parsed.filter(isStoredReview).slice(0, 30);
      }
    }
  } catch {
    return SERVER_PERSISTED;
  }

  const untouched =
    next.shop === EMPTY_SHOP &&
    Object.keys(next.cart).length === 0 &&
    next.reviews.length === 0;
  return untouched ? SERVER_PERSISTED : next;
}

function ensureRead() {
  if (didRead || typeof window === "undefined") return;
  didRead = true;
  snapshot = readStorage();
}

function commit(next: PersistedState) {
  snapshot = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE.shop, JSON.stringify(next.shop));
    localStorage.setItem(STORAGE.cart, JSON.stringify(next.cart));
    localStorage.setItem(STORAGE.reviews, JSON.stringify(next.reviews));
  }
  for (const listener of listeners) listener();
}

export function subscribePersisted(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPersisted() {
  ensureRead();
  return snapshot;
}

export function getServerPersisted() {
  return SERVER_PERSISTED;
}

export function saveShop(shop: ShopDetails) {
  ensureRead();
  commit({ ...snapshot, shop });
}

export function saveCart(cart: Record<string, number>) {
  ensureRead();
  commit({ ...snapshot, cart });
}

export function saveReviews(reviews: Review[]) {
  ensureRead();
  commit({ ...snapshot, reviews });
}
