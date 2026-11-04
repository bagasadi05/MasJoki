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
  /** Nama token untuk gaya inline (mis. pita atas nota). */
  varName: string;
  /** Ikon representasi visual layanan (ramah & ekspresif). */
  ikon: string;
  /** Gradasi latar belakang modern untuk kartu. */
  gradient: string;
  /** Warna aksen hex untuk style inline atau border highlight. */
  hex: string;
}

export const AKSEN: Record<AksenId, Aksen> = {
  biru: {
    dot: "bg-brand",
    soft: "bg-brand-soft",
    border: "border-brand",
    top: "border-t-brand",
    ring: "ring-brand",
    text: "text-brand",
    chip: "border-brand/30 bg-brand-soft text-brand",
    wash: "bg-brand-soft/50",
    varName: "--color-brand",
    ikon: "🔄",
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    hex: "#2563EB",
  },
  mint: {
    dot: "bg-mint",
    soft: "bg-mint-soft",
    border: "border-mint",
    top: "border-t-mint",
    ring: "ring-mint",
    text: "text-mint",
    chip: "border-mint/30 bg-mint-soft text-mint",
    wash: "bg-mint-soft/50",
    varName: "--color-mint",
    ikon: "✨",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    hex: "#059669",
  },
  koral: {
    dot: "bg-koral",
    soft: "bg-koral-soft",
    border: "border-koral",
    top: "border-t-koral",
    ring: "ring-koral",
    text: "text-koral",
    chip: "border-koral/30 bg-koral-soft text-koral",
    wash: "bg-koral-soft/50",
    varName: "--color-koral",
    ikon: "📚",
    gradient: "from-orange-500/10 via-rose-500/5 to-transparent",
    hex: "#EA580C",
  },
  lilac: {
    dot: "bg-lilac",
    soft: "bg-lilac-soft",
    border: "border-lilac",
    top: "border-t-lilac",
    ring: "ring-lilac",
    text: "text-lilac",
    chip: "border-lilac/30 bg-lilac-soft text-lilac",
    wash: "bg-lilac-soft/50",
    varName: "--color-lilac",
    ikon: "🎓",
    gradient: "from-purple-500/10 via-violet-500/5 to-transparent",
    hex: "#7C3AED",
  },
  amber: {
    dot: "bg-amber",
    soft: "bg-amber-soft",
    border: "border-amber",
    top: "border-t-amber",
    ring: "ring-amber",
    text: "text-amber",
    chip: "border-amber/30 bg-amber-soft text-amber",
    wash: "bg-amber-soft/50",
    varName: "--color-amber",
    ikon: "📊",
    gradient: "from-amber-500/10 via-yellow-500/5 to-transparent",
    hex: "#D97706",
  },
  langit: {
    dot: "bg-langit",
    soft: "bg-langit-soft",
    border: "border-langit",
    top: "border-t-langit",
    ring: "ring-langit",
    text: "text-langit",
    chip: "border-langit/30 bg-langit-soft text-langit",
    wash: "bg-langit-soft/50",
    varName: "--color-langit",
    ikon: "📝",
    gradient: "from-sky-500/10 via-cyan-500/5 to-transparent",
    hex: "#0284C7",
  },
  olive: {
    dot: "bg-olive",
    soft: "bg-olive-soft",
    border: "border-olive",
    top: "border-t-olive",
    ring: "ring-olive",
    text: "text-olive",
    chip: "border-olive/30 bg-olive-soft text-olive",
    wash: "bg-olive-soft/50",
    varName: "--color-olive",
    ikon: "🌐",
    gradient: "from-lime-500/10 via-emerald-500/5 to-transparent",
    hex: "#65A30D",
  },
  rose: {
    dot: "bg-rose",
    soft: "bg-rose-soft",
    border: "border-rose",
    top: "border-t-rose",
    ring: "ring-rose",
    text: "text-rose",
    chip: "border-rose/30 bg-rose-soft text-rose",
    wash: "bg-rose-soft/50",
    varName: "--color-rose",
    ikon: "🎨",
    gradient: "from-pink-500/10 via-fuchsia-500/5 to-transparent",
    hex: "#DB2777",
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

/** Inisial dua huruf untuk cap/stempel kecil, gaya nota. */
export const INISIAL: Record<ServiceId, string> = {
  parafrase: "Pa",
  humanisasi: "Hu",
  makalah: "Ma",
  jurnal: "Ju",
  powerpoint: "PP",
  word: "Wo",
  terjemah: "Te",
  desain: "De",
};

export function aksenLayanan(id: ServiceId): Aksen {
  return AKSEN[WARNA_LAYANAN[id]];
}
