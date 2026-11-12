import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

const baseUrl = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/auth/"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
