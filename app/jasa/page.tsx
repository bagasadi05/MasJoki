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
        <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-line pb-10">
          <div className="max-w-2xl">
            <span className="stempel-hijau">
              ✓ HARGA TRANSPARAN DI AWAL
            </span>
            <h1 className="mt-3 font-display text-[2.5rem] leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3.2rem]">
              Sembilan Layanan Bantuan Tugas.
            </h1>
            <p className="mt-4 max-w-[56ch] text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 font-medium">
              Semua dikerjakan langsung oleh Bagas tanpa perantara. Harga terkunci di awal dan dihitung otomatis lewat kalkulator tanpa biaya siluman.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row shrink-0">
            <Link
              href="/hitung"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-dark hover:shadow-lg"
            >
              <Calculator className="size-4" />
              <span>Buka Kalkulator Biaya</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={waLink(waPesanUmum)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white px-6 py-3.5 text-sm font-bold text-ink shadow-2xs transition-colors hover:bg-ink hover:text-white"
            >
              <span>Tanya Bagas via WhatsApp</span>
              <ExternalLink className="size-3.5 opacity-60" />
            </a>
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
                Bagas bisa menyesuaikan pengerjaan dengan pedoman dosen atau instansi kampusmu. Kirimkan brief via chat WhatsApp untuk penawaran khusus.
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
