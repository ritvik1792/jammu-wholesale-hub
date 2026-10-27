import type { BriteSubcategory, CatalogCategory, ShopDetails } from "@/lib/types";

/**
 * Sample desk contacts for this build. Replace them before sharing the site.
 * `whatsappE164` is country code + mobile, digits only, with no plus sign.
 */
export const BUSINESS = {
  name: "B.B. Gupta & Bros.",
  callDisplay: "+91 84929 99292",
  callTel: "+918492999292",
  whatsappDisplay: "+91 84929 99292",
  whatsappE164: "918492999292",
  email: "orders@bbguptabros.in",
  street: "Shop 12-14, Raghunath Bazar",
  locality: "Jammu, Jammu & Kashmir 180001",
  hours: "Mon–Sat 10:00 AM – 8:00 PM",
  sundayHours: "Sunday 11:00 AM – 5:00 PM",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Raghunath+Bazar+Jammu",
} as const;

export const CATEGORIES: { id: CatalogCategory; label: string; short: string }[] =
  [
    { id: "all", label: "All Products", short: "All" },
    {
      id: "brite-store",
      label: "BRITE STORE (Ready-Made Clothing)",
      short: "BRITE STORE",
    },
    {
      id: "jewellery",
      label: "Artificial Jewellery & Payal",
      short: "Jewellery",
    },
    {
      id: "cosmetics",
      label: "Cosmetics & Beauty Supplies",
      short: "Cosmetics",
    },
    {
      id: "bags",
      label: "Purses, Handbags & Clutches",
      short: "Bags",
    },
    {
      id: "hair",
      label: "Hair Accessories (Bands, Clutchers, Clips)",
      short: "Hair",
    },
    { id: "bangles", label: "Bangles & Glassware", short: "Bangles" },
    {
      id: "festival",
      label: "Seasonal & Festival Specials (Rakhi, Bridal Accessories)",
      short: "Festival",
    },
  ];

export const BRITE_SUBCATEGORIES: {
  id: BriteSubcategory | "all";
  label: string;
  short: string;
  icon: string;
  description: string;
}[] = [
  {
    id: "all",
    label: "All Clothing",
    short: "All Clothes",
    icon: "✨",
    description:
      "Complete wholesale catalogue of ready-made clothing across Kids, Ladies, and Gents.",
  },
  {
    id: "kids",
    label: "Kids Clothing",
    short: "Kids",
    icon: "👶",
    description:
      "Ready-made wholesale garments for children (baba suits, party frocks, shorts, sets).",
  },
  {
    id: "ladies",
    label: "Ladies Garments",
    short: "Ladies",
    icon: "👗",
    description:
      "Wholesale ladies wear (suits, kurtis, leggings, churidar, nightwear).",
  },
  {
    id: "gents",
    label: "Gents Wear",
    short: "Gents",
    icon: "👔",
    description:
      "Men's ready-made clothing lots (formal & casual shirts, polo t-shirts, trousers).",
  },
];

export const CATEGORY_BLURB: Record<CatalogCategory, string> = {
  all: "Ready lots for shop counters across J&K and the neighbouring states.",
  "brite-store":
    "Ready-made wholesale clothing for Kids, Ladies, and Gents by BRITE STORE. Direct factory lots for retail shopkeepers.",
  jewellery: "Payal, necksets, and everyday artificial jewellery at dozen rates.",
  cosmetics: "Lipstick, kajal, and compact boxes packed for a beauty counter.",
  bags: "Clutches and handbag lots for boutiques and fancy stores.",
  hair: "Bands, clutchers, and clips billed by the dozen or the box.",
  bangles: "Glass bangle boxes and metal kada sets for daily and bridal wear.",
  festival: "Rakhi counters and bridal sets to book before the rush.",
};

export const CITIES = [
  "Jammu",
  "R.S. Pura",
  "Samba",
  "Kathua",
  "Udhampur",
  "Reasi",
  "Rajouri",
  "Poonch",
  "Srinagar",
  "Anantnag",
  "Baramulla",
  "Sopore",
  "Leh",
  "Kargil",
  "Pathankot",
  "Amritsar",
  "Other",
] as const;

export const EMPTY_SHOP: ShopDetails = {
  retailerName: "",
  shopName: "",
  city: "",
  otherCity: "",
  mobile: "",
  notes: "",
};

export const MAX_QTY = 99;

export const fieldClass =
  "w-full rounded-xl border border-line bg-white px-3 py-3 text-base text-foreground outline-none transition placeholder:text-muted/70 focus:border-gold";
