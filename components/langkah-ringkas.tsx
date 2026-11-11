import { ArrowRight } from "lucide-react";

const LANGKAH = [
  {
    nomor: "1",
    judul: "Atur jumlah & tenggat",
    isi: "Geser jumlah kata/halaman, lalu pilih tenggat yang kamu butuhkan.",
  },
  {
    nomor: "2",
    judul: "Kirim nota ke WhatsApp",
    isi: "Rincian dan total tersusun otomatis. Kamu tinggal tekan kirim.",
  },
  {
    nomor: "3",
    judul: "Bayar DP 50%",
    isi: "Pengerjaan langsung mulai. Pelunasan setelah hasil kamu cek.",
  },
];

/**
 * Ringkasan alur tiga langkah untuk halaman yang berisi kalkulator.
 * Sengaja ringkas: pengunjung harus paham urutannya tanpa membaca paragraf.
 */
export function LangkahRingkas() {
  return (
    <section
      aria-label="Alur singkat pemesanan"
      className="mt-8 rounded-2xl border border-line bg-paper-2/60 p-4 sm:p-5"
    >
      <ol className="grid gap-4 sm:grid-cols-3 sm:gap-2">
        {LANGKAH.map((item, index) => (
          <li key={item.nomor} className="relative flex items-start gap-3">
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full border border-brand/30 bg-white font-mono text-xs font-black text-brand shadow-2xs"
            >
              {item.nomor}
            </span>

            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold leading-snug text-ink">
                {item.judul}
              </p>
              <p className="mt-1 text-[0.72rem] sm:text-xs leading-relaxed text-slate-600 font-medium">
                {item.isi}
              </p>
            </div>

            {index < LANGKAH.length - 1 && (
              <ArrowRight
                aria-hidden
                className="ml-auto mt-1 hidden size-4 shrink-0 text-muted/40 sm:block"
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
