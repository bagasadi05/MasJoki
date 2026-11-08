import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";

function loadEnv() {
  if (existsSync(".env.local")) {
    const lines = readFileSync(".env.local", "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Memeriksa koneksi ke Supabase URL:", url);

async function run() {
  if (!url || !serviceKey) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY di .env.local belum diisi.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    const { data, error } = await supabase.from("token_licenses").select("*").limit(5);
    if (error) {
      if (error.code === "42P01") {
        console.log("⚠️  KONEKSI BERHASIL, tetapi tabel 'token_licenses' BELUM DIBUAT di database!");
        console.log("   Silakan buka SQL Editor di Supabase lalu jalankan file supabase/schema.sql.");
      } else {
        console.error("❌ Error dari Supabase:", error.message, "(code: " + error.code + ")");
      }
    } else {
      console.log("✅ KONEKSI 100% SUKSES!");
      console.log("   Tabel 'token_licenses' sudah aktif dan siap digunakan.");
      console.log("   Jumlah lisensi saat ini:", data.length);
    }
  } catch (err: unknown) {
    console.error("❌ Gagal terhubung ke Supabase (Network/URL Error):", err);
  }
}

run();

