import type { ServiceId } from "./services";

/**
 * Warna aksen dipakai sebagai penanda layanan, bukan hiasan.
 * Satu layanan = satu warna, konsisten di daftar harga, kalkulator, halaman
 * detail, dan footer. Semua kelas ditulis lengkap supaya terbaca Tailwind.
 */
export type AksenId =
  | "biru"
  | "mint"
  | "koral"
  | "lilac"
  | "amber"
  | "langit"
  | "olive"
  | "rose";

export interface Aksen {
  /** Titik kecil penanda. */
  dot: string;
  /** Latar lembut untuk area terpilih. */
  soft: string;
  /** Garis aksen. */
  border: string;
  /** Garis atas kartu. */
  top: string;
  /** Cincin tipis untuk status terpilih. */
  ring: string;
  /** Teks berwarna aksen (kontras sudah dicek ≥ 4.5:1 di atas soft). */
  text: string;
  /** Chip kecil: latar lembut + teks + garis. */
  chip: string;
  /** Wash bagian yang sangat tipis. */
  wash: string;
}

export const AKSEN: Record<AksenId, Aksen> = {
  biru: {
    dot: "bg-brand",
    soft: "bg-brand-soft",
    border: "border-brand",
    top: "border-t-brand",
    ring: "ring-brand",
    text: "text-brand",
    chip: "border-brand/25 bg-brand-soft text-brand",
    wash: "bg-brand-soft/35",
  },
  mint: {
    dot: "bg-mint",
    soft: "bg-mint-soft",
    border: "border-mint",
    top: "border-t-mint",
    ring: "ring-mint",
    text: "text-mint",
    chip: "border-mint/25 bg-mint-soft text-mint",
    wash: "bg-mint-soft/35",
  },
  koral: {
    dot: "bg-koral",
    soft: "bg-koral-soft",
    border: "border-koral",
    top: "border-t-koral",
    ring: "ring-koral",
    text: "text-koral",
    chip: "border-koral/25 bg-koral-soft text-koral",
    wash: "bg-koral-soft/35",
  },
  lilac: {
    dot: "bg-lilac",
    soft: "bg-lilac-soft",
    border: "border-lilac",
    top: "border-t-lilac",
    ring: "ring-lilac",
    text: "text-lilac",
    chip: "border-lilac/25 bg-lilac-soft text-lilac",
    wash: "bg-lilac-soft/35",
  },
  amber: {
    dot: "bg-amber",
    soft: "bg-amber-soft",
    border: "border-amber",
    top: "border-t-amber",
    ring: "ring-amber",
    text: "text-amber",
    chip: "border-amber/25 bg-amber-soft text-amber",
    wash: "bg-amber-soft/35",
  },
  langit: {
    dot: "bg-langit",
    soft: "bg-langit-soft",
    border: "border-langit",
    top: "border-t-langit",
    ring: "ring-langit",
    text: "text-langit",
    chip: "border-langit/25 bg-langit-soft text-langit",
    wash: "bg-langit-soft/35",
  },
  olive: {
    dot: "bg-olive",
    soft: "bg-olive-soft",
    border: "border-olive",
    top: "border-t-olive",
    ring: "ring-olive",
    text: "text-olive",
    chip: "border-olive/25 bg-olive-soft text-olive",
    wash: "bg-olive-soft/35",
  },
  rose: {
    dot: "bg-rose",
    soft: "bg-rose-soft",
    border: "border-rose",
    top: "border-t-rose",
    ring: "ring-rose",
    text: "text-rose",
    chip: "border-rose/25 bg-rose-soft text-rose",
    wash: "bg-rose-soft/35",
  },
};

export const WARNA_LAYANAN: Record<ServiceId, AksenId> = {
  parafrase: "biru",
  humanisasi: "mint",
  makalah: "koral",
  jurnal: "lilac",
  powerpoint: "amber",
  word: "langit",
  terjemah: "olive",
  desain: "rose",
};

export function aksenLayanan(id: ServiceId): Aksen {
  return AKSEN[WARNA_LAYANAN[id]];
}
