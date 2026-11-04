import { rupiah } from "./format";

export type Basis =
  | "kata"
  | "halaman"
  | "slide"
  | "dokumen"
  | "artikel"
  | "desain";

export type ServiceId =
  | "parafrase"
  | "humanisasi"
  | "makalah"
  | "jurnal"
  | "powerpoint"
  | "word"
  | "terjemah"
  | "desain";

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
  /** Batas bawah total. Menjaga agar pesanan kecil tetap masuk akal. */
  minPrice: number;
  /** Estimasi pengerjaan pada tenggat normal. */
  turnaround: string;
  presets: number[];
  /** Layanan yang paling sering dipesan, ditandai di daftar harga. */
  popular?: boolean;
}

export const BASIS_LABEL: Record<Basis, string> = {
  kata: "kata",
  halaman: "halaman",
  slide: "slide",
  dokumen: "dokumen",
  artikel: "artikel",
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
    minPrice: 15000,
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
    minPrice: 20000,
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
    minPrice: 35000,
    turnaround: "1–2 hari",
    presets: [5, 10, 20, 40],
    popular: true,
  },
  {
    id: "jurnal",
    name: "Artikel jurnal",
    promise:
      "Artikel ilmiah dengan struktur IMRAD, sitasi, dan referensi terbaru.",
    basis: "artikel",
    chunk: 1,
    pricePerChunk: 250000,
    minQty: 1,
    defaultQty: 1,
    minPrice: 250000,
    turnaround: "3–5 hari",
    presets: [1, 2, 3],
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
    minPrice: 30000,
    turnaround: "12–24 jam",
    presets: [5, 10, 20, 30],
    popular: true,
  },
  {
    id: "word",
    name: "Rapikan Word",
    promise:
      "Margin, heading, penomoran, dan daftar isi dirapikan sesuai pedoman kampus.",
    basis: "dokumen",
    chunk: 1,
    pricePerChunk: 20000,
    minQty: 1,
    defaultQty: 1,
    minPrice: 20000,
    turnaround: "2–6 jam",
    presets: [1, 2, 3],
  },
  {
    id: "terjemah",
    name: "Terjemahan",
    promise: "Indonesia ke Inggris atau sebaliknya, disunting agar tidak kaku.",
    basis: "kata",
    chunk: 100,
    pricePerChunk: 5000,
    minQty: 100,
    defaultQty: 500,
    minPrice: 25000,
    turnaround: "6–12 jam",
    presets: [300, 500, 1000, 3000],
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
    minPrice: 45000,
    turnaround: "12–24 jam",
    presets: [1, 2, 3],
  },
];

export function getService(id: string): Service {
  return SERVICES.find((s) => s.id === id) ?? SERVICES[0];
}

export function priceLabel(service: Service): string {
  if (service.chunk === 1) {
    return `${rupiah(service.pricePerChunk)} / ${BASIS_LABEL[service.basis]}`;
  }
  return `${rupiah(service.pricePerChunk)} / ${service.chunk} ${BASIS_LABEL[service.basis]}`;
}
