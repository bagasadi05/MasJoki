import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { TransisiHalaman } from "@/components/transisi-halaman";
import { SiteFooter } from "@/components/site-footer";
import { HumanizerWorkspace } from "@/components/humanizer/humanizer-workspace";
import { HumanizerTour } from "@/components/humanizer/humanizer-tour";

export const metadata: Metadata = {
  title: "Humanizer AI",
  description:
    "Ubah naskah akademik, formal, atau draf buatan AI menjadi bahasa sehari-hari yang sangat sederhana, agak polos, dan mudah dipahami tanpa mengubah angka desimal atau sitasi referensi.",
  alternates: { canonical: "/humanizer" },
};

const PRINSIP = [
  {
    judul: "Bahasa lugas, bukan bahasa robot",
    isi: "Kalimat panjang dipecah, kata klise AI diganti kata sehari-hari, dan ritme kalimat dibuat tidak seragam.",
  },
  {
    judul: "Angka dan satuan tidak disentuh",
    isi: "Desimal, persentase, dan nomor pasal diperiksa ulang setelah penulisan — kalau berubah, hasilnya ditolak.",
  },
  {
    judul: "Sitasi tetap menempel di kalimatnya",
    isi: "Rujukan seperti (Slavin, 2015) dan istilah teknis kampus dipertahankan, bukan dibuang atau dipindah.",
  },
  {
    judul: "Istilah penting bisa dikunci",
    isi: "Daftarkan nama teori, singkatan, atau istilah yang tidak boleh berubah sebelum naskah diproses.",
  },
];

export default function HumanizerPage() {
  return (
    <>
      <SiteHeader />

      <TransisiHalaman
        id="konten"
        className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      >
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-[0.7rem] font-semibold text-muted"
        >
          <Link href="/" className="transition-colors hover:text-brand">
            Beranda
          </Link>
          <span aria-hidden className="text-line-strong">
            /
          </span>
          <span className="text-ink">Humanizer AI</span>
        </nav>

        {/* Kepala halaman: tanpa badge pil, tanpa kartu */}
        <header className="max-w-3xl">
          <p className="font-mono text-[0.7rem] font-semibold text-muted">
            Alat mandiri · saldo token
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-[2.6rem]">
            Humanizer AI untuk Penulisan Lugas.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-[0.95rem]">
            Menulis ulang teks akademik, skripsi, dan artikel formal menjadi
            bahasa sehari-hari yang sederhana dan mengalir apa adanya — tanpa
            mengubah fakta, angka desimal, persentase, atau sitasi referensi.
          </p>
        </header>

        <HumanizerWorkspace />

        <HumanizerTour />

        {/* Prinsip kerja: daftar bergaris, bukan empat kartu kembar */}
        <section className="border-t border-line pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl font-display text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl">
              Empat hal yang dijaga saat naskah ditulis ulang.
            </h2>
            <p className="max-w-sm text-[0.78rem] leading-relaxed text-muted">
              Ini yang benar-benar diperiksa mesin, bukan klaim lolos detektor.
            </p>
          </div>

          <ol className="mt-8 grid gap-x-12 sm:grid-cols-2">
            {PRINSIP.map((item, index) => (
              <li key={item.judul} className="border-t border-line py-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.7rem] font-bold text-brand">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[1rem] font-bold leading-snug text-ink">
                      {item.judul}
                    </h3>
                    <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-soft">
                      {item.isi}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA penutup: satu strip, bukan panel berbingkai */}
        <section className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              Butuh dikerjakan penuh, bukan alat?
            </h2>
            <p className="mt-1 max-w-xl text-[0.82rem] leading-relaxed text-ink-soft">
              Untuk tugas dengan kebutuhan data khusus (SPSS, coding, analisis
              statistik), serahkan ke Mas Joki dengan pengerjaan manual dan
              garansi revisi.
            </p>
          </div>

          <Link
            href="/hitung"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand px-5 py-3 text-[0.82rem] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            Hitung biaya manual
          </Link>
        </section>
      </TransisiHalaman>

      <SiteFooter />
    </>
  );
}
