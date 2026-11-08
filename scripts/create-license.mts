import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Load .env.local manually without external dependencies
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
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const words = Number(process.argv[2]);
const packageName = process.argv[3] || `Paket ${words.toLocaleString("id-ID")} Kata`;
const customerNote = process.argv[4] || "Manual Admin";

if (!Number.isInteger(words) || words <= 0) {
  console.log(`
==============================================================
 Pembuat Kode Voucher Mas Joki (Sekali Pakai - Supabase)
==============================================================
Format penggunaan:
  npm run voucher -- <jumlah_kata> "[nama_paket]" "[catatan]"

Contoh:
  npm run voucher -- 3000 "Paket Populer" "WA: 0812345678"
  npm run voucher -- 7000 "Paket Skripsi" "Lunas ShopeePay"
==============================================================
  `);
  process.exit(1);
}

function generateKeyCode(kata: number): string {
  // Hanya pakai ringkasan "3K" bila benar-benar kelipatan 1.000. Angka seperti
  // 1.500 sebelumnya dibulatkan menjadi "2K" sehingga menyesatkan admin.
  const prefix = kata >= 1000 && kata % 1000 === 0 ? `${kata / 1000}K` : `${kata}`;
  const part1 = randomBytes(2).toString("hex").toUpperCase();
  const part2 = randomBytes(2).toString("hex").toUpperCase();
  return `MJ-${prefix}-${part1}-${part2}`;
}

const keyCode = generateKeyCode(words);

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("\n==============================================================");
  console.log(" KODE VOUCHER BARU BERHASIL DIGENERATE (SEKALI PAKAI)");
  console.log("==============================================================");
  console.log(`• Kode Voucher : ${keyCode}`);
  console.log(`• Paket        : ${packageName}`);
  console.log(`• Total Kuota  : ${words.toLocaleString("id-ID")} kata`);
  console.log(`• Catatan      : ${customerNote}`);
  console.log("--------------------------------------------------------------");

  if (url && serviceKey) {
    try {
      const supabase = createClient(url, serviceKey, {
        auth: { persistSession: false },
      });
      const payload: Record<string, unknown> = {
        key_code: keyCode,
        package_name: packageName,
        total_words: words,
        remaining_words: words,
        customer_note: customerNote,
      };

      let { error } = await supabase.from("token_licenses").insert({
        ...payload,
        is_redeemed: false,
      });

      if (error && error.message.includes("is_redeemed")) {
        const retry = await supabase.from("token_licenses").insert(payload);
        error = retry.error;
      }

      if (error) {
        console.error("⚠️  Gagal insert ke Supabase:", error.message);
      } else {
        console.log("✅ Berhasil disimpan ke Supabase! Status: AKTIF (Belum Diklaim)");
      }
    } catch (err: unknown) {
      console.error("⚠️  Gagal terhubung ke Supabase:", err);
    }
  } else {
    console.log("ℹ️  Info: Credentials Supabase di .env.local belum diisi.");
    console.log("    Kamu bisa copy SQL berikut dan jalankan di SQL Editor Supabase:");
    console.log(`
INSERT INTO public.token_licenses (key_code, package_name, total_words, remaining_words, is_redeemed, customer_note)
VALUES ('${keyCode}', '${packageName}', ${words}, ${words}, false, '${customerNote}');
    `);
  }

  console.log("\n--------------------------------------------------------------");
  console.log("📲 FORMAT PESAN WHATSAPP UNTUK PELANGGAN (tinggal copy-paste):");
  console.log("--------------------------------------------------------------");
  console.log(`
Halo kak! Pembayaran untuk ${packageName} (${words.toLocaleString("id-ID")} kata) sudah kami terima.

Berikut Kode Voucher AI Humanizer kamu (Sekali Pakai):
🎟️ *${keyCode}*

Cara klaim kuota:
1. Buka https://masjoki.id/humanizer
2. Klik tombol "Klaim Voucher"
3. Masukkan kode voucher di atas lalu klik "Klaim Voucher Sekarang"

Saldo kuota ${words.toLocaleString("id-ID")} kata akan langsung masuk dan siap digunakan. Terima kasih banyak sudah mempercayakan Mas Joki! 🙏
  `);
  console.log("==============================================================\n");
}

main();
