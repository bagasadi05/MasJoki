import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, ExternalLink, Flame } from "lucide-react";
import { BeforeAfterShowcase } from "@/components/before-after-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StempelLayanan } from "@/components/stempel-layanan";
import { aksenLayanan } from "@/lib/aksen";
import { rupiah } from "@/lib/format";
import { SERVICES, priceLabel, type ServiceId } from "@/lib/services";
import { waLink, waPesanUmum } from "@/lib/site";

export const metadata: Metadata = {
  title: "Daftar Layanan & Harga Lengkap",
  description:
    "Delapan layanan Mas Joki dengan harga per satuan yang transparan: parafrase, humanisasi teks AI, makalah, artikel jurnal, PowerPoint, rapikan Word, terjemahan, dan desain visual.",
  alternates: { canonical: "/jasa" },
};

const KODE_LAYANAN: Record<ServiceId, string> = {
  parafrase: "PF-01",
  humanisasi: "HM-02",
  makalah: "MK-03",
  jurnal: "JR-04",
  powerpoint: "PT-05",
  word: "WD-06",
  terjemah: "TJ-07",
  desain: "DS-08",
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
          <span className="stempel">
            KATALOG RESMI
          </span>
          <h1 className="mt-3 font-display text-[2.4rem] leading-[1.06] tracking-[-0.03em] text-ink sm:text-[3.1rem]">
            Delapan layanan, satu standar kejujuran harga.
          </h1>
          <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-relaxed text-ink-soft">
            Semua nominal di bawah adalah tarif dasar per satuan. Total akhir menyesuaikan
            kuantitas, tenggat, dan tingkat kesulitan — dan selalu terlihat jelas di nota sebelum kamu order.
          </p>

          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
            <Link
              href="/hitung"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-[0.92rem] font-bold text-white shadow-md shadow-brand/25 transition-all hover:bg-brand-dark"
            >
              <Calculator className="size-4.5" />
              <span>Hitung Biaya Tugasku</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={waLink(waPesanUmum)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white px-6 py-3.5 text-[0.92rem] font-bold text-ink shadow-2xs transition-colors hover:bg-ink hover:text-white"
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
            const kode = KODE_LAYANAN[service.id];

            return (
              <li key={service.id}>
                <Link
                  href={`/jasa/${service.id}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ backgroundColor: aksen.hex }}
                  />

                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <StempelLayanan id={service.id} ukuran="sedang" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[0.66rem] font-bold text-muted/70 tracking-wider">
                              {kode}
                            </span>
                            {service.popular ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.2 text-[0.64rem] font-bold text-amber-900 shadow-2xs">
                                <Flame className="size-2.5 text-amber-600 fill-amber-500" />
                                <span>Populer</span>
                              </span>
                            ) : null}
                          </div>
                          <h2 className="mt-0.5 font-display text-[1.3rem] font-extrabold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
                            {service.name}
                          </h2>
                          <span className="text-[0.74rem] text-muted">
                            Estimasi pengerjaan: <strong>{service.turnaround}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-[0.88rem] leading-relaxed text-ink-soft/90">
                      {service.promise}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-4">
                    <div>
                      <span className="block text-[0.68rem] font-bold uppercase tracking-wider text-muted">
                        Tarif Dasar
                      </span>
                      <span className="font-mono text-[0.98rem] font-extrabold tabular-nums text-ink">
                        {priceLabel(service)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[0.76rem] font-medium text-muted">
                        Mulai {rupiah(service.minPrice)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-paper-2 px-3.5 py-2 text-[0.78rem] font-bold text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                        <span>Buka Detail</span>
                        <ArrowRight className="size-3.5" />
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
        <div className="mt-12 rounded-3xl border border-line bg-paper-2/70 p-7 sm:p-9 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-ink">
                Punya tugas kombinasi atau topik riset spesifik?
              </h3>
              <p className="mt-1.5 text-[0.88rem] text-ink-soft">
                Admin siap membantu menganalisis brief tugasmu secara personal tanpa biaya konsultasi.
              </p>
            </div>
            <Link
              href="/hitung"
              className="inline-flex items-center gap-1.5 justify-center rounded-2xl bg-ink px-6 py-3.5 text-[0.88rem] font-bold text-white transition-colors hover:bg-brand shrink-0"
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
