import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, ExternalLink, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TestimoniNyata } from "@/components/testimoni-nyata";
import { TransisiHalaman } from "@/components/transisi-halaman";
import { SITE_URL } from "@/lib/config";
import { site, waLink, waPesanUmum } from "@/lib/site";

const PAGE_DESCRIPTION =
  "Lima tangkapan layar chat WhatsApp pesanan nyata Mas Joki tanpa rating karangan, dengan identitas klien disamarkan sesuai Pasal 04 Kerahasiaan.";

export const metadata: Metadata = {
  title: "Testimoni & Bukti Pengerjaan Nyata",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/testimoni" },
  openGraph: {
    title: `Testimoni & Bukti Pengerjaan Nyata · ${site.name}`,
    description: PAGE_DESCRIPTION,
    url: "/testimoni",
    type: "website",
    locale: "id_ID",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Testimoni",
      item: `${SITE_URL}/testimoni`,
    },
  ],
};

export default function HalamanTestimoni() {
  return (
    <>
      <SiteHeader />

      <TransisiHalaman id="konten">
        <section className="border-b border-line bg-paper pt-10 pb-12 sm:pt-14 sm:pb-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            {/* Breadcrumb */}
            <nav
              aria-label="Remah roti"
              className="flex items-center gap-2 text-xs font-semibold text-ink-soft"
            >
              <Link href="/" className="transition-colors hover:text-brand">
                Beranda
              </Link>
              <span aria-hidden className="text-muted">
                /
              </span>
              <span className="font-bold text-ink">Testimoni</span>
            </nav>

            <div className="mt-7">
              <span className="stempel-hijau">✓ ARSIP CHAT NYATA</span>
              <h1 className="mt-3 max-w-3xl font-display text-[2.3rem] leading-[1.08] tracking-[-0.03em] text-balance text-ink sm:text-[3.1rem]">
                Bukti pengerjaan langsung dari WhatsApp.
              </h1>

              <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-[58ch] space-y-3">
                  <p className="text-sm leading-relaxed font-medium text-ink-soft md:text-base">
                    Lima tangkapan layar percakapan pesanan sungguhan antara klien dan Mas Joki—tanpa rating bintang fiktif, tanpa angka pelanggan karangan, dan tanpa klaim jaminan skor mutlak.
                  </p>
                  <p className="inline-flex items-start gap-2 rounded-xl border border-mint/25 bg-mint-soft/75 px-3.5 py-2.5 text-xs leading-relaxed font-semibold text-ink">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
                    <span>
                      Sesuai Pasal 04 Kerahasiaan, nomor telepon, nama mahasiswa, kampus, email, serta judul spesifik naskah telah disamarkan secara permanen sebelum dipublikasikan.
                    </span>
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Link
                    href="/hitung"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark hover:shadow-lg dark:bg-[#2f4fd8] dark:hover:bg-[#2643c4]"
                  >
                    <Calculator className="size-4" aria-hidden />
                    <span>Buka Kalkulator Biaya</span>
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <a
                    href={waLink(waPesanUmum)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-line bg-card px-6 py-3.5 text-sm font-bold text-ink shadow-2xs transition-colors hover:border-brand hover:bg-brand hover:text-white dark:border-line-strong"
                  >
                    <span>Tanya via WhatsApp</span>
                    <ExternalLink className="size-3.5 opacity-70" aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TestimoniNyata />
      </TransisiHalaman>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
