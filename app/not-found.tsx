import Link from "next/link";
import { ArrowRight, Calculator, FileQuestion, SearchX } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const TAUTAN = [
  { href: "/jasa", label: "Daftar layanan" },
  { href: "/hitung", label: "Kalkulator biaya" },
  { href: "/cara-kerja", label: "Cara kerja" },
  { href: "/faq", label: "Pertanyaan umum" },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main id="konten" className="bg-paper">
        <section className="relative overflow-hidden border-b border-line px-5 py-16 sm:px-8 sm:py-24">
          <div
            aria-hidden
            className="kertas-titik pointer-events-none absolute inset-0 opacity-30"
          />

          <div className="relative mx-auto max-w-2xl">
            <div className="nota p-8 sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.24em] text-muted">
                    Nota tidak ditemukan
                  </p>
                  <h1 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.03em] text-ink sm:text-[2.6rem]">
                    Halaman ini tidak ada di buku nota.
                  </h1>
                </div>

                <span className="stempel-merah shrink-0 rotate-3">404</span>
              </div>

              <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-slate-600 font-medium">
                Mungkin tautannya salah ketik, atau halamannya sudah dipindah.
                Semua yang kamu butuhkan tetap bisa diakses lewat tautan di bawah.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-dark active:translate-y-0"
                >
                  <SearchX className="size-4" />
                  <span>Kembali ke beranda</span>
                </Link>
                <Link
                  href="/hitung"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-card px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  <Calculator className="size-4" />
                  <span>Hitung biaya tugas</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              <div className="mt-8 border-t border-dashed border-line pt-5">
                <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">
                  Halaman yang tersedia
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {TAUTAN.map((t) => (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper-2/60 px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
                      >
                        <FileQuestion className="size-3" aria-hidden />
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
