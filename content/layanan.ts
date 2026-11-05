import type { ServiceId } from "@/lib/services";

export interface KontenLayanan {
  /** Kalimat pembuka: untuk siapa dan masalah apa. */
  intro: string;
  cakupan: string[];
  /** Yang perlu pelanggan siapkan sebelum memesan. */
  siapkan: string[];
  faq: { q: string; a: string }[];
}

export const KONTEN_LAYANAN: Record<ServiceId, KontenLayanan> = {
  parafrase: {
    intro:
      "Menyusun ulang kalimat dengan bahasa sendiri tanpa mengubah makna, istilah teknis, atau nomor sitasi. Cocok untuk bagian yang masih perlu dirapikan bahasanya tapi sudah sesuai pedoman kampus.",
    cakupan: [
      "Menyusun ulang per kalimat, bukan menukar sinonim otomatis",
      "Istilah teknis, nama teori, dan angka tetap seperti aslinya",
      "Sitasi dan daftar pustaka tidak diubah",
      "Hasil dikirim sebagai .docx yang bisa kamu edit",
    ],
    siapkan: [
      "Teks asli dalam Word atau Google Docs",
      "Bagian mana saja yang perlu diparafrase",
      "Pedoman gaya sitasi kampusmu (APA, MLA, atau lainnya)",
    ],
    faq: [
      {
        q: "Apakah similaritas pasti turun?",
        a: "Biasanya turun, tapi tidak ada angka yang bisa dijanjikan. Hasilnya tergantung teks asli dan basis data yang dipakai kampus. Yang kami jamin: kalimat benar-benar disusun ulang, bukan sekadar mengganti kata.",
      },
      {
        q: "Apakah makna tulisan bisa berubah?",
        a: "Tidak, selama brief-nya jelas. Kalau ada kalimat yang ambigu, admin akan bertanya dulu sebelum mengubahnya.",
      },
    ],
  },
  humanisasi: {
    intro:
      "Merapikan teks yang terasa kaku atau terlalu seragam: memvariasikan panjang kalimat, memilih diksi yang lebih wajar, dan membuang pola yang berulang.",
    cakupan: [
      "Variasi panjang dan struktur kalimat",
      "Diksi disesuaikan dengan gaya akademik kampusmu",
      "Pola pengulangan dan kalimat template dibongkar",
      "Makna dan data tidak diubah",
    ],
    siapkan: [
      "Teks yang ingin dirapikan",
      "Contoh tulisanmu sendiri yang terasa paling natural",
      "Bagian yang tidak boleh diubah sama sekali",
    ],
    faq: [
      {
        q: "Apakah ini menjamin lolos detektor AI?",
        a: "Tidak, dan kami tidak menjanjikannya. Detektor AI berubah terus dan sering salah. Yang kami kerjakan adalah menyunting teks agar lebih wajar dibaca manusia — bukan mengejar skor alat tertentu.",
      },
      {
        q: "Apa bedanya dengan parafrase?",
        a: "Parafrase menyusun ulang makna dengan struktur baru. Humanisasi mempertahankan struktur tetapi memperbaiki ritme, diksi, dan variasi kalimat. Banyak pelanggan memakai keduanya berurutan.",
      },
    ],
  },
  makalah: {
    intro:
      "Menyusun makalah dan laporan dari referensi yang kamu kirim, lengkap dengan pembahasan dan daftar pustaka sesuai pedoman kampus.",
    cakupan: [
      "Struktur mengikuti pedoman kampus (bab, subbab, penomoran)",
      "Pembahasan ditulis dari referensi yang kamu berikan",
      "Daftar pustaka dan sitasi dalam teks",
      "Format .docx siap cetak",
    ],
    siapkan: [
      "Topik dan batasan pembahasan",
      "Referensi yang sudah kamu kumpulkan (jurnal, buku, data)",
      "Template atau pedoman penulisan dari kampus",
      "Jumlah halaman yang diminta",
    ],
    faq: [
      {
        q: "Apakah referensinya dicari sendiri?",
        a: "Bisa, dengan biaya tambahan karena masuk tingkat kesulitan riset. Tanpa itu, kami menulis dari referensi yang kamu kirim agar sumbernya tetap bisa kamu pertanggungjawabkan.",
      },
      {
        q: "Berapa lama pengerjaan makalah 20 halaman?",
        a: "Sekitar 1–2 hari untuk tenggat normal. Kalau butuh 2–3 hari, tarifnya naik 30%; kalau kurang dari 24 jam, naik 60% dan tergantung antrean.",
      },
    ],
  },
  jurnal: {
    intro:
      "Menulis artikel ilmiah dengan struktur IMRAD, argumen yang runtut, dan referensi yang bisa dilacak — untuk tugas akhir, publikasi, atau lomba karya tulis.",
    cakupan: [
      "Abstrak, pendahuluan, metode, hasil, pembahasan, kesimpulan",
      "Sitasi dan daftar pustaka sesuai gaya jurnal tujuan",
      "Tabel dan gambar ditata ulang agar konsisten",
      "Revisi dua kali untuk menyesuaikan catatan pembimbing",
    ],
    siapkan: [
      "Judul atau topik yang diinginkan",
      "Data atau hasil penelitian (kalau ada)",
      "Gaya sitasi jurnal tujuan",
      "Catatan pembimbing kalau sudah ada",
    ],
    faq: [
      {
        q: "Apakah bisa menyesuaikan template jurnal tertentu?",
        a: "Bisa. Kirim template atau tautan author guideline jurnalnya, dan hasilnya akan mengikuti struktur serta gaya sitasi tersebut.",
      },
      {
        q: "Apakah data penelitian disediakan?",
        a: "Tidak. Kami menulis dari data yang kamu berikan. Mengarang data penelitian bukan bagian dari layanan ini.",
      },
    ],
  },
  powerpoint: {
    intro:
      "Membuat slide presentasi yang enak dibaca dari jauh, dengan alur yang jelas dan catatan presenter untuk kamu bawakan.",
    cakupan: [
      "Struktur slide dari outline yang kamu kirim",
      "Tata letak konsisten, teks tidak menumpuk",
      "Grafik dan tabel disederhanakan agar terbaca",
      "Catatan presenter di tiap slide",
      "File .pptx yang bisa kamu edit",
    ],
    siapkan: [
      "Materi atau makalah yang jadi sumber",
      "Durasi presentasi",
      "Warna atau logo kampus (kalau ada)",
      "Jumlah slide yang diinginkan",
    ],
    faq: [
      {
        q: "Bisa pakai template kampus?",
        a: "Bisa. Kirim file templatenya, dan kami akan memakai master slide yang sama supaya seragam dengan presentasi lain.",
      },
      {
        q: "Apakah termasuk gambar dan ikon?",
        a: "Termasuk aset gratis yang boleh dipakai. Kalau butuh foto atau ilustrasi khusus, sebutkan di catatan pesanan.",
      },
    ],
  },
  word: {
    intro:
      "Merapikan file Word agar sesuai pedoman kampus: margin, spasi, heading, penomoran, daftar isi otomatis, dan daftar pustaka.",
    cakupan: [
      "Margin, ukuran kertas, dan spasi sesuai pedoman",
      "Heading dan penomoran bertingkat yang rapi",
      "Daftar isi dan daftar tabel otomatis",
      "Daftar pustaka dirapikan sesuai gaya sitasi",
    ],
    siapkan: [
      "File .docx asli",
      "Pedoman penulisan kampus (PDF atau tautan)",
      "Bagian mana yang paling sering dikoreksi dosen",
    ],
    faq: [
      {
        q: "Apakah isi tulisan diubah?",
        a: "Tidak. Layanan ini hanya menyentuh format. Kalau kamu juga ingin isinya disunting, pesan layanan parafrase atau humanisasi secara terpisah.",
      },
      {
        q: "Bisa selesai dalam hitungan jam?",
        a: "Bisa. Untuk satu dokumen, pengerjaan normal 2–6 jam. Kalau lebih dari tiga dokumen, pakai mode penawaran agar dihitung sekaligus.",
      },
    ],
  },
  terjemah: {
    intro:
      "Menerjemahkan teks Indonesia–Inggris dengan penyuntingan agar hasilnya tidak terasa seperti mesin penerjemah.",
    cakupan: [
      "Terjemahan per kalimat, bukan tempel ke mesin",
      "Istilah teknis dikonsultasikan kalau ambigu",
      "Gaya bahasa disesuaikan konteks akademik atau umum",
      "Dua arah: Indonesia ke Inggris dan sebaliknya",
    ],
    siapkan: [
      "Teks sumber dalam format yang bisa disalin",
      "Konteks pemakaian (abstrak, lampiran, atau presentasi)",
      "Istilah khusus yang harus dipertahankan",
    ],
    faq: [
      {
        q: "Apakah bisa untuk abstrak jurnal?",
        a: "Bisa, dan itu salah satu permintaan tersering. Sebutkan bahwa teksnya abstrak agar gaya bahasanya disesuaikan.",
      },
      {
        q: "Bagaimana kalau teksnya sangat panjang?",
        a: "Harga dihitung per 100 kata. Untuk dokumen di atas 5.000 kata, gunakan mode penawaran supaya ada penyesuaian volume.",
      },
    ],
  },
  desain: {
    intro:
      "Membuat cover, poster, atau infografis untuk keperluan kampus dan organisasi, lengkap dengan file sumber yang bisa kamu edit.",
    cakupan: [
      "Cover makalah, laporan, atau proposal",
      "Poster kegiatan dan infografis data",
      "File sumber (Canva atau format desain) diserahkan",
      "Revisi dua kali untuk penyesuaian",
    ],
    siapkan: [
      "Judul dan teks yang harus muncul",
      "Ukuran atau orientasi yang dibutuhkan",
      "Referensi visual yang kamu suka",
      "Logo dan warna resmi (kalau ada)",
    ],
    faq: [
      {
        q: "File apa yang saya terima?",
        a: "File gambar siap pakai (PNG/JPG) plus sumber desainnya, supaya kamu bisa mengubah teks sendiri nanti.",
      },
      {
        q: "Bisa desain untuk cetak?",
        a: "Bisa. Sebutkan ukuran cetak dan jumlah halaman di catatan, karena itu memengaruhi tata letak dan waktu pengerjaan.",
      },
    ],
  },
};
