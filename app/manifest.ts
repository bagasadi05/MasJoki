import type { MetadataRoute } from "next";

/**
 * Manifest aplikasi web: memungkinkan "Tambahkan ke layar utama" di Android
 * dan memberi warna splash yang sesuai kertas situs, bukan putih sistem.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mas Joki — Bantuan Tugas Kuliah",
    short_name: "Mas Joki",
    description:
      "Hitung estimasi biaya bantuan tugas kuliah secara mandiri, lalu kirim pesanan lewat WhatsApp.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f2e6",
    theme_color: "#f7f2e6",
    lang: "id",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
