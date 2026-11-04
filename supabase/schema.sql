-- Skema Mas Joki
-- Jalankan di Supabase SQL Editor, atau: supabase db push
--
-- Catatan keamanan:
-- Tabel ini hanya ditulis lewat server action memakai service role key.
-- Karena itu RLS diaktifkan TANPA policy untuk anon: service role tetap
-- bisa menulis (bypass RLS), sementara pengunjung tidak bisa membaca
-- data pelanggan sama sekali.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- orders
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  customer_name text not null,
  whatsapp      text not null,
  service_id    text not null,
  service_name  text not null,
  quantity      integer not null check (quantity > 0),
  deadline      text not null,
  difficulty    text not null,
  subtotal      integer not null check (subtotal >= 0),
  total         integer not null check (total >= 0),
  file_url      text,
  notes         text,
  status        text not null default 'menunggu_konfirmasi'
                check (status in (
                  'menunggu_konfirmasi',
                  'menunggu_pembayaran',
                  'dibayar',
                  'dikerjakan',
                  'revisi',
                  'selesai',
                  'kedaluwarsa',
                  'gagal',
                  'dikembalikan',
                  'batal'
                )),
  midtrans_order_id  text,
  snap_token         text,
  snap_redirect_url  text,
  paid_at            timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists orders_status_idx
  on public.orders (status, created_at desc);
create index if not exists orders_whatsapp_idx
  on public.orders (whatsapp);

-- Untuk database yang sudah terlanjur dibuat sebelum integrasi pembayaran:
alter table public.orders add column if not exists midtrans_order_id text;
alter table public.orders add column if not exists snap_token text;
alter table public.orders add column if not exists snap_redirect_url text;
alter table public.orders add column if not exists paid_at timestamptz;

-- -------------------------------------------------------- quote_requests
create table if not exists public.quote_requests (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  customer_name text not null,
  whatsapp      text not null,
  service_id    text not null,
  detail        text not null,
  deadline      text not null,
  budget        text,
  file_url      text,
  status        text not null default 'baru'
                check (status in ('baru', 'dibalas', 'deal', 'ditutup')),
  created_at    timestamptz not null default now()
);

create index if not exists quote_requests_status_idx
  on public.quote_requests (status, created_at desc);

-- ------------------------------------------------------------- updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------- RLS
alter table public.orders enable row level security;
alter table public.quote_requests enable row level security;

-- Sengaja tidak ada policy. Akses hanya lewat service role di server.
