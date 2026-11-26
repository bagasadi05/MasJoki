/**
 * Keep-alive Supabase: ping ringan ke project supaya tidak di-pause karena
 * tidak ada aktivitas (free tier di-pause setelah ~7 hari tanpa request API).
 *
 * Dipakai oleh .github/workflows/keepalive-supabase.yml (jadwal tiap 3 hari)
 * dan bisa dijalankan manual:
 *   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
 *     node scripts/keepalive-supabase.mjs
 *
 * Sengaja plain .mjs: jalan dengan `node` langsung tanpa dependency, jadi bisa
 * dipakai di GitHub Actions tanpa `npm install` lebih dulu.
 *
 * Aturan lulus/gagal: project dianggap AKTIF kalau minimal satu endpoint
 * menjawab 2xx. Kalau tidak ada 2xx (mis. semua menjawab 521 dari Cloudflare
 * atau 403 saat project di-pause) → exit code 1 supaya workflow terlihat
 * merah dan project perlu di-restore manual di dashboard.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum di-set.");
  process.exitCode = 1;
} else {
  // Satu request API apa pun sudah terhitung sebagai aktivitas project.
  const endpoints = [
    `${url}/auth/v1/settings`,
    `${url}/rest/v1/rate_limits?limit=1`,
  ];

  let adaAktif = false;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
        signal: AbortSignal.timeout(15_000),
      });
      console.log(`${endpoint} -> HTTP ${res.status}`);
      if (res.ok) adaAktif = true;
    } catch (err) {
      console.error(`${endpoint} -> gagal: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (adaAktif) {
    console.log("Project Supabase aktif — request ini terhitung sebagai aktivitas.");
  } else {
    console.error(
      "Tidak ada endpoint yang menjawab 2xx. Project kemungkinan sedang DI-PAUSE: " +
        "restore dulu lewat dashboard Supabase (banner 'Restore project' atau " +
        "Settings -> General), lalu jalankan lagi.",
    );
    process.exitCode = 1;
  }
}
