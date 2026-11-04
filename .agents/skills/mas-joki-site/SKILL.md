---
name: mas-joki-site
description: Konvensi proyek situs Mas Joki (jasa bantuan tugas Indonesia). Gunakan saat mengubah harga, menambah layanan, menyunting copy, mengerjakan alur pesanan/penawaran, atau menyentuh desain dan database proyek ini. Berisi sumber kebenaran harga, aturan copy yang tidak boleh dilanggar, token desain, dan peta file.
license: MIT
metadata:
  audience: maintainers
  stack: nextjs-supabase
---

# Mas Joki — konvensi proyek

Situs pemesanan jasa bantuan tugas berbahasa Indonesia. Model bisnisnya
**harga transparan**: pengunjung menghitung sendiri biayanya sebelum chat.

## Peta file

| Path | Isi |
|---|---|
| `lib/services.ts` | Katalog 8 layanan + harga per satuan. **Satu-satunya sumber harga.** |
| `lib/pricing.ts` | Mesin hitung: tenggat, tingkat kesulitan, pembulatan, batas minimum. |
| `lib/site.ts` | Identitas brand, nomor WhatsApp, jam operasional. |
| `lib/validation.ts` | Skema zod untuk kedua formulir. |
| `lib/supabase.ts` | Klien service role (server only). |
| `lib/midtrans.ts` | Klien Snap (REST, tanpa SDK). |
| `lib/payment-status.ts` | Pemetaan status Midtrans → status lokal + aturan monoton. |
| `lib/auth.ts` | Sesi admin (cookie HMAC). |
| `app/actions.ts` | Server action `submitOrder` dan `submitQuote`. |
| `app/admin/(dashboard)/` | Dashboard admin, dilindungi layout. |
| `app/admin/(dashboard)/actions.ts` | `ubahStatus` + `cekStatusPembayaran` (rekonsiliasi Midtrans). |
| `app/api/pembayaran/route.ts` | Membuat transaksi Snap untuk satu pesanan. |
| `app/api/midtrans/webhook/route.ts` | Verifikasi signature + update status. |
| `app/pesanan/[kode]/page.tsx` | Halaman status & bayar untuk pelanggan. |
| `app/page.tsx` | Landing page + JSON-LD. |
| `app/jasa/page.tsx` | Daftar layanan (SEO + internal link). |
| `app/jasa/[layanan]/page.tsx` | Halaman detail per layanan, statis via `generateStaticParams`. |
| `content/layanan.ts` | Konten per layanan (intro, cakupan, FAQ). Wajib diisi saat nambah layanan. |
| `components/price-calculator.tsx` | Kalkulator dua mode. |
| `components/nota.tsx` | Komponen nota/kwitansi. |
| `supabase/schema.sql` | Tabel `orders` dan `quote_requests`. |
| `content/faq.ts` | Sumber FAQ (dipakai juga untuk FAQPage schema). |

## Model harga

`computePrice(service, qty, deadlineId, difficultyId)` di `lib/pricing.ts`.

- Satuan: `kata` (per 100), `halaman`, `slide`, `dokumen`, `artikel`, `desain`.
- `units = ceil(qty / service.chunk)`; `subtotal = units × pricePerChunk`.
- Pengali tenggat: 7+ hari `1.0`, 4–6 hari `1.1`, 2–3 hari `1.3`, <24 jam `1.6`.
- Pengali kesulitan: standar `1.0`, menengah `1.2`, riset `1.45`.
- Batas minimum (`minPrice`) dikunci pada **harga dasar**, baru dikali pengali
  tenggat dan kesulitan. Total dibulatkan ke **500 rupiah**.

**Aturan:** total di browser tidak pernah dipercaya. Server action menghitung
ulang harga dari `serviceId` + `qty` sebelum menyimpan.

Menambah layanan = tambah objek di `SERVICES` **dan** entri di
`content/layanan.ts`. URL halaman detail mengikuti `service.id`:
`/jasa/{id}`. Menghapus/mengganti `id` layanan memotong URL SEO yang sudah
terindeks — kalau hanya mengubah isi, jangan ganti `id`.

## Halaman layanan (SEO)

- `/jasa` = daftar; `/jasa/[layanan]` = detail per layanan (statis).
- Halaman detail memakai `generateMetadata` (judul + canonical + og) dan
  JSON-LD `Service` + `FAQPage` + `BreadcrumbList`.
- CTA "Hitung biaya persisnya" menaut ke `/?layanan={id}#hitung`. Kode di
  `CalculatorProvider` membaca query `layanan`/`mode` dari URL — jangan hapus,
  itu yang membuat tombol CTA langsung memilih layanan yang benar.
- Slug tak dikenal → 404 (tidak boleh `dynamicParams`; tidak kompatibel dengan
  `cacheComponents`).

## Dua mode pesanan

1. **Hitung langsung** — pengguna memilih layanan, jumlah, tenggat, kesulitan.
   Nota menampilkan rincian baris. Submit menyimpan ke `orders`.
2. **Minta penawaran** — brief bebas untuk tugas yang tidak masuk pola.
   Submit menyimpan ke `quote_requests`.

Keduanya memakai honeypot `perusahaan`. Tanpa kredensial Supabase, action
mengembalikan `demo: true` dan UI menampilkan peringatan bahwa data belum
tersimpan — jangan hapus perilaku ini, itu yang membuat repo bisa dijalankan
tanpa backend.

Status pesanan: `menunggu_konfirmasi`→`menunggu_pembayaran`→`dibayar`→
`dikerjakan`→`revisi`→`selesai`, plus `kedaluwarsa` / `gagal` / `dikembalikan`
/ `batal`. Definisi label & pemetaan dari Midtrans ada di
`lib/payment-status.ts` — jangan satukan aturannya di tempat lain.

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
  format `Rp 15.000` lewat `rupiah()` di `lib/format.ts`, jangan `toLocaleString`
  langsung (hindari hydration mismatch).
- Sebut harga selalu dengan satuan: "Rp 2.500 / 100 kata", bukan "mulai 2.500".

## Token desain

Arah visual: **nota/kwitansi**, bukan kartu SaaS.

```
paper #FBFAF6 · ink #101A33 · ink-soft #3C465C · muted #6E7480
line #DED9C8 · brand #1F3BE0 · brand-soft #E7EAFF · stabilo #FFE44D
display: Bricolage Grotesque · body: Plus Jakarta Sans
```

- Nota = `.nota` (tepi bawah bergerigi), stempel = `.stempel`.
- Hanya satu momen gerak: nota tercetak + stempel turun saat hero dimuat.
  Hormati `prefers-reduced-motion`.
- Jangan tambahkan eyebrow ALL-CAPS, kartu rounded identik, atau gradien
  dekoratif. Struktur (garis, garis putus-putus, penomoran) hanya dipakai kalau
  memang membawa informasi.
- Fokus keyboard wajib terlihat; jangan hapus `:focus-visible` di `globals.css`.
- Halaman ini terang saja. Jangan tambahkan mode gelap tanpa diminta.

## Perintah

```bash
npm run dev     # http://localhost:3000
npm run build   # cek tipe + build produksi
npm run lint
```

Seeder Supabase: jalankan `supabase/schema.sql` di SQL Editor.

## Belum dikerjakan

- Upload file langsung ke Supabase Storage (sekarang hanya tautan).
- Autentikasi admin berlapis (Supabase Auth) kalau admin lebih dari satu.
