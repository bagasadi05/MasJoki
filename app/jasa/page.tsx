import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, ExternalLink } from "lucide-react";
import { BeforeAfterShowcase } from "@/components/before-after-showcase";
import { ServiceList } from "@/components/service-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { waLink, waPesanUmum } from "@/lib/site";

export const metadata: Metadata = {
  title: "Daftar Layanan & Harga Lengkap",
  description:
    "Sembilan layanan Mas Joki dengan standar transparansi harga: parafrase, humanisasi teks AI, makalah, artikel jurnal, PowerPoint, rapikan Word, terjemahan, desain visual, dan penurunan skor Turnitin & AI.",
  alternates: { canonical: "/jasa" },
};

export default function HalamanDaftarLayanan() {
  return (
    <>
      <SiteHeader />

      <main id="konten" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-18">
        {/* Breadcrumb */}
        <nav aria-label="Remah roti" className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Link href="/" className="transition-colors hover:text-brand">
            Beranda
          </Link>
          <span aria-hidden className="text-slate-400">/</span>
          <span className="font-bold text-ink">Semua Layanan</span>
        </nav>

        {/* Hero Title */}
        <div className="mt-8 border-b border-line pb-10">
          <span className="stempel-hijau">
            ✓ HARGA TRANSPARAN DI AWAL
          </span>
          <h1 className="mt-3 max-w-4xl font-display text-[2.5rem] leading-[1.08] tracking-[-0.03em] text-balance text-ink sm:text-[2.9rem] xl:text-[3.4rem]">
            Layanan Bantuan Tugas.
          </h1>

          <div className="mt-5 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <p className="max-w-[52ch] text-sm md:text-base leading-relaxed text-slate-600 font-medium">
              9 kategori utama yang dikerjakan langsung oleh Mas Joki tanpa perantara. Tersedia varian tingkat artikel jurnal dan paket abstrak. Harga terkunci di awal dan dihitung otomatis lewat kalkulator tanpa biaya siluman.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row shrink-0">
            <Link
              href="/hitung"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark hover:shadow-lg"
            >
              <Calculator className="size-4" />
              <span>Buka Kalkulator Biaya</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={waLink(waPesanUmum)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-line dark:border-line-strong bg-white dark:bg-[#162035] px-6 py-3.5 text-sm font-bold text-ink dark:text-slate-100 shadow-2xs transition-colors hover:bg-brand dark:hover:bg-brand hover:text-white dark:hover:border-brand"
            >
              <span>Tanya Mas Joki via WhatsApp</span>
              <ExternalLink className="size-3.5 opacity-60" />
            </a>
            </div>
          </div>
        </div>

        {/* Grid Cards Berformat Seragam */}
        <div className="mt-12">
          <ServiceList isCatalogPage={true} />
        </div>

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
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
                Mas Joki bisa menyesuaikan pengerjaan dengan pedoman dosen atau instansi kampusmu. Kirimkan brief via chat WhatsApp untuk penawaran khusus.
              </p>
            </div>
            <a
              href={waLink(
                "Halo Mas Joki, saya mau tanya soal tugas dengan kebutuhan khusus.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-brand-dark transition-colors shrink-0"
            >
              <span>Konsultasi Khusus via WhatsApp</span>
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
