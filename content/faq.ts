import { pembayaran } from "@/lib/site";

export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "Apakah harga bisa berubah setelah saya pesan?",
    a: "Tidak, selama jumlah halaman/kata, tenggat, dan instruksi tugas tidak berubah. Jika tugasmu memiliki kebutuhan analisis teknis khusus (misal olah data SPSS atau uji laboratorium), admin akan mengonfirmasi penyesuaian di awal sebelum kamu transfer — dan itu pun wajib kamu setujui dulu.",
  },
  {
    q: "Apakah bisa bayar DP (uang muka) 50% dulu?",
    a: "Bisa banget! Untuk pesanan mulai Rp 40.000, kamu cukup membayar DP 50% di awal agar tim kami langsung bekerja. Pelunasan 50% sisanya baru kamu bayarkan setelah tugas selesai dan kamu memeriksa preview hasilnya.",
  },
  {
    q: "Bagaimana cara membayarnya?",
    a: `Bayar lewat ShopeePay, GoPay, atau DANA ke nomor yang sama dengan admin: ${pembayaran.nomor}. Kirim bukti transfer di chat WhatsApp yang sama. Pengerjaan mulai setelah pembayaran dikonfirmasi.`,
  },
  {
    q: "Berapa kali saya boleh minta revisi?",
    a: "Dua kali, gratis. Revisi berlaku untuk hal yang memang menyimpang dari brief atau pedoman kampusmu. Kalau kamu ingin mengubah arah tulisan setelah hasil pertama jadi, itu dihitung pesanan baru.",
  },
  {
    q: "Apakah file yang saya terima bisa diedit?",
    a: "Ya. Untuk makalah dan Word kamu menerima .docx, untuk slide menerima .pptx, dan untuk desain menerima file sumbernya. Kamu tidak terkunci pada PDF.",
  },
  {
    q: "Bagaimana jika saya belum punya link Google Drive untuk melampirkan tugas?",
    a: "Sangat fleksibel! Kamu cukup mengosongkan kolom link dokumen pada form pemesanan atau kalkulator. Setelah mengklik tombol pesan, kamu bisa langsung melampirkan file dokumen (Word, PPT, PDF, atau foto catatan materi) secara langsung di ruang chat WhatsApp kepada admin kami.",
  },
  {
    q: "Bisa pesan untuk tenggat hari ini?",
    a: "Bisa, dengan tarif kilat. Tapi tetap tergantung antrean yang sedang berjalan. Cara tercepat: kirim brief lewat mode penawaran, admin akan bilang jujur kalau memang tidak sempat.",
  },
  {
    q: "Tugas saya tidak ada di daftar layanan. Bagaimana?",
    a: "Pakai mode minta penawaran, pilih “Lainnya”, lalu jelaskan tugasnya. Admin akan membaca brief dan memberi harga, biasanya di bawah satu jam kerja.",
  },
  {
    q: "Apakah file saya akan dipublikasikan?",
    a: "Tidak. File yang kamu kirim hanya dipakai untuk mengerjakan pesanan itu. Kami juga tidak menampilkan hasil kerja pelanggan di portofolio tanpa izin.",
  },
  {
    q: "Apakah ini termasuk pelanggaran akademik?",
    a: "Mas Joki menyediakan bantuan penulisan, penyuntingan, dan perapian format. Setiap kampus punya aturan berbeda, dan keputusan memakai layanan ini ada di tanganmu. Kalau ragu, tanyakan dulu ke dosen atau pedoman akademik kampusmu.",
  },
];
