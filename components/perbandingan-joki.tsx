import { CheckCircle2, Scale, ShieldAlert, Star, XCircle } from "lucide-react";

export function PerbandinganJoki() {
  const perbandingan = [
    {
      kategori: "Transparansi Biaya",
      biasa: "Harga ditembak sesuka hati lewat DM, sering minta biaya tambahan tak jelas di akhir.",
      masJoki: "Harga dihitung terbuka di kalkulator nota resmi sebelum chat. Terkunci tanpa biaya tersembunyi.",
    },
    {
      kategori: "Kualitas & Integritas",
      biasa: "Asal generate dari bot AI mentah tanpa disunting, berantakan dan rawan terdeteksi.",
      masJoki: "Dikerjakan dan disunting secara cermat dengan rujukan literatur valid dan tata bahasa natural.",
    },
    {
      kategori: "Garansi Revisi",
      biasa: "Minta perbaikan malah slow respon, minta biaya tambahan lagi, atau bahkan akun diblokir.",
      masJoki: "Garansi 2× revisi gratis sesuai arahan awal atau pedoman format kampusmu.",
    },
    {
      kategori: "Format File Akhir",
      biasa: "Hanya dikirim PDF terkunci yang tidak bisa kamu perbaiki atau tambahkan lagi.",
      masJoki: "File asli sumber diserahkan (Word .docx, PowerPoint .pptx) sehingga kamu bebas mengeditnya.",
    },
    {
      kategori: "Keamanan Pembayaran",
      biasa: "Rekening ganti-ganti atas nama perorangan tak jelas, rawan penipuan.",
      masJoki: "Satu nomor pembayaran resmi untuk ShopeePay, GoPay, dan DANA atas nama admin Mas Joki.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand shadow-2xs">
          <Scale className="size-3.5" />
          <span>Bandingkan Sendiri</span>
        </span>
        <h2 className="mt-3 font-display text-[2.1rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.7rem]">
          Beda Mas Joki vs Joki Medsos Liar.
        </h2>
        <p className="mt-3.5 text-[0.98rem] leading-relaxed text-ink-soft">
          Jangan korbankan nilai semestermu pada joki anonim yang tidak bertanggung jawab.
          Inilah alasan kenapa mahasiswa selalu mempercayakan tugasnya ke Mas Joki.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {/* Kolom Joki Medsos Biasa */}
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-7 sm:p-9 shadow-sm">
          <div className="flex items-center gap-3 border-b border-red-200 pb-5">
            <span className="grid size-11 place-items-center rounded-2xl bg-red-100 text-red-600">
              <ShieldAlert className="size-6" />
            </span>
            <div>
              <h3 className="font-display text-xl font-bold text-red-950">
                Joki Anonim di Medsos
              </h3>
              <p className="text-xs font-medium text-red-700">
                Twitter / Telegram / IG tanpa identitas jelas
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-5">
            {perbandingan.map((item) => (
              <li key={item.kategori} className="flex items-start gap-3">
                <XCircle className="mt-0.5 size-4 text-red-500 shrink-0" />
                <div>
                  <p className="text-[0.82rem] font-bold text-red-800">
                    {item.kategori}
                  </p>
                  <p className="mt-0.5 text-[0.86rem] leading-relaxed text-red-950/80">
                    {item.biasa}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom Mas Joki */}
        <div className="relative rounded-3xl border-2 border-brand bg-brand-soft/40 p-7 sm:p-9 shadow-xl shadow-brand/10 ring-4 ring-brand/10">
          <span className="absolute -top-3.5 right-6 inline-flex items-center gap-1 rounded-full bg-brand px-3.5 py-1 font-display text-xs font-black uppercase tracking-wider text-white shadow-md">
            <Star className="size-3 fill-white" />
            <span>Pilihan Terpercaya</span>
          </span>

          <div className="flex items-center gap-3 border-b border-brand/20 pb-5">
            <span className="grid size-11 place-items-center rounded-2xl bg-brand text-white shadow-xs">
              <CheckCircle2 className="size-6" />
            </span>
            <div>
              <h3 className="font-display text-xl font-extrabold text-brand">
                Mas Joki (Asisten Terbuka)
              </h3>
              <p className="text-xs font-semibold text-brand/80">
                Sistem transparan, aman, dan bergaransi
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-5">
            {perbandingan.map((item) => (
              <li key={item.kategori} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[0.82rem] font-bold text-brand">
                    {item.kategori}
                  </p>
                  <p className="mt-0.5 text-[0.86rem] leading-relaxed text-ink font-medium">
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
