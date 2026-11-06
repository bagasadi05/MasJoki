import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FolderArchive,
  Lock,
  MessageCircle,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";
import { AlurKerja } from "@/components/alur-kerja";
import { HeroStaticReceipt } from "@/components/hero-static-receipt";
import { ServiceList } from "@/components/service-list";
import { SimulasiContoh } from "@/components/simulasi-contoh";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { QRIS_ENABLED, SITE_OWNER } from "@/lib/config";
import { pembayaran, site, waLink, waPesanUmum } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mas Joki — Bantuan Tugas Kuliah Transparan, Harga Terbuka di Awal",
  description:
    "Hitung estimasi biaya tugas kuliahmu secara mandiri. Parafrase, humanisasi teks AI, makalah, artikel jurnal, PPT, rapikan Word, hingga penurunan Turnitin langsung oleh Mas Joki tanpa perantara.",
  alternates: { canonical: "/" },
};

const stripRingkasan = [
  {
    icon: Tag,
    label: "Mulai Rp15.000",
    iconBg: "bg-brand-soft text-brand",
  },
  {
    icon: Zap,
    label: "Pengerjaan mulai 6 jam",
    iconBg: "bg-amber-soft text-amber",
  },
  {
    icon: CreditCard,
    label: "DP 50% dulu, lunas setelah selesai",
    iconBg: "bg-mint-soft text-mint",
  },
  {
    icon: RefreshCcw,
    label: "Revisi 2× gratis",
    iconBg: "bg-brand-soft text-brand",
  },
];

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
    isi: "Mas Joki selalu menyerahkan file sumber (file mentah asli: .docx atau .pptx) yang bebas kamu edit dan simpan kapan pun.",
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
    <>
      <SiteHeader />

      <main id="konten">
        {/* ========================================================== *
         * 1. HERO UTAMA (NILAI JUAL: Harga Terbuka di Awal & Nota Transparan)
         * ========================================================== */}
        <section className="relative overflow-hidden border-b border-line bg-paper">
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
              {/* Badge Kecil & Flagship Tag */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2/90 px-3.5 py-1 text-xs font-bold text-ink shadow-2xs">
                  <span className="size-2 rounded-full bg-mint animate-pulse" />
                  <span>Jasa Bantuan Tugas</span>
                  <span className="text-muted/40">•</span>
                  <span className="text-slate-600 font-medium">Online</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint-soft px-3 py-1 text-xs font-bold text-mint shadow-2xs">
                  <Sparkles className="size-3 text-mint" />
                  <span>Produk Unggulan: Humanisasi Teks AI (GPTZero 98%) &amp; Turnitin</span>
                </div>
              </div>

              {/* Headline & Sub-headline */}
              <h1 className="mt-5 font-display text-[2.5rem] leading-[1.06] tracking-[-0.035em] text-ink sm:text-[3.2rem] lg:text-[3.6rem]">
                Tugas kuliah beres, harga pasti kelihatan di awal.
              </h1>

              <p className="mt-4 max-w-[48ch] text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
                Dikerjakan langsung oleh Mas Joki tanpa perantara. Buka kalkulator biaya untuk menghitung perkiraan biaya tugasmu seketika sebelum menghubungi kami.
              </p>

              {/* Dua Tombol CTA Utama: Buka Kalkulator Biaya & Lihat Layanan */}
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <Link
                  href="/hitung"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35 active:translate-y-0 cursor-pointer"
                >
                  <Calculator className="size-4.5" />
                  <span>Buka Kalkulator Biaya</span>
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#layanan"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-line dark:border-line-strong bg-white dark:bg-[#162035] px-7 py-4 text-sm font-bold text-ink dark:text-slate-100 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand dark:hover:bg-brand hover:text-white dark:hover:border-brand active:translate-y-0"
                >
                  <span>Lihat Layanan Unggulan</span>
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
                  <span>Dikerjakan langsung oleh Mas Joki</span>
                </span>
                <span className="text-slate-300 hidden sm:inline" aria-hidden>
                  •
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-amber shrink-0" />
                  <span>File sumber (.docx / .pptx) disertakan</span>
                </span>
              </div>
            </div>

            {/* Sisi Kanan: Nota Mini Statis (Pajangan Nilai Jual) */}
            <div className="relative">
              <HeroStaticReceipt />
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 2. STRIP RINGKASAN CEPAT (Animasi Berjalan / Infinite Marquee)
         * ========================================================== */}
        <section
          aria-label="Ringkasan keunggulan layanan Mas Joki"
          className="relative overflow-hidden border-b border-line bg-white/95 dark:bg-[#0f172a]/95 py-3.5 shadow-2xs backdrop-blur-sm"
        >
          {/* Efek gradien fade di tepi kiri & kanan */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-white dark:from-[#0f172a] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-white dark:from-[#0f172a] to-transparent z-10" />

          <div className="flex w-max animate-marquee items-center select-none hover:[animation-play-state:paused] [animation-duration:28s]">
            {/* Track 1: Set Pertama */}
            <div className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8">
              {stripRingkasan.concat(stripRingkasan).map((item, idx) => (
                <div key={`track1-${idx}`} className="flex items-center gap-6 sm:gap-8">
                  <div className="flex items-center gap-2">
                    <span className={`grid size-6 place-items-center rounded-full text-xs shrink-0 ${item.iconBg}`}>
                      <item.icon className="size-3.5" />
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-ink whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                    •
                  </span>
                </div>
              ))}
            </div>

            {/* Track 2: Set Duplikat Identik untuk Loop Tanpa Henti */}
            <div className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8" aria-hidden="true">
              {stripRingkasan.concat(stripRingkasan).map((item, idx) => (
                <div key={`track2-${idx}`} className="flex items-center gap-6 sm:gap-8">
                  <div className="flex items-center gap-2">
                    <span className={`grid size-6 place-items-center rounded-full text-xs shrink-0 ${item.iconBg}`}>
                      <item.icon className="size-3.5" />
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-ink whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                    •
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 3. HIGHLIGHT LAYANAN UNGGULAN (Hanya Populer, Lainnya di /jasa)
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
                <span className="stempel">PRODUK UNGGULAN &amp; PILIHAN UTAMA</span>
                <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
                  Layanan Unggulan &amp; Paling Banyak Dipesan.
                </h2>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                  Spesialisasi utama: Humanisasi teks AI (terbukti lolos GPTZero 98% Human), penurunan Turnitin manual, dan asistensi tugas akademik tanpa perantara.
                </p>
              </div>

              <Link
                href="/jasa"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink hover:border-brand hover:text-brand shadow-2xs transition-colors shrink-0"
              >
                <span>Buka Katalog Lengkap</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="mt-10">
              <ServiceList hanyaHighlight={true} />
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 4. NILAI JUAL: EMPAT GARANSI INTEGRITAS
         * ========================================================== */}
        <section
          id="nilai-jual"
          className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper via-paper-2/40 to-paper py-14 sm:py-20 scroll-mt-16"
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
                Prinsip baku tanpa kompromi yang Mas Joki pegang untuk setiap tugasmu.
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
         * 5. PROFIL PEMILIK (NILAI JUAL: Guru Aktif S.Pd, Tanpa Pihak Ketiga)
         * ========================================================== */}
        <section id="profil-pemilik" className="border-b border-line bg-gradient-to-b from-paper to-paper-2/40 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm">
              <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-2xl border-2 border-line shadow-xs mx-auto sm:mx-0">
                <Image
                  src="/mas-joki.jpg"
                  alt="Mas Joki — Pemilik & Pengerja"
                  width={112}
                  height={112}
                  className="size-full object-cover object-[center_18%]"
                  priority
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="stempel-hijau text-xs py-0.5 px-2.5">
                  ✓ DIKERJAKAN LANGSUNG
                </span>
                <h3 className="mt-2.5 font-display text-lg sm:text-xl font-bold text-ink">
                  Mas Joki — Pengelola &amp; Pengerja Langsung
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
                  Halo, saya Mas Joki — guru aktif bergelar S.Pd yang mengerjakan sendiri semua pesanan tugas di sini. Tanpa perantara, tanpa tim bayangan. Latar belakang pendidikan membuat saya paham persis format akademik yang diminta dosen: sitasi rapi, struktur benar, bahasa yang lolos dibaca manusia.
                </p>

                <div className="mt-4">
                  <a
                    href={waLink("Halo Mas Joki, saya mau tanya soal biaya tugas saya.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand hover:underline"
                  >
                    <MessageCircle className="size-4" />
                    <span>Chat Mas Joki di WhatsApp</span>
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 6. HIGHLIGHT CARA PESAN (4 Langkah Praktis)
         * ========================================================== */}
        <AlurKerja />

        {/* ========================================================== *
         * 7. HIGHLIGHT ESTIMASI BIAYA & SIMULASI NYATA (Pintu ke /hitung)
         * ========================================================== */}
        <section
          id="simulasi"
          className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper via-paper-2/40 to-paper py-16 sm:py-20 scroll-mt-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 size-96 rounded-full bg-brand-soft/70 blur-3xl opacity-60"
          />
          <div
            aria-hidden
            className="kertas-titik-jelas pointer-events-none absolute inset-0 opacity-35"
          />

          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="stempel">TRANSPARANSI HARGA</span>
                <h2 className="mt-3 font-display text-[2.2rem] leading-tight tracking-[-0.025em] text-ink sm:text-[2.6rem]">
                  Cek Estimasi Biaya Tugasmu Seketika.
                </h2>
                <p className="mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 font-medium">
                  Tidak perlu menunggu admin membalas pesan untuk tahu biaya. Coba simulasi contoh di bawah atau atur jumlah persismu di kalkulator mandiri.
                </p>
              </div>

              <Link
                href="/hitung"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-dark hover:shadow-lg shrink-0"
              >
                <Calculator className="size-4" />
                <span>Buka Kalkulator Lengkap</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Tiga Kartu Contoh Hitungan Nyata */}
            <div className="mt-10">
              <SimulasiContoh />
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 8. STRIP PEMBAYARAN RINGKAS (ShopeePay, GoPay, DANA)
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
                <span>Lihat panduan pembayaran →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 9. CTA AKHIR DENGAN DUA AKSI JELAS
         * ========================================================== */}
        <section id="cta-bawah" className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-[#0b1329] dark:bg-[#0c1527] dark:border dark:border-white/10 px-8 py-12 shadow-2xl sm:px-12 sm:py-16">
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
                  Tidak perlu bikin akun. Ketahui nominal pasti di awal sebelum kamu mengetik satu baris chat pun. Dikerjakan langsung oleh Mas Joki tanpa perantara.
                </p>

                {/* Dua Tombol Aksi: Buka Kalkulator & Chat WhatsApp */}
                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                  <Link
                    href="/hitung"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stabilo px-7 py-4 text-sm font-black text-slate-950 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-300 active:translate-y-0 cursor-pointer"
                  >
                    <Calculator className="size-4.5" />
                    <span>Hitung Biaya Sekarang</span>
                    <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href={waLink(waPesanUmum)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-xs transition-all duration-200 hover:bg-white/15 active:translate-y-0"
                  >
                    <MessageCircle className="size-4.5" />
                    <span>Chat Mas Joki di WhatsApp</span>
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
                    Mas Joki · Bantuan Tugas Kuliah
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
    </>
  );
}
