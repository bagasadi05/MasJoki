import { getSupabaseAdmin } from "@/lib/supabase";

export interface LicenseStatus {
  keyCode: string;
  packageName: string;
  totalWords: number;
  remainingWords: number;
  isActive: boolean;
}

export type CheckLicenseResult =
  | { ok: true; license: LicenseStatus }
  | { ok: false; error: string };

export type DeductLicenseResult =
  | { ok: true; remainingWords: number }
  | { ok: false; error: string };

/**
 * Cek validitas dan sisa kuota kunci token di Supabase.
 */
export async function checkLicense(rawCode: string): Promise<CheckLicenseResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { ok: false, error: "Kode kunci token wajib diisi." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      error: "Koneksi database Supabase belum dikonfigurasi di server.",
    };
  }

  const { data, error } = await supabase
    .from("token_licenses")
    .select("key_code, package_name, total_words, remaining_words, is_active")
    .eq("key_code", code)
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: "Kunci token tidak ditemukan. Pastikan kodenya benar.",
    };
  }

  if (!data.is_active) {
    return {
      ok: false,
      error: "Kunci token ini sudah dinonaktifkan.",
    };
  }

  return {
    ok: true,
    license: {
      keyCode: data.key_code,
      packageName: data.package_name,
      totalWords: data.total_words,
      remainingWords: data.remaining_words,
      isActive: data.is_active,
    },
  };
}

/**
 * Potong kuota kata dari kunci token di Supabase secara atomik dan aman.
 */
export async function deductLicenseWords(
  rawCode: string,
  wordsToDeduct: number,
): Promise<DeductLicenseResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { ok: false, error: "Kode kunci token wajib diisi." };
  }

  if (!Number.isInteger(wordsToDeduct) || wordsToDeduct <= 0) {
    return { ok: false, error: "Jumlah kata tidak valid." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      error: "Koneksi database Supabase belum dikonfigurasi di server.",
    };
  }

  // Update optimistis: syaratkan remaining_words masih sama dengan yang dibaca.
  // Dua request bersamaan tidak bisa sama-sama menang (tidak ada lost update).
  const MAX_PERCOBAAN = 3;

  for (let percobaan = 0; percobaan < MAX_PERCOBAAN; percobaan++) {
    const status = await checkLicense(code);
    if (!status.ok) {
      return { ok: false, error: status.error };
    }

    const saldoSaatIni = status.license.remainingWords;
    if (saldoSaatIni < wordsToDeduct) {
      return {
        ok: false,
        error: `Sisa kuota kunci tokenmu (${saldoSaatIni.toLocaleString("id-ID")} kata) tidak mencukupi untuk memproses ${wordsToDeduct.toLocaleString("id-ID")} kata.`,
      };
    }

    const newBalance = saldoSaatIni - wordsToDeduct;

    const { data, error: updateError } = await supabase
      .from("token_licenses")
      .update({
        remaining_words: newBalance,
        last_used_at: new Date().toISOString(),
      })
      .eq("key_code", code)
      .eq("is_active", true)
      .eq("remaining_words", saldoSaatIni)
      .select("remaining_words")
      .maybeSingle();

    if (updateError) {
      return {
        ok: false,
        error: "Gagal memperbarui saldo kuota di database.",
      };
    }

    if (data) {
      return {
        ok: true,
        remainingWords: data.remaining_words,
      };
    }

    // Tidak ada baris yang cocok: saldo berubah oleh request lain. Coba lagi.
  }

  return {
    ok: false,
    error: "Saldo kuota berubah bersamaan. Silakan coba lagi.",
  };
}

