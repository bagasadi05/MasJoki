import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./config";

export interface BreadcrumbItemInput {
  name: string;
  /** Path relatif (contoh: "/jasa", "/hitung") atau "/" / undefined untuk beranda. */
  path?: string;
}

/**
 * Menghasilkan objek OpenGraph metadata standar per halaman agar pratinjau
 * tautan (WhatsApp, media sosial) selalu akurat sesuai halaman tujuan.
 */
export function buatOpenGraph(
  title: string,
  description: string,
  path: string,
): NonNullable<Metadata["openGraph"]> {
  return {
    title: `${title} · ${SITE_NAME}`,
    description,
    url: path,
    type: "website",
    locale: "id_ID",
  };
}

/**
 * Membuat elemen JSON-LD `BreadcrumbList` (Schema.org) tanpa `"@context"`
 * sehingga dapat dipakai langsung di dalam `@graph`.
 */
export function buatBreadcrumbGraph(
  items: BreadcrumbItemInput[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.name,
        item: item.path ? `${SITE_URL}${item.path}` : SITE_URL,
      })),
    ],
  };
}

/** Membungkus `buatBreadcrumbGraph` dengan `"@context"` Schema.org lengkap. */
export function buatBreadcrumbSchema(items: BreadcrumbItemInput[]) {
  return {
    "@context": "https://schema.org",
    ...buatBreadcrumbGraph(items),
  };
}
