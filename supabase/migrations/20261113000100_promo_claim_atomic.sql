-- =============================================================================
-- 20261113000100 — Klaim voucher promo atomik per WALLET (bukan per IP)
--
-- Alasan:
-- 1. Sebelumnya klaim promo hanya diikat ke (promo_code, client_ip). IP bisa
--    berubah (VPN/NAT) sehingga satu akun bisa klaim berulang, dan IP bisa
--    dipalsukan via X-Forwarded-For sehingga bisa tak terbatas.
-- 2. Sebelumnya pencatatan klaim dan pengkreditan saldo berjalan terpisah;
--    kalau pengkreditan gagal, promo sudah tercatat hangus tanpa saldo masuk.
--
-- Solusi: satu fungsi database `claim_promo` yang MENGUNCI baris wallet,
-- MENolak klaim ganda per (promo_code, wallet_id), lalu MENAMBAH saldo dalam
-- SATU transaksi. Klaim tetap dicatat per IP juga (kolom client_ip) untuk audit.
-- =============================================================================

begin;

-- 1. Kolom wallet_id untuk mengikat klaim ke akun/wallet (wajib login saat klaim).
alter table public.promo_claims
  add column if not exists wallet_id uuid;

-- 2. Hapus unique lama per IP: user di balik NAT sama (kantor/kampus) tidak
--    lagi saling memblokir. Ganti dengan unique per wallet.
alter table public.promo_claims
  drop constraint if exists promo_claims_promo_code_client_ip_key;

drop index if exists public.promo_claims_promo_code_client_ip_key;

create unique index if not exists promo_claims_promo_wallet_key
  on public.promo_claims (promo_code, wallet_id)
  where wallet_id is not null;

-- Index non-unique untuk audit per IP (tanpa mengunci klaim).
create index if not exists idx_promo_claims_promo_ip
  on public.promo_claims (promo_code, client_ip);

-- 3. RPC atomik: catat klaim + tambah saldo dalam satu transaksi.
create or replace function public.claim_promo(
  p_promo_code text,
  p_wallet_id uuid,
  p_client_ip text,
  p_words int
)
returns table (ok boolean, tokens int, remaining_words int, reason text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text := upper(trim(coalesce(p_promo_code, '')));
  v_balance int;
begin
  if v_code = '' or p_wallet_id is null or p_words is null or p_words <= 0 then
    return query select false, 0, 0, 'invalid_request'::text;
    return;
  end if;

  -- Kunci baris wallet lebih dulu: klaim ganda dari wallet yang sama tidak bisa
  -- tembus, dan saldo tidak bisa dibaca stale oleh dua request bersamaan.
  select w.balance_words
    into v_balance
    from public.humanizer_wallets w
   where w.wallet_id = p_wallet_id
     for update;

  if not found then
    return query select false, 0, 0, 'wallet_not_found'::text;
    return;
  end if;

  -- Sudah pernah diklaim wallet ini?
  if exists (
    select 1 from public.promo_claims pc
     where pc.promo_code = v_code and pc.wallet_id = p_wallet_id
  ) then
    return query select false, 0, v_balance, 'already_claimed'::text;
    return;
  end if;

  -- Catat klaim (client_ip untuk audit; unique hanya pada wallet_id).
  insert into public.promo_claims (promo_code, client_ip, wallet_id)
  values (v_code, coalesce(p_client_ip, 'tanpa-ip'), p_wallet_id);

  update public.humanizer_wallets w
     set balance_words = w.balance_words + p_words,
         updated_at = now()
   where w.wallet_id = p_wallet_id
  returning w.balance_words into v_balance;

  return query select true, p_words, v_balance, 'ok'::text;
end;
$$;

-- Hanya server (service role) yang boleh memanggil fungsi ini.
revoke all on function public.claim_promo(text, uuid, text, int) from public;
revoke all on function public.claim_promo(text, uuid, text, int) from anon, authenticated;
grant execute on function public.claim_promo(text, uuid, text, int) to service_role;

commit;
