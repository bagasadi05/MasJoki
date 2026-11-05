/**
 * Data Testimoni & Bukti Sosial Mas Joki (TUGAS 4)
 *
 * PENTING:
 * - TESTIMONIALS_ENABLED default: false (jangan tampilkan sebelum diisi testimoni asli)
 * - Semua entri di bawah adalah entri contoh yang ditandai // TODO: ganti dengan testimoni asli
 */

export interface TestimonialItem {
  id: string;
  quote: string;
  initial: string;
  service: string;
  stars: number;
  roleOrCity?: string;
}

export interface ScreenshotBukti {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

/**
 * Toggle tampilkan section testimoni di beranda.
 * Set ke `true` hanya jika testimoni asli pelanggan sudah dimasukkan.
 */
export const TESTIMONIALS_ENABLED = false;

// TODO: ganti dengan testimoni asli pelanggan Mas Joki
export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "sample-1",
    // TODO: ganti dengan testimoni asli
    quote: "Format skripsi langsung rapi sesuai selingkung kampus, Turnitin dari 42% turun jadi 14%. Penjelasan transparan dan tepat waktu.",
    initial: "A.P.",
    service: "Parafrase & Turnitin Bab 4-5",
    stars: 5,
    roleOrCity: "Mahasiswa Semester 8, Surabaya",
  },
  {
    id: "sample-2",
    // TODO: ganti dengan testimoni asli
    quote: "PPT sidang proposal sangat terbantu. Speaker notes-nya jelas banget, bikin presentasi tenang di depan dosen penguji.",
    initial: "D.K.",
    service: "PowerPoint Sidang Proposal",
    stars: 5,
    roleOrCity: "Mahasiswi FEB, Yogyakarta",
  },
  {
    id: "sample-3",
    // TODO: ganti dengan testimoni asli
    quote: "Makalah studi kasus 15 halaman selesai sebelum deadline 24 jam. Sitasi Harvard rapi dan bebas plagiasi. Recommended!",
    initial: "R.S.",
    service: "Makalah Hukum Bisnis",
    stars: 5,
    roleOrCity: "Mahasiswa Hukum, Semarang",
  },
  {
    id: "sample-4",
    // TODO: ganti dengan testimoni asli
    quote: "Enak banget karena harga dihitung di depan pakai kalkulator, gak ada biaya siluman waktu naskah selesai.",
    initial: "M.F.",
    service: "Rapikan Format Skripsi Word",
    stars: 5,
    roleOrCity: "Mahasiswa Teknik, Malang",
  },
];

// TODO: ganti dengan screenshot chat / bukti hasil asli di folder public/testimoni/
export const SCREENSHOTS_BUKTI: ScreenshotBukti[] = [
  {
    id: "bukti-1",
    src: "/testimoni/bukti-chat-1.png",
    alt: "Tangkapan layar chat testimoni hasil Turnitin",
    caption: "Hasil penurunan similarity Turnitin",
  },
  {
    id: "bukti-2",
    src: "/testimoni/bukti-chat-2.png",
    alt: "Tangkapan layar kepuasan naskah sidang",
    caption: "Konfirmasi naskah disetujui dosen",
  },
];
