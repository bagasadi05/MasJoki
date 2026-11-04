import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://masjoki.id";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/jasa`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...SERVICES.map((service) => ({
      url: `${baseUrl}/jasa/${service.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
