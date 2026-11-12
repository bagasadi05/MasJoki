import { CheckCircle2, ShieldAlert, ShieldCheck, XCircle } from "lucide-react";

export function PerbandinganJoki() {
  const perbandingan = [
    {
      kategori: "Transparansi Biaya",
      biasa: "Harga ditembak sesuka hati lewat DM, sering mendadak minta biaya tambahan di tengah jalan.",
      masJoki: "Harga dihitung terbuka di nota resmi sebelum chat. Angka terkunci tanpa biaya siluman.",
    },
    {
      kategori: "Kualitas & Integritas",
      biasa: "Asal generate dari bot AI mentah tanpa disunting, berantakan dan langsung dicurigai dosen.",
      masJoki: "Disunting cermat dengan rujukan literatur valid, alur penalaran runut, dan tata bahasa natural.",
    },
    {
      kategori: "Revisi & Garansi",
      biasa: "Minta perbaikan malah slow respon, minta biaya tambahan lagi, atau bahkan akun diblokir.",
      masJoki: "Dilindungi garansi 2× revisi gratis sesuai instruksi tugas atau pedoman format kampusmu.",
    },
    {
      kategori: "Format Penyerahan File",
      biasa: "Hanya dikirim PDF terkunci yang tidak bisa kamu ubah atau kembangkan lagi.",
      masJoki: "File mentah asli diserahkan (.docx, .pptx, dsb.) sehingga kamu bebas mengeditnya kapan pun.",
    },
    {
      kategori: "Keamanan Pembayaran",
      biasa: "Rekening ganti-ganti atas nama perorangan tak dikenal, rawan modus penipuan online.",
      masJoki: "Satu nomor pembayaran resmi untuk ShopeePay, GoPay, dan DANA atas nama Mas Joki.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="stempel">
          BERITA ACARA KOMPARASI
        </span>
        <h2 className="mt-3 font-display text-[2.1rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.7rem]">
          Beda Mas Joki vs Joki Anonim Medsos.
        </h2>
        <p className="mt-3.5 text-[0.98rem] leading-relaxed text-ink-soft">
          Jangan pertaruhkan nilai mata kuliahmu pada joki medsos yang tidak jelas identitas dan tanggung jawabnya.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Kolom Joki Medsos Biasa */}
        <div className="rounded-2xl border border-koral/30 bg-koral-soft/40 p-7 sm:p-9 shadow-sm">
          <div className="flex items-start justify-between gap-3 border-b border-koral/25 pb-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-koral-soft text-koral">
                <ShieldAlert className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-koral">
                  Joki Anonim di Medsos
                </h3>
                <p className="text-xs font-medium text-koral/80">
                  Twitter / Telegram / IG tanpa identitas jelas
                </p>
              </div>
            </div>
            <span className="stempel-merah shrink-0">
              ⚠ RISIKO TINGGI
            </span>
          </div>

          <ul className="mt-6 space-y-5">
            {perbandingan.map((item) => (
              <li key={item.kategori} className="flex items-start gap-3">
                <XCircle className="mt-0.5 size-4 text-koral shrink-0" />
                <div>
                  <p className="text-[0.76rem] font-bold uppercase tracking-wider text-koral">
                    {item.kategori}
                  </p>
                  <p className="mt-0.5 text-[0.86rem] leading-relaxed text-ink-soft">
                    {item.biasa}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom Mas Joki */}
        <div className="relative rounded-2xl border-2 border-brand bg-white p-7 sm:p-9 shadow-xl shadow-brand/10 ring-4 ring-brand/5">
          <div className="flex items-start justify-between gap-3 border-b border-brand/20 pb-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-brand text-white shadow-xs">
                <ShieldCheck className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-xl font-extrabold text-brand">
                  Standar Layanan Mas Joki
                </h3>
                <p className="text-xs font-semibold text-brand/80">
                  Sistem nota terbuka, harga terkunci, &amp; bergaransi
                </p>
              </div>
            </div>
            <span className="stempel-hijau shrink-0">
              ✓ TERVERIFIKASI
            </span>
          </div>

          <ul className="mt-6 space-y-5">
            {perbandingan.map((item) => (
              <li key={item.kategori} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-4 text-mint shrink-0" />
                <div>
                  <p className="text-[0.76rem] font-bold uppercase tracking-wider text-brand">
                    {item.kategori}
                  </p>
                  <p className="mt-0.5 text-[0.88rem] leading-relaxed text-ink font-medium">
                    {item.masJoki}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
