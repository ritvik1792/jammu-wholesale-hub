import type { CatalogCategory, ShopDetails } from "@/lib/types";

/**
 * Sample desk contacts for this build. Replace them before sharing the site.
 * `whatsappE164` is country code + mobile, digits only, with no plus sign.
 */
export const BUSINESS = {
  name: "Jammu Wholesale Hub",
  callDisplay: "+91 94191 22010",
  callTel: "+919419122010",
  whatsappDisplay: "+91 97971 44020",
  whatsappE164: "919797144020",
  email: "orders@jammuwholesalehub.in",
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

export const CATEGORY_BLURB: Record<CatalogCategory, string> = {
  all: "Ready lots for shop counters across J&K and the neighbouring states.",
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
