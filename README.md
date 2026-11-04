# Mas Joki

Situs pemesanan jasa bantuan tugas dengan **harga transparan**: pengunjung
menghitung sendiri biayanya sebelum chat, atau meminta penawaran kalau tugasnya
tidak masuk pola.

Dibangun dengan Next.js 16 (App Router), Tailwind CSS v4, dan Supabase.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # opsional; tanpa env, situs tetap jalan
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

## Dua mode pesanan

| Mode | Untuk | Disimpan ke |
|---|---|---|
| **Hitung langsung** | Tugas yang masuk pola: jumlah + tenggat + kesulitan | `orders` |
| **Minta penawaran** | Tugas campuran atau di luar daftar layanan | `quote_requests` |

Tanpa kredensial Supabase, kedua mode tetap berjalan dan mengembalikan kode
pesanan, tetapi UI menandainya sebagai **mode demo** (data tidak tersimpan).
Ini disengaja supaya repo bisa dicoba tanpa setup backend.

## Perlindungan formulir

- **Honeypot** kolom `perusahaan` (diisi bot, diabaikan manusia) — langsung
  lolos tanpa menyimpan apa pun.
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

**Harga dihitung ulang di server** (`app/actions.ts`) — total dari browser tidak
dipercaya.

## Supabase

1. Buat project di https://supabase.com.
2. Jalankan isi `supabase/schema.sql` di SQL Editor.
3. Isi `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

RLS aktif tanpa policy: hanya service role (server) yang bisa menulis dan
membaca. Jangan pernah memakai service role key di komponen client.

## Pembayaran (Midtrans Snap)

Alur: pesanan dibuat → halaman `/pesanan/[kode]` → tombol **Bayar sekarang** →
`POST /api/pembayaran` membuat transaksi Snap → pelanggan diarahkan ke halaman
Midtrans → status diperbarui lewat webhook.

Isi `.env.local`:

```bash
MIDTRANS_SERVER_KEY=SB-Mid-server-...
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-...
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_SITE_URL=https://domain-kamu.com
```

Lalu di dashboard Midtrans (Sandbox): **Settings → Payment Notification URL**

```
https://domain-kamu.com/api/midtrans/webhook
```

Untuk mencoba di lokal, buka tunnel (mis. `ngrok http 3000`) dan pakai URL
tunnel itu sebagai notification URL.

Yang sudah dijaga di kode:

- `server key` hanya dipakai di server (`lib/midtrans.ts`).
- `signature_key` diverifikasi `sha512(order_id + status_code + gross_amount + server_key)`
  dengan perbandingan waktu-konstan sebelum database disentuh.
- Nominal notifikasi dicocokkan dengan `orders.total`.
- Status tidak bisa mundur: notifikasi `pending` yang telat tidak menimpa
  `dibayar` (`lib/payment-status.ts` → `bolehDitimpa`).
- Webhook selalu membalas 2xx setelah diproses agar Midtrans tidak retry
  terus-menerus.

Tanpa `MIDTRANS_SERVER_KEY`, tombol bayar mengembalikan pesan bahwa pembayaran
belum aktif — situs tidak error.

## Dashboard admin

Isi `ADMIN_PASSWORD` (minimal 8 karakter) di `.env.local`, lalu buka
`/admin/login`.

Isinya:

- ringkasan jumlah pesanan per tahap,
- 100 pesanan terbaru + ubah status langsung dari tabel,
- 50 permintaan penawaran terbaru + ubah status,
- tautan WhatsApp per pelanggan dengan pesan yang sudah terisi.

Sesi disimpan sebagai cookie `httpOnly` berisi HMAC dari password — password
tidak pernah masuk cookie, dan tidak ada halaman admin yang bisa diakses tanpa
sesi. Untuk keamanan lebih serius, ganti dengan Supabase Auth sebelum dipakai
banyak admin.

## Deploy

Vercel: import repo, tambahkan env yang sama, deploy. Tidak ada konfigurasi lain.

## Yang belum dikerjakan

- Integrasi Midtrans Snap (skill `integrate-midtrans-payments` sudah terpasang;
  tinggal membuat transaksi dan halaman status pembayaran).
- Dashboard admin untuk mengubah `status` pesanan.
- Autentikasi admin dan rate limit formulir.
- Halaman pelacakan untuk pelanggan (`/pesanan/[kode]`).
- Upload file langsung ke Supabase Storage — sekarang masih berupa tautan.

## Catatan sebelum go-live

- Ganti `NEXT_PUBLIC_WHATSAPP`, email, dan Instagram di `.env.local`.
- Untuk KYC Midtrans, posisikan usaha sebagai **bantuan penulisan dan
  penyuntingan akademik**, bukan "pengerjaan tugas". Sertakan syarat & ketentuan
  serta disclaimer yang sudah ada di footer.
- Copy di situs ini sengaja tidak memuat jaminan hasil ("100% lolos Turnitin")
  maupun testimoni karangan. Pertahankan itu saat menyunting.

Konvensi kerja lengkap ada di `.agents/skills/mas-joki-site/SKILL.md`.
