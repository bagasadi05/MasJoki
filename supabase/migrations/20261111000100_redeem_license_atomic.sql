-- =============================================================================
-- 20261111000100 — Redeem voucher atomik (sekali pakai -> saldo wallet)
--
-- Jalankan di Supabase Dashboard -> SQL Editor.
-- Aman diulang: semua langkah idempoten.
--
-- Kenapa perlu: sebelumnya aplikasi menandai voucher hangus lebih dulu, baru
-- menambah saldo wallet di request terpisah. Kalau langkah kedua gagal,
-- pembeli kehilangan voucher tanpa mendapat kata. Fungsi di bawah melakukan
-- keduanya dalam SATU transaksi.
-- =============================================================================

begin;

-- 1. Hapus index duplikat.
--    `key_code text unique` sudah membuat index unik sendiri; index kedua di
--    kolom yang sama hanya menambah biaya tulis tanpa mempercepat pembacaan.
drop index if exists public.idx_token_licenses_key_code;

-- 2. Constraint konsistensi status voucher.
alter table public.token_licenses
  drop constraint if exists token_licenses_redeemed_zero,
  drop constraint if exists token_licenses_key_code_upper;

alter table public.token_licenses
  add constraint token_licenses_redeemed_zero
    check (not is_redeemed or remaining_words = 0),
  add constraint token_licenses_key_code_upper
    check (key_code = upper(key_code));

-- 3. RPC: hanguskan voucher DAN tambah saldo wallet dalam satu transaksi.
create or replace function public.redeem_license(
  p_key_code text,
  p_wallet_id uuid
)
returns table (granted int, package_name text, remaining_words int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text := upper(trim(coalesce(p_key_code, '')));
  v_granted int;
  v_package text;
  v_balance int;
begin
  if v_code = '' then
    return;
  end if;

  if p_wallet_id is null then
    raise exception 'WALLET_NOT_FOUND' using errcode = 'P0002';
  end if;

  -- Kunci baris voucher: dua klaim bersamaan tidak bisa sama-sama menang.
  select l.remaining_words, l.package_name
    into v_granted, v_package
    from public.token_licenses l
   where l.key_code = v_code
     and l.is_active
     and not l.is_redeemed
     and l.remaining_words > 0
     for update;

  if not found then
    -- Tidak ada baris: voucher tidak ada, nonaktif, atau sudah dipakai.
    return;
  end if;

  update public.token_licenses l
     set remaining_words = 0,
         is_redeemed = true,
         redeemed_at = now(),
         last_used_at = now()
   where l.key_code = v_code;

  update public.humanizer_wallets w
     set balance_words = w.balance_words + v_granted,
         updated_at = now()
   where w.wallet_id = p_wallet_id
  returning w.balance_words into v_balance;

  if not found then
    -- Wallet tidak ada: batalkan seluruh transaksi, voucher TIDAK hangus.
    raise exception 'WALLET_NOT_FOUND' using errcode = 'P0002';
  end if;

  return query select v_granted, v_package, v_balance;
end;
$$;

-- Hanya server (service role) yang boleh memanggil fungsi ini.
revoke all on function public.redeem_license(text, uuid) from public;
revoke all on function public.redeem_license(text, uuid) from anon, authenticated;
grant execute on function public.redeem_license(text, uuid) to service_role;

commit;
