import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Check,
  CreditCard,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export const LANGKAH_PEMESANAN = [
  {
    nomor: "01",
    tahap: "LANGKAH 01",
    judul: "Pilih layanan & hitung",
    isi: "Tentukan jenis tugas, jumlah kata/halaman, dan tenggat. Estimasi biaya muncul seketika.",
    icon: Calculator,
    durasi: "± 2 menit",
    siapkan: ["Jenis tugas", "Jumlah kata/halaman"],
  },
  {
    nomor: "02",
    tahap: "LANGKAH 02",
    judul: "Kirim pesanan via WhatsApp",
    isi: "Rincian tugas tersusun otomatis di pesan. Kamu tinggal tekan kirim, tidak perlu ketik ulang.",
    icon: MessageSquare,
    durasi: "± 1 menit",
    siapkan: ["File atau link Drive"],
  },
  {
    nomor: "03",
    tahap: "LANGKAH 03",
    judul: "Bayar DP 50%",
    isi: "Uang muka setengah dari nominal nota, lewat ShopeePay/GoPay/DANA. Pengerjaan langsung mulai.",
    icon: CreditCard,
    durasi: "± 3 menit",
    siapkan: ["E-wallet aktif"],
  },
  {
    nomor: "04",
    tahap: "LANGKAH 04",
    judul: "Terima hasil & revisi",
    isi: "File sumber .docx/.pptx diserahkan. Pelunasan setelah kamu cek, termasuk 2× revisi gratis.",
    icon: Sparkles,
    durasi: "6–24 jam",
    siapkan: ["Waktu untuk mengecek"],
  },
];

export function AlurKerja() {
  return (
    <section
      id="cara-pesan"
      className="relative overflow-hidden border-y border-ink bg-ink py-14 text-[#f7f2e6] sm:py-20 scroll-mt-20"
    >
      <div
        aria-hidden
        className="kertas-garis pointer-events-none absolute inset-0 opacity-10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 size-72 rounded-full bg-brand/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-md border-2 border-stabilo/50 bg-white/5 px-2.5 py-1 font-sans text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-stabilo">
              Alur pesan
            </span>
            <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-[#f7f2e6] sm:text-[2.5rem]">
              Empat langkah, dari hitung sampai file diterima.
            </h2>
            <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-[#f7f2e6]/70 font-medium">
              Tidak perlu bikin akun dan tidak perlu chat bolak-balik untuk tahu harga.
              Semua langkah di bawah ini bisa kamu ikuti sendiri, urut dari atas.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5">
            <span className="grid size-6 place-items-center rounded-full bg-stabilo/15 text-stabilo">
              <Check className="size-3.5" aria-hidden />
            </span>
            <p className="text-xs font-bold leading-tight text-[#f7f2e6]">
              Total persiapan pesan
              <span className="block text-[0.7rem] font-semibold text-[#f7f2e6]/60">
                ± 6 menit, sekali jalan
              </span>
            </p>
          </div>
        </div>

        {/* Jalur langkah: garis putus-putus menyambung nomor di layar lebar. */}
        <ol className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[2.15rem] right-[2.15rem] top-[2.15rem] hidden border-t-2 border-dashed border-white/20 lg:block"
          />

          {LANGKAH_PEMESANAN.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.nomor}
                className="group relative flex flex-col rounded-2xl border border-white/12 bg-white/[0.04] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-stabilo/40 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-2 border-stabilo/40 bg-stabilo/10 font-mono text-sm font-black text-stabilo ring-4 ring-[#101a33] transition-colors duration-200 group-hover:bg-stabilo group-hover:text-ink">
                    {item.nomor}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[0.7rem] font-bold text-[#f7f2e6]/70">
                    <Icon className="size-3" aria-hidden />
                    {item.durasi}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-[1.05rem] font-bold leading-snug tracking-tight text-[#f7f2e6] transition-colors group-hover:text-stabilo">
                  {item.judul}
                </h3>

                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[#f7f2e6]/65 font-medium">
                  {item.isi}
                </p>

                <div className="mt-4 border-t border-dashed border-white/15 pt-3">
                  <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-[#f7f2e6]/40">
                    Kamu siapkan
                  </span>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {item.siapkan.map((bahan) => (
                      <li
                        key={bahan}
                        className="rounded-md bg-white/10 px-2 py-1 text-[0.7rem] font-semibold text-[#f7f2e6]/80"
                      >
                        {bahan}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <p className="font-display text-base font-bold text-[#f7f2e6]">
              Mulai dari langkah pertama — hitung dulu, bayar belakangan.
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-[#f7f2e6]/65">
              Harga terkunci di nota sejak awal. DP baru diminta setelah nominalnya kamu setujui.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <Link
              href="/hitung"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stabilo px-5 py-3 text-xs sm:text-sm font-bold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-300 active:translate-y-0"
            >
              <Calculator className="size-4" />
              <span>Langkah 1: Hitung biaya</span>
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/cara-kerja"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-xs sm:text-sm font-bold text-[#f7f2e6] transition-colors hover:border-stabilo hover:text-stabilo"
            >
              <span>Panduan lengkap</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
