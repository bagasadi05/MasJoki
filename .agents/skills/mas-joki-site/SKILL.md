---
name: mas-joki-site
description: Konvensi proyek situs Mas Joki (jasa bantuan tugas Indonesia). Gunakan saat mengubah harga, menambah layanan, menyunting copy, mengerjakan alur pesanan/penawaran, atau menyentuh desain proyek ini. Berisi sumber kebenaran harga, aturan copy yang tidak boleh dilanggar, nomor pembayaran, token desain, dan peta file.
license: MIT
metadata:
  audience: maintainers
  stack: nextjs
---

# Mas Joki — konvensi proyek

Situs pemesanan jasa bantuan tugas berbahasa Indonesia. Model bisnisnya
**harga transparan**: pengunjung menghitung sendiri biayanya sebelum chat.

**Tanpa database, tanpa payment gateway.** Pesanan berakhir sebagai chat
WhatsApp. Pembayaran manual lewat ShopeePay/GoPay/DANA.

## Peta file

| Path | Isi |
|---|---|
| `lib/services.ts` | Katalog 8 layanan + harga per satuan. **Satu-satunya sumber harga.** |
| `lib/pricing.ts` | Mesin hitung: tenggat, tingkat kesulitan, pembulatan, batas minimum. |
| `lib/site.ts` | Brand, nomor WhatsApp, **nomor pembayaran e-wallet**, jam operasional. |
| `lib/validation.ts` | Skema zod untuk kedua formulir. |
| `lib/rate-limit.ts` | Rate limit in-memory per IP. |
| `lib/types.ts` | `ActionResult` (status, pesan, `waUrl`, `fieldErrors`). |
| `lib/nav.ts` | Item navigasi bersama (header desktop + menu seluler). |
| `lib/aksen.ts` | Palet aksen + pemetaan warna per layanan (satu sumber identitas warna). |
| `lib/pesan.ts` | Penyusun teks pesan WhatsApp (fungsi murni, mudah diuji). |
| `app/actions.ts` | Server action `submitOrder` & `submitQuote` → susun tautan WhatsApp. |
| `app/page.tsx` | Landing page: hero, daftar harga, cara kerja, pembayaran, kalkulator, FAQ. |
| `app/jasa/page.tsx` | Daftar layanan (SEO + internal link). |
| `app/jasa/[layanan]/page.tsx` | Detail per layanan, statis via `generateStaticParams`. |
| `content/layanan.ts` | Konten per layanan (intro, cakupan, FAQ). Wajib diisi saat nambah layanan. |
| `content/faq.ts` | FAQ umum (dipakai juga untuk FAQPage schema). |
| `components/price-calculator.tsx` | Kalkulator dua mode, validasi per kolom, panel sukses. |
| `components/pembayaran.tsx` | Bagian pembayaran e-wallet + tombol salin nomor + CTA konfirmasi. |
| `components/wa-melayang.tsx` | Tombol WhatsApp melayang; sembunyi saat bagian `#hitung`/`#bayar` terlihat. |
| `components/site-header.tsx` | Header sticky + CTA; memuat menu seluler. |
| `components/menu-seluler.tsx` | Menu dropdown mobile (Escape, klik luar, fokus kembali ke tombol). |
| `components/nota.tsx` | Komponen nota/kwitansi; prop `aksen` menggambar pita warna di tepi atas. |
| `components/stempel-layanan.tsx` | Cap inisial layanan (kotak warna miring) untuk identitas visual. |

## Alur pesanan (penting)

1. Form dikirim ke server action.
2. Action memvalidasi (zod), menghitung ulang harga, lalu menyusun teks pesanan.
3. Action mengembalikan `waUrl` (`wa.me/...?text=...`) — **tidak ada yang
   disimpan**.
4. Panel sukses menampilkan estimasi + nomor pembayaran + tombol
   "Kirim pesanan via WhatsApp". Tautan dibuka di tab baru; pengguna tinggal
   menekan kirim.

Jangan menambahkan database tanpa diminta. Jangan menambahkan payment gateway.
Kalau perlu menyimpan pesanan, itu perubahan arsitektur — diskusikan dulu.

Nomor pembayaran ada di `lib/site.ts` (`pembayaran`). Format tampil `08…`,
format WhatsApp `62…`.

## Model harga

`computePrice(service, qty, deadlineId, difficultyId)` di `lib/pricing.ts`.

- Satuan: `kata` (per 100), `halaman`, `slide`, `dokumen`, `artikel`, `desain`.
- `units = ceil(qty / service.chunk)`; `subtotal = units × pricePerChunk`.
- Pengali tenggat: 7+ hari `1.0`, 4–6 hari `1.1`, 2–3 hari `1.3`, <24 jam `1.6`.
- Pengali kesulitan: standar `1.0`, menengah `1.2`, riset `1.45`.
- Batas minimum (`minPrice`) dikunci pada **harga dasar**, baru dikali pengali
  tenggat dan kesulitan. Total dibulatkan ke **500 rupiah**.

**Aturan:** total di browser tidak pernah dipercaya. Server action menghitung
ulang harga dari `serviceId` + `qty` sebelum menyusun pesan WhatsApp.

Menambah layanan = tambah objek di `SERVICES` **dan** entri di
`content/layanan.ts`. URL halaman detail mengikuti `service.id`:
`/jasa/{id}`. Menghapus/mengganti `id` layanan memotong URL SEO yang sudah
terindeks — kalau hanya mengubah isi, jangan ganti `id`.

## Dua mode pesanan

1. **Hitung langsung** — pengguna memilih layanan, jumlah, tenggat, kesulitan.
   Nota menampilkan rincian baris. Pesan WhatsApp memuat semuanya + estimasi.
2. **Minta penawaran** — brief bebas untuk tugas yang tidak masuk pola.
   Pesan WhatsApp memuat brief + tenggat + anggaran.

Keduanya memakai honeypot `perusahaan`. Bot yang mengisi honeypot mendapat
balasan "ok" tanpa `waUrl`, jadi tidak ada tautan yang bisa disalahgunakan.

## Halaman layanan (SEO)

- `/jasa` = daftar; `/jasa/[layanan]` = detail per layanan (statis).
- Halaman detail memakai `generateMetadata` (judul + canonical + og) dan
  JSON-LD `Service` + `FAQPage` + `BreadcrumbList`.
- CTA "Hitung biaya persisnya" menaut ke `/?layanan={id}#hitung`. Kode di
  `CalculatorProvider` membaca query `layanan`/`mode` dari URL — jangan hapus,
  itu yang membuat tombol CTA langsung memilih layanan yang benar.
- Slug tak dikenal → 404. Jangan menambah `dynamicParams`; tidak kompatibel
  dengan `cacheComponents`.

## Aturan copy (jangan dilanggar)

- **Tanpa jaminan hasil.** Jangan tulis "100% lolos Turnitin", "dijamin bebas
  plagiat", atau klaim skor. Itu janji yang tidak bisa dipenuhi dan berisiko
  secara hukum.
- **Tanpa bukti sosial karangan.** Tidak ada testimoni, jumlah pelanggan, atau
  rating fiktif. Bagian "Tiga contoh" memang dihitung dari mesin harga, jadi
  angkanya jujur — pertahankan sifat itu.
- **Tanpa urgensi palsu.** Tidak ada "sisa 2 slot" atau hitung mundur.
- Sebut layanan apa adanya: bantuan penulisan dan penyuntingan, bukan
  "pengerjaan tugasmu biar kamu libur".
- Bahasa Indonesia informal-profesional: "kamu", bukan "Anda". Angka pakai
  format `Rp 15.000` lewat `rupiah()` di `lib/format.ts`, jangan
  `toLocaleString` langsung (hindari hydration mismatch).
- Sebut harga selalu dengan satuan: "Rp 2.500 / 100 kata", bukan "mulai 2.500".
- Pembayaran disebut sebagai **ShopeePay, GoPay, DANA** — bukan QRIS/VA/transfer
  bank.

## Token desain

Arah visual: **nota/kwitansi**, bukan kartu SaaS.

```
paper #F7F2E6 · paper-2 #ECE4D2 · card #FFFDF6
ink #101A33 · ink-soft #3C465C · muted #5F6672
line #DDD3BD · brand #1F3BE0 · brand-soft #E7EAFF · stabilo #FFE44D
display: Bricolage Grotesque · body: Plus Jakarta Sans
```

### Warna aksen layanan

Satu layanan = satu warna, dipakai konsisten sebagai penanda (bukan hiasan):

| Aksen | Teks | Latar lembut | Layanan |
|---|---|---|---|
| biru | `#1F3BE0` | `#E7EAFF` | Parafrase |
| mint | `#2A6B55` | `#E6F1EA` | Humanisasi teks |
| koral | `#9E4E42` | `#F6E7E2` | Makalah & laporan |
| lilac | `#6556A3` | `#ECE7F7` | Artikel jurnal |
| amber | `#8A5D12` | `#F7EDD3` | PowerPoint |
| langit | `#2B6A97` | `#E4EFF7` | Rapikan Word |
| olive | `#5F6F2A` | `#EEF1DC` | Terjemahan |
| rose | `#9D4D6B` | `#F6E7ED` | Desain visual |

Aturannya:

- Semua warna aksen dan pemetaan layanan ada di `lib/aksen.ts`. Jangan menulis
  kelas warna langsung di komponen untuk identitas layanan.
- Warna hanya boleh muncul sebagai titik kecil, cap inisial, garis atas kartu,
  chip, pita, atau wash bagian. Jangan mewarnai tombol utama — tombol aksi tetap
  `brand`/`ink`.
- Jangan menambah warna baru di luar tabel ini. Kalau butuh, turunkan chroma
  dan pastikan kontras teks ≥ 4.5:1 di atas latarnya.
- Warna tidak boleh menjadi satu-satunya pembeda; nama layanan selalu ada.
- Wash bagian: `paper-2` untuk netral, `amber-soft/50` (cara kerja),
  `langit-soft/50` (pembayaran), `lilac-soft/50` (contoh). Hero layanan memakai
  `aksen.wash` (/45). Sisanya biarkan `paper`.
- `components/stempel-layanan.tsx` = cap inisial dua huruf untuk identitas
  layanan di daftar harga, kartu `/jasa`, judul halaman layanan, dan layanan
  terkait. Titik kecil tetap dipakai di footer dan tombol kalkulator.
- `.pita` = garis 4px berisi delapan warna layanan (bukan gradasi halus).
  Maksimal tiga tempat per halaman: bawah header, mahkota blok CTA akhir, dan
  atas footer.
- `Nota` menerima prop `aksen`; garis 5px di atas nota mengikuti layanan aktif
  (kalkulator) atau layanan halaman (detail). Tanpa `aksen`, nota tetap netral.

- Nota = `.nota` (tepi bawah bergerigi), stempel = `.stempel`.
- Hanya satu momen gerak: nota tercetak + stempel turun saat hero dimuat.
  Hormati `prefers-reduced-motion`.
- Jangan tambahkan eyebrow ALL-CAPS, kartu rounded identik, atau gradien
  dekoratif. Struktur (garis, garis putus-putus, penomoran) hanya dipakai kalau
  memang membawa informasi.
- Fokus keyboard wajib terlihat; jangan hapus `:focus-visible` di `globals.css`.
- Halaman ini terang saja. Jangan tambahkan mode gelap tanpa diminta.
- Jangan memakai putih bersih (#FFF) untuk latar atau kartu: pakai `card`.
  Putih bersih hanya untuk kertas nota di dalam poster/cetak.
- Irama bagian: krem `paper` dan `paper-2` bergantian, ditambah maksimal satu
  bidang jenuh per halaman (pita `stabilo` atau panel `ink`). Jangan membuat
  setiap bagian berwarna sendiri.

## UX & aksesibilitas

- Form memakai `noValidate`; validasi lewat zod di server action. Error
  dikembalikan sebagai `fieldErrors`, ditampilkan di bawah kolom terkait, lalu
  fokus berpindah ke kolom pertama yang salah (`fokusKesalahan`). Pesan error
  pada satu kolom hilang saat kolom itu diperbaiki (`bersihkanGalat`).
- Panel sukses menggulir dirinya ke tampilan dan memakai `role="status"`.
  Tombol WhatsApp tetap tautan biasa yang dibuka pengguna, bukan redirect
  otomatis.
- Header punya skip link ke `#konten` (setiap `<main>` wajib `id="konten"`) dan
  menu seluler yang bisa ditutup dengan Escape/klik luar.
- Tombol WhatsApp melayang disembunyikan saat `#hitung` atau `#bayar` terlihat
  agar tidak menutupi CTA utama. Jangan menambahkan tombol melayang kedua.
- Target sentuh minimal ~40px; jangan mengecilkan tombol header di mobile.
- Semua placeholder diakhiri `…` (bukan `...`), dan input non-rahasia memakai
  `autoComplete="off"`/`spellCheck={false}` bila perlu.
- Jangan memakai `aria-live` pada seluruh nota (berisik). Cukup satu region
  `sr-only` berisi total.

## Perintah

```bash
npm run dev       # http://localhost:3000
npm run build     # build produksi
npm run lint
npm run typecheck
```

## Belum dikerjakan

- Upload file langsung dari halaman (sekarang hanya tautan Drive).
- Cek status pesanan otomatis (status hanya lewat chat WhatsApp).
- Katalog promo/kode referral.
