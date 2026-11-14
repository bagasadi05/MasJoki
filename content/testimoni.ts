import type { AksenId } from "@/lib/aksen";
import type { ServiceId } from "@/lib/services";

export type TestimoniKategori =
  | "semua"
  | "artikel"
  | "turnitin"
  | "presentasi"
  | "kwitansi";

export interface TestimoniBerkas {
  format: string;
  label: string;
  ukuran: string;
}

export interface TestimoniTimeline {
  waktu: string;
  keterangan: string;
}

export interface TurnitinCaseDetail {
  tanggal: string;
  similarity: string;
  aiCheckNote: string;
  filters: {
    label: string;
    nilai: "on" | "off";
  }[];
  disclaimer: string;
}

export interface TestimoniBukti {
  id: "bukti-01" | "bukti-02" | "bukti-03" | "bukti-04" | "bukti-05";
  nomor: "01" | "02" | "03" | "04" | "05";
  kodeNota: string;
  kategori: Exclude<TestimoniKategori, "semua">;
  aksenId: AksenId;
  serviceId?: ServiceId;
  layananLabel: string;
  klienLabel: string;
  judul: string;
  ringkasan: string;
  kutipanKlien: string;
  pertanyaanKlien?: string;
  balasanAdmin?: string;
  jamKutipan: string;
  turnaround: string;
  berkas: TestimoniBerkas[];
  timeline: TestimoniTimeline[];
  turnitinDetail?: TurnitinCaseDetail;
  ctaHref: string;
  ctaLabel: string;
  gambar: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
}

export const KATEGORI_TESTIMONI: {
  id: TestimoniKategori;
  label: string;
}[] = [
  { id: "semua", label: "Semua Bukti" },
  { id: "turnitin", label: "Turnitin & AI" },
  { id: "artikel", label: "Artikel & Revisi" },
  { id: "presentasi", label: "PowerPoint" },
  { id: "kwitansi", label: "Kwitansi Resmi" },
];

/**
 * Lima tangkapan layar WhatsApp pesanan nyata yang telah disanitasi.
 * Semua identitas pribadi, nomor telepon, nama kampus, dan judul spesifik
 * disamarkan sesuai Pasal 04 Kerahasiaan.
 */
export const TESTIMONI_BUKTI: TestimoniBukti[] = [
  {
    id: "bukti-01",
    nomor: "01",
    kodeNota: "WA-01",
    kategori: "artikel",
    aksenId: "lilac",
    serviceId: "artikel_ilmiah",
    layananLabel: "Artikel Ilmiah (Revisi)",
    klienLabel: "Klien #01 · Penulis Artikel Ilmiah",
    judul: "Revisi Artikel Ilmiah Selesai dalam 1 Jam 52 Menit",
    ringkasan:
      "Naskah masuk pukul 19:54 WIB beserta catatan pengecekan tautan dan sumber buku. File revisi selesai dikirim kembali pukul 21:46 WIB di malam yang sama.",
    kutipanKlien: "makasih banyak mas, semoga lancar selalu rejekinya",
    jamKutipan: "21:47 WIB",
    turnaround: "1 jam 52 menit",
    berkas: [
      { format: "DOCX", label: "File masuk", ukuran: "68 kB" },
      { format: "DOCX", label: "revisi.docx", ukuran: "53 kB" },
    ],
    timeline: [
      {
        waktu: "19:54",
        keterangan:
          "Naskah artikel ilmiah (DOCX · 68 kB) dikirim klien, disusul catatan akses tautan & rujukan buku (19:55–20:04).",
      },
      {
        waktu: "20:31",
        keterangan: "Mas Joki mengonfirmasi naskah mulai diproses.",
      },
      {
        waktu: "21:46",
        keterangan: "File hasil revisi.docx (DOCX · 53 kB) dikirim ke klien.",
      },
      {
        waktu: "21:47",
        keterangan:
          "Klien membalas: “makasih banyak mas / semoga lancar selalu rejekinya”.",
      },
    ],
    ctaHref: "/hitung?layanan=artikel_ilmiah",
    ctaLabel: "Hitung Artikel Ilmiah",
    gambar: {
      src: "/testimoni/bukti-01-artikel-revisi.webp",
      width: 1008,
      height: 452,
      alt: "Tangkapan layar chat WhatsApp pesanan revisi artikel ilmiah Mas Joki: file masuk pukul 19:54, file revisi.docx dikirim pukul 21:46, dan dibalas klien pukul 21:47 dengan judul naskah disamarkan.",
    },
  },
  {
    id: "bukti-02",
    nomor: "02",
    kodeNota: "WA-02",
    kategori: "kwitansi",
    aksenId: "langit",
    layananLabel: "Kwitansi PDF Resmi",
    klienLabel: "Klien #02 · Order Kwitansi Pemesanan",
    judul: "Rincian Pembayaran Dikirim lewat Kwitansi PDF Resmi",
    ringkasan:
      "Pengiriman dokumen kwitansi pembayaran resmi Mas Joki format PDF satu halaman agar nominal tagihan tercatat rapi sebelum klien melakukan transfer.",
    kutipanKlien: "Oke pak nanti tak tf",
    jamKutipan: "18:12 WIB",
    turnaround: "Respons 1 jam",
    berkas: [
      { format: "PDF", label: "Kwitansi resmi (1 halaman)", ukuran: "535 kB" },
    ],
    timeline: [
      {
        waktu: "17:12",
        keterangan:
          "File PDF kwitansi pembayaran resmi (1 page · 535 kB) dikirim beserta pesan rincian.",
      },
      {
        waktu: "18:12",
        keterangan: "Klien mengonfirmasi: “Oke pak nanti tak tf”.",
      },
    ],
    ctaHref: "/cara-kerja",
    ctaLabel: "Lihat Panduan Pembayaran",
    gambar: {
      src: "/testimoni/bukti-02-kwitansi-resmi.webp",
      width: 1008,
      height: 242,
      alt: "Tangkapan layar chat WhatsApp pengiriman PDF kwitansi pembayaran resmi Mas Joki pukul 17:12 dengan nama klien dan judul naskah disamarkan, dibalas pukul 18:12.",
    },
  },
  {
    id: "bukti-03",
    nomor: "03",
    kodeNota: "WA-03",
    kategori: "artikel",
    aksenId: "biru",
    serviceId: "jurnal_submit",
    layananLabel: "Artikel Penelitian",
    klienLabel: "Klien #03 · Mahasiswa — Artikel Penelitian",
    judul: "Artikel Penelitian (PDF 14 Hal. & DOCX) Sebelum Target Malam",
    ringkasan:
      "Diskusi tabel hasil penelitian dimulai Selasa pagi dengan target selesai Rabu malam. File PDF siap baca (14 halaman) dan DOCX siap edit dikirim pukul 18:38 WIB.",
    kutipanKlien: "Oke makasih mas tak cek dulu ya mas",
    jamKutipan: "Rabu, 19:28 WIB",
    turnaround: "Lebih awal dari target malam",
    berkas: [
      { format: "PDF", label: "14 halaman siap baca", ukuran: "392 kB" },
      { format: "DOCX", label: "File sumber siap edit", ukuran: "51 kB" },
    ],
    timeline: [
      {
        waktu: "Selasa 07:51",
        keterangan:
          "Klien mengirim dua tangkapan layar tabel hasil penelitian; target selesai disepakati Rabu malam.",
      },
      {
        waktu: "Rabu 18:38",
        keterangan:
          "File PDF (14 pages · 392 kB) dan file sumber DOCX (51 kB) dikirim bersamaan.",
      },
      {
        waktu: "Rabu 19:28",
        keterangan:
          "Klien membalas: “Oke makasih mas tak cek dulu ya mas”.",
      },
    ],
    ctaHref: "/hitung?layanan=jurnal_submit",
    ctaLabel: "Hitung Artikel Jurnal",
    gambar: {
      src: "/testimoni/bukti-03-artikel-pdf-docx.webp",
      width: 1008,
      height: 722,
      alt: "Tangkapan layar chat WhatsApp pesanan artikel penelitian Mas Joki dari diskusi tabel Selasa 07:51 sampai pengiriman PDF 14 halaman dan DOCX Rabu 18:38, dengan nomor telepon dan cover disamarkan.",
    },
  },
  {
    id: "bukti-04",
    nomor: "04",
    kodeNota: "WA-04",
    kategori: "turnitin",
    aksenId: "mint",
    serviceId: "turnitin_ai",
    layananLabel: "Cek Turnitin & GPTZero",
    klienLabel: "Klien #04 · Klien Artikel Ilmiah (Cek Turnitin & AI)",
    judul: "Studi Kasus 31/10/2026: Laporan Similarity Turnitin 12% & Cek GPTZero",
    ringkasan:
      "Dokumentasi satu pesanan nyata bertanggal 31/10/2026: naskah DOCX dikirim pukul 16:40 WIB, dilanjutkan konfirmasi cek GPTZero dan laporan PDF Turnitin 24 halaman pukul 18:12 WIB.",
    kutipanKlien: "Siap aman mas bagas",
    pertanyaanKlien: "Plagiasme karo ai aman yo mas bagas?",
    balasanAdmin: "cek ai lewat gptzero aman semua, tinggal cek turnitin bae",
    jamKutipan: "31/10/2026 · 17:51–18:12 WIB",
    turnaround: "Selesai sore (31/10/2026)",
    berkas: [
      { format: "DOCX", label: "Naskah artikel", ukuran: "106 kB" },
      { format: "PDF", label: "Laporan Turnitin 24 halaman", ukuran: "4 MB" },
    ],
    timeline: [
      {
        waktu: "05:47–06:01",
        keterangan: "Koordinasi awal jadwal pengiriman naskah di sore hari.",
      },
      {
        waktu: "16:40",
        keterangan: "File naskah artikel (DOCX · 106 kB) dikirim ke klien.",
      },
      {
        waktu: "17:51–17:58",
        keterangan:
          "Klien menanyakan cek plagiasi & AI; diinfokan pengecekan AI lewat GPTZero sudah selesai.",
      },
      {
        waktu: "18:12",
        keterangan:
          "Laporan PDF Turnitin (24 pages · 4 MB) dikirim dengan catatan Similarity 12% dan rincian filter.",
      },
    ],
    turnitinDetail: {
      tanggal: "31/10/2026",
      similarity: "12%",
      aiCheckNote:
        "Pengecekan AI melalui GPTZero diinfokan pada sesi chat pukul 17:58 WIB sebelum laporan Turnitin dikirim.",
      filters: [
        { label: "Exclude Quotes", nilai: "off" },
        { label: "Exclude Bibliography", nilai: "on" },
        { label: "Exclude Matches", nilai: "off" },
      ],
      disclaimer:
        "Contoh hasil satu pesanan nyata (31/10/2026) dengan setelan filter di atas. Angka ini adalah dokumentasi studi kasus naskah tersebut — bukan jaminan skor Turnitin maupun hasil cek AI mutlak untuk semua naskah, karena hasilnya bergantung pada isi dokumen, sitasi, dan filter kampus kamu.",
    },
    ctaHref: "/hitung?mode=penawaran&layanan=turnitin_ai",
    ctaLabel: "Minta Penawaran Turnitin",
    gambar: {
      src: "/testimoni/bukti-04-turnitin-gptzero.webp",
      width: 1008,
      height: 673,
      alt: "Tangkapan layar chat WhatsApp tanggal 31/10/2026 menampilkan pengiriman DOCX, pesan cek GPTZero, dan laporan PDF Similarity Turnitin 12% dengan filter Exclude Bibliography on; identitas klien disamarkan.",
    },
  },
  {
    id: "bukti-05",
    nomor: "05",
    kodeNota: "WA-05",
    kategori: "presentasi",
    aksenId: "amber",
    serviceId: "powerpoint",
    layananLabel: "PowerPoint (PPTX)",
    klienLabel: "Klien #05 · Klien Presentasi PPT",
    judul: "Presentasi PowerPoint (.pptx) Rampung di Hari yang Sama",
    ringkasan:
      "Pesanan masuk pukul 11:14 WIB dengan janji kirim paling lambat malam. File slide .pptx dikirim pukul 19:53 WIB dan langsung disetujui klien satu menit kemudian.",
    kutipanKlien: "okey kak · bagus",
    jamKutipan: "19:54 WIB",
    turnaround: "8 jam 39 menit",
    berkas: [
      { format: "PPTX", label: "Slide presentasi siap edit", ukuran: "59 kB" },
    ],
    timeline: [
      {
        waktu: "11:14",
        keterangan:
          "Pesanan masuk, dijanjikan selesai paling lambat malam hari.",
      },
      {
        waktu: "18:08–18:09",
        keterangan: "Klien menanyakan status; diinfokan masih tahap pengerjaan.",
      },
      {
        waktu: "19:53",
        keterangan: "File presentasi .pptx (PPTX · 59 kB) dikirim ke klien.",
      },
      {
        waktu: "19:54",
        keterangan: "Klien merespons: “okey kak” lalu “bagus”.",
      },
    ],
    ctaHref: "/hitung?layanan=powerpoint",
    ctaLabel: "Hitung Biaya PowerPoint",
    gambar: {
      src: "/testimoni/bukti-05-presentasi-pptx.webp",
      width: 1008,
      height: 325,
      alt: "Tangkapan layar chat WhatsApp pesanan PowerPoint Mas Joki dari pukul 11:14 sampai pengiriman file PPTX 59 kB pukul 19:53 dan balasan bagus pukul 19:54, dengan nama klien disamarkan.",
    },
  },
];

/**
 * Urutan tampil editorial di halaman beranda:
 * 1) Bukti #04 sebagai kartu sorotan utama (studi kasus Turnitin & GPTZero)
 * 2) Bukti #01 & #03 sebagai pasangan kartu artikel
 * 3) Bukti #05 & #02 sebagai pasangan kartu format lebar (PPTX & Kwitansi)
 */
export const URUTAN_TAMPIL_TESTIMONI: TestimoniBukti["id"][] = [
  "bukti-04",
  "bukti-01",
  "bukti-03",
  "bukti-05",
  "bukti-02",
];
