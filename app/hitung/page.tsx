import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { CalculatorProvider } from "@/components/calculator-context";
import { PriceCalculator } from "@/components/price-calculator";
import { SimulasiContoh } from "@/components/simulasi-contoh";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Kalkulator Biaya Tugas Kuliah & Cek Nota Transparan",
  description:
    "Hitung estimasi biaya tugas kuliahmu secara mandiri. Pilih layanan, atur jumlah kata/halaman dan tenggat waktu. Total harga langsung terkunci di nota resmi.",
  alternates: { canonical: "/hitung" },
};

export default function HalamanKalkulator() {
  return (
    <CalculatorProvider>
      <SiteHeader />

      <main id="konten" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Remah roti"
          className="flex items-center gap-2 text-[0.8rem] font-medium text-muted"
        >
          <Link href="/" className="transition-colors hover:text-brand">
            Beranda
          </Link>
          <span aria-hidden className="text-muted/50">
            /
          </span>
          <span className="font-bold text-ink">Kalkulator Biaya</span>
        </nav>

        {/* Heading */}
        <div className="mt-6 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-[0.74rem] font-bold text-brand">
            <Calculator className="size-3.5" />
            <span>Kalkulator Estimasi Biaya</span>
          </span>
          <h1
            id="judul-hitung"
            tabIndex={-1}
            className="mt-3 font-display text-[2.3rem] leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3rem] focus:outline-none"
          >
            Hitung Biaya Tugasmu Secara Mandiri.
          </h1>
          <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-relaxed text-ink-soft">
            Pilih jenis tugas, geser jumlah kata atau halaman, dan pilih tenggat yang kamu butuhkan.
            Total biaya dan rincian nota kwitansi langsung keluar seketika tanpa perlu nunggu chat admin dibalas.
          </p>
        </div>

        {/* Main Calculator */}
        <div id="hitung" className="mt-10 scroll-mt-24">
          <PriceCalculator />
        </div>

        {/* 3 Simulasi Contoh Nyata */}
        <section className="mt-20">
          <SimulasiContoh />
        </section>
      </main>

      <SiteFooter />
    </CalculatorProvider>
  );
}
