import type { Metadata } from "next";
import Link from "next/link";
import { LangkahRingkas } from "@/components/langkah-ringkas";
import { PriceCalculator } from "@/components/price-calculator";
import { SimulasiContoh } from "@/components/simulasi-contoh";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TransisiHalaman } from "@/components/transisi-halaman";

export const metadata: Metadata = {
  title: "Kalkulator Biaya Bantuan Tugas",
  description:
    "Hitung estimasi biaya bantuan tugas kuliahmu secara mandiri. Pilih layanan, sesuaikan jumlah kata/halaman, tentukan tenggat, dan dapatkan rincian nota kwitansi transparan di awal.",
  alternates: { canonical: "/hitung" },
};

export default function HalamanKalkulator() {
  return (
    <>
      <SiteHeader />

      <TransisiHalaman id="konten" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Remah roti"
          className="flex items-center gap-2 text-xs font-semibold text-slate-600"
        >
          <Link href="/" className="transition-colors hover:text-brand">
            Beranda
          </Link>
          <span aria-hidden className="text-slate-400">
            /
          </span>
          <span className="font-bold text-ink">Kalkulator Biaya</span>
        </nav>

        {/* Heading */}
        <div className="mt-6 max-w-3xl">
          <h1
            id="judul-hitung"
            tabIndex={-1}
            className="mt-3 font-display text-[2.3rem] leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3rem] focus:outline-none"
          >
            Hitung Biaya Tugasmu Secara Mandiri.
          </h1>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-slate-600 font-medium">
            Pilih jenis tugas, geser jumlah kata atau halaman, dan pilih tenggat yang kamu butuhkan.
            Total biaya dan rincian nota keluar seketika tanpa menunggu balasan chat.
          </p>
        </div>

        <LangkahRingkas />

        {/* Main Calculator */}
        <div id="hitung" className="mt-10 scroll-mt-24">
          <PriceCalculator />
        </div>

        {/* 3 Simulasi Contoh Nyata */}
        <section className="mt-20">
          <SimulasiContoh />
        </section>
      </TransisiHalaman>

      <SiteFooter />
    </>
  );
}
