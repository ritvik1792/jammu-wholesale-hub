import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS.siteUrl.replace(/\/$/, "");

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
