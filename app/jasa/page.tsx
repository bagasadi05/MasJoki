import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, ExternalLink, Flame } from "lucide-react";
import { BeforeAfterShowcase } from "@/components/before-after-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StempelLayanan } from "@/components/stempel-layanan";
import { aksenLayanan } from "@/lib/aksen";
import { rupiah } from "@/lib/format";
import { SERVICES, priceLabel } from "@/lib/services";
import { waLink, waPesanUmum } from "@/lib/site";

export const metadata: Metadata = {
  title: "Daftar Layanan & Harga Lengkap",
  description:
    "Delapan layanan Mas Joki dengan harga per satuan yang transparan: parafrase, humanisasi teks AI, makalah, artikel jurnal, PowerPoint, rapikan Word, terjemahan, dan desain visual.",
  alternates: { canonical: "/jasa" },
};

export default function HalamanDaftarLayanan() {
  return (
    <>
      <SiteHeader />

      <main id="konten" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-18">
        {/* Breadcrumb */}
        <nav aria-label="Remah roti" className="flex items-center gap-2 text-[0.8rem] font-medium text-muted">
          <Link href="/" className="transition-colors hover:text-brand">
            Beranda
          </Link>
          <span aria-hidden className="text-muted/50">/</span>
          <span className="font-bold text-ink">Semua Layanan</span>
        </nav>

        {/* Heading */}
        <div className="mt-6 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-[0.74rem] font-bold text-brand">
            <BookOpen className="size-3.5" />
            <span>Katalog Layanan</span>
          </span>
          <h1 className="mt-3 font-display text-[2.4rem] leading-[1.06] tracking-[-0.03em] text-ink sm:text-[3.1rem]">
            Delapan layanan, satu standar kejujuran harga.
          </h1>
          <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-relaxed text-ink-soft">
            Semua nominal di bawah adalah harga dasar per satuan. Total akhir menyesuaikan
            kuantitas, tenggat, dan tingkat kesulitan — dan selalu terlihat jelas di nota sebelum kamu order.
          </p>

          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
            <Link
              href="/hitung"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[0.92rem] font-bold text-white shadow-md shadow-brand/25 transition-all hover:bg-brand-dark"
            >
              <Calculator className="size-4.5" />
              <span>Hitung Biaya Tugasku</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={waLink(waPesanUmum)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-white px-6 py-3.5 text-[0.92rem] font-bold text-ink shadow-2xs transition-colors hover:bg-ink hover:text-white"
            >
              <span>Tanya Admin via WhatsApp</span>
              <ExternalLink className="size-3.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Grid Cards */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {SERVICES.map((service) => {
            const aksen = aksenLayanan(service.id);

            return (
              <li key={service.id}>
                <Link
                  href={`/jasa/${service.id}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-lg"
                >
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-1.5 ${aksen.top.replace("border-t-", "bg-")}`}
                  />

                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <StempelLayanan id={service.id} ukuran="sedang" />
                        <div>
                          <h2 className="font-display text-[1.25rem] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
                            {service.name}
                          </h2>
                          <span className="text-[0.74rem] text-muted">
                            Estimasi pengerjaan: <strong>{service.turnaround}</strong>
                          </span>
                        </div>
                      </div>

                      {service.popular ? (
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[0.68rem] font-bold text-amber-900 shadow-2xs">
                          <Flame className="size-3 text-amber-600 fill-amber-500" />
                          <span>Populer</span>
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-4 text-[0.88rem] leading-relaxed text-ink-soft">
                      {service.promise}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-4">
                    <div>
                      <span className="block text-[0.68rem] font-bold uppercase tracking-wider text-muted">
                        Harga Dasar
                      </span>
                      <span className="font-mono text-[0.95rem] font-extrabold tabular-nums text-ink">
                        {priceLabel(service)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[0.76rem] font-medium text-muted">
                        Mulai {rupiah(service.minPrice)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-paper-2 px-3 py-1.5 text-[0.78rem] font-bold text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                        <span>Buka Detail</span>
                        <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bukti Mutu Sebelum vs Sesudah */}
        <div className="mt-16 border-t border-line pt-12">
          <BeforeAfterShowcase />
        </div>

        {/* Footer info box */}
        <div className="mt-12 rounded-2xl border border-line bg-paper-2/70 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-ink">
                Punya tugas kombinasi atau topik riset spesifik?
              </h3>
              <p className="mt-1 text-[0.86rem] text-muted">
                Admin siap membantu menganalisis brief tugasmu secara personal.
              </p>
            </div>
            <Link
              href="/hitung"
              className="inline-flex items-center gap-1.5 justify-center rounded-xl bg-ink px-5 py-3 text-[0.86rem] font-bold text-white transition-colors hover:bg-brand"
            >
              <span>Hitung Biaya Sekarang</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
