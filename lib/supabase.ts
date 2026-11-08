import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client (Khusus Server Actions).
 * Menggunakan SUPABASE_SERVICE_ROLE_KEY untuk bypass RLS secara aman di server,
 * sehingga operasi validasi dan pemotongan sisa kata terjamin tidak bisa diakali client.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Supabase Public Client (Bisa dipakai di browser/anon jika diperlukan).
 */
export function getSupabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

