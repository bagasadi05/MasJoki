import {
  SITE_EMAIL,
  SITE_LOCATION,
  SITE_NAME,
  SITE_OPERATIONAL_HOURS,
  WA_NUMBER,
  WA_NUMBER_INTL,
  getWhatsAppUrl,
} from "./config";

export const site = {
  name: SITE_NAME,
  tagline: "Bantuan tugas, harga kelihatan di awal.",
  whatsapp: WA_NUMBER_INTL,
  email: SITE_EMAIL,
  instagram: "masjoki.id",
  jamOperasional: SITE_OPERATIONAL_HOURS,
  kota: SITE_LOCATION,
} as const;

/**
 * Pembayaran manual via e-wallet. Satu nomor untuk ShopeePay, GoPay, dan DANA.
 * Pembeli mengirim bukti di chat WhatsApp yang sama dengan pesanannya.
 */
export const pembayaran = {
  metode: ["ShopeePay", "GoPay", "DANA"] as const,
  /** Format yang ditampilkan ke pengunjung. */
  nomor: WA_NUMBER,
  /** Format internasional untuk tautan WhatsApp. */
  nomorWhatsapp: WA_NUMBER_INTL,
} as const;

export function waLink(pesan: string): string {
  return getWhatsAppUrl(pesan);
}

export const waPesanUmum =
  "Halo Mas Joki, saya mau tanya soal biaya tugas saya.";
