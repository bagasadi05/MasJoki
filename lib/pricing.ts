import { rupiah } from "./format";
import { BASIS_LABEL, type Service, type ServiceId } from "./services";

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
  { id: "santai", label: "7 hari atau lebih", note: "Harga normal", mult: 1 },
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
    services: ["parafrase", "humanisasi", "makalah", "jurnal"],
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
    services: ["makalah", "jurnal", "parafrase"],
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
    services: ["makalah", "jurnal"],
  },
];

export function getDeadline(id: string): Deadline {
  return DEADLINES.find((d) => d.id === id) ?? DEADLINES[0];
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

const VOLUME_TIERS: Record<Service["basis"], VolumeDiscountTier[]> = {
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
  desain: [
    { minQty: 5, rate: 0.1, label: "Diskon paket ≥5 desain (10%)" },
    { minQty: 3, rate: 0.05, label: "Diskon paket ≥3 desain (5%)" },
  ],
};

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
  total: number;
  /** Opsi uang muka 50% (dibulatkan ke 500 terdekat) untuk pesanan >= Rp 40.000. */
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
}

/** Semua harga dibulatkan ke 500 rupiah terdekat. */
export function bulatkan(value: number): number {
  return Math.round(value / 500) * 500;
}

export function clampQty(service: Service, qty: number): number {
  if (!Number.isFinite(qty)) return service.defaultQty;
  return Math.max(service.minQty, Math.round(qty));
}

function hitungKonversiEkuivalen(service: Service, qty: number): string {
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
  }
}

function hitungEstimasiPengerjaan(
  service: Service,
  qty: number,
  deadlineId: DeadlineId,
): string {
  const rasioBeban = qty / service.defaultQty;

  if (deadlineId === "kilat") {
    if (rasioBeban <= 1.2) return "3–8 jam (Selesai hari ini)";
    if (rasioBeban <= 2.5) return "8–14 jam (Prioritas <24 jam)";
    return "14–22 jam (Ekspres <24 jam)";
  }

  if (deadlineId === "cepat") {
    if (rasioBeban <= 1.5) return "1–2 hari kerja";
    return "2–3 hari kerja";
  }

  if (deadlineId === "normal") {
    if (rasioBeban <= 1.5) return service.turnaround;
    return "3–5 hari kerja";
  }

  return "5–7 hari kerja (Santai)";
}

export function computePrice(
  service: Service,
  rawQty: number,
  deadlineId: string,
  difficultyId: string,
  addonIds: string[] = [],
): PriceResult {
  const qty = clampQty(service, rawQty);
  const deadline = getDeadline(deadlineId);
  const difficulty = getDifficulty(difficultyId);
  const selectedAddons = getValidAddons(service.id, addonIds);

  const units = Math.ceil(qty / service.chunk);
  const unitPrice = service.pricePerChunk;
  const rawSubtotal = units * unitPrice;

  // Batas minimum berlaku pada harga dasar sebelum diskon/pengali.
  const subtotal = Math.max(service.minPrice, rawSubtotal);
  const minimumFee = subtotal - rawSubtotal;

  // Cek diskon kuantitas berdasarkan basis satuan
  const tiers = VOLUME_TIERS[service.basis] ?? [];
  const activeTier = tiers.find((t) => qty >= t.minQty) ?? null;
  const discountRate = activeTier ? activeTier.rate : 0;
  const discountAmount = activeTier ? bulatkan(subtotal * discountRate) : 0;
  const discountLabel = activeTier ? activeTier.label : null;

  // Cari tier diskon berikutnya sebagai petunjuk hemat bagi pengguna
  const nextTier = [...tiers]
    .reverse()
    .find((t) => qty < t.minQty);
  const nextDiscountHint = nextTier
    ? `Tambah ${nextTier.minQty - qty} ${BASIS_LABEL[service.basis]} lagi untuk diskon ${Math.round(nextTier.rate * 100)}%!`
    : null;

  const effectiveBase = subtotal - discountAmount;

  // Hitung biaya tenggat & tingkat kesulitan secara berurutan dan bulatkan tiap baris
  // agar jumlah rincian di nota selalu 100% sama dengan Total Akhir.
  const deadlineFee =
    deadline.mult > 1 ? bulatkan(effectiveBase * (deadline.mult - 1)) : 0;
  const afterDeadline = effectiveBase + deadlineFee;

  const difficultyFee =
    difficulty.mult > 1 ? bulatkan(afterDeadline * (difficulty.mult - 1)) : 0;

  const addonsTotal = selectedAddons.reduce((acc, item) => acc + item.price, 0);

  const total = effectiveBase + deadlineFee + difficultyFee + addonsTotal;

  // Opsi DP 50% untuk memudahkan mahasiswa
  const dpAmount = bulatkan(total * 0.5);
  const pelunasanAmount = total - dpAmount;

  // Harga efektif per chunk/satuan
  const effectivePerChunk = Math.round(total / Math.max(1, units));
  const effectiveUnitLabel =
    service.chunk === 1
      ? `${rupiah(effectivePerChunk)} / ${BASIS_LABEL[service.basis]}`
      : `${rupiah(effectivePerChunk)} / ${service.chunk} ${BASIS_LABEL[service.basis]}`;

  const equivalentLabel = hitungKonversiEkuivalen(service, qty);
  const estimatedTurnaround = hitungEstimasiPengerjaan(
    service,
    qty,
    deadline.id,
  );

  const unitDetail =
    service.chunk === 1
      ? `${qty} ${BASIS_LABEL[service.basis]} × ${rupiah(unitPrice)}`
      : `${qty} ${BASIS_LABEL[service.basis]} (${units} × ${rupiah(unitPrice)})`;

  const lines: PriceLine[] = [
    {
      label: service.name,
      detail: unitDetail,
      amount: rawSubtotal,
      kind: "base",
    },
  ];

  if (minimumFee > 0) {
    lines.push({
      label: "Penyesuaian batas minimum",
      detail: `Minimum pesanan ${rupiah(service.minPrice)}`,
      amount: minimumFee,
      kind: "surcharge",
    });
  }

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

  return {
    units,
    unitPrice,
    rawSubtotal,
    subtotal,
    minimumFee,
    discountRate,
    discountAmount,
    discountLabel,
    nextDiscountHint,
    deadlineFee,
    difficultyFee,
    addonsTotal,
    selectedAddons,
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
  };
}
