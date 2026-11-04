import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CreditCard,
  ExternalLink,
  FileText,
  FolderArchive,
  Lock,
  MessageCircle,
  Rocket,
  RotateCcw,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { CalculatorProvider } from "@/components/calculator-context";
import { HeroLivePreview } from "@/components/hero-live-preview";
import { MarqueeTicker } from "@/components/marquee-ticker";
import { ServiceList } from "@/components/service-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site, waLink, waPesanUmum } from "@/lib/site";

const alasan = [
  {
    judul: "Harga Terbuka Tanpa Tawar-Menawar",
    isi: "Gak perlu nanya 'berapaan min?'. Angka di nota dikunci sejak awal. Tidak ada biaya tersembunyi yang mendadak muncul di tengah jalan.",
    icon: Lock,
    bg: "bg-blue-50/70 border-blue-200 text-blue-950",
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    judul: "Garansi 2× Revisi Gratis",
    isi: "Setiap pesanan dilindungi garansi revisi gratis sebanyak dua kali sesuai instruksi atau format kampus yang kamu kirimkan.",
    icon: RotateCcw,
    bg: "bg-emerald-50/70 border-emerald-200 text-emerald-950",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    judul: "File Sumber Lengkap & Siap Edit",
    isi: "Kami selalu menyerahkan file mentah: Word (.docx), PowerPoint (.pptx), atau format asli lainnya. Bebas kamu kembangkan kapan pun.",
    icon: FolderArchive,
    bg: "bg-amber-50/70 border-amber-200 text-amber-950",
    iconBg: "bg-amber-100 text-amber-700",
  },
  {
    judul: "Kerahasiaan Terjaga 100%",
    isi: "Data mahasiswa, nama kampus, materi tugas, dan berkas yang kamu kirim dijamin aman, privat, dan tidak pernah dipublikasikan.",
    icon: ShieldCheck,
    bg: "bg-purple-50/70 border-purple-200 text-purple-950",
    iconBg: "bg-purple-100 text-purple-700",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description:
    "Bantuan penulisan dan penyuntingan tugas: parafrase, humanisasi teks AI, makalah, PowerPoint, artikel jurnal, terjemahan, dan perapian format Word.",
  areaServed: "ID",
  priceRange: "Rp15.000–Rp250.000",
  email: site.email,
  address: { "@type": "PostalAddress", addressLocality: site.kota },
  openingHours: "Mo-Su 07:00-23:00",
};

export default function Home() {
  return (
    <CalculatorProvider>
      <SiteHeader />

      <main id="konten">
        {/* ---------------------------------------------------------- *
         * Hero Section (Inspirasi Modern Manuru + Ciri Khas Mas Joki)
         * ---------------------------------------------------------- */}
        <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-paper via-white to-paper-2/40 aurora-bg">
          <div
            aria-hidden
            className="kertas-titik pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(75%_65%_at_50%_0%,#000,transparent)]"
          />

          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-16">
            <div>
              {/* Badge Friendly Mascot Intro */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-brand/20 bg-brand-soft/90 p-1 pr-4 text-[0.8rem] font-bold text-brand shadow-xs backdrop-blur-xs">
                <div className="relative size-7 overflow-hidden rounded-full border-2 border-brand/30 bg-white ring-1 ring-white">
                  <Image
                    src="/mas-joki.jpg"
                    alt="Maskot Mas Joki"
                    width={28}
                    height={28}
                    className="size-full object-cover object-top"
                  />
                </div>
                <span>Halo! Kenalkan Mas Joki</span>
                <span className="text-brand/40">✦</span>
                <span>Asisten Akademik Transparan</span>
              </div>

              <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.035em] text-ink sm:text-[3.4rem] lg:text-[3.8rem]">
                Tugas kuliah beres,{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  harga pasti kelihatan
                </span>{" "}
                di awal.
              </h1>

              <p className="mt-5 max-w-[50ch] text-[1.04rem] leading-relaxed text-ink-soft sm:text-[1.1rem]">
                Gak perlu lagi nunggu DM dibalas berjam-jam cuma buat tahu harga.
                Parafrase, humanisasi teks AI, makalah, PowerPoint, jurnal, sampai rapikan Word —
                cek estimasi biaya dan nota transparan seketika!
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <Link
                  href="/hitung"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-7 py-4 text-[0.96rem] font-extrabold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35 active:translate-y-0 cursor-pointer"
                >
                  <Calculator className="size-4.5" />
                  <span>Hitung Biaya Sekarang</span>
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href={waLink(waPesanUmum)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white px-7 py-4 text-[0.96rem] font-bold text-ink shadow-xs transition-all duration-200 hover:-translate-y-1 hover:bg-ink hover:text-white active:translate-y-0"
                >
                  <MessageCircle className="size-4.5 text-emerald-600" />
                  <span>Chat Mas Joki</span>
                  <ExternalLink className="size-3.5 opacity-60" />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5 text-[0.76rem] font-semibold text-muted">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-line px-3 py-1.5 shadow-2xs">
                  <Zap className="size-3.5 text-amber-500 fill-amber-500" />
                  <span>Pengerjaan Mulai 6 Jam</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-line px-3 py-1.5 shadow-2xs">
                  <RotateCcw className="size-3.5 text-emerald-600" />
                  <span>Garansi 2× Revisi</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-line px-3 py-1.5 shadow-2xs">
                  <FileText className="size-3.5 text-blue-600" />
                  <span>File Sumber Word &amp; PPT</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-line px-3 py-1.5 shadow-2xs">
                  <CreditCard className="size-3.5 text-purple-600" />
                  <span>E-Wallet Resmi</span>
                </span>
              </div>
            </div>

            {/* Visual Khas: Showcase Maskot 3D Mas Joki + Live Quick Estimator */}
            <div className="relative">
              <HeroLivePreview />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- *
         * Running Marquee Ticker (Modern Touch)
         * ---------------------------------------------------------- */}
        <MarqueeTicker />

        {/* ---------------------------------------------------------- *
         * Layanan Kami (Katalog Grid Ceria & Penuh Warna)
         * ---------------------------------------------------------- */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand shadow-2xs">
                <BookOpen className="size-3.5" />
                <span>Solusi Tugas Akademik</span>
              </span>
              <h2 className="mt-3 font-display text-[2.1rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.7rem]">
                Delapan Layanan Bantuan Tugas.
              </h2>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
                Pilih layanan yang kamu butuhkan. Hitung estimasi biaya langsung di kalkulator atau buka detailnya.
              </p>
            </div>

            <Link
              href="/jasa"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-ink hover:border-brand hover:text-brand shadow-2xs transition-colors shrink-0"
            >
              <span>Katalog Layanan Lengkap</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-12">
            <ServiceList />
          </div>
        </section>

        {/* ---------------------------------------------------------- *
         * Bento Grid Alasan (Kenapa Memilih Mas Joki)
         * ---------------------------------------------------------- */}
        <section className="border-y border-line bg-paper-2/50 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-900 shadow-2xs">
                  <Star className="size-3.5 text-emerald-700 fill-emerald-600" />
                  <span>Nilai Kepercayaan</span>
                </span>
                <h2 className="mt-3 font-display text-[2.1rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.7rem]">
                  Alasan Mahasiswa Selalu Balik Lagi.
                </h2>
                <p className="mt-3 text-[0.98rem] text-ink-soft">
                  Pengalaman asistensi tugas yang jujur, aman, dan tanpa rasa waswas.
                </p>
              </div>

              <Link
                href="/cara-kerja"
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-brand shadow-xs transition-colors shrink-0"
              >
                <span>Pelajari Cara Kerja &amp; Pembayaran</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {alasan.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.judul}
                    className={`rounded-3xl border p-7 transition-all duration-300 hover:shadow-md ${item.bg}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`grid size-11 place-items-center rounded-2xl shadow-2xs ${item.iconBg}`}
                      >
                        <Icon className="size-5.5" />
                      </div>
                      <h3 className="font-display text-[1.25rem] font-bold tracking-tight">
                        {item.judul}
                      </h3>
                    </div>
                    <p className="mt-3.5 text-[0.9rem] leading-relaxed opacity-90">
                      {item.isi}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- *
         * CTA Banner Akhir dengan Maskot Mas Joki
         * ---------------------------------------------------------- */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-slate-900 to-indigo-950 px-8 py-14 shadow-2xl sm:px-14 sm:py-18">
            <div aria-hidden className="pita absolute inset-x-0 top-0 h-[4px]" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-brand/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -bottom-16 size-80 rounded-full bg-purple-600/25 blur-3xl"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-xs">
                  <Rocket className="size-3.5 text-amber-400" />
                  <span>Siap Selesaikan Tugasmu?</span>
                </span>

                <h2 className="mt-4 font-display text-[2.3rem] leading-[1.08] tracking-[-0.02em] text-white sm:text-[3rem]">
                  Cek harga tugasmu sekarang.
                  <br />
                  <span className="text-stabilo">
                    Transparan &amp; tanpa ribet.
                  </span>
                </h2>

                <p className="mt-4 max-w-[46ch] text-[0.98rem] leading-relaxed text-white/80">
                  Tidak perlu bikin akun. Tidak ada biaya konsultasi tersembunyi.
                  Ketahui nominal pasti sebelum kamu mengetik satu baris chat pun.
                </p>

                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                  <Link
                    href="/hitung"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stabilo px-7 py-4 text-[0.94rem] font-extrabold text-ink shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-white active:translate-y-0 cursor-pointer"
                  >
                    <Calculator className="size-4.5" />
                    <span>Hitung Biaya Sekarang</span>
                    <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href={waLink(waPesanUmum)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/5 px-7 py-4 text-[0.94rem] font-bold text-white backdrop-blur-xs transition-all duration-200 hover:bg-white/15 active:translate-y-0"
                  >
                    <MessageCircle className="size-4.5" />
                    <span>Chat WhatsApp</span>
                    <ExternalLink className="size-3.5 opacity-60" />
                  </a>
                </div>
              </div>

              {/* Avatar Mascot in final CTA */}
              <div className="hidden lg:flex justify-end">
                <div className="relative size-56 overflow-hidden rounded-3xl border-4 border-white/20 bg-white/5 shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/mas-joki.jpg"
                    alt="Maskot Mas Joki Jempol"
                    width={224}
                    height={224}
                    className="size-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3.5 inset-x-0 text-center font-display text-xs font-bold text-white">
                    Mas Joki Siap Membantu 👍
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
