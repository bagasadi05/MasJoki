import { rupiah } from "./format";
import {
  BASIS_LABEL,
  type Service,
  type ServiceId,
} from "./services";

export type DeadlineId = "santai" | "normal" | "cepat" | "kilat";
export type DifficultyId = "standar" | "menengah" | "riset";
export type AddonId =
  | "lampiran_similarity"
  | "format_daftar_isi"
  | "referensi_jurnal"
  | "catatan_presentasi"
  | "slide_ringkasan";

export interface Deadline {
  id: DeadlineId;
  label: string;
  note: string;
  mult: number;
}

export interface Difficulty {
  id: DifficultyId;
  label: string;
  note: string;
  mult: number;
}

export interface Addon {
  id: AddonId;
  label: string;
  shortLabel: string;
  note: string;
  price: number;
  /** Layanan yang relevan untuk menampilkan opsi tambahan ini. */
  services: ServiceId[];
}

export const DEADLINES: Deadline[] = [
  { id: "santai", label: "7 hari atau lebih", note: "Harga normal (+0%)", mult: 1 },
  { id: "normal", label: "4–6 hari", note: "+10%", mult: 1.1 },
  { id: "cepat", label: "2–3 hari", note: "+30%", mult: 1.3 },
  { id: "kilat", label: "Kurang dari 24 jam", note: "+60%", mult: 1.6 },
];

export const DIFFICULTIES: Difficulty[] = [
  { id: "standar", label: "Standar", note: "Tugas harian / umum", mult: 1 },
  { id: "menengah", label: "Menengah", note: "Perlu sitasi & referensi (+20%)", mult: 1.2 },
  {
    id: "riset",
    label: "Riset Mendalam",
    note: "Analisis data / teknis (+45%)",
    mult: 1.45,
  },
];

export const ADDONS: Addon[] = [
  {
    id: "lampiran_similarity",
    label: "Lampiran cek kemiripan (no-repository)",
    shortLabel: "Laporan Cek Kemiripan",
    note: "Bukti persentase kemiripan akhir, aman tidak tersimpan di database publik",
    price: 15000,
    services: ["parafrase", "humanisasi", "makalah", "jurnal", "artikel_ilmiah", "jurnal_submit"],
  },
  {
    id: "format_daftar_isi",
    label: "Rapikan margin & daftar isi otomatis",
    shortLabel: "Format Word & Daftar Isi",
    note: "Heading, penomoran halaman, dan daftar isi otomatis siap cetak",
    price: 15000,
    services: ["parafrase", "humanisasi", "makalah", "terjemah"],
  },
  {
    id: "referensi_jurnal",
    label: "Tambahan 5+ referensi jurnal terbaru",
    shortLabel: "5+ Jurnal Terindeks Baru",
    note: "Rujukan jurnal nasional/internasional 5 tahun terakhir lengkap sitasi",
    price: 20000,
    services: ["makalah", "jurnal", "artikel_ilmiah", "jurnal_submit", "parafrase"],
  },
  {
    id: "catatan_presentasi",
    label: "Naskah bicara presenter (speaker notes)",
    shortLabel: "Catatan Bicara Presenter",
    note: "Teks panduan bicara per bagian agar siap langsung presentasi",
    price: 15000,
    services: ["powerpoint", "makalah", "desain"],
  },
  {
    id: "slide_ringkasan",
    label: "Paket hemat slide PPT ringkasan (8 slide)",
    shortLabel: "Bundling 8 Slide PPT",
    note: "Intisari naskah langsung dibuatkan slide presentasi rapi (hemat Rp 15.000)",
    price: 45000,
    services: ["makalah", "jurnal", "artikel_ilmiah", "jurnal_submit"],
  },
];

/**
 * Estimasi waktu pengerjaan resmi terpusat.
 */
export const TURNAROUND_ESTIMATES: Record<
  ServiceId,
  Record<DeadlineId, string>
> = {
  parafrase: {
    santai: "5–7 hari kerja",
    normal: "3–5 hari kerja",
    cepat: "1–2 hari kerja",
    kilat: "6–12 jam",
  },
  humanisasi: {
    santai: "5–7 hari kerja",
    normal: "3–5 hari kerja",
    cepat: "1–2 hari kerja",
    kilat: "6–12 jam",
  },
  makalah: {
    santai: "5–7 hari kerja",
    normal: "3–5 hari kerja",
    cepat: "2–3 hari kerja",
    kilat: "8–16 jam",
  },
  artikel_ilmiah: {
    santai: "6–7 hari kerja",
    normal: "4–5 hari kerja",
    cepat: "2–3 hari kerja",
    kilat: "20–24 jam prioritas",
  },
  jurnal_submit: {
    santai: "7–8 hari kerja",
    normal: "5–6 hari kerja",
    cepat: "2–3 hari kerja",
    kilat: "24 jam prioritas",
  },
  jurnal: {
    santai: "6–7 hari kerja",
    normal: "4–5 hari kerja",
    cepat: "2–3 hari kerja",
    kilat: "20–24 jam prioritas",
  },
  powerpoint: {
    santai: "5–7 hari kerja",
    normal: "3–4 hari kerja",
    cepat: "1–2 hari kerja",
    kilat: "6–12 jam",
  },
  word: {
    santai: "5–7 hari kerja",
    normal: "2–4 hari kerja",
    cepat: "1–2 hari kerja",
    kilat: "3–8 jam",
  },
  terjemah: {
    santai: "5–7 hari kerja",
    normal: "3–5 hari kerja",
    cepat: "1–2 hari kerja",
    kilat: "6–12 jam",
  },
  paket_abstrak: {
    santai: "5–7 hari kerja",
    normal: "2–4 hari kerja",
    cepat: "1–2 hari kerja",
    kilat: "4–8 jam",
  },
  desain: {
    santai: "5–7 hari kerja",
    normal: "3–4 hari kerja",
    cepat: "1–2 hari kerja",
    kilat: "6–12 jam",
  },
  turnitin_ai: {
    santai: "Sesuai kesepakatan brief",
    normal: "Sesuai kesepakatan brief",
    cepat: "Sesuai kesepakatan brief",
    kilat: "Sesuai kesepakatan brief",
  },
};

export function getTurnaroundEstimate(
  serviceId: ServiceId,
  deadlineId: DeadlineId,
): string {
  return TURNAROUND_ESTIMATES[serviceId]?.[deadlineId] ?? "3–5 hari kerja";
}

export function getDeadline(id: string): Deadline {
  return DEADLINES.find((d) => d.id === id) ?? DEADLINES[0]; // default 'santai' (harga normal +0%)
}

export function getDifficulty(id: string): Difficulty {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[0];
}

export function getAddonsForService(serviceId: ServiceId): Addon[] {
  return ADDONS.filter((addon) => addon.services.includes(serviceId));
}

export function getValidAddons(
  serviceId: ServiceId,
  addonIds: string[] = [],
): Addon[] {
  const allowed = getAddonsForService(serviceId);
  const set = new Set(addonIds);
  return allowed.filter((addon) => set.has(addon.id));
}

export interface VolumeDiscountTier {
  minQty: number;
  rate: number;
  label: string;
}

export const VOLUME_TIERS: Record<Service["basis"], VolumeDiscountTier[]> = {
  kata: [
    { minQty: 5000, rate: 0.1, label: "Diskon partai besar ≥5.000 kata (10%)" },
    { minQty: 3000, rate: 0.05, label: "Diskon kuantitas ≥3.000 kata (5%)" },
  ],
  halaman: [
    { minQty: 40, rate: 0.1, label: "Diskon partai besar ≥40 halaman (10%)" },
    { minQty: 25, rate: 0.05, label: "Diskon kuantitas ≥25 halaman (5%)" },
  ],
  slide: [
    { minQty: 30, rate: 0.1, label: "Diskon partai besar ≥30 slide (10%)" },
    { minQty: 20, rate: 0.05, label: "Diskon kuantitas ≥20 slide (5%)" },
  ],
  dokumen: [
    { minQty: 5, rate: 0.1, label: "Diskon paket ≥5 dokumen (10%)" },
    { minQty: 3, rate: 0.05, label: "Diskon paket ≥3 dokumen (5%)" },
  ],
  artikel: [
    { minQty: 3, rate: 0.1, label: "Diskon paket ≥3 artikel (10%)" },
    { minQty: 2, rate: 0.05, label: "Diskon paket ≥2 artikel (5%)" },
  ],
  paket: [],
  desain: [
    { minQty: 5, rate: 0.1, label: "Diskon paket ≥5 desain (10%)" },
    { minQty: 3, rate: 0.05, label: "Diskon paket ≥3 desain (5%)" },
  ],
};

/**
 * REVISI 3: Tingkat tarif Rapikan Word per rentang halaman.
 */
export const WORD_TIERS = [
  { minPages: 1, maxPages: 25, price: 30000, label: "Rapikan Word (1–25 halaman)" },
  { minPages: 26, maxPages: 60, price: 50000, label: "Rapikan Word (26–60 halaman)" },
  { minPages: 61, maxPages: 120, price: 85000, label: "Rapikan Word (61–120 halaman)" },
];

export function getWordTier(pages: number) {
  if (pages > 120) {
    return {
      price: 0,
      label: "Rapikan Word (>120 halaman)",
      isOverLimit: true,
    };
  }
  if (pages > 60) {
    return {
      price: 85000,
      label: "Rapikan Word (61–120 halaman)",
      isOverLimit: false,
    };
  }
  if (pages > 25) {
    return {
      price: 50000,
      label: "Rapikan Word (26–60 halaman)",
      isOverLimit: false,
    };
  }
  return {
    price: 30000,
    label: "Rapikan Word (1–25 halaman)",
    isOverLimit: false,
  };
}

/**
 * REVISI 4: Batas minimum transaksi kalkulator Mas Joki.
 */
export const MINIMUM_TRANSACTION = 15000;

export interface PriceLine {
  label: string;
  detail?: string;
  amount: number;
  /** Penanda khusus untuk baris diskon (nilai negatif) atau item tambahan. */
  kind?: "base" | "discount" | "surcharge" | "addon";
}

export interface PriceResult {
  units: number;
  unitPrice: number;
  rawSubtotal: number;
  subtotal: number;
  minimumFee: number;
  discountRate: number;
  discountAmount: number;
  discountLabel: string | null;
  nextDiscountHint: string | null;
  deadlineFee: number;
  difficultyFee: number;
  addonsTotal: number;
  selectedAddons: Addon[];
  /** Total hitungan murni sebelum penyesuaian batas minimum belanja Rp15.000 */
  totalSebelumMinimum: number;
  total: number;
  /** Opsi DP 50%, dibulatkan KE ATAS ke kelipatan Rp500 terdekat */
  dpAmount: number;
  pelunasanAmount: number;
  /** Rata-rata biaya per satuan/chunk untuk transparansi. */
  effectiveUnitLabel: string;
  /** Konversi ekuivalen (misal kata ke halaman A4, atau slide ke durasi menit). */
  equivalentLabel: string;
  /** Estimasi waktu pengerjaan dinamis sesuai jumlah & tenggat. */
  estimatedTurnaround: string;
  lines: PriceLine[];
  deadline: Deadline;
  difficulty: Difficulty;
  qty: number;
  /** REVISI 4: Catatan penyesuaian batas minimum belanja Rp15.000 */
  minimumAdjustmentNote?: string | null;
  /** REVISI 1 & 3: Penanda kuantitas melebihi batas hitungan otomatis */
  isOverLimit?: boolean;
  overLimitMessage?: string | null;
}

/** Semua penambahan biaya dibulatkan ke kelipatan 500 rupiah. */
export function bulatkan(value: number): number {
  return Math.round(value / 500) * 500;
}

/**
 * DP = 50% dari total, dibulatkan KE ATAS ke kelipatan Rp500 terdekat.
 */
export function hitungDp(total: number): number {
  return Math.ceil((total * 0.5) / 500) * 500;
}

export function clampQty(service: Service, qty: number): number {
  if (!Number.isFinite(qty)) return service.defaultQty;
  return Math.max(service.minQty, Math.round(qty));
}

export function hitungKonversiEkuivalen(service: Service, qty: number): string {
  switch (service.id) {
    case "word":
      return `Format pedoman kampus (${qty} halaman dokumen)`;
    case "artikel_ilmiah":
      return `Artikel ilmiah tugas kuliah (${qty} kata, maks. 3.000 kata)`;
    case "jurnal_submit":
      return `Standar IMRAD siap submit (${qty} kata, maks. 6.000 kata)`;
    case "paket_abstrak":
      return `Pasangan abstrak 2 versi (Indonesia & Inggris, maks. 300 kata/versi)`;
  }

  switch (service.basis) {
    case "kata": {
      const hal = Math.max(1, Math.round((qty / 250) * 10) / 10);
      return `Setara ±${hal} halaman A4 (spasi 1.5, font 12pt)`;
    }
    case "halaman": {
      const kata = qty * 250;
      return `Setara ±${kata.toLocaleString("id-ID")} kata standar akademik`;
    }
    case "slide": {
      const menitMin = Math.max(3, Math.round(qty * 1.2));
      const menitMax = Math.max(5, Math.round(qty * 1.8));
      return `Durasi bicara ±${menitMin}–${menitMax} menit presentasi`;
    }
    case "artikel":
      return `Struktur IMRAD lengkap (${qty * 3000}–${qty * 5000} kata)`;
    case "dokumen":
      return `Perapian menyeluruh margin, heading & daftar isi (${qty} file)`;
    case "desain":
      return `Resolusi cetak & digital tinggi + file sumber (${qty} desain)`;
    default:
      return `${qty} ${service.basis}`;
  }
}

export interface ComputePriceOptions {
  /**
   * Terapkan batas minimum transaksi Rp15.000.
   * Default: true (untuk kalkulator /hitung dan formulir pemesanan).
   * Set ke false untuk tabel gambaran biaya contoh agar menampilkan angka murni.
   */
  applyMinimum?: boolean;
}

/**
 * Satu-satunya fungsi perhitungan harga resmi untuk seluruh situs Mas Joki.
 */
export function computePrice(
  service: Service,
  rawQty: number,
  deadlineId: string = "santai",
  difficultyId: string = "standar",
  addonIds: string[] = [],
  options?: ComputePriceOptions,
): PriceResult {
  const qty = clampQty(service, rawQty);
  const deadline = getDeadline(deadlineId);
  const difficulty = getDifficulty(difficultyId);
  const selectedAddons = getValidAddons(service.id, addonIds);

  let isOverLimit = false;
  let overLimitMessage: string | null = null;
  let rawSubtotal = 0;
  let subtotal = 0;
  let unitPrice = service.pricePerChunk;
  let units = 1;
  let unitDetail = "";
  let baseLineLabel = service.name;

  // Cek batas khusus per jenis layanan
  if (service.id === "word") {
    // REVISI 3: Rapikan Word bertingkat per halaman
    const wordTier = getWordTier(qty);
    units = qty;
    unitPrice = wordTier.price;
    rawSubtotal = wordTier.price;
    subtotal = rawSubtotal;
    baseLineLabel = wordTier.label;
    unitDetail = `${qty} halaman dokumen`;

    if (wordTier.isOverLimit) {
      isOverLimit = true;
      overLimitMessage =
        "Dokumen di atas 120 halaman tidak dapat dihitung otomatis. Silakan kirimkan naskah lewat WhatsApp untuk penawaran khusus.";
    }
  } else if (service.id === "artikel_ilmiah") {
    // REVISI 1(a): Artikel Ilmiah flat Rp250.000 / maks 3.000 kata
    units = 1;
    unitPrice = 250000;
    rawSubtotal = 250000;
    subtotal = 250000;
    baseLineLabel = "Artikel Ilmiah (Tugas Kuliah)";
    unitDetail = `${qty.toLocaleString("id-ID")} kata (maks. 3.000 kata)`;

    if (qty > 3000) {
      isOverLimit = true;
      overLimitMessage =
        "Jumlah kata melebihi batas maksimal 3.000 kata untuk Artikel Ilmiah. Kelebihan kata dialihkan ke mode Minta Penawaran.";
    }
  } else if (service.id === "jurnal_submit") {
    // REVISI 1(b): Jurnal Siap Submit flat Rp400.000 / maks 6.000 kata
    units = 1;
    unitPrice = 400000;
    rawSubtotal = 400000;
    subtotal = 400000;
    baseLineLabel = "Artikel Jurnal Siap Submit";
    unitDetail = `${qty.toLocaleString("id-ID")} kata (maks. 6.000 kata)`;

    if (qty > 6000) {
      isOverLimit = true;
      overLimitMessage =
        "Jumlah kata melebihi batas maksimal 6.000 kata untuk Jurnal Siap Submit. Kelebihan kata dialihkan ke mode Minta Penawaran.";
    }
  } else if (service.id === "paket_abstrak") {
    // REVISI 2(b): Paket Abstrak (ID+EN) flat Rp35.000 / maks 300 kata
    units = 1;
    unitPrice = 35000;
    rawSubtotal = 35000;
    subtotal = 35000;
    baseLineLabel = "Paket Abstrak (ID+EN)";
    unitDetail = `${qty} kata per versi (maks. 300 kata)`;

    if (qty > 300) {
      isOverLimit = true;
      overLimitMessage =
        "Abstrak di atas 300 kata per versi dialihkan ke mode Minta Penawaran.";
    }
  } else {
    // Layanan berbasis chunk standar (Parafrase, Humanisasi, Makalah, PowerPoint, Terjemahan, Desain)
    units = Math.ceil(qty / service.chunk);
    unitPrice = service.pricePerChunk;
    rawSubtotal = units * unitPrice;
    subtotal = rawSubtotal;

    unitDetail =
      service.chunk === 1
        ? `${qty} ${BASIS_LABEL[service.basis] ?? service.basis} × ${rupiah(unitPrice)}`
        : `${qty.toLocaleString("id-ID")} ${BASIS_LABEL[service.basis] ?? service.basis} (${units} × ${rupiah(unitPrice)})`;
  }

  // Diskon kuantitas hanya untuk layanan non-paket dan non-tier
  const tiers =
    service.tierPricing ||
    service.basis === "paket" ||
    service.basis === "artikel" ||
    service.id === "artikel_ilmiah" ||
    service.id === "jurnal_submit" ||
    service.id === "paket_abstrak"
      ? []
      : VOLUME_TIERS[service.basis] ?? [];

  const activeTier = tiers.find((t) => qty >= t.minQty) ?? null;
  const discountRate = activeTier ? activeTier.rate : 0;
  const discountAmount = activeTier ? Math.round(subtotal * discountRate) : 0;
  const discountLabel = activeTier ? activeTier.label : null;

  const nextTier = [...tiers]
    .reverse()
    .find((t) => qty < t.minQty);
  const nextDiscountHint = nextTier
    ? `Tambah ${nextTier.minQty - qty} ${BASIS_LABEL[service.basis] ?? service.basis} lagi untuk diskon ${Math.round(nextTier.rate * 100)}%!`
    : null;

  const effectiveBase = subtotal - discountAmount;

  // Hitung biaya tenggat (+0% santai 7 hari+, +10% normal 4-6 hari, +30% cepat, +60% kilat)
  const deadlineFee =
    deadline.mult > 1 ? Math.round(effectiveBase * (deadline.mult - 1)) : 0;
  const afterDeadline = effectiveBase + deadlineFee;

  // Pengali tingkat kesulitan jika ada (standar = 0)
  const difficultyFee =
    difficulty.mult > 1 ? Math.round(afterDeadline * (difficulty.mult - 1)) : 0;

  const addonsTotal = selectedAddons.reduce((acc, item) => acc + item.price, 0);

  const totalSebelumMinimum = effectiveBase + deadlineFee + difficultyFee + addonsTotal;

  // REVISI 4: Minimum transaksi Rp15.000 untuk kalkulator dan formulir order
  let minimumAdjustment = 0;
  let minimumAdjustmentNote: string | null = null;
  let total = totalSebelumMinimum;

  const shouldApplyMinimum = options?.applyMinimum !== false;

  if (shouldApplyMinimum && !isOverLimit && totalSebelumMinimum < MINIMUM_TRANSACTION) {
    minimumAdjustment = MINIMUM_TRANSACTION - totalSebelumMinimum;
    total = MINIMUM_TRANSACTION;
    minimumAdjustmentNote = "Disesuaikan dengan minimum transaksi Rp15.000.";
  }

  // Aturan DP 50%, dibulatkan KE ATAS ke kelipatan Rp500 terdekat dari total akhir
  const dpAmount = hitungDp(total);
  const pelunasanAmount = total - dpAmount;

  // Harga efektif per satuan/chunk
  const effectivePerChunk = Math.round(total / Math.max(1, units));
  const effectiveUnitLabel =
    service.id === "word"
      ? `${rupiah(total)} / dokumen`
      : service.chunk === 1
        ? `${rupiah(effectivePerChunk)} / ${BASIS_LABEL[service.basis] ?? service.basis}`
        : `${rupiah(effectivePerChunk)} / ${service.chunk} ${BASIS_LABEL[service.basis] ?? service.basis}`;

  const equivalentLabel = hitungKonversiEkuivalen(service, qty);
  const estimatedTurnaround = getTurnaroundEstimate(
    service.id,
    deadline.id,
  );

  const lines: PriceLine[] = [
    {
      label: baseLineLabel,
      detail: unitDetail,
      amount: rawSubtotal,
      kind: "base",
    },
  ];

  if (discountAmount > 0 && discountLabel) {
    lines.push({
      label: "Potongan kuantitas",
      detail: discountLabel,
      amount: -discountAmount,
      kind: "discount",
    });
  }

  if (deadlineFee > 0) {
    lines.push({
      label: `Tenggat ${deadline.label.toLowerCase()}`,
      detail: `Prioritas pengerjaan (${deadline.note})`,
      amount: deadlineFee,
      kind: "surcharge",
    });
  }

  if (difficultyFee > 0) {
    lines.push({
      label: `Tingkat ${difficulty.label.toLowerCase()}`,
      detail: difficulty.note,
      amount: difficultyFee,
      kind: "surcharge",
    });
  }

  for (const addon of selectedAddons) {
    lines.push({
      label: `+ ${addon.shortLabel}`,
      detail: "Opsi tambahan terpilih",
      amount: addon.price,
      kind: "addon",
    });
  }

  // REVISI 4: Baris penyesuaian batas minimum belanja Rp15.000
  if (minimumAdjustment > 0) {
    lines.push({
      label: "Penyesuaian minimum transaksi",
      detail: "Batas minimum order Rp15.000",
      amount: minimumAdjustment,
      kind: "surcharge",
    });
  }

  return {
    units,
    unitPrice,
    rawSubtotal,
    subtotal,
    minimumFee: minimumAdjustment,
    discountRate,
    discountAmount,
    discountLabel,
    nextDiscountHint,
    deadlineFee,
    difficultyFee,
    addonsTotal,
    selectedAddons,
    totalSebelumMinimum,
    total,
    dpAmount,
    pelunasanAmount,
    effectiveUnitLabel,
    equivalentLabel,
    estimatedTurnaround,
    lines,
    deadline,
    difficulty,
    qty,
    minimumAdjustmentNote,
    isOverLimit,
    overLimitMessage,
  };
}
