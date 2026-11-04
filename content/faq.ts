export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "Apakah harga bisa berubah setelah saya pesan?",
    a: "Tidak, selama jumlah, tenggat, dan tingkat kesulitan tidak berubah. Admin hanya menyesuaikan kalau file yang kamu kirim ternyata jauh berbeda dari yang kamu tulis di brief — dan itu pun harus kamu setujui dulu.",
  },
  {
    q: "Bagaimana cara membayarnya?",
    a: "Setelah admin mengonfirmasi pesanan, kamu menerima tautan pembayaran. Bisa lewat QRIS, virtual account bank, atau transfer. Pesanan mulai dikerjakan setelah pembayaran masuk.",
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
