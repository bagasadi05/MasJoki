import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Klien server dengan service role.
 *
 * Sengaja hanya dipakai di server action. Jangan pernah mengimpor file ini
 * dari komponen client: service role key melewati Row Level Security.
 */
export const supabaseAdmin: SupabaseClient | null =
  url && serviceRoleKey
    ? createClient(url, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export const supabaseConfigured = supabaseAdmin !== null;
