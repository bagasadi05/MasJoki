-- =============================================================================
-- 20261111000200 — Rate limit bersama (lintas instance)
--
-- Rate limit in-memory hanya berlaku per proses. Di serverless, 10 instance
-- berarti 10x batas. Tabel ini menyimpan hitungan di database supaya batasnya
-- benar-benar berlaku global.
--
-- Akses: hanya service_role (RLS aktif tanpa policy untuk anon/authenticated).
-- =============================================================================

begin;

create table if not exists public.rate_limits (
  key text primary key,
  hits int not null default 0,
  window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

drop policy if exists "Anon no direct access to rate limits" on public.rate_limits;
create policy "Anon no direct access to rate limits"
  on public.rate_limits
  for all
  to anon
  using (false);

-- Satu panggilan atomik: kunci baris, cek jendela, tambah hitungan.
create or replace function public.hit_rate_limit(
  p_key text,
  p_batas int,
  p_jendela int
)
returns table (allowed boolean, retry_after int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hits int;
  v_start timestamptz;
  v_now timestamptz := now();
begin
  if p_batas <= 0 or p_jendela <= 0 then
    return query select false, 60;
    return;
  end if;

  -- Bersihkan entri lama sekali-sekali supaya tabel tidak tumbuh selamanya.
  if random() < 0.02 then
    delete from public.rate_limits where window_start < v_now - interval '2 days';
  end if;

  insert into public.rate_limits (key, hits, window_start)
  values (p_key, 0, v_now)
  on conflict (key) do nothing;

  select rl.hits, rl.window_start
    into v_hits, v_start
    from public.rate_limits rl
   where rl.key = p_key
     for update;

  if v_now - v_start >= make_interval(secs => p_jendela) then
    v_hits := 0;
    v_start := v_now;
  end if;

  if v_hits >= p_batas then
    update public.rate_limits
       set hits = v_hits,
           window_start = v_start
     where key = p_key;

    return query
      select false,
             greatest(
               1,
               ceil(extract(epoch from (v_start + make_interval(secs => p_jendela) - v_now)))::int
             );
    return;
  end if;

  update public.rate_limits
     set hits = v_hits + 1,
         window_start = v_start
   where key = p_key;

  return query select true, 0;
end;
$$;

revoke all on function public.hit_rate_limit(text, int, int) from public;
revoke all on function public.hit_rate_limit(text, int, int) from anon, authenticated;
grant execute on function public.hit_rate_limit(text, int, int) to service_role;

commit;
