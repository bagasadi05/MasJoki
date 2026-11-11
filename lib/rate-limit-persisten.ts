import { getSupabaseAdmin } from "@/lib/supabase";
import type { HasilLimit } from "./rate-limit";

/**
 * Rate limit bersama lewat Postgres (fungsi `hit_rate_limit`).
 *
 * Mengembalikan `null` kalau database belum dikonfigurasi atau sedang error,
 * supaya pemanggil bisa jatuh ke penghitung in-memory. Sengaja fail-open:
 * layanan login tidak boleh mati total hanya karena tabel penunjang bermasalah.
 */
export async function batasiKunciPersisten(
  kunci: string,
  batas: number,
  jendelaDetik: number,
): Promise<HasilLimit | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.rpc("hit_rate_limit", {
      p_key: kunci,
      p_batas: batas,
      p_jendela: jendelaDetik,
    });

    if (error) return null;

    const baris = Array.isArray(data) ? data[0] : data;
    if (!baris) return null;

    if (baris.allowed) return { ok: true };

    const sisa = Number(baris.retry_after);
    return {
      ok: false,
      cobaLagiDalamDetik: Number.isFinite(sisa) && sisa > 0 ? sisa : 60,
    };
  } catch {
    return null;
  }
}
