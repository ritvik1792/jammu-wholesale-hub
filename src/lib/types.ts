export type SellUnit =
  | "dozen"
  | "box"
  | "piece"
  | "pair"
  | "set"
  | "packet"
  | (string & {});

export type CategoryId =
  | "brite-store"
  | "jewellery"
  | "cosmetics"
  | "bags"
  | "hair"
  | "bangles"
  | "festival"
  | (string & {});

export type BriteSubcategory = "kids" | "ladies" | "gents";

export type CatalogCategory = "all" | CategoryId;

export interface CategoryItem {
  id: CatalogCategory;
  label: string;
  short: string;
  description?: string;
  isCustom?: boolean;
}

export type Tone =
  | "gold"
  | "rose"
  | "plum"
  | "ink"
  | "saffron"
  | "emerald"
  | "navy";

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
  | "bridal"
  | "clothing"
  | "shirt";

export interface Product {
  id: string;
  sku?: string;
  name: string;
  category: CategoryId;
  subcategory?: BriteSubcategory | string;
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
  unitsPerBox?: number | string;
  /** Public path such as `/catalog/payal.jpg` or full cloud URL. Falls back to swatch art. */
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
  shopName?: string;
  city?: string;
  productName?: string;
  category?: string;
  rating: number;
  comment?: string;
  date: string;
  verified: boolean;
  promoted?: boolean;
  adminReply?: string;
  adminReplyDate?: string;
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
