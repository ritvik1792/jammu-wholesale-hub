export type SellUnit = "dozen" | "box";

export type CategoryId =
  | "jewellery"
  | "cosmetics"
  | "bags"
  | "hair"
  | "bangles"
  | "festival";

export type CatalogCategory = "all" | CategoryId;

export type Tone = "gold" | "rose" | "plum" | "ink" | "saffron" | "emerald";

export type Motif =
  | "payal"
  | "necklace"
  | "earrings"
  | "lipstick"
  | "makeup"
  | "clutch"
  | "handbag"
  | "hair"
  | "clips"
  | "bangles"
  | "kada"
  | "rakhi"
  | "bridal";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: CategoryId;
  keywords: string[];
  moq: number;
  unit: SellUnit;
  price: number | null;
  priceLabel: string;
  tone: Tone;
  motif: Motif;
  badge?: string;
  description?: string;
  promoted?: boolean;
  /** Public path such as `/catalog/payal.jpg`. Falls back to the swatch art. */
  image?: string;
}

export interface ShopDetails {
  retailerName: string;
  shopName: string;
  city: string;
  otherCity: string;
  mobile: string;
  notes: string;
}

export type ShopErrors = Partial<
  Record<"retailerName" | "shopName" | "city" | "mobile", string>
>;

export interface CartLine {
  product: Product;
  quantity: number;
  lineTotal: number | null;
}

export interface Review {
  id: string;
  reviewerName: string;
  shopName: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface RatingSummary {
  average: number;
  count: number;
  buckets: Record<1 | 2 | 3 | 4 | 5, number>;
}

export type ReviewFilter = "all" | 1 | 2 | 3 | 4 | 5;

export interface ToastMessage {
  message: string;
  action?: "drawer";
}
