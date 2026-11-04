export const site = {
  name: "Mas Joki",
  tagline: "Bantuan tugas, harga kelihatan di awal.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "6289619774116",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "halo@masjoki.id",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "masjoki.id",
  jamOperasional: "Setiap hari, 07.00–23.00 WIB",
  kota: "Yogyakarta",
} as const;

/**
 * Pembayaran manual via e-wallet. Satu nomor untuk ShopeePay, GoPay, dan DANA.
 * Pembeli mengirim bukti di chat WhatsApp yang sama dengan pesanannya.
 */
export const pembayaran = {
  metode: ["ShopeePay", "GoPay", "DANA"] as const,
  /** Format yang ditampilkan ke pengunjung. */
  nomor: "089619774116",
  /** Format internasional untuk tautan WhatsApp. */
  nomorWhatsapp: "6289619774116",
} as const;

export function waLink(pesan: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(pesan)}`;
}

export const waPesanUmum =
  "Halo Mas Joki, saya mau tanya soal biaya tugas saya.";
