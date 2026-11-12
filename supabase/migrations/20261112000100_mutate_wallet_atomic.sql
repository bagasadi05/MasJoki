-- =============================================================================
-- 20261112000100 — Mutasi saldo wallet atomik (kurangi / kembalikan kata)
--
-- Menggantikan loop baca-ubah-simpan (optimistic CAS) di aplikasi agar mutasi
-- saldo konkuren selesai dalam satu operasi UPDATE atomik di PostgreSQL.
-- Aman dijalankan ulang (idempoten).
-- =============================================================================

begin;

create or replace function public.mutate_wallet_balance(
  p_wallet_id uuid,
  p_delta int
)
returns table (ok boolean, balance_words int, reason text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_balance int;
begin
  if p_wallet_id is null or p_delta is null or p_delta = 0 then
    return query select false, 0, 'invalid_request'::text;
    return;
  end if;

  -- Kunci baris lebih dulu untuk membedakan "wallet tidak ada" vs "saldo kurang".
  select w.balance_words
    into v_balance
    from public.humanizer_wallets w
   where w.wallet_id = p_wallet_id
     for update;

  if not found then
    return query select false, 0, 'not_found'::text;
    return;
  end if;

  if v_balance + p_delta < 0 then
    return query select false, v_balance, 'insufficient_funds'::text;
    return;
  end if;

  update public.humanizer_wallets w
     set balance_words = w.balance_words + p_delta,
         updated_at = now()
   where w.wallet_id = p_wallet_id
  returning w.balance_words into v_balance;

  return query select true, v_balance, 'ok'::text;
end;
$$;

revoke all on function public.mutate_wallet_balance(uuid, int) from public;
revoke all on function public.mutate_wallet_balance(uuid, int) from anon, authenticated;
grant execute on function public.mutate_wallet_balance(uuid, int) to service_role;

commit;
