import type { ServiceId } from "./services";

export interface OrderFieldOption {
  value: string;
  label: string;
  badge?: string;
  description?: string;
}

export interface ServiceOrderSpec {
  serviceId: ServiceId;
  headline: string;
  subheadline: string;
  checkerTitle?: string;
  checkerOptions?: OrderFieldOption[];
  currentScoreTitle?: string;
  currentScorePlaceholder?: string;
  currentScoreOptions?: OrderFieldOption[];
  targetScoreTitle?: string;
  targetScoreOptions?: OrderFieldOption[];
  citationTitle?: string;
  citationOptions?: OrderFieldOption[];
  customQuestionTitle?: string;
  customQuestionOptions?: OrderFieldOption[];
  fileHelperText: string;
}

export const SERVICE_ORDER_SPECS: Record<ServiceId, ServiceOrderSpec> = {
  humanisasi: {
    serviceId: "humanisasi",
    headline: "Form Pemesanan Humanisasi Teks AI",
    subheadline:
      "Ubah teks hasil AI menjadi naskah mengalir alami yang lolos Turnitin AI, GPTZero, dan standar dosen.",
    checkerTitle: "Alat Pengecek AI yang Digunakan Kampus",
    checkerOptions: [
      { value: "turnitin_ai", label: "Turnitin AI Writing", badge: "Paling Umum" },
      { value: "gptzero", label: "GPTZero", badge: "Populer" },
      { value: "zerogpt", label: "ZeroGPT" },
      { value: "copyleaks", label: "CopyLeaks" },
      { value: "dosen_manual", label: "Arahan Dosen Langsung" },
    ],
    currentScoreTitle: "Berapa Skor Deteksi AI Naskahmu Saat Ini?",
    currentScoreOptions: [
      { value: "30-50%", label: "30% – 50% AI", description: "Deteksi sedang" },
      { value: "51-75%", label: "51% – 75% AI", description: "Deteksi tinggi" },
      { value: "76-100%", label: "76% – 100% AI", description: "Mayoritas buatan AI" },
      { value: "belum_tahu", label: "Belum Dicek", description: "Biar admin yang cek" },
    ],
    targetScoreTitle: "Target Penurunan Skor yang Diinginkan",
    targetScoreOptions: [
      {
        value: "<10%",
        label: "Di Bawah 10% (Sangat Aman)",
        badge: "Rekomendasi",
        description: "Standar aman lolos uji skripsi & tesis",
      },
      {
        value: "<20%",
        label: "Di Bawah 20% (Aman)",
        description: "Standar umum tugas mata kuliah reguler",
      },
      {
        value: "0%",
        label: "Murni 100% Manusiawi (0%)",
        description: "Parafrase menyeluruh tanpa jejak bot",
      },
    ],
    fileHelperText:
      "Tautan Google Drive dokumen Word naskah asli (.docx) atau PDF laporan hasil cek AI (pastikan izin berbagi publik).",
  },
  parafrase: {
    serviceId: "parafrase",
    headline: "Form Pemesanan Parafrase & Penurunan Turnitin",
    subheadline:
      "Turunkan persentase kesamaan Turnitin dengan penulisan ulang manual tanpa merusak substansi kalimat.",
    checkerTitle: "Sistem Pengecek Plagiasi",
    checkerOptions: [
      { value: "turnitin", label: "Turnitin (No-Repository)", badge: "Standar Kampus" },
      { value: "drillbit", label: "Drillbit Plagiarism" },
      { value: "plagscan", label: "PlagScan" },
      { value: "dosen_kampus", label: "Arahan Dosen Penguji" },
    ],
    currentScoreTitle: "Persentase Kemiripan (Similarity) Saat Ini",
    currentScoreOptions: [
      { value: "25-40%", label: "25% – 40% Similarity", description: "Perlu parafrase bab tertentu" },
      { value: "41-60%", label: "41% – 60% Similarity", description: "Perlu parafrase menyeluruh" },
      { value: ">60%", label: "Di Atas 60%", description: "Perombakan struktur mayor" },
      { value: "belum_tahu", label: "Belum Punya Laporan", description: "Admin bantu cek awal" },
    ],
    targetScoreTitle: "Target Persentase Akhir",
    targetScoreOptions: [
      {
        value: "<15%",
        label: "Di Bawah 15% (Sangat Aman)",
        badge: "Rekomendasi",
        description: "Standar baku sidang skripsi/tesis",
      },
      {
        value: "<20%",
        label: "Di Bawah 20% (Standar Kampus)",
        description: "Batas wajar makalah/laporan",
      },
      {
        value: "<10%",
        label: "Di Bawah 10% (Super Aman)",
        description: "Standar jurnal terakreditasi SINTA",
      },
    ],
    fileHelperText:
      "Tautan Google Drive dokumen naskah Word (.docx) dan PDF laporan Turnitin sebelumnya jika ada.",
  },
  makalah: {
    serviceId: "makalah",
    headline: "Form Pemesanan Makalah & Laporan Akademik",
    subheadline:
      "Penyusunan naskah makalah lengkap sitasi, referensi jurnal terindeks, dan format rapi.",
    citationTitle: "Format Sitasi & Gaya Rujukan yang Diminta Dosen",
    citationOptions: [
      { value: "apa_7", label: "APA Style 7th Edition", badge: "Paling Banyak" },
      { value: "ieee", label: "IEEE (Teknik/Komputer)" },
      { value: "harvard", label: "Harvard Style" },
      { value: "chicago", label: "Chicago / Turabian" },
      { value: "vancouver", label: "Vancouver (Kesehatan/Kedokteran)" },
    ],
    customQuestionTitle: "Kebutuhan Elemen Tambahan",
    customQuestionOptions: [
      { value: "abstrak_dua_bahasa", label: "Abstrak ID + EN", badge: "Gratis" },
      { value: "jurnal_5_tahun", label: "Wajib Jurnal 5 Tahun Terakhir", badge: "Standar" },
      { value: "lampiran_kuesioner", label: "Disertai Lampiran / Tabel Data" },
    ],
    fileHelperText:
      "Tautan Google Drive berisi silabus tugas, petunjuk penulisan dosen, atau draft kasar makalah.",
  },
  jurnal: {
    serviceId: "jurnal",
    headline: "Form Pemesanan Artikel Jurnal Ilmiah",
    subheadline:
      "Penyusunan artikel jurnal standar IMRAD lengkap dengan analisis literatur dan sitasi baku.",
    citationTitle: "Sasaran Publikasi & Format Naskah",
    citationOptions: [
      { value: "sinta_3_4", label: "Jurnal Nasional SINTA 3–4", badge: "Populer" },
      { value: "sinta_2", label: "Jurnal Nasional Bereputasi SINTA 2" },
      { value: "prosiding_konferensi", label: "Prosiding Seminar Nasional" },
      { value: "internasional", label: "Jurnal Internasional Terindeks" },
    ],
    customQuestionTitle: "Gaya Sitasi Rujukan",
    customQuestionOptions: [
      { value: "apa_7", label: "APA 7th Edition" },
      { value: "ieee", label: "IEEE Style" },
      { value: "vancouver", label: "Vancouver" },
      { value: "mendeley", label: "Sesuai Template Jurnal Sasaran" },
    ],
    fileHelperText:
      "Tautan Google Drive naskah draft atau link website jurnal tujuan beserta template Word jurnal.",
  },
  powerpoint: {
    serviceId: "powerpoint",
    headline: "Form Pemesanan Slide Presentasi PowerPoint",
    subheadline:
      "Desain slide modern rasio 16:9, visual bersih, dan lengkap dengan naskah bicara presenter.",
    customQuestionTitle: "Arah Gaya Visual Slide yang Diinginkan",
    customQuestionOptions: [
      { value: "minimalis_akademik", label: "Minimalis Akademik Rapi", badge: "Pilihan Dosen" },
      { value: "infografis_modern", label: "Infografis & Visual Card", badge: "Populer" },
      { value: "corporate_clean", label: "Modern Corporate / Professional" },
      { value: "kreatif_penuh_warna", label: "Ceria & Berwarna (Eye-catching)" },
    ],
    fileHelperText:
      "Tautan Google Drive makalah, naskah Word, atau poin-poin materi yang ingin dijadikan slide.",
  },
  word: {
    serviceId: "word",
    headline: "Form Pemesanan Rapikan Format Word & Skripsi",
    subheadline:
      "Standarisasi margin 4-4-3-3, Section Break penomoran Romawi/Arab, dan Daftar Isi otomatis siap cetak.",
    customQuestionTitle: "Fokus Perapian Dokumen",
    customQuestionOptions: [
      { value: "full_skripsi", label: "Paket Lengkap Skripsi / Tesis", badge: "Rekomendasi" },
      { value: "margin_toc_page", label: "Margin + Daftar Isi + Nomor Halaman" },
      { value: "daftar_pustaka_sort", label: "Rapikan Daftar Pustaka Abjad A–Z" },
      { value: "tabel_gambar_caption", label: "Daftar Tabel & Daftar Gambar Otomatis" },
    ],
    fileHelperText:
      "Tautan Google Drive dokumen Word yang perlu dirapikan (.docx) dan buku pedoman kampus jika ada.",
  },
  terjemah: {
    serviceId: "terjemah",
    headline: "Form Pemesanan Terjemahan Akademik",
    subheadline:
      "Terjemahan dokumen akademik akurat, tata bahasa alami, dan terminologi ilmiah tepat sasaran.",
    customQuestionTitle: "Pasangan Bahasa & Arah Terjemahan",
    customQuestionOptions: [
      { value: "en_to_id", label: "Bahasa Inggris ke Indonesia", badge: "Paling Banyak" },
      { value: "id_to_en", label: "Bahasa Indonesia ke Inggris (Akademik)", badge: "Populer" },
      { value: "abstrak_kilat", label: "Khusus Abstrak Skripsi ID ↔ EN" },
    ],
    fileHelperText:
      "Tautan Google Drive artikel jurnal, ebook, atau teks Word yang akan diterjemahkan.",
  },
  desain: {
    serviceId: "desain",
    headline: "Form Pemesanan Desain Visual Akademik",
    subheadline:
      "Pembuatan poster ilmiah, infografis presentasi, dan materi publikasi akademik beresolusi tinggi.",
    customQuestionTitle: "Jenis Desain yang Dibutuhkan",
    customQuestionOptions: [
      { value: "poster_ilmiah", label: "Poster Ilmiah Skripsi / Seminar (A1/A2/A3)", badge: "Populer" },
      { value: "infografis_materi", label: "Infografis Ringkasan Materi" },
      { value: "banner_kegiatan", label: "Banner / Spanduk Kegiatan Kampus" },
    ],
    fileHelperText:
      "Tautan Google Drive naskah materi, logo kampus, dan contoh poster referensi jika ada.",
  },
};

export function getOrderSpec(serviceId: ServiceId): ServiceOrderSpec {
  return SERVICE_ORDER_SPECS[serviceId] ?? SERVICE_ORDER_SPECS.humanisasi;
}
