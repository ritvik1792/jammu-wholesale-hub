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

const title = "Jammu Wholesale Hub | Artificial Jewellery, Cosmetics & Accessories";
const description =
  "Wholesale catalogue for retailers across Jammu, Kashmir, Leh, Punjab, and Himachal. Factory rates on artificial jewellery, cosmetics, purses, hair accessories, bangles, and festive stock.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: BUSINESS.name,
  openGraph: {
    title,
    description,
    locale: "en_IN",
    type: "website",
    siteName: BUSINESS.name,
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
  name: BUSINESS.name,
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
