import { rupiah } from "./format";

export type Basis =
  | "kata"
  | "halaman"
  | "slide"
  | "dokumen"
  | "artikel"
  | "paket"
  | "desain";

export type ServiceId =
  | "parafrase"
  | "humanisasi"
  | "makalah"
  | "artikel_ilmiah"
  | "jurnal_submit"
  | "jurnal"
  | "powerpoint"
  | "word"
  | "terjemah"
  | "paket_abstrak"
  | "desain"
  | "turnitin_ai";

export interface Service {
  id: ServiceId;
  name: string;
  /** Satu kalimat: apa yang pelanggan dapat. */
  promise: string;
  basis: Basis;
  /** Jumlah satuan dasar yang dibungkus satu harga. 100 untuk harga per 100 kata. */
  chunk: number;
  /** Harga per chunk, dalam rupiah. */
  pricePerChunk: number;
  minQty: number;
  defaultQty: number;
  /** Batas bawah total. 0 jika tanpa batas buatan agar perkalian murni. */
  minPrice: number;
  /** Batas maksimal kata untuk layanan tertentu (mis. Artikel Ilmiah 3.000, Jurnal 6.000, Abstrak 300). */
  maxWords?: number;
  /** Batas maksimal halaman untuk layanan tertentu (mis. Word 120 halaman). */
  maxPages?: number;
  /** Estimasi pengerjaan pada tenggat normal. */
  turnaround: string;
  presets: number[];
  /** Layanan yang paling sering dipesan, ditandai di daftar harga. */
  popular?: boolean;
  /** Layanan khusus yang tarifnya dinegosiasikan via penawaran (tanpa kalkulasi instan). */
  customQuoteOnly?: boolean;
  /** Layanan dengan tarif bertingkat (mis. Rapikan Word per rentang halaman). */
  tierPricing?: boolean;
}

export const BASIS_LABEL: Record<Basis, string> = {
  kata: "kata",
  halaman: "halaman",
  slide: "slide",
  dokumen: "dokumen",
  artikel: "artikel",
  paket: "paket",
  desain: "desain",
};

export const SERVICES: Service[] = [
  {
    id: "parafrase",
    name: "Parafrase",
    promise:
      "Kalimat disusun ulang dengan bahasa sendiri, makna dan sitasi tetap utuh.",
    basis: "kata",
    chunk: 100,
    pricePerChunk: 3000,
    minQty: 100,
    defaultQty: 500,
    minPrice: 0,
    turnaround: "6–12 jam",
    presets: [300, 500, 1000, 3000],
    popular: true,
  },
  {
    id: "humanisasi",
    name: "Humanisasi teks",
    promise:
      "Teks AI dirapikan jadi lebih natural: variasi kalimat, diksi, dan ritme.",
    basis: "kata",
    chunk: 100,
    pricePerChunk: 4000,
    minQty: 100,
    defaultQty: 500,
    minPrice: 0,
    turnaround: "6–12 jam",
    presets: [300, 500, 1000, 3000],
    popular: true,
  },
  {
    id: "makalah",
    name: "Makalah & laporan",
    promise:
      "Disusun dari referensi yang kamu kirim, lengkap dengan daftar pustaka.",
    basis: "halaman",
    chunk: 1,
    pricePerChunk: 12000,
    minQty: 1,
    defaultQty: 10,
    minPrice: 0,
    turnaround: "1–2 hari kerja",
    presets: [5, 10, 20, 40],
    popular: true,
  },
  // REVISI 1: Tingkat (a) Artikel Ilmiah untuk tugas kuliah (Rp 250.000 / maks 3.000 kata)
  {
    id: "artikel_ilmiah",
    name: "Artikel Ilmiah",
    promise:
      "Artikel ilmiah untuk tugas kuliah, struktur lengkap dengan sitasi dan daftar pustaka.",
    basis: "kata",
    chunk: 100,
    pricePerChunk: 250000,
    minQty: 100,
    defaultQty: 2000,
    minPrice: 0,
    maxWords: 3000,
    turnaround: "3–5 hari kerja",
    presets: [1500, 2000, 2500, 3000],
    popular: true,
  },
  // REVISI 1: Tingkat (b) Artikel Jurnal Siap Submit untuk publikasi (Rp 400.000 / maks 6.000 kata)
  {
    id: "jurnal_submit",
    name: "Artikel Jurnal Siap Submit",
    promise:
      "IMRAD lengkap, sitasi dan daftar pustaka rapi, mengikuti format jurnal tujuan, termasuk cek kemiripan.",
    basis: "kata",
    chunk: 100,
    pricePerChunk: 400000,
    minQty: 100,
    defaultQty: 4000,
    minPrice: 0,
    maxWords: 6000,
    turnaround: "4–7 hari kerja",
    presets: [3000, 4500, 5000, 6000],
  },
  // Induk/overview untuk halaman rute /jasa/jurnal (menjelaskan 2 pilihan tingkat)
  {
    id: "jurnal",
    name: "Artikel Jurnal",
    promise:
      "Dua pilihan tingkat: Artikel Ilmiah tugas kuliah (Rp 250.000) dan Jurnal Siap Submit (Rp 400.000).",
    basis: "artikel",
    chunk: 1,
    pricePerChunk: 250000,
    minQty: 1,
    defaultQty: 1,
    minPrice: 0,
    turnaround: "3–5 hari kerja",
    presets: [1],
    popular: true,
  },
  {
    id: "powerpoint",
    name: "PowerPoint",
    promise:
      "Slide rapi dan enak dibaca, dari outline sampai catatan presenter.",
    basis: "slide",
    chunk: 1,
    pricePerChunk: 7500,
    minQty: 1,
    defaultQty: 10,
    minPrice: 0,
    turnaround: "12–24 jam",
    presets: [5, 10, 20, 30],
    popular: true,
  },
  // REVISI 3: Rapikan Word bertingkat berdasarkan halaman (1-25 hal: 30k, 26-60 hal: 50k, 61-120 hal: 85k)
  {
    id: "word",
    name: "Rapikan Word",
    promise:
      "Margin, heading, penomoran, dan daftar isi dirapikan sesuai pedoman kampus (berdasarkan jumlah halaman, mulai Rp 30.000).",
    basis: "halaman",
    chunk: 1,
    pricePerChunk: 30000,
    minQty: 1,
    defaultQty: 25,
    minPrice: 0,
    maxPages: 120,
    tierPricing: true,
    turnaround: "2–6 jam",
    presets: [25, 60, 100],
  },
  // REVISI 2(a): Terjemahan naik menjadi Rp10.000 / 100 kata
  {
    id: "terjemah",
    name: "Terjemahan",
    promise:
      "Indonesia ke Inggris atau sebaliknya, disunting akademik agar tidak kaku.",
    basis: "kata",
    chunk: 100,
    pricePerChunk: 10000,
    minQty: 100,
    defaultQty: 500,
    minPrice: 0,
    turnaround: "6–12 jam",
    presets: [300, 500, 1000, 3000],
  },
  // REVISI 2(b): Paket Abstrak (ID+EN) flat Rp 35.000 (maks. 300 kata per versi)
  {
    id: "paket_abstrak",
    name: "Paket Abstrak (ID+EN)",
    promise:
      "Abstrak Indonesia + Abstract Inggris, siap tempel ke skripsi atau artikel.",
    basis: "kata",
    chunk: 50,
    pricePerChunk: 35000,
    minQty: 50,
    defaultQty: 250,
    minPrice: 0,
    maxWords: 300,
    turnaround: "6–12 jam",
    presets: [150, 200, 250, 300],
  },
  {
    id: "desain",
    name: "Desain visual",
    promise:
      "Cover, infografis, atau poster dengan file sumber yang bisa kamu edit.",
    basis: "desain",
    chunk: 1,
    pricePerChunk: 45000,
    minQty: 1,
    defaultQty: 1,
    minPrice: 0,
    turnaround: "12–24 jam",
    presets: [1, 2, 3],
  },
  {
    id: "turnitin_ai",
    name: "Penurunan Skor Turnitin & AI",
    promise:
      "Membantu menurunkan skor kemiripan Turnitin dan deteksi AI sampai target yang disepakati, umumnya di bawah 30%.",
    basis: "dokumen",
    chunk: 1,
    pricePerChunk: 0,
    minQty: 1,
    defaultQty: 1,
    minPrice: 0,
    turnaround: "Sesuai kesepakatan brief",
    presets: [1],
    popular: true,
    customQuoteOnly: true,
  },
];

/** Layanan utama yang ditampilkan di katalog halaman /jasa dan grid beranda */
const CATALOG_ORDER: ServiceId[] = [
  "humanisasi",
  "turnitin_ai",
  "parafrase",
  "makalah",
  "jurnal",
  "powerpoint",
  "word",
  "terjemah",
  "desain",
];

export const CATALOG_SERVICES = CATALOG_ORDER.map((id) => SERVICES.find((s) => s.id === id)!).filter(Boolean);

/** Layanan yang dapat dipilih langsung di kalkulator biaya (/hitung) */
export const CALCULABLE_SERVICES = SERVICES.filter(
  (s) => s.id !== "jurnal", // Di kalkulator, opsi jurnal dipecah menjadi artikel_ilmiah & jurnal_submit
);


export function getService(id: string): Service {
  return SERVICES.find((s) => s.id === id) ?? SERVICES[0];
}

export function priceLabel(service: Service): string {
  if (service.customQuoteOnly) {
    return "Minta Penawaran";
  }
  if (service.id === "word") {
    return "Mulai Rp 30.000 (berdasarkan halaman)";
  }
  if (service.id === "jurnal") {
    return "Mulai Rp 250.000 (2 pilihan tingkat)";
  }
  if (service.id === "artikel_ilmiah") {
    return "Rp 250.000 / artikel (maks. 3.000 kata)";
  }
  if (service.id === "jurnal_submit") {
    return "Rp 400.000 / artikel (maks. 6.000 kata)";
  }
  if (service.id === "paket_abstrak") {
    return "Rp 35.000 / paket (ID+EN)";
  }
  if (service.chunk === 1) {
    return `${rupiah(service.pricePerChunk)} / ${BASIS_LABEL[service.basis] ?? service.basis}`;
  }
  return `${rupiah(service.pricePerChunk)} / ${service.chunk} ${BASIS_LABEL[service.basis] ?? service.basis}`;
}
