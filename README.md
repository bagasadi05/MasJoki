# Mas Joki

Situs pemesanan jasa bantuan tugas dengan **harga transparan**: pengunjung
menghitung sendiri biayanya sebelum chat, lalu mengirim ringkasannya ke WhatsApp
admin dalam satu klik.

Dibangun dengan Next.js 16 (App Router) dan Tailwind CSS v4. **Tanpa database,
tanpa payment gateway.** Pesanan masuk sebagai chat WhatsApp; pembayaran manual
lewat ShopeePay, GoPay, atau DANA ke **089619774116**.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # opsional; tanpa env, nomor bawaan tetap dipakai
npm run dev
```

Buka http://localhost:3000.

```bash
npm run build     # build produksi (termasuk type check)
npm run lint
npm run typecheck
```

> Di mesin dengan RAM kecil, `next build` bisa kehabisan heap saat type check.
> Jalankan `NODE_OPTIONS=--max-old-space-size=4096 npm run build`.

## Alur pesanan

| Mode | Untuk | Ujungnya |
|---|---|---|
| **Hitung langsung** | Tugas yang masuk pola: jumlah + tenggat + kesulitan | Ringkasan + total dikirim ke WhatsApp |
| **Minta penawaran** | Tugas campuran atau di luar daftar layanan | Brief dikirim ke WhatsApp, admin balas harga |

Alurnya:

1. Pengunjung mengisi kalkulator.
2. Server action (`app/actions.ts`) memvalidasi isian dan **menghitung ulang
   harga** — angka dari browser tidak dipercaya.
3. Server mengembalikan tautan `wa.me` berisi ringkasan pesanan yang sudah
   terisi. Tidak ada data yang disimpan di server.
4. Admin membalas, mengunci harga, lalu pembeli membayar via e-wallet dan
   mengirim bukti di chat yang sama.

Nomor WhatsApp, nomor pembayaran, dan metode ada di `lib/site.ts`:

```ts
export const site = { whatsapp: "6289619774116", ... };
export const pembayaran = {
  metode: ["ShopeePay", "GoPay", "DANA"],
  nomor: "089619774116",
  nomorWhatsapp: "6289619774116",
};
```

Ganti keduanya kalau nomor berubah. `site.whatsapp` memakai format internasional
(`62…`), `pembayaran.nomor` memakai format lokal (`08…`).

## Perlindungan formulir

- **Honeypot** kolom `perusahaan` (diisi bot, diabaikan manusia) — bot tidak
  diberi tautan WhatsApp.
- **Rate limit** di `lib/rate-limit.ts`: maksimal 10 pengiriman per IP per jam,
  di memori. Cukup untuk satu instance; ganti dengan Redis kalau sudah
  di-deploy di banyak node.

## Halaman SEO

- `/jasa` = daftar layanan; `/jasa/{id}` = halaman detail per layanan (statis,
  dengan `generateMetadata` + JSON-LD `Service`/`FAQPage`/`BreadcrumbList`).
- Konten per layanan disimpan di `content/layanan.ts` — wajib diisi saat
  menambah layanan di `lib/services.ts`.
- CTA di halaman layanan menaut ke `/?layanan={id}#hitung`; kalkulator membaca
  `layanan`/`mode` dari query string.

## Mengubah harga

Semua harga ada di satu tempat: `lib/services.ts`.

```ts
{
  id: "makalah",
  name: "Makalah & laporan",
  basis: "halaman",
  chunk: 1,
  pricePerChunk: 12000,   // Rp 12.000 per halaman
  minQty: 1,
  defaultQty: 10,
  minPrice: 35000,
  presets: [5, 10, 20, 40],
}
```

Pengali tenggat dan tingkat kesulitan ada di `lib/pricing.ts`. Pembulatan ke
500 rupiah dan batas minimum dihitung di `computePrice()`.

## Deploy

Vercel: import repo, tambahkan env yang sama, deploy. Tidak ada konfigurasi lain.

## Yang belum dikerjakan

- Upload file langsung dari halaman (sekarang pelanggan menempel tautan Drive).
- Cek status pesanan otomatis — status hanya lewat chat WhatsApp.
- Katalog promo/kode referral.

## Catatan sebelum go-live

- Ganti `NEXT_PUBLIC_WHATSAPP`, email, dan Instagram di `.env.local`.
- Pastikan nomor pembayaran dan nama penerima yang tampil memang milik admin.
- Copy di situs ini sengaja tidak memuat jaminan hasil ("100% lolos Turnitin")
  maupun testimoni karangan. Pertahankan itu saat menyunting.

Konvensi kerja lengkap ada di `.agents/skills/mas-joki-site/SKILL.md`.
