import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { BUSINESS } from "@/lib/constants";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const title =
  "BB Gupta & Bros. | Wholesale Artificial Jewellery, Cosmetics & BRITE STORE Clothing Jammu";
const description =
  "Official wholesale catalogue for retailers across Jammu, Kashmir, Leh, Punjab, and Himachal. Factory wholesale rates on artificial jewellery, cosmetics, fancy accessories, and BRITE STORE ready-made garments from B.B. Gupta & Bros.";

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.siteUrl),
  title,
  description,
  applicationName: BUSINESS.name,
  keywords: [
    "bbgupta",
    "bbgupta.com",
    "bb gupta",
    "b b gupta",
    "bb gupta jammu",
    "bb gupta & bros",
    "bb gupta and bros",
    "b.b. gupta & bros.",
    "bbguptabros",
    "jammu wholesale",
    "jammu wholesale market",
    "jammu wholesale hub",
    "artificial jewellery wholesale jammu",
    "cosmetics wholesale jammu",
    "brite store jammu",
    "clothing wholesale jammu",
    "shalamar road jammu wholesale",
    "kanak mandi jammu clothing wholesale",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
    locale: "en_IN",
    type: "website",
    siteName: "BB Gupta & Bros.",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#431018",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WholesaleStore",
  name: "B.B. Gupta & Bros.",
  alternateName: [
    "bbgupta",
    "BB Gupta",
    "BB Gupta & Bros",
    "B.B. Gupta and Bros",
    "bbguptabros",
    "BB Gupta Jammu",
  ],
  url: BUSINESS.siteUrl,
  image: `${BUSINESS.siteUrl}/icon.svg`,
  priceRange: "₹₹",
  telephone: BUSINESS.callTel,
  email: BUSINESS.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.street,
    addressLocality: "Jammu",
    addressRegion: "Jammu and Kashmir",
    postalCode: "180001",
    addressCountry: "IN",
  },
  department: [
    {
      "@type": "WholesaleStore",
      name: "B.B. Gupta & Bros. (Main Showroom)",
      alternateName: ["BB Gupta Main Showroom", "bbgupta jewellery"],
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.street,
        addressLocality: "Jammu",
        addressRegion: "Jammu and Kashmir",
        postalCode: "180001",
        addressCountry: "IN",
      },
    },
    {
      "@type": "ClothingStore",
      name: "BRITE STORE (Ready-Made Clothing)",
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.clothingDivision.street,
        addressLocality: "Jammu",
        addressRegion: "Jammu and Kashmir",
        postalCode: "180001",
        addressCountry: "IN",
      },
    },
  ],
  areaServed: ["Jammu", "Kashmir", "Leh", "Punjab", "Himachal Pradesh"],
  openingHours: ["Mo-Sa 10:00-20:00", "Su 11:00-17:00"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
