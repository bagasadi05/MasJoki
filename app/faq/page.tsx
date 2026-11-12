import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, MessageCircle, RotateCcw, ShieldCheck, Zap } from "lucide-react";
import { FaqList } from "@/components/faq-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { faq } from "@/content/faq";
import { site, waLink, waPesanUmum } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tanya Jawab & FAQ Lengkap Asistensi Tugas Kuliah",
  description:
    "Pertanyaan seputar keamanan privasi, revisi 2x gratis, metode pembayaran e-wallet, waktu pengerjaan tugas, dan format file di Mas Joki.",
  alternates: { canonical: "/faq" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function HalamanFaq() {
  return (
    <>
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
          <span className="font-bold text-ink">FAQ</span>
        </nav>

        {/* Heading */}
        <div className="mt-6 max-w-3xl">
                    <h1 className="mt-3 font-display text-[2.3rem] leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3rem]">
            Pertanyaan yang Sering Ditanyakan.
          </h1>
          <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-relaxed text-ink-soft">
            Semua hal yang perlu kamu ketahui seputar privasi dokumen, mekanisme revisi,
            sistem pembayaran, hingga penyerahan file akhir.
          </p>
        </div>

        {/* 2 Kolom Layout */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16">
          {/* Kolom Kiri: Contact Box & Trust Highlights */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-paper-2/80 p-6 sm:p-7 shadow-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/25 bg-mint-soft px-2.5 py-0.5 text-xs font-bold text-mint">
                <span className="size-1.5 rounded-full bg-mint " />
                Bantuan Langsung
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-ink">
                Butuh Konsultasi Langsung?
              </h2>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                Punya pertanyaan di luar daftar ini atau tugas dengan format kampus yang sangat khusus?
                Admin membalas pada jam operasional 07.00–23.00 WIB.
              </p>

              <a
                href={waLink(waPesanUmum)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-sm font-bold text-white shadow-md shadow-brand/25 transition hover:bg-brand-dark hover:shadow-lg"
              >
                <MessageCircle className="size-4.5" />
                <span>Chat Admin Mas Joki via WhatsApp</span>
                <ExternalLink className="size-4 opacity-70" />
              </a>

              <p className="mt-3 text-center text-xs text-muted">
                Jam operasional: {site.jamOperasional}
              </p>
            </div>

            {/* Quick Revisions */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm space-y-4">
              <p className="font-bold text-ink text-sm">
                Yang Kamu Dapat:
              </p>

              <div className="flex items-start gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-lilac-soft text-lilac shrink-0">
                  <ShieldCheck className="size-4.5" />
                </div>
                <div>
                  <p className="font-bold text-ink text-sm">Privasi Dokumen Terjaga</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    Data kampus, nama mahasiswa, dan materi tugas dienkripsi &amp; tidak pernah dipublikasikan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-line/60 pt-3">
                <div className="grid size-9 place-items-center rounded-xl bg-mint-soft text-mint shrink-0">
                  <RotateCcw className="size-4.5" />
                </div>
                <div>
                  <p className="font-bold text-ink text-sm">Revisi 2× Gratis</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    Bila ada arahan awal dosen yang belum terpenuhi, admin langsung revisi tanpa biaya tambahan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-line/60 pt-3">
                <div className="grid size-9 place-items-center rounded-xl bg-amber-soft text-amber shrink-0">
                  <Zap className="size-4.5" />
                </div>
                <div>
                  <p className="font-bold text-ink text-sm">Selesai Tepat Waktu</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    Tenggat waktu yang kamu pilih di awal kami kunci dan patuhi dengan disiplin penuh.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Accordion FAQ */}
          <div>
            <FaqList />
          </div>
        </div>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
