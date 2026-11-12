import { pembayaran } from "@/lib/site";

export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  // 1. CARA PESAN
  {
    q: "Bagaimana cara memesan tugas jika belum punya link Google Drive?",
    a: "Tidak perlu link. Kosongkan kolom dokumen, lalu lampirkan file (Word, PPT, PDF, atau foto catatan) langsung di chat WhatsApp.",
  },
  // 2. DP 50%
  {
    q: "Apakah bisa bayar DP (uang muka) 50% dulu?",
    a: "Bisa. DP 50% dibayar di awal, dibulatkan ke atas ke kelipatan Rp 500. Sisanya dilunasi setelah tugas selesai dan kamu memeriksa hasilnya.",
  },
  // 3. REVISI
  {
    q: "Berapa kali saya boleh minta revisi?",
    a: "Dua kali revisi gratis, selama masih sesuai brief awal atau pedoman format kampusmu. Ganti topik menyeluruh setelah selesai dihitung sebagai pesanan baru.",
  },
  // 4. KEAMANAN FILE
  {
    q: "Apakah file dan berkas tugas saya dijamin aman?",
    a: "Berkas naskah, nama kampus, dan data mahasiswa tidak dibagikan atau dipublikasikan ke pihak ketiga tanpa izinmu.",
  },
  // 5. TURNITIN & AI
  {
    q: "Apakah bisa membantu menurunkan skor Turnitin atau deteksi AI?",
    a: "Bisa. Naskah diperiksa dulu untuk melihat skor kemiripan Turnitin dan indikasi AI. Penurunan dikerjakan manual lewat parafrase dan restrukturisasi kalimat.",
  },
  // 6. KETEPATAN WAKTU
  {
    q: "Bisa pesan untuk tenggat hari ini dan apakah tepat waktu?",
    a: "Bisa, ada opsi tenggat kilat di bawah 24 jam. Kalau antrean padat dan waktunya tidak realistis, Mas Joki bilang terus terang sebelum kamu transfer.",
  },
  // PERTANYAAN LAINNYA (TAMPIL DI /faq)
  {
    q: "Apakah harga bisa berubah setelah saya memesan?",
    a: "Tidak, selama jumlah kata/halaman, tenggat, dan brief tidak berubah. Total di nota terkunci sejak awal.",
  },
  {
    q: "Bagaimana cara melakukan pembayarannya?",
    a: `Pembayaran lewat ShopeePay, GoPay, atau DANA ke nomor resmi: ${pembayaran.nomor} (a.n. Mas Joki). Kirim bukti transfer di chat, pengerjaan mulai setelah konfirmasi.`,
  },
  {
    q: "Apakah file hasil tugas yang saya terima bisa diedit?",
    a: "Bisa. Dokumen diserahkan sebagai file sumber asli: Word (.docx), PowerPoint (.pptx), dan file desain asli — bukan PDF mati.",
  },
  {
    q: "Tugas saya tidak ada di daftar pilihan layanan. Bagaimana?",
    a: "Pakai mode Minta Penawaran, pilih kategori, lalu ceritakan kebutuhanmu. Estimasi biaya dikirim di bawah satu jam kerja.",
  },
  {
    q: "Apakah layanan ini melanggar kode etik akademik?",
    a: "Mas Joki menyediakan pendampingan belajar, perapian format, penyuntingan bahasa, parafrase, dan pembuatan presentasi. Pedoman tiap kampus berbeda; keputusan memakainya ada di tanganmu.",
  },
];

/**
 * Subset untuk beranda: hanya pertanyaan yang menutup keberatan terakhir
 * sebelum CTA. Sumber teksnya tetap satu — kalau pertanyaan di atas diubah
 * namanya, item ini hilang dan tes akan menangkapnya.
 */
const PERTANYAAN_RINGKAS = [
  "Apakah bisa bayar DP (uang muka) 50% dulu?",
  "Berapa kali saya boleh minta revisi?",
  "Apakah file dan berkas tugas saya dijamin aman?",
  "Apakah harga bisa berubah setelah saya memesan?",
  "Apakah bisa membantu menurunkan skor Turnitin atau deteksi AI?",
];

export const faqRingkas: FaqItem[] = PERTANYAAN_RINGKAS.map((q) =>
  faq.find((item) => item.q === q),
).filter((item): item is FaqItem => Boolean(item));
