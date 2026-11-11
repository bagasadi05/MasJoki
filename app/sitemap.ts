import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { SERVICES } from "@/lib/services";

const baseUrl = SITE_URL;
// Satu tanggal untuk semua entri; diperbarui saat deploy.
const terakhirDiperbarui = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: terakhirDiperbarui,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/jasa`,
      lastModified: terakhirDiperbarui,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/humanizer`,
      lastModified: terakhirDiperbarui,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/hitung`,
      lastModified: terakhirDiperbarui,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cara-kerja`,
      lastModified: terakhirDiperbarui,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: terakhirDiperbarui,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...SERVICES.map((service) => ({
      url: `${baseUrl}/jasa/${service.id}`,
      lastModified: terakhirDiperbarui,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
