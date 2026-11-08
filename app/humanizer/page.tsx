import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HumanizerWorkspace } from "@/components/humanizer/humanizer-workspace";
import { ShieldCheck, Sparkles, Zap, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Humanizer AI (Bahasa Sederhana Alami) | Mas Joki",
  description:
    "Ubah naskah akademik, formal, atau draf buatan AI menjadi bahasa sehari-hari yang sangat sederhana, agak polos, dan mudah dipahami tanpa mengubah angka desimal atau sitasi referensi.",
  alternates: { canonical: "/humanizer" },
};

export default function HumanizerPage() {
  return (
    <>
      <SiteHeader />

      <main id="konten" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold text-muted"
        >
          <Link href="/" className="transition-colors hover:text-brand">
            Beranda
          </Link>
          <span aria-hidden className="text-muted/60">
            /
          </span>
          <span className="font-bold text-ink">Humanizer AI (Bahasa Sederhana Alami)</span>
        </nav>

        {/* Hero Section */}
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-brand-soft text-brand border border-brand/20">
            <Sparkles className="size-3.5" />
            <span>Skill: Bahasa Sederhana Alami</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] font-bold text-ink tracking-tight leading-tight">
            Humanizer AI — Bahasa Sederhana Alami.
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
            Menulis ulang teks akademik, skripsi, dan artikel formal menjadi bahasa sehari-hari
            yang sangat sederhana, agak polos, dan mengalir apa adanya seperti tulisan orang yang
            belum terbiasa menulis, tanpa mengubah fakta, angka desimal, persentase, atau sitasi referensi.
          </p>
        </div>

        {/* Humanizer Workspace Component */}
        <HumanizerWorkspace />

        {/* Feature Cards / How It Works */}
        <section className="pt-10 border-t border-line space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-ink">
              Mengapa AI Humanizer Mas Joki Berbeda?
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Dirancang untuk naskah akademik berbahasa Indonesia, dari abstrak sampai daftar
              pustaka.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-card border border-line rounded-2xl p-5 shadow-xs space-y-2.5">
              <div className="size-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Sparkles className="size-5" />
              </div>
              <h3 className="font-display font-bold text-base text-ink">
                Bahasa Sederhana & Polos
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Naskah ditulis ulang dengan kata-kata umum sehari-hari yang bersahaja seperti penjelasan
                lisan seseorang, tanpa susunan kalimat yang terlalu abstrak.
              </p>
            </div>

            <div className="bg-white dark:bg-card border border-line rounded-2xl p-5 shadow-xs space-y-2.5">
              <div className="size-10 rounded-xl bg-mint-soft text-mint flex items-center justify-center font-bold">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="font-display font-bold text-base text-ink">
                Pecah Kalimat Padat
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Memecah kalimat majemuk panjang yang bertele-tele menjadi kalimat pendek yang mudah dibaca
                dengan penghubung dasar: <i>jadi</i>, <i>karena</i>, <i>tetapi</i>, <i>lalu</i>, <i>setelah itu</i>.
              </p>
            </div>

            <div className="bg-white dark:bg-card border border-line rounded-2xl p-5 shadow-xs space-y-2.5">
              <div className="size-10 rounded-xl bg-stabilo/30 text-ink flex items-center justify-center font-bold">
                <BookOpen className="size-5" />
              </div>
              <h3 className="font-display font-bold text-base text-ink">
                100% Preservasi Sitasi & Data
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Sitasi dalam kurung seperti <code>(Slavin, 2015)</code>, istilah teknis (PTKK, TGT, KKTP),
                angka desimal <code>75,05</code>, dan persentase dipertahankan secara utuh.
              </p>
            </div>

            <div className="bg-white dark:bg-card border border-line rounded-2xl p-5 shadow-xs space-y-2.5">
              <div className="size-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center font-bold">
                <Zap className="size-5" />
              </div>
              <h3 className="font-display font-bold text-base text-ink">
                Pembersihan Klise AI
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Menyingkirkan kata klise AI (seperti <i>peserta didik</i> → <i>siswa</i>, <i>mengimplementasikan</i> → <i>menggunakan</i>,
                dan <i>berdasarkan temuan</i> → <i>dari hasil yang ditemukan</i>).
              </p>
            </div>
          </div>
        </section>

        {/* Token Pricing Info & WhatsApp Help */}
        <section className="bg-paper-2/70 border border-line rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-ink">
                Butuh Bantuan Pengerjaan Skripsi / Tugas Penuh?
              </h3>
              <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
                Kalau kamu tidak punya waktu untuk mengedit sendiri atau tugasmu memiliki kebutuhan data
                khusus (SPSS, coding, analisis statistik), serahkan langsung ke Mas Joki dengan pengerjaan
                manual dan garansi revisi.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/hitung"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold shadow-xs transition"
              >
                Hitung Biaya Manual
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
