-- ==============================================================================
-- SKEMA SUPABASE: VOUCHER AI HUMANIZER SEKALI PAKAI (MAS JOKI)
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Buat / Update Tabel token_licenses (Voucher Sekali Pakai)
create table if not exists public.token_licenses (
  id uuid primary key default gen_random_uuid(),
  key_code text unique not null,                      -- contoh: 'MJ-3K-8AF7-1A9A'
  package_name text not null,                          -- 'Paket Mini 1.000 kata', dll.
  total_words int not null check (total_words > 0),
  remaining_words int not null check (remaining_words >= 0),
  is_active boolean default true not null,
  is_redeemed boolean default false not null,          -- STATUS SEKALI PAKAI (true = EXPIRED / SUDAH DIKLAIM)
  redeemed_at timestamptz,                             -- Waktu voucher diklaim
  created_at timestamptz default now() not null,
  last_used_at timestamptz,
  customer_note text                                   -- catatan admin: 'WA: 0812xxxx'
);

-- Pastikan kolom is_redeemed dan redeemed_at ada jika tabel sudah terlanjur dibuat
alter table public.token_licenses
  add column if not exists is_redeemed boolean default false not null,
  add column if not exists redeemed_at timestamptz;

-- 2. Buat Index agar query verifikasi kunci instan (<5ms)
create index if not exists idx_token_licenses_key_code on public.token_licenses(key_code);

-- 3. Tabel Pencatatan Klaim Promo Publik (misal MASJOKIBARU agar tidak bisa diklaim berulang)
create table if not exists public.promo_claims (
  id uuid primary key default gen_random_uuid(),
  promo_code text not null,
  client_ip text not null,
  created_at timestamptz default now() not null,
  unique (promo_code, client_ip)
);

-- 4. Aktifkan Row Level Security (RLS)
alter table public.token_licenses enable row level security;
alter table public.promo_claims enable row level security;

-- 5. Kebijakan RLS (Keamanan Tingkat Tinggi)
-- Aplikasi hanya mengakses tabel ini lewat Service Role di server action
-- (getSupabaseAdmin). Kunci voucher aktif tidak boleh bisa dibaca dari browser.
drop policy if exists "Anon read-only for active keys" on public.token_licenses;
drop policy if exists "Anon no direct access" on public.token_licenses;
create policy "Anon no direct access"
  on public.token_licenses
  for all
  to anon
  using (false);

drop policy if exists "Anon no direct access to promo claims" on public.promo_claims;
create policy "Anon no direct access to promo claims"
  on public.promo_claims
  for all
  to anon
  using (false);

-- Catatan: service role bypass RLS secara otomatis di Supabase.
-- Jangan pernah membuat policy 'to anon' dengan using (true) atau using (is_active = true).
