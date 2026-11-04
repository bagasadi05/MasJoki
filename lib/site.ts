export const site = {
  name: "Mas Joki",
  tagline: "Bantuan tugas, harga kelihatan di awal.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "6281234567890",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "halo@masjoki.id",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "masjoki.id",
  jamOperasional: "Setiap hari, 07.00–23.00 WIB",
  kota: "Yogyakarta",
} as const;

export function waLink(pesan: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(pesan)}`;
}

export const waPesanUmum =
  "Halo Mas Joki, saya mau tanya soal biaya tugas saya.";
