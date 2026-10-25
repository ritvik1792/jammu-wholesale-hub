"use client";

import { SEED_REVIEWS, buildSummary } from "@/data/reviews";
import { PRODUCTS as SEED_PRODUCTS, PRODUCT_MAP as SEED_PRODUCT_MAP } from "@/data/products";
import { MAX_QTY } from "@/lib/constants";
import { scrollToId } from "@/lib/format";
import {
  getPersisted,
  getServerPersisted,
  saveCart,
  saveReviews,
  saveShop,
  subscribePersisted,
} from "@/lib/persisted";
import type {
  CartLine,
  CatalogCategory,
  Product,
  Review,
  ShopDetails,
  ShopErrors,
  ToastMessage,
} from "@/lib/types";
import { hasErrors, resolvedCity, validateShop } from "@/lib/validate";
import {
  GENERAL_ENQUIRY,
  buildEnquiryMessage,
  openWhatsApp,
} from "@/lib/whatsapp";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

interface CatalogContextValue {
  products: Product[];
  query: string;
  setQuery: (value: string) => void;
  category: CatalogCategory;
  setCategory: (category: CatalogCategory) => void;
  selectCategory: (category: CatalogCategory) => void;
  lines: CartLine[];
  itemCount: number;
  estimate: number;
  hasPricedLines: boolean;
  hasInquireLines: boolean;
  addToEnquiry: (productId: string, quantity: number) => void;
  setCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  shop: ShopDetails;
  setShop: (patch: Partial<ShopDetails>) => void;
  shopErrors: ShopErrors;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  prepareEnquiry: (options?: { requireItems?: boolean }) => boolean;
  enquiryMessage: string;
  callbackMessage: string;
  instantWhatsApp: () => void;
  requestCallback: () => void;
  callbackOpen: boolean;
  closeCallback: () => void;
  reviews: Review[];
  ratingSummary: ReturnType<typeof buildSummary>;
  freshReviewId: string | null;
  reviewModalOpen: boolean;
  openReviewModal: () => void;
  closeReviewModal: () => void;
  addReview: (review: Review) => void;
  toast: ToastMessage | null;
  dismissToast: () => void;
  cartQty: (productId: string) => number | undefined;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const persisted = useSyncExternalStore(
    subscribePersisted,
    getPersisted,
    getServerPersisted,
  );
  const { shop, cart, reviews: userReviews } = persisted;
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [serverReviews, setServerReviews] = useState<Review[]>([]);
  const [query, setQueryState] = useState("");
  const [category, setCategory] = useState<CatalogCategory>("all");
  const [shopErrors, setShopErrors] = useState<ShopErrors>({});

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch(() => {});

    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data?.reviews && Array.isArray(data.reviews)) {
          setServerReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [freshReviewId, setFreshReviewId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const queryRef = useRef("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = (next: ToastMessage) => {
    setToast(next);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    if (!freshReviewId) return;
    const timer = setTimeout(() => setFreshReviewId(null), 4000);
    return () => clearTimeout(timer);
  }, [freshReviewId]);

  useEffect(() => {
    const locked = drawerOpen || callbackOpen || reviewModalOpen;
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen, callbackOpen, reviewModalOpen]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (callbackOpen) {
        setCallbackOpen(false);
        return;
      }
      if (reviewModalOpen) {
        setReviewModalOpen(false);
        return;
      }
      if (drawerOpen) setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [callbackOpen, reviewModalOpen, drawerOpen]);

  const lines = useMemo(() => {
    const productMap = new Map(products.map((p) => [p.id, p]));
    const next: CartLine[] = [];
    for (const [productId, quantity] of Object.entries(cart)) {
      const product = productMap.get(productId) || SEED_PRODUCT_MAP.get(productId);
      if (!product || quantity <= 0) continue;
      next.push({
        product,
        quantity,
        lineTotal: product.price == null ? null : product.price * quantity,
      });
    }
    return next;
  }, [cart, products]);

  const reviews = useMemo(() => {
    const combined = [...serverReviews, ...userReviews];
    const seen = new Set<string>();
    const unique: Review[] = [];
    for (const r of combined) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        unique.push(r);
      }
    }
    // If server reviews haven't loaded yet or are empty, ensure seed reviews show
    if (unique.length === 0) {
      return SEED_REVIEWS;
    }
    return unique.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [serverReviews, userReviews]);

  const ratingSummary = useMemo(() => buildSummary(reviews), [reviews]);
  const estimate = lines.reduce((sum, line) => sum + (line.lineTotal ?? 0), 0);
  const hasPricedLines = lines.some((line) => line.lineTotal != null);
  const hasInquireLines = lines.some((line) => line.lineTotal == null);
  const city = resolvedCity(shop);
  const enquiryMessage = buildEnquiryMessage({
    shop,
    city,
    lines,
    kind: "order",
  });
  const callbackMessage = buildEnquiryMessage({
    shop,
    city,
    lines,
    kind: "callback",
  });

  const setQuery = (value: string) => {
    const shouldScroll = !queryRef.current.trim() && value.trim().length > 0;
    queryRef.current = value;
    setQueryState(value);
    if (shouldScroll) scrollToId("catalog");
  };

  const selectCategory = (next: CatalogCategory) => {
    setCategory(next);
    scrollToId("catalog");
  };

  const setShop = (patch: Partial<ShopDetails>) => {
    saveShop({ ...getPersisted().shop, ...patch });
    setShopErrors((current) => {
      const next = { ...current };
      if ("retailerName" in patch) delete next.retailerName;
      if ("shopName" in patch) delete next.shopName;
      if ("city" in patch || "otherCity" in patch) delete next.city;
      if ("mobile" in patch) delete next.mobile;
      return next;
    });
  };

  const findProduct = (productId: string) => {
    return products.find((p) => p.id === productId) || SEED_PRODUCT_MAP.get(productId);
  };

  const addToEnquiry = (productId: string, quantity: number) => {
    const product = findProduct(productId);
    if (!product) return;
    const nextQty = Math.min(MAX_QTY, Math.max(product.moq, Math.floor(quantity)));
    const existed = getPersisted().cart[productId] != null;
    saveCart({ ...getPersisted().cart, [productId]: nextQty });
    notify({
      message: existed
        ? `${product.name} updated in your enquiry`
        : `${product.name} added to enquiry`,
      action: "drawer",
    });
  };

  const setCartQty = (productId: string, quantity: number) => {
    const product = findProduct(productId);
    if (!product) return;
    const nextQty = Math.min(MAX_QTY, Math.max(product.moq, Math.floor(quantity)));
    saveCart({ ...getPersisted().cart, [productId]: nextQty });
  };

  const removeFromCart = (productId: string) => {
    const product = findProduct(productId);
    const next = { ...getPersisted().cart };
    delete next[productId];
    saveCart(next);
    if (product) notify({ message: `${product.name} removed` });
  };

  const clearCart = () => saveCart({});

  const prepareEnquiry = (options?: { requireItems?: boolean }) => {
    const requireItems = options?.requireItems ?? true;
    const errors = validateShop(shop);
    setShopErrors(errors);
    if (hasErrors(errors)) {
      setDrawerOpen(true);
      notify({ message: "Add your shop details to send the enquiry." });
      window.setTimeout(() => {
        document
          .querySelector("[data-invalid='true']")
          ?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 60);
      return false;
    }
    if (requireItems && lines.length === 0) {
      setDrawerOpen(true);
      notify({ message: "Add at least one item to the enquiry list." });
      return false;
    }
    return true;
  };

  const instantWhatsApp = () => {
    if (lines.length === 0) {
      openWhatsApp(GENERAL_ENQUIRY);
      return;
    }
    if (!prepareEnquiry()) return;
    openWhatsApp(enquiryMessage);
  };

  const requestCallback = () => {
    if (!prepareEnquiry({ requireItems: false })) return;
    setCallbackOpen(true);
  };

  const addReview = async (review: Review) => {
    // 1. Immediately update local state so user sees it right away
    saveReviews([review, ...getPersisted().reviews].slice(0, 30));
    setServerReviews((prev) => [review, ...prev.filter((r) => r.id !== review.id)]);
    setFreshReviewId(review.id);
    setReviewModalOpen(false);
    notify({ message: "Thank you! Your review is now live." });
    scrollToId("reviews");

    // 2. Persist to server so every visitor sees it
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
    } catch (err) {
      console.error("Failed to persist review globally:", err);
    }
  };

  const value: CatalogContextValue = {
    products,
    query,
    setQuery,
    category,
    setCategory,
    selectCategory,
    lines,
    itemCount: lines.length,
    estimate,
    hasPricedLines,
    hasInquireLines,
    addToEnquiry,
    setCartQty,
    removeFromCart,
    clearCart,
    shop,
    setShop,
    shopErrors,
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    prepareEnquiry,
    enquiryMessage,
    callbackMessage,
    instantWhatsApp,
    requestCallback,
    callbackOpen,
    closeCallback: () => setCallbackOpen(false),
    reviews,
    ratingSummary,
    freshReviewId,
    reviewModalOpen,
    openReviewModal: () => setReviewModalOpen(true),
    closeReviewModal: () => setReviewModalOpen(false),
    addReview,
    toast,
    dismissToast: () => setToast(null),
    cartQty: (productId: string) => cart[productId],
  };

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return value;
}
