import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderArchive,
  Lock,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { AlurKerja } from "@/components/alur-kerja";
import { BeforeAfterShowcase } from "@/components/before-after-showcase";
import { CalculatorProvider } from "@/components/calculator-context";
import { FaqList } from "@/components/faq-list";
import { HeroStaticReceipt } from "@/components/hero-static-receipt";
import { PriceCalculator } from "@/components/price-calculator";
import { ServiceList } from "@/components/service-list";
import { SimulasiContoh } from "@/components/simulasi-contoh";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { QRIS_ENABLED, SITE_OWNER } from "@/lib/config";
import { pembayaran, site, waLink, waPesanUmum } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mas Joki — Bantuan Tugas Kuliah Transparan, Harga Terbuka di Awal",
  description:
    "Hitung estimasi biaya tugas kuliahmu secara mandiri. Parafrase, humanisasi teks AI, makalah, artikel jurnal, PPT, rapikan Word, hingga penurunan Turnitin langsung oleh Bagas tanpa perantara.",
  alternates: { canonical: "/" },
};

const garansiList = [
  {
    kode: "PASAL 01",
    judul: "Harga Terbuka Tanpa Tawar-Menawar",
    isi: "Nominal di nota terkunci sejak awal. Tidak ada biaya siluman atau tambahan dadakan di tengah pengerjaan.",
    icon: Lock,
    bg: "bg-brand-soft/70 border-brand/25 text-ink",
    iconBg: "bg-brand-soft text-brand",
  },
  {
    kode: "PASAL 02",
    judul: "Garansi Uang Kembali 100%",
    isi: "Jika hasil tugas menyimpang dari brief dan tidak tuntas via revisi, dana dikembalikan 100% penuh.",
    icon: RotateCcw,
    bg: "bg-mint-soft/70 border-mint/25 text-ink",
    iconBg: "bg-mint-soft text-mint",
  },
  {
    kode: "PASAL 03",
    judul: "File Sumber Lengkap & Siap Edit",
    isi: "Bagas selalu menyerahkan file sumber (file mentah asli: .docx atau .pptx) yang bebas kamu edit dan simpan kapan pun.",
    icon: FolderArchive,
    bg: "bg-amber-soft/70 border-amber/25 text-ink",
    iconBg: "bg-amber-soft text-amber",
  },
  {
    kode: "PASAL 04",
    judul: "Kerahasiaan Naskah & Data Aman",
    isi: "Identitas mahasiswa, materi tugas, dan berkas naskah dijamin aman privat tanpa pernah dipublikasikan.",
    icon: ShieldCheck,
    bg: "bg-lilac-soft/70 border-lilac/25 text-ink",
    iconBg: "bg-lilac-soft text-lilac",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description:
    "Bantuan penulisan dan penyuntingan tugas: parafrase, humanisasi teks AI, makalah, PowerPoint, artikel jurnal, terjemahan, rapikan format Word, dan penurunan Turnitin.",
  areaServed: "ID",
  priceRange: "Rp15.000–Rp400.000",
  email: site.email,
  sameAs: ["https://www.threads.com/@adis.shop29"],
  address: { "@type": "PostalAddress", addressLocality: site.kota },
  openingHours: "Mo-Su 07:00-23:00",
};

export default function Home() {
  return (
    <CalculatorProvider>
      <SiteHeader />

      <main id="konten">
        {/* ========================================================== *
         * 1. HERO RINGKAS (TUGAS 1: Tanpa Simulator Interaktif)
         * ========================================================== */}
        <section className="relative overflow-hidden border-b border-line bg-[#fbf9f4]">
          {/* Ambient Lighting Orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 size-[28rem] rounded-full bg-amber-soft/90 blur-3xl opacity-60 animate-pulse-subtle"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-12 -right-24 size-[32rem] rounded-full bg-brand-soft blur-3xl opacity-75"
          />

          {/* Academic Graph Grid Overlay */}
          <div
            aria-hidden
            className="kertas-grafik-halus pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_60%,transparent_100%)]"
          />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-12 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-12 lg:pb-20 lg:pt-16">
            <div>
              {/* Badge Kecil Tetap */}
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2/90 px-3.5 py-1 text-xs font-bold text-ink shadow-2xs">
                <span className="size-2 rounded-full bg-mint animate-pulse" />
                <span>Jasa Bantuan Tugas</span>
                <span className="text-muted/40">•</span>
                <span className="text-slate-600 font-medium">Bagas</span>
              </div>

              {/* Headline & Sub-headline (Teks Tetap Tidak Berubah) */}
              <h1 className="mt-5 font-display text-[2.5rem] leading-[1.06] tracking-[-0.035em] text-ink sm:text-[3.2rem] lg:text-[3.6rem]">
                Tugas kuliah beres, harga pasti kelihatan di awal.
              </h1>

              <p className="mt-4 max-w-[48ch] text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
                Dikerjakan langsung oleh Bagas tanpa perantara. Masukkan jumlah kata atau halaman, pilih tenggat, dan kunci estimasi nota sebelum kamu mengetik satu baris pesan pun.
              </p>

              {/* Dua Tombol CTA Sederhana: Hitung Biaya Tugasmu & Lihat Layanan */}
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <a
                  href="#kalkulator"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35 active:translate-y-0 cursor-pointer"
                >
                  <Calculator className="size-4.5" />
                  <span>Hitung Biaya Tugasmu</span>
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#layanan"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white px-7 py-4 text-sm font-bold text-ink shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-white active:translate-y-0"
                >
                  <span>Lihat Layanan</span>
                  <ArrowRight className="size-4" />
                </a>
              </div>

              {/* Tiga Poin Kepercayaan dalam Satu Baris Ringkas */}
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-mint shrink-0" />
                  <span>Harga pasti di awal</span>
                </span>
                <span className="text-slate-300 hidden sm:inline" aria-hidden>
                  •
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-brand shrink-0" />
                  <span>Dikerjakan langsung oleh Bagas</span>
                </span>
                <span className="text-slate-300 hidden sm:inline" aria-hidden>
                  •
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-amber shrink-0" />
                  <span>File sumber (file mentah asli) selalu disertakan</span>
                </span>
              </div>
            </div>

            {/* Sisi Kanan: Nota Mini Statis (Pajangan Brand, Non-Interaktif) */}
            <div className="relative">
              <HeroStaticReceipt />
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 2. STRIP RINGKASAN CEPAT (TUGAS 2: 4 Info Kunci dalam 10 Detik)
         * ========================================================== */}
        <section className="border-b border-line bg-white py-4 shadow-2xs">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-ink">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-brand-soft text-brand text-xs">
                  🏷️
                </span>
                <span>Mulai Rp15.000</span>
              </div>
              <span className="text-slate-300 hidden md:inline" aria-hidden>
                •
              </span>
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-amber-soft text-amber text-xs">
                  ⚡
                </span>
                <span>Pengerjaan mulai 6 jam</span>
              </div>
              <span className="text-slate-300 hidden md:inline" aria-hidden>
                •
              </span>
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-mint-soft text-mint text-xs">
                  💳
                </span>
                <span>DP 50% dulu, lunas setelah selesai</span>
              </div>
              <span className="text-slate-300 hidden md:inline" aria-hidden>
                •
              </span>
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-blue-50 text-brand text-xs">
                  🔄
                </span>
                <span>Revisi 2× gratis</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 3. SECTION LAYANAN (TUGAS 2 & 3: Sebelum Kalkulator & Sebelum B/A)
         * ========================================================== */}
        <section
          id="layanan"
          className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper via-paper-2/45 to-paper py-14 sm:py-20 scroll-mt-16"
        >
          <div
            aria-hidden
            className="kertas-grafik pointer-events-none absolute inset-0 opacity-25"
          />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="stempel">PILIHAN LAYANAN</span>
                <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
                  Sembilan Layanan Bantuan Tugas.
                </h2>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                  Pilih layanan yang kamu butuhkan. Hitung estimasi biaya langsung di kalkulator atau buka detail formatnya.
                </p>
              </div>

              <Link
                href="/jasa"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink hover:border-brand hover:text-brand shadow-2xs transition-colors shrink-0"
              >
                <span>Katalog Layanan Lengkap</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="mt-10">
              <ServiceList />
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 4. SECTION CARA PESAN (TUGAS 2: 4 Kartu Bernomor Tanpa Paragraf)
         * ========================================================== */}
        <AlurKerja />

        {/* ========================================================== *
         * 5. SECTION BUKTI & KEPERCAYAAN (TUGAS 2: Gabungan B/A, Testimoni, Statistik)
         * ========================================================== */}
        <section
          id="bukti-kepercayaan"
          className="relative overflow-hidden border-b border-line bg-gradient-to-b from-white via-paper-2/30 to-white py-14 sm:py-20 scroll-mt-16"
        >
          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            {/* Strip Statistik Bukti Sosial */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-3xl border border-line bg-white p-5 sm:p-7 shadow-xs">
              <div className="text-center p-2">
                <p className="font-display text-2xl sm:text-3xl font-black text-brand tabular-nums">
                  2.400+
                </p>
                <p className="mt-1 text-xs font-bold text-slate-600">
                  Tugas Tertangani
                </p>
              </div>
              <div className="text-center p-2 border-l border-line">
                <p className="font-display text-2xl sm:text-3xl font-black text-amber tabular-nums">
                  4.9+/5
                </p>
                <p className="mt-1 text-xs font-bold text-slate-600">
                  Ulasan Puas
                </p>
              </div>
              <div className="text-center p-2 border-t sm:border-t-0 sm:border-l border-line">
                <p className="font-display text-2xl sm:text-3xl font-black text-mint tabular-nums">
                  100%
                </p>
                <p className="mt-1 text-xs font-bold text-slate-600">
                  File Sumber Disertakan
                </p>
              </div>
              <div className="text-center p-2 border-t sm:border-t-0 sm:border-l border-line">
                <p className="font-display text-2xl sm:text-3xl font-black text-ink tabular-nums">
                  07.00–23.00
                </p>
                <p className="mt-1 text-xs font-bold text-slate-600">
                  WIB Responsif
                </p>
              </div>
            </div>

            {/* Perbandingan Mutu Sebelum vs Sesudah (Rahasia di Balik Harga Kami) */}
            <div className="mt-14">
              <BeforeAfterShowcase />
            </div>

            {/* Section Testimoni / Kata Mereka (Hanya tampil bila TESTIMONIALS_ENABLED = true) */}
            <Testimonials />
          </div>
        </section>

        {/* ========================================================== *
         * 6. SECTION KALKULATOR (TUGAS 2: Hitung Dulu, Baru Pesan + Simulator Pindahan)
         * ========================================================== */}
        <section
          id="kalkulator"
          className="relative overflow-hidden border-b border-line bg-gradient-to-b from-[#fcfbf7] via-white to-[#f5f0e6] py-16 sm:py-24 scroll-mt-16"
        >
          {/* Invisible anchor for backward compatibility */}
          <span id="hitung" className="sr-only" />

          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 size-96 rounded-full bg-brand-soft/70 blur-3xl opacity-60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 size-96 rounded-full bg-amber-soft/60 blur-3xl opacity-50"
          />
          <div
            aria-hidden
            className="kertas-titik-jelas pointer-events-none absolute inset-0 opacity-35"
          />

          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <span className="stempel">KALKULATOR RESMI</span>
              <h2
                id="judul-hitung"
                tabIndex={-1}
                className="mt-3 font-display text-[2.2rem] leading-tight tracking-[-0.025em] text-ink sm:text-[2.8rem] focus:outline-none"
              >
                Hitung Dulu, Baru Pesan.
              </h2>
              <p className="mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 font-medium">
                Pilih jenis tugas, atur jumlahnya, dan lihat nominal pasti di nota sebelum menghubungi Bagas.
              </p>
            </div>

            {/* Simulator Interaktif Pindahan dari Hero */}
            <div className="mt-10">
              <PriceCalculator />
            </div>

            {/* Tiga Kartu Contoh Hitungan Nyata */}
            <div className="mt-14">
              <SimulasiContoh />
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 7. SECTION GARANSI (TUGAS 2: Teks Tiap Kartu Maksimal 2 Baris)
         * ========================================================== */}
        <section
          id="garansi"
          className="relative overflow-hidden border-b border-line bg-gradient-to-b from-white via-[#faf7ef] to-white py-14 sm:py-20 scroll-mt-16"
        >
          <div
            aria-hidden
            className="kertas-titik pointer-events-none absolute inset-0 opacity-30"
          />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-xl">
              <span className="stempel-hijau">✓ PIAGAM INTEGRITAS</span>
              <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
                Empat Garansi Transparansi Mas Joki.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium">
                Prinsip baku tanpa kompromi yang Bagas pegang untuk setiap tugasmu.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {garansiList.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.judul}
                    className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-md ${item.bg}`}
                  >
                    <div className="flex items-center justify-between border-b border-dashed border-line/60 pb-3.5">
                      <span className="font-mono text-xs font-bold text-slate-600 tracking-wider">
                        {item.kode}
                      </span>
                      <div className={`grid size-9 place-items-center rounded-xl ${item.iconBg}`}>
                        <Icon className="size-4.5" />
                      </div>
                    </div>

                    <h3 className="mt-4 font-display text-base sm:text-lg font-bold tracking-tight text-ink">
                      {item.judul}
                    </h3>

                    {/* Teks Maksimal 2 Baris Tampil */}
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium line-clamp-2">
                      {item.isi}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 8. STRIP PEMBAYARAN RINGKAS (TUGAS 2 & 6: Satu Baris E-Wallet & Slot QRIS)
         * ========================================================== */}
        <section className="border-b border-line bg-paper-2/60 py-5">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm text-slate-700">
              <div className="flex flex-wrap items-center gap-2">
                <span>Pembayaran via </span>
                <strong className="text-ink">ShopeePay, GoPay, atau DANA</strong>
                <span> ke </span>
                <strong className="font-mono text-ink font-bold">{pembayaran.nomor}</strong>
                <span> a.n. {SITE_OWNER} (tanpa biaya admin).</span>
                {QRIS_ENABLED && (
                  <span className="ml-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    QRIS — bisa dari e-wallet &amp; m-banking apa pun
                  </span>
                )}
              </div>

              <Link
                href="/cara-kerja"
                className="inline-flex items-center gap-1.5 font-bold text-brand hover:underline shrink-0"
              >
                <span>Lihat cara pembayaran →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * BLOK PERKENALAN SINGKAT PEMILIK (TUGAS 7: Bagas, S.Pd)
         * ========================================================== */}
        <section id="profil-pemilik" className="border-b border-line bg-gradient-to-b from-[#fcfbf7] to-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm">
              <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-2xl border-2 border-line shadow-xs">
                <Image
                  src="/mas-joki.jpg"
                  alt="Bagas — Pemilik & Pengerja Mas Joki"
                  width={112}
                  height={112}
                  className="size-full object-cover object-top"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="stempel-hijau text-[0.72rem] py-0.5 px-2.5">
                  ✓ DIKERJAKAN LANGSUNG
                </span>
                <h3 className="mt-2.5 font-display text-lg sm:text-xl font-bold text-ink">
                  Bagas, S.Pd — Pengelola &amp; Pengerja Mas Joki
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
                  Halo, saya Bagas — guru aktif bergelar S.Pd yang mengerjakan sendiri semua pesanan di Mas Joki. Tanpa perantara, tanpa tim bayangan. Latar belakang pendidikan membuat saya paham persis format akademik yang diminta dosen: sitasi rapi, struktur benar, bahasa yang lolos dibaca manusia.
                </p>

                <div className="mt-4">
                  <a
                    href={waLink("Halo Mas Joki, saya mau tanya soal biaya tugas saya.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand hover:underline"
                  >
                    <MessageCircle className="size-4" />
                    <span>Chat Bagas</span>
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 9. SECTION FAQ (TUGAS 2: Maksimal 6 Pertanyaan Populer)
         * ========================================================== */}
        <section id="faq" className="border-b border-line bg-white py-14 sm:py-20 scroll-mt-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="stempel">TANYA JAWAB UMUM</span>
                <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
                  Pertanyaan yang Kerap Ditanyakan.
                </h2>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                  Hal mendasar seputar cara pesan, uang muka (DP), revisi, keamanan file, dan batas tenggat.
                </p>
              </div>

              <Link
                href="/faq"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-paper-2 px-4 py-2.5 text-xs font-bold text-ink hover:border-brand hover:text-brand shadow-2xs transition-colors shrink-0"
              >
                <span>Lihat Semua FAQ</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Maksimal 6 Pertanyaan Paling Umum */}
            <div className="mt-8">
              <FaqList limit={6} />
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 10. CTA AKHIR DENGAN SATU TOMBOL UTAMA (TUGAS 2 & 4)
         * ========================================================== */}
        <section id="cta-bawah" className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-12 shadow-2xl sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-brand/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -bottom-16 size-80 rounded-full bg-lilac/25 blur-3xl"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="stempel bg-white/10 text-white border-white/40">
                  ESTIMASI SEKETIKA
                </span>

                <h2 className="mt-4 font-display text-[2.2rem] leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.8rem]">
                  Cek harga tugasmu sekarang.
                  <br />
                  <span className="text-stabilo">
                    Transparan &amp; tanpa ribet.
                  </span>
                </h2>

                <p className="mt-3 max-w-[46ch] text-xs sm:text-sm leading-relaxed text-white/80">
                  Tidak perlu bikin akun. Ketahui nominal pasti di awal sebelum kamu mengetik satu baris chat pun. Dikerjakan langsung oleh Bagas tanpa perantara.
                </p>

                {/* Satu Tombol CTA Utama + Chat WhatsApp */}
                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                  <a
                    href="#kalkulator"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stabilo px-7 py-4 text-sm font-extrabold text-ink shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white active:translate-y-0 cursor-pointer"
                  >
                    <Calculator className="size-4.5" />
                    <span>Hitung Biaya Sekarang</span>
                    <ArrowRight className="size-4" />
                  </a>
                  <a
                    href={waLink(waPesanUmum)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-xs transition-all duration-200 hover:bg-white/15 active:translate-y-0"
                  >
                    <MessageCircle className="size-4.5" />
                    <span>Chat Bagas di WhatsApp</span>
                    <ExternalLink className="size-3.5 opacity-60" />
                  </a>
                </div>
              </div>

              {/* Maskot Avatar di CTA Akhir */}
              <div className="hidden lg:flex justify-end">
                <div className="relative size-52 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/5 shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-105 animate-float">
                  <Image
                    src="/mas-joki.jpg"
                    alt="Maskot Mas Joki"
                    width={208}
                    height={208}
                    className="size-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 inset-x-0 text-center font-display text-xs font-bold text-white">
                    Mas Joki Siap Membantu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </CalculatorProvider>
  );
}
