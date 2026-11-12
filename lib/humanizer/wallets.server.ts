import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const HUMANIZER_WALLET_COOKIE = "mj_humanizer_wallet_v1";
export const INITIAL_HUMANIZER_WORDS = 300;

type WalletMutationResult =
  | { ok: true; remainingWords: number }
  | { ok: false; error: string };

export type HumanizerWalletResult =
  | { ok: true; walletId: string; remainingWords: number }
  | { ok: false; error: string; errorCode?: "auth" | "config" | "database" };

function isWalletId(value: string | undefined): value is string {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
  );
}

function setWalletCookie(walletId: string) {
  return cookies().then((cookieStore) => {
    cookieStore.set(HUMANIZER_WALLET_COOKIE, walletId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
    });
  });
}

async function readWalletId(): Promise<{ walletId: string; isNew: boolean }> {
  const cookieStore = await cookies();
  const stored = cookieStore.get(HUMANIZER_WALLET_COOKIE)?.value;
  if (isWalletId(stored)) return { walletId: stored, isNew: false };

  const walletId = randomUUID();
  await setWalletCookie(walletId);
  return { walletId, isNew: true };
}

async function getAuthenticatedUserId(): Promise<
  | { userId: string }
  | { error: string }
> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return { error: "Silakan masuk dengan email sebelum memakai token humanizer." };
    }
    return { userId: data.user.id };
  } catch {
    return { error: "Layanan login belum dikonfigurasi di server." };
  }
}

type WalletRow = { balanceWords: number } | { error: string };

async function getWalletRow(walletId: string): Promise<WalletRow> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Layanan token belum dikonfigurasi di server." };

  const { data, error } = await supabase
    .from("humanizer_wallets")
    .select("balance_words")
    .eq("wallet_id", walletId)
    .maybeSingle();

  if (error || !data) {
    return { error: "Saldo token belum siap. Silakan muat ulang halaman." };
  }

  return { balanceWords: Number(data.balance_words) };
}

type UserWalletLookup =
  | { wallet: { walletId: string; balanceWords: number } }
  | { wallet: null }
  | { error: string };

async function getUserWallet(userId: string): Promise<UserWalletLookup> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Layanan token belum dikonfigurasi di server." };

  const { data, error } = await supabase
    .from("humanizer_wallets")
    .select("wallet_id, balance_words")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { error: "Saldo token belum siap. Silakan coba lagi." };
  if (!data) return { wallet: null };

  return {
    wallet: {
      walletId: String(data.wallet_id),
      balanceWords: Number(data.balance_words),
    },
  };
}

export async function getOrCreateHumanizerWallet(): Promise<HumanizerWalletResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      error: "Layanan token belum dikonfigurasi di server.",
      errorCode: "config",
    };
  }

  const auth = await getAuthenticatedUserId();
  if ("error" in auth) return { ok: false, error: auth.error, errorCode: "auth" };

  // Cek wallet akun yang sudah ada lebih dulu agar kunjungan dari perangkat
  // baru tidak langsung membuat cookie UUID kosong yang tidak terpakai.
  const existing = await getUserWallet(auth.userId);
  if ("error" in existing) {
    return { ok: false, error: existing.error, errorCode: "database" };
  }
  if (existing.wallet) {
    return {
      ok: true,
      walletId: existing.wallet.walletId,
      remainingWords: existing.wallet.balanceWords,
    };
  }

  const stored = await readWalletId();

  // Migrasikan wallet anonim yang masih berada di browser ini ke akun terverifikasi.
  if (!stored.isNew) {
    const { data: claimed, error: claimError } = await supabase
      .from("humanizer_wallets")
      .update({ user_id: auth.userId, updated_at: new Date().toISOString() })
      .eq("wallet_id", stored.walletId)
      .is("user_id", null)
      .select("wallet_id, balance_words")
      .maybeSingle();

    if (claimError) {
      return { ok: false, error: "Saldo token belum siap. Silakan coba lagi.", errorCode: "database" };
    }
    if (claimed) {
      return {
        ok: true,
        walletId: String(claimed.wallet_id),
        remainingWords: Number(claimed.balance_words),
      };
    }
  }

  let walletId = stored.walletId;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { error: insertError } = await supabase.from("humanizer_wallets").insert({
      wallet_id: walletId,
      user_id: auth.userId,
      balance_words: INITIAL_HUMANIZER_WORDS,
    });

    if (!insertError) {
      return { ok: true, walletId, remainingWords: INITIAL_HUMANIZER_WORDS };
    }

    if (insertError.code !== "23505") {
      return { ok: false, error: "Saldo token belum siap. Silakan coba lagi.", errorCode: "database" };
    }

    const afterConflict = await getUserWallet(auth.userId);
    if ("error" in afterConflict) {
      return { ok: false, error: afterConflict.error, errorCode: "database" };
    }
    if (afterConflict.wallet) {
      return {
        ok: true,
        walletId: afterConflict.wallet.walletId,
        remainingWords: afterConflict.wallet.balanceWords,
      };
    }

    walletId = randomUUID();
    await setWalletCookie(walletId);
  }

  return { ok: false, error: "Saldo berubah bersamaan. Silakan coba lagi.", errorCode: "database" };
}

async function changeWalletBalance(
  walletId: string,
  delta: number,
): Promise<WalletMutationResult> {
  if (!isWalletId(walletId) || !Number.isInteger(delta) || delta === 0) {
    return { ok: false, error: "Permintaan saldo token tidak valid." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "Layanan token belum dikonfigurasi di server." };
  }

  const { data: rpcData, error: rpcError } = await supabase.rpc("mutate_wallet_balance", {
    p_wallet_id: walletId,
    p_delta: delta,
  });

  if (!rpcError) {
    const baris = Array.isArray(rpcData) ? rpcData[0] : rpcData;
    if (baris) {
      if (baris.ok) {
        return { ok: true, remainingWords: Number(baris.balance_words) };
      }
      if (baris.reason === "insufficient_funds") {
        const saldo = Number(baris.balance_words);
        return {
          ok: false,
          error: `Saldo token tidak cukup. Sisa kuota ${saldo.toLocaleString("id-ID")} kata.`,
        };
      }
      if (baris.reason === "not_found") {
        return { ok: false, error: "Saldo token belum siap. Silakan muat ulang halaman." };
      }
      return { ok: false, error: "Permintaan saldo token tidak valid." };
    }
  } else if (rpcError.code !== "PGRST202") {
    return { ok: false, error: "Gagal memperbarui saldo token." };
  }

  // Fallback jika migrasi mutate_wallet_balance belum dijalankan di database.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const row = await getWalletRow(walletId);
    if ("error" in row) return { ok: false, error: row.error };

    const nextBalance = row.balanceWords + delta;
    if (nextBalance < 0) {
      return {
        ok: false,
        error: `Saldo token tidak cukup. Sisa kuota ${row.balanceWords.toLocaleString("id-ID")} kata.`,
      };
    }

    const { data, error } = await supabase
      .from("humanizer_wallets")
      .update({ balance_words: nextBalance, updated_at: new Date().toISOString() })
      .eq("wallet_id", walletId)
      .eq("balance_words", row.balanceWords)
      .select("balance_words")
      .maybeSingle();

    if (error) return { ok: false, error: "Gagal memperbarui saldo token." };
    if (data) return { ok: true, remainingWords: Number(data.balance_words) };
  }

  return { ok: false, error: "Saldo berubah bersamaan. Silakan coba lagi." };
}

export function deductHumanizerWords(walletId: string, words: number) {
  if (!Number.isInteger(words) || words <= 0) {
    return Promise.resolve({ ok: false, error: "Jumlah kata tidak valid." } as const);
  }
  return changeWalletBalance(walletId, -words);
}

export function creditHumanizerWords(walletId: string, words: number) {
  if (!Number.isInteger(words) || words <= 0) {
    return Promise.resolve({ ok: false, error: "Jumlah pengembalian token tidak valid." } as const);
  }
  return changeWalletBalance(walletId, words);
}
