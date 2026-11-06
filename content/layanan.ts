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
      "Menyusun ulang kalimat dengan bahasa sendiri tanpa mengubah makna, istilah teknis, atau nomor sitasi. Cocok untuk naskah yang masih perlu dirapikan bahasanya dan disesuaikan dengan pedoman kampus.",
    cakupan: [
      "Menyusun ulang per kalimat langsung oleh Mas Joki, bukan sinonim bot otomatis",
      "Istilah teknis, nama teori, dan angka tetap seperti aslinya",
      "Sitasi dan daftar pustaka tidak diubah",
      "Hasil dikirim sebagai .docx yang bebas kamu edit",
    ],
    siapkan: [
      "Teks asli dalam Word atau Google Docs",
      "Bagian mana saja yang perlu diparafrase",
      "Pedoman gaya sitasi kampusmu (APA, MLA, atau lainnya)",
    ],
    faq: [
      {
        q: "Apakah similaritas pasti turun?",
        a: "Biasanya turun signifikan, tapi tidak ada angka yang bisa dijanjikan mutlak. Hasilnya tergantung teks asli dan basis data repositori kampus. Yang saya jamin: kalimat benar-benar disusun ulang secara manual, bukan sekadar menukar sinonim otomatis.",
      },
      {
        q: "Apakah makna tulisan bisa berubah?",
        a: "Tidak, selama brief-nya jelas. Kalau ada kalimat yang ambigu, Mas Joki akan bertanya dulu sebelum mengubahnya.",
      },
    ],
  },
  humanisasi: {
    intro:
      "Merapikan teks yang terasa kaku atau terlalu seragam: memvariasikan panjang kalimat, memilih diksi yang lebih wajar, dan membuang pola berulang.",
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
        q: "Apakah skor deteksi AI pasti jadi 0%?",
        a: "Tidak, dan saya tidak menjanjikannya karena detektor AI berubah terus dan sering menghasilkan false positive. Yang saya kerjakan adalah menyunting naskah secara manual agar mengalir alami layaknya pemikiran manusia — bukan mengejar skor algoritma tertentu.",
      },
      {
        q: "Apakah kutipan langsung ikut diubah?",
        a: "Tidak. Kutipan langsung, definisi undang-undang, dan istilah teknis tetap dipertahankan.",
      },
    ],
  },
  makalah: {
    intro:
      "Membantu menyusun makalah, laporan magang, atau tugas akhir berdasarkan materi dan referensi yang kamu berikan.",
    cakupan: [
      "Struktur lengkap: pendahuluan, pembahasan, sampai penutup",
      "Referensi terdaftar di daftar pustaka",
      "Format margin dan spasi rapi sejak awal",
      "Garansi dua kali revisi gratis",
    ],
    siapkan: [
      "Topik atau judul tugas",
      "Pedoman penulisan dari dosen atau kampus (kalau ada)",
      "Referensi utama yang wajib dipakai (buku, jurnal, dsb.)",
      "Jumlah halaman dan tenggat waktu",
    ],
    faq: [
      {
        q: "Apakah referensi dicarikan?",
        a: "Bisa, dengan biaya tambahan jika masuk tingkat kesulitan riset. Tanpa itu, saya menulis langsung dari referensi yang kamu kirim agar sumbernya tetap bisa kamu pertanggungjawabkan.",
      },
      {
        q: "Berapa lama pengerjaannya?",
        a: "Tergantung jumlah halaman. Untuk 10–15 halaman biasanya selesai dalam 1–2 hari kerja pada tenggat normal.",
      },
    ],
  },
  jurnal: {
    intro:
      "Menyusun artikel jurnal ilmiah dengan kaidah akademis: struktur IMRAD, bahasa baku, dan format rujukan sesuai standar jurnal target.",
    cakupan: [
      "Struktur IMRAD (Introduction, Methods, Results, and Discussion)",
      "Penulisan abstrak dwibahasa (Indonesia & Inggris)",
      "Sitasi terintegrasi dengan gaya APA, IEEE, atau Harvard",
      "Revisi gratis dua kali",
    ],
    siapkan: [
      "Data atau temuan penelitian yang mau ditulis",
      "Template atau nama jurnal target",
      "Referensi pendukung utama",
    ],
    faq: [
      {
        q: "Apakah dijamin tembus jurnal tertentu?",
        a: "Mas Joki membantu penulisan naskah sesuai standar ilmiah, bukan menjamin penerimaan (acceptance) karena keputusan mutlak di tangan reviewer dan editor jurnal.",
      },
      {
        q: "Apakah termasuk olah data statistik?",
        a: "Hanya penulisan dan penyajian data mentah. Untuk olah data khusus (SPSS, SEM, dsb.), konsultasikan dulu via chat sebelum memesan.",
      },
    ],
  },
  artikel_ilmiah: {
    intro:
      "Artikel ilmiah terstruktur untuk tugas kuliah, seminar, atau mata kuliah kepenulisan akademik. Batas maksimal 3.000 kata dengan sitasi dan daftar pustaka rapi.",
    cakupan: [
      "Struktur artikel ilmiah lengkap (Pendahuluan, Metode/Ulasan, Pembahasan, Kesimpulan)",
      "Kutipan dan sitasi sesuai pedoman (APA 7, IEEE, Harvard)",
      "Batas maksimal 3.000 kata naskah tugas kuliah",
      "Dikerjakan langsung oleh Mas Joki tanpa perantara",
    ],
    siapkan: [
      "Tema atau topik tugas dari dosen",
      "Bahan referensi atau jurnal acuan (jika ada)",
      "Format pedoman tugas kampus",
    ],
    faq: [
      {
        q: "Bagaimana jika naskah lebih dari 3.000 kata?",
        a: "Jika melebihi 3.000 kata, pesanan dialihkan ke mode Minta Penawaran untuk kesepakatan waktu dan tarif khusus.",
      },
      {
        q: "Apakah termasuk daftar pustaka?",
        a: "Ya, sudah termasuk daftar pustaka lengkap berformat baku.",
      },
    ],
  },
  jurnal_submit: {
    intro:
      "Artikel jurnal komprehensif berstandar publikasi nasional (SINTA) atau internasional. Mengikuti template jurnal tujuan dengan struktur IMRAD lengkap hingga 6.000 kata, termasuk cek kemiripan awal.",
    cakupan: [
      "Format IMRAD ketat sesuai template jurnal target",
      "Sitasi dan daftar pustaka Mendeley/Zotero siap pakai",
      "Batas maksimal 6.000 kata",
      "Termasuk laporan cek kemiripan (no-repository)",
    ],
    siapkan: [
      "Tautan author guidelines / template jurnal tujuan",
      "Data mentah atau hasil penelitian yang ingin ditulis",
      "Target tenggat submit jurnal",
    ],
    faq: [
      {
        q: "Apakah formatnya persis template jurnal tujuan?",
        a: "Ya, penulisan disesuaikan langsung dengan template dan author guidelines jurnal yang kamu tuju.",
      },
      {
        q: "Bagaimana jika naskah lebih dari 6.000 kata?",
        a: "Naskah di atas 6.000 kata dapat dikonsultasikan via WhatsApp untuk penawaran khusus.",
      },
    ],
  },
  powerpoint: {
    intro:
      "Membuat slide presentasi yang visual, ringkas, dan fokus pada poin utama — dari naskah makalah, jurnal, atau outline materi yang kamu miliki.",
    cakupan: [
      "Desain bersih dengan hierarki visual yang jelas",
      "Poin-poin disederhanakan agar tidak teks melulu",
      "Format .pptx yang bisa kamu sesuaikan sendiri",
      "Opsi tambahan: naskah bicara per slide (speaker notes)",
    ],
    siapkan: [
      "Bahan materi (makalah, skripsi, atau outline poin)",
      "Jumlah slide yang diinginkan atau durasi presentasi",
      "Template kampus kalau ada ketentuan khusus",
    ],
    faq: [
      {
        q: "Bisa pakai template kampus saya?",
        a: "Bisa. Kirim file templatenya, dan saya akan memakai master slide yang sama supaya seragam dengan presentasi kampusmu.",
      },
      {
        q: "Apakah sudah termasuk materi presentasinya?",
        a: "Slide dirangkum dari materi yang kamu kirim. Kalau belum ada materinya sama sekali, hubungi lewat WhatsApp untuk konsultasi penulisan dari nol.",
      },
    ],
  },
  word: {
    intro:
      "Merapikan dokumen skripsi, tesis, makalah, atau laporan yang berantakan formatnya agar sesuai dengan pedoman penulisan resmi kampusmu.",
    cakupan: [
      "Atur margin, ukuran kertas, dan spasi",
      "Heading bertingkat (Bab, Sub-bab) konsisten",
      "Daftar isi, tabel, dan gambar otomatis",
      "Penomoran halaman romawi dan angka terpisah rapi",
    ],
    siapkan: [
      "File dokumen Word (.docx) yang mau dirapikan",
      "Buku pedoman penulisan format dari kampusmu (PDF)",
      "Catatan revisi dari dosen (kalau ada)",
    ],
    faq: [
      {
        q: "Apakah isinya ikut diubah?",
        a: "Tidak. Layanan ini murni perapian tata letak, format, dan tipografi dokumen. Teks dan isi tetap 100% seperti yang kamu tulis.",
      },
      {
        q: "Berapa lama prosesnya?",
        a: "Untuk skripsi lengkap (50–100 halaman) biasanya memakan waktu 2–6 jam kerja.",
      },
    ],
  },
  terjemah: {
    intro:
      "Menerjemahkan teks akademik dari bahasa Indonesia ke Inggris atau sebaliknya dengan tata bahasa natural dan konteks ilmiah yang tepat.",
    cakupan: [
      "Diterjemahkan secara cermat dengan padanan istilah yang tepat",
      "Gaya bahasa akademik, bukan terjemahan mesin kaku",
      "Format dokumen tetap dipertahankan",
      "Pengecekan konsistensi istilah teknis",
    ],
    siapkan: [
      "Dokumen teks sumber (Word/PDF)",
      "Glosarium istilah khusus (kalau ada)",
      "Target audiens dokumen",
    ],
    faq: [
      {
        q: "Apakah bisa untuk abstrak jurnal?",
        a: "Bisa! Tersedia juga Paket Abstrak (ID+EN) flat Rp35.000 untuk pasangan abstrak skripsi/artikel sampai 300 kata per versi.",
      },
      {
        q: "Bagaimana kalau teksnya sangat panjang?",
        a: "Harga dihitung per 100 kata (Rp10.000/100 kata). Untuk dokumen di atas 5.000 kata, gunakan mode penawaran supaya ada penyesuaian diskon volume.",
      },
    ],
  },
  paket_abstrak: {
    intro:
      "Pasangan abstrak dua versi (Bahasa Indonesia dan Bahasa Inggris akademik) untuk skripsi, tesis, atau artikel jurnal. Maksimal 300 kata per versi, siap ditempel ke dokumen akhir.",
    cakupan: [
      "Abstrak Bahasa Indonesia dengan struktur baku (latar belakang, tujuan, metode, hasil, kesimpulan)",
      "Abstract Bahasa Inggris terjemahan akademik natural (bukan mesin kaku)",
      "Kata kunci (keywords) relevan dan tepat konteks",
      "Batas maksimal 300 kata per versi",
    ],
    siapkan: [
      "Draf skripsi/artikel atau rangkuman penelitianmu",
      "Pedoman penulisan abstrak dari kampus",
    ],
    faq: [
      {
        q: "Apakah bisa revisi jika ada masukan dari dosen pembimbing?",
        a: "Tentu, gratis 2 kali revisi sesuai brief awal.",
      },
      {
        q: "Berapa lama pengerjaannya?",
        a: "Pada tenggat normal, biasanya selesai dalam 6–12 jam kerja.",
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
        a: "Bisa. Sebutkan ukuran cetak dan resolusi di catatan, karena itu memengaruhi tata letak pengerjaan.",
      },
    ],
  },
  turnitin_ai: {
    intro:
      "Membantu menurunkan skor kemiripan Turnitin dan deteksi AI sampai target yang disepakati, umumnya di bawah 30%. Pengerjaan dilakukan manual oleh Mas Joki lewat parafrase mendalam dan restrukturisasi kalimat agar naskah tetap ilmiah dan berbobot.",
    cakupan: [
      "Pemeriksaan naskah awal dan telaah persentase kemiripan",
      "Penyusunan ulang kalimat yang terdeteksi similar / AI secara manual",
      "Struktur akademik, argumen, dan sitasi tetap valid",
      "Hasil akhir dikirim sebagai file Word (.docx) siap pakai",
    ],
    siapkan: [
      "File naskah dokumen lengkap (Word/PDF)",
      "Tangkapan layar atau laporan hasil uji Turnitin/AI sebelumnya (bila ada)",
      "Target batas maksimal persentase kampusmu",
    ],
    faq: [
      {
        q: "Berapa lama proses penurunan skor?",
        a: "Waktu disepakati di awal setelah Mas Joki memeriksa panjang dokumen dan skor awal. Rata-rata 12–24 jam untuk bab skripsi atau makalah standar.",
      },
      {
        q: "Bagaimana sistem penentuan biayanya?",
        a: "Karena tingkat kesulitan tergantung panjang teks dan skor awal, biaya ditentukan lewat penawaran langsung di awal. Harganya terkunci sebelum pengerjaan dimulai.",
      },
    ],
  },
};
