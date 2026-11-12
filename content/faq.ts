import { pembayaran } from "@/lib/site";

export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  // 1. CARA PESAN
  {
    q: "Bagaimana cara memesan tugas jika belum punya link Google Drive?",
    a: "Sangat fleksibel! Kamu cukup mengosongkan kolom link dokumen pada kalkulator atau formulir. Setelah menekan tombol pesan, kamu bisa langsung melampirkan file dokumen (Word, PPT, PDF, atau foto catatan materi) di ruang chat WhatsApp langsung kepada Mas Joki.",
  },
  // 2. DP 50%
  {
    q: "Apakah bisa bayar DP (uang muka) 50% dulu?",
    a: "Bisa banget! Kamu cukup membayar DP 50% di awal (dibulatkan ke atas ke kelipatan Rp 500 terdekat) agar Mas Joki langsung mulai bekerja. Pelunasan 50% sisanya baru dibayarkan setelah tugas selesai dan kamu memeriksa preview hasilnya.",
  },
  // 3. REVISI
  {
    q: "Berapa kali saya boleh minta revisi?",
    a: "Dua kali revisi gratis. Revisi berlaku jika ada bagian yang belum sesuai dengan brief awal atau pedoman format kampusmu. Jika ingin mengubah arah topik tugas secara menyeluruh setelah pengerjaan selesai, hal itu dihitung sebagai pesanan baru.",
  },
  // 4. KEAMANAN FILE
  {
    q: "Apakah file dan berkas tugas saya dijamin aman?",
    a: "Dijamin 100% aman dan privat. Berkas naskah, nama kampus, dan data mahasiswa tidak pernah dibagikan atau dipublikasikan ke pihak ketiga mana pun tanpa izin tertulis darimu.",
  },
  // 5. TURNITIN & AI
  {
    q: "Apakah bisa membantu menurunkan skor Turnitin atau deteksi AI?",
    a: "Bisa. Naskah diperiksa terlebih dahulu untuk mengecek skor kemiripan (similarity Turnitin) dan indikasi AI. Penurunan skor dikerjakan manual oleh Mas Joki lewat parafrase mendalam dan restrukturisasi kalimat agar naskah tetap ilmiah dan berbobot.",
  },
  // 6. KETEPATAN WAKTU
  {
    q: "Bisa pesan untuk tenggat hari ini dan apakah tepat waktu?",
    a: "Bisa, tersedia opsi tenggat kilat (kurang dari 24 jam). Mas Joki berkomitmen pada ketepatan waktu pengiriman. Jika antrean sedang padat dan tidak memungkinkan, Mas Joki akan menyampaikannya secara jujur di awal sebelum kamu melakukan transfer.",
  },
  // PERTANYAAN LAINNYA (TAMPIL DI /faq)
  {
    q: "Apakah harga bisa berubah setelah saya memesan?",
    a: "Tidak, selama jumlah kata/halaman, tenggat waktu, dan brief instruksi tugas tidak berubah. Angka total pada nota kwitansi terkunci sejak awal tanpa biaya siluman.",
  },
  {
    q: "Bagaimana cara melakukan pembayarannya?",
    a: `Pembayaran dilakukan lewat ShopeePay, GoPay, atau DANA ke nomor resmi: ${pembayaran.nomor} (a.n. Mas Joki). Kirimkan bukti transfer di chat WhatsApp, pengerjaan langsung dimulai setelah konfirmasi.`,
  },
  {
    q: "Apakah file hasil tugas yang saya terima bisa diedit?",
    a: "Tentu bisa. Dokumen diserahkan dalam bentuk file sumber asli: format Word (.docx) untuk makalah/laporan, PowerPoint (.pptx) untuk presentasi, dan format desain asli. Kamu tidak terkunci pada format PDF mati.",
  },
  {
    q: "Tugas saya tidak ada di daftar pilihan layanan. Bagaimana?",
    a: "Gunakan mode Minta Penawaran, pilih kategori tugas, lalu ceritakan kebutuhanmu. Mas Joki akan memeriksa brief dan memberikan estimasi biaya transparan dalam waktu di bawah satu jam kerja.",
  },
  {
    q: "Apakah layanan ini melanggar kode etik akademik?",
    a: "Mas Joki menyediakan pendampingan belajar, perapian format dokumen, penyuntingan bahasa, parafrase naskah, dan pembuatan presentasi. Setiap kampus memiliki pedoman akademik masing-masing, dan keputusan pemanfaatannya berada di tangan mahasiswa secara bijak.",
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
