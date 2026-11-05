/**
 * Konfigurasi Tunggal Mas Joki (Single Source of Truth untuk Kontak & Lokasi)
 */

export const WA_NUMBER = "089619774116";
export const WA_NUMBER_INTL = "6289619774116";
export const WA_BASE_URL = `https://wa.me/${WA_NUMBER_INTL}`;

export function getWhatsAppUrl(pesan?: string): string {
  if (!pesan) return WA_BASE_URL;
  return `${WA_BASE_URL}?text=${encodeURIComponent(pesan)}`;
}

export const SITE_LOCATION = "Madiun, Jawa Timur";
export const SITE_OPERATIONAL_HOURS = "Setiap hari, 07.00–23.00 WIB";
export const SITE_EMAIL = "halo@masjoki.id";
export const SITE_NAME = "Mas Joki";
export const SITE_OWNER = "Bagas";

/** Domain aktif kanonis terpusat (masjoki.vercel.app) */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://masjoki.vercel.app";

/** Akun media sosial resmi Mas Joki */
export const THREADS_URL = "https://www.threads.com/@adis.shop29";

/**
 * Flag QRIS Mas Joki (TUGAS 6).
 * Default `false`. Ubah ke `true` jika pemilik sudah menaruh file public/qris.png.
 */
export const QRIS_ENABLED = false;
