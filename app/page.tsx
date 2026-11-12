import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  MessageCircle,
  RefreshCcw,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";
import { AlurKerja } from "@/components/alur-kerja";
import { FaqRingkas } from "@/components/faq-ringkas";
import { HeroStaticReceipt } from "@/components/hero-static-receipt";
import { ServiceList } from "@/components/service-list";
import { SimulasiContoh } from "@/components/simulasi-contoh";
import { HighlightHumanizer } from "@/components/highlight-humanizer";
import { LacakKlik } from "@/components/lacak-klik";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TransisiHalaman } from "@/components/transisi-halaman";
import { Tilt } from "@/components/tilt";
import { QRIS_ENABLED, SITE_OWNER, SITE_URL } from "@/lib/config";
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
    label: "Mulai Rp 15.000",
    iconBg: "bg-black/10 text-[#101a33]",
  },
  {
    icon: Zap,
    label: "Pengerjaan mulai 6 jam",
    iconBg: "bg-black/10 text-[#101a33]",
  },
  {
    icon: CreditCard,
    label: "DP 50% dulu, lunas setelah selesai",
    iconBg: "bg-black/10 text-[#101a33]",
  },
  {
    icon: RefreshCcw,
    label: "Revisi 2× gratis",
    iconBg: "bg-black/10 text-[#101a33]",
  },
];

const garansiList = [
  {
    kode: "Pasal 01",
    judul: "Harga Terbuka Tanpa Tawar-Menawar",
    isi: "Nominal di nota terkunci sejak awal. Tidak ada biaya siluman atau tambahan dadakan di tengah pengerjaan.",
  },
  {
    kode: "Pasal 02",
    judul: "Garansi Uang Kembali 100%",
    isi: "Jika hasil tugas menyimpang dari brief dan tidak tuntas via revisi, dana dikembalikan 100% penuh.",
  },
  {
    kode: "Pasal 03",
    judul: "File Sumber Lengkap & Siap Edit",
    isi: "Mas Joki selalu menyerahkan file sumber (file mentah asli: .docx atau .pptx) yang bebas kamu edit dan simpan kapan pun.",
  },
  {
    kode: "Pasal 04",
    judul: "Kerahasiaan Naskah & Data Aman",
    isi: "Identitas mahasiswa, materi tugas, dan berkas naskah dijamin aman privat tanpa pernah dipublikasikan.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description:
    "Bantuan penulisan dan penyuntingan tugas: parafrase, humanisasi teks AI, makalah, PowerPoint, artikel jurnal, terjemahan, rapikan format Word, dan penurunan Turnitin.",
  areaServed: "ID",
  priceRange: "Rp 15.000–Rp 400.000",
  email: site.email,
  sameAs: ["https://www.threads.com/@adis.shop29"],
  address: { "@type": "PostalAddress", addressLocality: site.kota },
  openingHours: "Mo-Su 07:00-23:00",
};

export default function Home() {
  return (
    <>
      <SiteHeader />

      <TransisiHalaman id="konten">
        {/* ========================================================== *
         * 1. HERO UTAMA (NILAI JUAL: Harga Terbuka di Awal & Nota Transparan)
         * ========================================================== */}
        <section className="relative overflow-hidden border-b border-line bg-paper">
          {/* Academic Graph Grid Overlay */}
          <div
            aria-hidden
            className="kertas-grafik-halus pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_60%,transparent_100%)]"
          />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-12 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-12 lg:pb-20 lg:pt-16">
            <div>
              {/* Label Kategori + Satu Badge Unggulan */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="inline-flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span aria-hidden className="size-2 rounded-full bg-mint" />
                  <span>Jasa bantuan tugas</span>
                  <span aria-hidden className="text-muted/40">·</span>
                  <span className="font-medium">Online</span>
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint-soft px-3 py-1 text-xs font-bold text-mint">
                  <Sparkles aria-hidden className="size-3 text-mint" />
                  <span>Unggulan: Humanisasi Teks AI &amp; Penurunan Turnitin</span>
                </div>
              </div>

              {/* Headline & Sub-headline */}
              <h1 className="mt-5 font-display text-[2.5rem] leading-[1.06] tracking-[-0.035em] text-ink sm:text-[3.2rem] lg:text-[3.6rem]">
                Tugas kuliah beres, harga pasti kelihatan di awal.
              </h1>

              <p className="mt-4 max-w-[48ch] text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
                Buka kalkulator biaya dan lihat perkiraan biayanya seketika, sebelum menghubungi.
              </p>

              {/* Dua Tombol CTA Utama: Buka Kalkulator Biaya & Lihat Layanan */}
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <LacakKlik nama="cta_hitung" data={{ lokasi: "hero" }}>
                  <Link
                    href="/hitung"
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35 active:translate-y-0 cursor-pointer"
                  >
                    <Calculator className="size-4.5" />
                    <span>Buka Kalkulator Biaya</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                  </Link>
                </LacakKlik>
                <a
                  href="#layanan"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-line dark:border-line-strong bg-white dark:bg-[#162035] px-7 py-4 text-sm font-bold text-ink dark:text-slate-100 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:bg-brand dark:hover:bg-brand hover:text-white dark:hover:border-brand active:translate-y-0"
                >
                  <span>Lihat Layanan Unggulan</span>
                  <ArrowRight className="size-4" />
                </a>
              </div>

              {/* Tiga Poin Kepercayaan dalam Satu Baris Ringkas */}
              <ul className="mt-8 flex flex-col gap-1.5 text-xs font-semibold text-slate-600">
                {[
                  "Harga pasti di awal",
                  "Dikerjakan langsung oleh Mas Joki",
                  "File sumber (.docx / .pptx) disertakan",
                ].map((poin) => (
                  <li key={poin} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 aria-hidden className="size-3.5 shrink-0 text-mint" />
                    <span>{poin}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sisi Kanan: Nota Mini Statis (Pajangan Nilai Jual) */}
            <div className="relative">
              <HeroStaticReceipt />
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 2. STRIP RINGKASAN CEPAT (band stabilo berjalan)
         * ========================================================== */}
        <section
          aria-label="Ringkasan keunggulan layanan Mas Joki"
          className="overflow-hidden border-b border-ink/15 bg-stabilo py-3.5 sm:py-4"
        >
          <div className="[mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]">
            <div className="band-berjalan">
              {[0, 1, 2, 3].map((salinan) => (
                <ul
                  key={salinan}
                  aria-hidden={salinan > 0 ? true : undefined}
                  data-duplikat={salinan > 0 ? "" : undefined}
                  className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
                >
                  {stripRingkasan.map((item) => (
                    <li
                      key={item.label}
                      className="flex shrink-0 items-center gap-2.5 whitespace-nowrap"
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full ${item.iconBg}`}
                      >
                        <item.icon className="size-3.5" aria-hidden />
                      </span>
                      <span className="text-xs font-bold leading-snug text-ink sm:text-sm">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 3. HIGHLIGHT LAYANAN UNGGULAN (Hanya Populer, Lainnya di /jasa)
         * ========================================================== */}
        <section
          id="layanan"
          className="relative overflow-hidden border-b border-line bg-paper-2 py-14 sm:py-20 scroll-mt-16"
        >
          <div
            aria-hidden
            className="kertas-grafik pointer-events-none absolute inset-0 opacity-25"
          />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
                  Layanan Unggulan &amp; Paling Banyak Dipesan.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 font-medium">
                  Humanisasi teks AI, penurunan Turnitin manual, dan asistensi tugas akademik.
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

            <div className="reveal mt-10">
              <ServiceList hanyaHighlight={true} />
            </div>
          </div>
        </section>

        {/* Humanizer mandiri: jalur kedua, pakai token sendiri */}
        <HighlightHumanizer />

        {/* ========================================================== *
         * 4. NILAI JUAL: EMPAT GARANSI INTEGRITAS
         * ========================================================== */}
        <section
          id="nilai-jual"
          className="relative overflow-hidden border-b border-line bg-paper-2 py-14 sm:py-20 scroll-mt-16"
        >
          <div
            aria-hidden
            className="kertas-titik pointer-events-none absolute inset-0 opacity-30"
          />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">              <div className="max-w-xl">
              <span className="stempel-hijau">✓ PIAGAM INTEGRITAS</span>
              <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
                Empat Garansi Transparansi Mas Joki.
              </h2>
              <p className="mt-2 text-sm text-slate-600 font-medium">
                Yang Mas Joki pegang di setiap pesanan.
              </p>
            </div>

            <div className="reveal mt-10 overflow-hidden rounded-2xl border border-line bg-card">
              {garansiList.map((item) => (
                <article
                  key={item.judul}
                  className="grid gap-2 border-b border-line p-6 last:border-b-0 sm:grid-cols-[7.5rem_1fr] sm:gap-6 sm:p-7"
                >
                  <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted">
                    {item.kode}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold tracking-tight text-ink sm:text-lg">
                      {item.judul}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 font-medium">
                      {item.isi}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 5. PROFIL PEMILIK (NILAI JUAL: Guru Aktif S.Pd, Tanpa Pihak Ketiga)
         * ========================================================== */}
        <section id="profil-pemilik" className="border-b border-line bg-paper py-12 sm:py-16">
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
                  Guru aktif bergelar S.Pd yang mengerjakan sendiri semua pesanan di sini. Paham format yang diminta dosen: sitasi rapi, struktur benar, bahasa enak dibaca.
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
          className="relative overflow-hidden border-b border-line bg-paper py-16 sm:py-20 scroll-mt-16"
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
                <h2 className="font-display text-[2.2rem] leading-tight tracking-[-0.025em] text-ink sm:text-[2.6rem]">
                  Cek Estimasi Biaya Tugasmu Seketika.
                </h2>
                <p className="mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 font-medium">
                  Tanpa akun. Nominal muncul sebelum kamu mengetik satu baris chat pun.
                </p>
              </div>

              <Link
                href="/hitung"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark hover:shadow-lg shrink-0"
              >
                <Calculator className="size-4" />
                <span>Buka Kalkulator Lengkap</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Tiga Kartu Contoh Hitungan Nyata */}
            <div className="reveal mt-10">
              <SimulasiContoh />
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 8. POSTER HARGA (NILAI JUAL: SATU LEMBAR, SEMUA TARIF)
         * ========================================================== */}
        <section
          id="poster-harga"
          className="relative overflow-hidden border-b border-line bg-paper-2 py-14 sm:py-20 scroll-mt-16"
        >
          <div
            aria-hidden
            className="kertas-titik pointer-events-none absolute inset-0 opacity-25"
          />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <span className="stempel">POSTER HARGA</span>
              <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
                Satu lembar, semua tarif kelihatan.
              </h2>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-slate-600 font-medium">
                Dihitung dari mesin harga yang sama dengan kalkulator, bukan angka tempelan.
              </p>

              <ul className="mt-6 space-y-2.5">
                <li className="flex items-start gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
                  <span>Delapan layanan inti, lengkap dengan satuan harganya.</span>
                </li>
                <li className="flex items-start gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                  <span>Tidak ada &quot;mulai dari&quot; tanpa satuan — semua angka bisa dicek ulang di kalkulator.</span>
                </li>
                <li className="flex items-start gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
                  <span>Bisa diunduh dan dibagikan tanpa perlu screenshot berantakan.</span>
                </li>
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <LacakKlik nama="poster_unduh" data={{ lokasi: "poster" }}>
                  <a
                    href="/poster"
                    download="poster-harga-mas-joki.png"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg active:translate-y-0"
                  >
                    <Download className="size-4" />
                    <span>Unduh poster (PNG)</span>
                  </a>
                </LacakKlik>
                <Link
                  href="/hitung"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand group"
                >
                  <span>Hitung biaya persisnya</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </Link>
              </div>

              <p className="mt-3 text-xs font-medium text-muted">
                Ukuran 1080 × 1350 px — pas untuk status WhatsApp atau feed Instagram.
              </p>
            </div>

            <figure className="relative mx-auto w-full max-w-[360px]">
              <Tilt maks={4}>
                <div className="rotate-[1.2deg] overflow-hidden rounded-xl border border-line bg-white p-2 shadow-xl shadow-ink/10">
                  <Image
                    src="/poster"
                    alt="Poster daftar harga Mas Joki: humanisasi teks AI, parafrase, makalah, artikel jurnal, PowerPoint, rapikan Word, terjemahan, dan desain visual."
                    width={1080}
                    height={1350}
                    sizes="(max-width: 640px) 320px, 360px"
                    quality={80}
                    className="h-auto w-full rounded-md"
                  />
                </div>
                <figcaption className="mt-3 text-center text-xs font-semibold text-muted">
                  Poster harga Mas Joki · 1080 × 1350 px
                </figcaption>
              </Tilt>
            </figure>
          </div>
        </section>

        {/* ========================================================== *
         * 9. STRIP PEMBAYARAN RINGKAS (ShopeePay, GoPay, DANA)
         * ========================================================== */}
        <section className="border-b border-line bg-paper py-5">
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
                <span>Lihat panduan pembayaran</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================== *
         * 9. CTA AKHIR DENGAN DUA AKSI JELAS
         * ========================================================== */}
        <FaqRingkas />

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

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
              <div>
                <h2 className="font-display text-[2.2rem] leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.8rem]">
                  Cek harga tugasmu sekarang.
                  <br />
                  <span className="text-stabilo">
                    Transparan &amp; tanpa ribet.
                  </span>
                </h2>

                <p className="mt-3 max-w-[46ch] text-xs sm:text-sm leading-relaxed text-white/80">
                  Nominal sudah kelihatan sebelum kamu chat. Tanpa akun, tanpa tunggu balasan admin.
                </p>

                {/* Dua Tombol Aksi: Buka Kalkulator & Chat WhatsApp */}
                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/hitung"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-stabilo px-7 py-4 text-sm font-black text-slate-950 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-amber-300 active:translate-y-0 cursor-pointer"
                  >
                    <Calculator className="size-4.5" />
                    <span>Hitung Biaya Sekarang</span>
                    <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href={waLink(waPesanUmum)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-xs transition duration-200 hover:bg-white/15 active:translate-y-0"
                  >
                    <MessageCircle className="size-4.5" />
                    <span>Chat Mas Joki di WhatsApp</span>
                    <ExternalLink className="size-3.5 opacity-60" />
                  </a>
                </div>
              </div>

              {/* Maskot Avatar di CTA Akhir */}
              <div className="hidden lg:flex justify-end">
                <div className="relative size-52 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/5 shadow-2xl backdrop-blur-sm">
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
      </TransisiHalaman>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
