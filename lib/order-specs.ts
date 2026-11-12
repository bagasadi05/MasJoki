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
      "Ubah teks hasil AI menjadi naskah mengalir alami yang mengalir alami dan sesuai standar dosen.",
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
      { value: "belum_tahu", label: "Belum Dicek", description: "Biar Mas Joki yang cek" },
    ],
    targetScoreTitle: "Target Penurunan Skor yang Diinginkan",
    targetScoreOptions: [
      { value: "<20%", label: "Target <20%", badge: "Sangat Aman" },
      { value: "<10%", label: "Target <10%", badge: "Bebas Cemas" },
      { value: "0%", label: "Mendekati 0%", badge: "Maksimal" },
    ],
    fileHelperText:
      "Tautan Google Drive naskah tugas/skripsi (.docx) dan hasil pengecekan AI sebelumnya (jika ada).",
  },
  parafrase: {
    serviceId: "parafrase",
    headline: "Form Pemesanan Parafrase & Penurunan Plagiasi",
    subheadline:
      "Susun ulang kalimat tugas secara alami per paragraf dengan makna dan kutipan sitasi tetap utuh.",
    checkerTitle: "Alat Pengecek Plagiasi Kampus",
    checkerOptions: [
      { value: "turnitin", label: "Turnitin No-Repository", badge: "Standar Kampus" },
      { value: "plagiarism_checker", label: "Plagiarism Checker X" },
      { value: "dosen", label: "Review Dosen" },
    ],
    currentScoreTitle: "Estimasi Similarity Skor Awal",
    currentScoreOptions: [
      { value: "25-40%", label: "25% – 40% Similarity" },
      { value: "41-60%", label: "41% – 60% Similarity" },
      { value: ">60%", label: "Lebih dari 60% Similarity" },
      { value: "belum_tahu", label: "Belum Dicek" },
    ],
    targetScoreTitle: "Target Batas Similarity Kampus",
    targetScoreOptions: [
      { value: "<20%", label: "Di bawah 20%", badge: "Standar Skripsi" },
      { value: "<15%", label: "Di bawah 15%", badge: "Standar Tesis/Jurnal" },
      { value: "<25%", label: "Di bawah 25%", badge: "Tugas Harian" },
    ],
    fileHelperText:
      "Tautan Google Drive naskah Word (.docx) dan PDF hasil cek Turnitin (jika ada).",
  },
  makalah: {
    serviceId: "makalah",
    headline: "Form Pemesanan Makalah & Laporan Akademik",
    subheadline:
      "Penyusunan naskah makalah terstruktur, argumen ilmiah solid, dan rujukan jurnal tervalidasi.",
    citationTitle: "Gaya Sitasi & Format Daftar Pustaka",
    citationOptions: [
      { value: "apa", label: "APA Style 7th Edition", badge: "Paling Banyak" },
      { value: "harvard", label: "Harvard Referencing" },
      { value: "ieee", label: "IEEE (Teknik/Informatika)" },
      { value: "chicago", label: "Chicago / Turabian" },
      { value: "bebas", label: "Standar Umum Kampus" },
    ],
    customQuestionTitle: "Kebutuhan Khusus Penulisan",
    customQuestionOptions: [
      { value: "bab_lengkap", label: "Lengkap Bab I s/d Bab III/IV", badge: "Utuh" },
      { value: "pembahasan_saja", label: "Fokus Bab Pembahasan & Analisis" },
      { value: "revisi_makalah", label: "Revisi Perbaikan Makalah Lama" },
    ],
    fileHelperText:
      "Tautan Google Drive silabus/instruksi dosen, materi kuliah, atau buku rujukan wajib.",
  },
  jurnal: {
    serviceId: "jurnal",
    headline: "Form Pemesanan Artikel Jurnal Ilmiah",
    subheadline:
      "Penyusunan manuskrip artikel ilmiah standar IMRAD, abstrak dwibahasa, dan sitasi jurnal terakreditasi.",
    citationTitle: "Template & Gaya Sitasi Jurnal Target",
    citationOptions: [
      { value: "sinta", label: "Jurnal Nasional Terakreditasi SINTA", badge: "SINTA 2-4" },
      { value: "scopus", label: "Jurnal Internasional / Prosiding" },
      { value: "internal_kampus", label: "Jurnal Mahasiswa Internal Kampus" },
    ],
    customQuestionTitle: "Kelengkapan Naskah Awal",
    customQuestionOptions: [
      { value: "draft_kasar", label: "Sudah Ada Draft Kasar / Skripsi", badge: "Konversi Skripsi" },
      { value: "data_mentah", label: "Hanya Ada Data Hasil Penelitian" },
      { value: "tinjauan_pustaka", label: "Literature Review / Systematic Review" },
    ],
    fileHelperText:
      "Tautan Google Drive naskah skripsi/data penelitian, template jurnal target (jika ada), dan pedoman author.",
  },
  artikel_ilmiah: {
    serviceId: "artikel_ilmiah",
    headline: "Form Pemesanan Artikel Ilmiah (Tugas Kuliah)",
    subheadline:
      "Penyusunan artikel ilmiah lengkap struktur baku, sitasi dan rujukan akademik untuk tugas kuliah.",
    citationTitle: "Gaya Sitasi / Rujukan",
    citationOptions: [
      { value: "apa", label: "APA 7th Edition", badge: "Paling Umum" },
      { value: "harvard", label: "Harvard Style" },
      { value: "ieee", label: "IEEE Style" },
    ],
    fileHelperText:
      "Tautan Google Drive materi brief tugas, petunjuk dosen, atau draft kasar yang ingin dikembangkan.",
  },
  jurnal_submit: {
    serviceId: "jurnal_submit",
    headline: "Form Pemesanan Artikel Jurnal Siap Submit",
    subheadline:
      "Standar publikasi IMRAD lengkap, rujukan mutakhir, template jurnal tujuan, termasuk cek kemiripan.",
    citationTitle: "Target Jurnal & Template",
    citationOptions: [
      { value: "sinta", label: "Jurnal Terakreditasi SINTA", badge: "SINTA 2-4" },
      { value: "scopus", label: "Jurnal Internasional Scopus" },
      { value: "prosiding", label: "Prosiding Konferensi Nasional/Internasional" },
    ],
    fileHelperText:
      "Tautan Google Drive naskah draft/skripsi, template jurnal target, dan panduan author.",
  },
  paket_abstrak: {
    serviceId: "paket_abstrak",
    headline: "Form Pemesanan Paket Abstrak (ID+EN)",
    subheadline:
      "Pasangan abstrak dua versi (Bahasa Indonesia & English Abstract) siap tempel ke skripsi atau artikel jurnal.",
    customQuestionTitle: "Jenis Naskah Abstrak",
    customQuestionOptions: [
      { value: "skripsi", label: "Abstrak Skripsi / Tugas Akhir", badge: "Paling Banyak" },
      { value: "jurnal", label: "Abstrak Artikel Jurnal Ilmiah" },
      { value: "tesis", label: "Abstrak Tesis / Proposal" },
    ],
    fileHelperText:
      "Tautan Google Drive atau teks dokumen Word bab ringkasan/draft abstrak yang mau diterjemahkan.",
  },
  powerpoint: {
    serviceId: "powerpoint",
    headline: "Form Pemesanan Presentasi PowerPoint",
    subheadline:
      "Slide modern, visual rapi, tidak menumpuk teks, dan siap dipresentasikan di depan dosen.",
    customQuestionTitle: "Tujuan Presentasi",
    customQuestionOptions: [
      { value: "sidang_skripsi", label: "Sidang Skripsi / Tesis / Sempro", badge: "Krusial" },
      { value: "tugas_kelompok", label: "Tugas Mingguan Kuliah" },
      { value: "lomba_pitching", label: "Lomba Karya Ilmiah / Business Plan" },
    ],
    fileHelperText:
      "Tautan Google Drive naskah makalah/skripsi yang akan diringkas ke slide dan template PPT kampus jika ada.",
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
  turnitin_ai: {
    serviceId: "turnitin_ai",
    headline: "Form Penawaran Penurunan Skor Turnitin & AI",
    subheadline:
      "Turunkan persentase similaritas Turnitin dan deteksi AI naskahmu hingga target aman di bawah 30%.",
    checkerTitle: "Uji yang Ingin Diturunkan",
    checkerOptions: [
      { value: "turnitin_similarity", label: "Turnitin Similarity (Plagiasi)", badge: "Paling Umum" },
      { value: "turnitin_ai", label: "Turnitin AI Writing Detection" },
      { value: "kombinasi", label: "Keduanya (Similarity + AI Detection)", badge: "Paket Lengkap" },
      { value: "gptzero", label: "GPTZero / ZeroGPT" },
    ],
    currentScoreTitle: "Berapa Skor Naskahmu Saat Ini?",
    currentScorePlaceholder: "Contoh: Similarity 42%, AI 65%",
    targetScoreTitle: "Target Skor yang Diinginkan Kampus",
    targetScoreOptions: [
      { value: "<20%", label: "Di bawah 20%", badge: "Standar Skripsi" },
      { value: "<15%", label: "Di bawah 15%", badge: "Standar Jurnal" },
      { value: "<10%", label: "Di bawah 10%", badge: "Super Aman" },
      { value: "<30%", label: "Di bawah 30%", badge: "Tugas Umum" },
    ],
    fileHelperText:
      "Kirimkan file naskah Word (.docx) beserta file laporan/PDF Turnitin sebelumnya (bila ada).",
  },
};

export function getOrderSpec(serviceId: ServiceId): ServiceOrderSpec {
  return SERVICE_ORDER_SPECS[serviceId] ?? SERVICE_ORDER_SPECS.humanisasi;
}
