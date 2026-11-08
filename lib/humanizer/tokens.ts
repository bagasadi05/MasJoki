import type { TokenPackage } from "./types";
import { getWhatsAppUrl } from "@/lib/config";
import { rupiah } from "@/lib/format";

/**
 * tokens.ts — modul aman untuk client.
 *
 * Semua logika penandatanganan/verifikasi voucher dipindah ke
 * `vouchers.server.ts` agar kunci rahasia tidak pernah ikut ke bundle browser.
 */

export const INITIAL_FREE_TOKENS = 300;

export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: "pkt-1k",
    name: "Paket Mini",
    words: 1000,
    price: 15000,
    badge: "Tugas Ringan",
    description: "Cocok untuk tugas esai singkat, ringkasan jurnal, atau 1-2 bab pendahuluan.",
    popular: false,
  },
  {
    id: "pkt-3k",
    name: "Paket Populer",
    words: 3000,
    price: 35000,
    badge: "Paling Laris",
    description: "Pilihan utama untuk makalah lengkap, bab pembahasan skripsi, atau laporan magang.",
    popular: true,
  },
  {
    id: "pkt-7k",
    name: "Paket Skripsi",
    words: 7000,
    price: 70000,
    badge: "Hemat 33%",
    description: "Ideal untuk naskah skripsi Bab 1-5, review jurnal mendalam, atau tesis.",
    popular: false,
  },
  {
    id: "pkt-15k",
    name: "Paket Jumbo",
    words: 15000,
    price: 130000,
    badge: "Hemat 42%",
    description: "Kapasitas raksasa untuk beberapa artikel ilmiah, draf publikasi, atau rombongan tugas.",
    popular: false,
  },
];

/**
 * Build WhatsApp checkout URL for a token package
 */
export function getPackageWhatsAppUrl(pkg: TokenPackage): string {
  const text = [
    `Halo Mas Joki, saya mau beli Token AI Humanizer:`,
    `• Paket: ${pkg.name} (${pkg.words.toLocaleString("id-ID")} kata)`,
    `• Harga: ${rupiah(pkg.price)}`,
    ``,
    `Metode bayar yang saya inginkan: (ShopeePay / GoPay / DANA).`,
    `Mohon kirimkan nomor e-wallet dan kode voucher setelah transfer berhasil. Terima kasih!`,
  ].join("\n");

  return getWhatsAppUrl(text);
}

// Client Storage Keys
export const STORAGE_KEYS = {
  TOKENS: "mj_humanizer_token_balance_v1",
  CLAIMED_VOUCHERS: "mj_humanizer_claimed_vouchers_v1",
  INIT_FLAG: "mj_humanizer_initialized_v1",
  ACTIVE_LICENSE: "mj_humanizer_active_license_v1",
} as const;
