import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BUSINESS.siteUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
