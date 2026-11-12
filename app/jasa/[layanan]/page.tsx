import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Nota } from "@/components/nota";
import { ServiceIcon } from "@/components/service-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TransisiHalaman } from "@/components/transisi-halaman";
import { StempelLayanan } from "@/components/stempel-layanan";
import { KONTEN_LAYANAN } from "@/content/layanan";
import { aksenLayanan } from "@/lib/aksen";
import { rupiah } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import {
  BASIS_LABEL,
  CATALOG_SERVICES,
  SERVICES,
  getService,
  priceLabel,
  type ServiceId,
} from "@/lib/services";
import { site, waLink } from "@/lib/site";

const SLUG = new Set(SERVICES.map((service) => service.id));

interface HalamanProps {
  params: Promise<{ layanan: string }>;
}

export const instant = false;

function cariLayanan(slug: string) {
  return SLUG.has(slug as ServiceId) ? getService(slug) : null;
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ layanan: service.id }));
}

export async function generateMetadata({
  params,
}: HalamanProps): Promise<Metadata> {
  const { layanan } = await params;
  const service = cariLayanan(layanan);
  if (!service) return {};

  const judul = `Jasa ${service.name}`;
  const tarif = service.customQuoteOnly ? "Minta Penawaran" : `mulai ${rupiah(service.pricePerChunk)}`;

  return {
    title: `${judul} — ${tarif}`,
    description: `${service.promise} Dikerjakan langsung oleh Mas Joki tanpa perantara. Harga ${priceLabel(service)}, total dihitung di depan sebelum kamu memesan.`,
    alternates: { canonical: `/jasa/${service.id}` },
    openGraph: {
      title: `${judul} · ${site.name}`,
      description: service.promise,
      type: "website",
      locale: "id_ID",
    },
  };
}

export default async function HalamanLayanan({ params }: HalamanProps) {
  const { layanan } = await params;
  const service = cariLayanan(layanan);
  if (!service) notFound();

  const konten = KONTEN_LAYANAN[service.id];
  const aksen = aksenLayanan(service.id);

  // Contoh harga simulasi: bawaan jumlah dan tenggat normal (4–6 hari)
  const contoh = computePrice(service, service.defaultQty, "normal", "standar");

  const lain = CATALOG_SERVICES.filter((item) => item.id !== service.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `Jasa ${service.name}`,
        serviceType: service.name,
        description: service.promise,
        areaServed: "ID",
        provider: {
          "@type": "ProfessionalService",
          name: site.name,
          email: site.email,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "IDR",
          price: service.pricePerChunk,
          description: `${priceLabel(service)}, total menyesuaikan jumlah dan tenggat.`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: konten.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Beranda", item: "/" },
          { "@type": "ListItem", position: 2, name: "Layanan", item: "/jasa" },
          {
            "@type": "ListItem",
            position: 3,
            name: service.name,
            item: `/jasa/${service.id}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <SiteHeader />

      <TransisiHalaman id="konten">
        {/* Hero Section Layanan */}
        <section className={`border-b border-line ${aksen.wash}`}>
          <div className="mx-auto max-w-6xl px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
            <nav aria-label="Remah roti" className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Link href="/" className="transition-colors hover:text-brand">
                Beranda
              </Link>
              <span aria-hidden className="text-slate-400">/</span>
              <Link href="/jasa" className="transition-colors hover:text-brand">
                Layanan
              </Link>
              <span aria-hidden className="text-slate-400">/</span>
              <span className="font-bold text-ink">{service.name}</span>
            </nav>

            <div className="mt-8 grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl border border-brand/20 bg-white shadow-2xs">
                    <ServiceIcon id={service.id} className="size-6" />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${aksen.chip}`}>
                    {priceLabel(service)}
                  </span>
                </div>

                <h1 className="mt-4 font-display text-[2.4rem] leading-[1.06] tracking-[-0.03em] text-ink sm:text-[3.2rem]">
                  Jasa {service.name.toLowerCase()}
                </h1>

                <p className="mt-4 max-w-[54ch] text-sm sm:text-base leading-relaxed text-slate-700">
                  {konten.intro}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1">
                    Estimasi pengerjaan: <strong className="text-ink">{service.turnaround}</strong>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1">
                    Termasuk <strong>2× revisi</strong>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1">
                    Dikerjakan langsung <strong>Mas Joki</strong>
                  </span>
                </div>

                {service.customQuoteOnly ? (
                  <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                    <Link
                      href="/hitung?mode=penawaran&layanan=turnitin_ai"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-4 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35"
                    >
                      <span>Minta Penawaran Turnitin &amp; AI</span>
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/hitung"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-4 text-sm font-bold text-ink hover:bg-paper-2 transition-colors"
                    >
                      <span>Buka Kalkulator Utama</span>
                    </Link>
                  </div>
                ) : service.id === "jurnal" ? (
                  <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                    <Link
                      href="/hitung?layanan=artikel_ilmiah"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35"
                    >
                      <span>Pesan Artikel Ilmiah (Rp 250rb)</span>
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/hitung?layanan=jurnal_submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand bg-white px-6 py-4 text-sm font-bold text-brand hover:bg-brand hover:text-white transition-colors"
                    >
                      <span>Pesan Jurnal Submit (Rp 400rb)</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                    <Link
                      href={`/jasa/${service.id}/order`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-4 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35"
                    >
                      <span>Pesan {service.name} Sekarang</span>
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href={`/hitung?layanan=${service.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-4 text-sm font-bold text-ink hover:bg-paper-2 transition-colors"
                    >
                      <span>Simulasi Kalkulator</span>
                    </Link>
                  </div>
                )}
              </div>

              <div>
                {service.customQuoteOnly ? (
                  <Nota
                    lines={[
                      {
                        label: "Penurunan Skor Turnitin & AI",
                        detail: "Pemeriksaan naskah & kesepakatan target skor",
                        amount: 0,
                        kind: "base",
                      },
                    ]}
                    total={0}
                    note="Biaya ditentukan langsung secara transparan lewat formulir penawaran setelah Mas Joki memeriksa panjang dokumen dan skor awal."
                    stamp="Harga Transparan"
                    code="QUOTE-TI"
                    aksen={aksen}
                    className="mx-auto max-w-md"
                  />
                ) : (
                  <Nota
                    lines={contoh.lines}
                    total={contoh.total}
                    note={
                      service.id === "jurnal"
                        ? "Contoh simulasi tingkat Artikel Ilmiah dengan tenggat normal (4–6 hari kerja, +10%)."
                        : `Contoh simulasi ${contoh.qty} ${BASIS_LABEL[service.basis]} dengan tenggat normal (4–6 hari kerja, +10%).`
                    }
                    stamp="Harga Transparan"
                    code="SIM-DETAIL"
                    aksen={aksen}
                    className="mx-auto max-w-md"
                    minimumAdjustmentNote={contoh.minimumAdjustmentNote}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Bukti Hasil Scan Asli untuk Layanan Humanisasi, Turnitin, & Parafrase */}
        {(service.id === "humanisasi" || service.id === "turnitin_ai" || service.id === "parafrase") && (
          <section className="border-b border-line bg-paper-2/50 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
              <div className="rounded-3xl border border-line bg-white p-6 sm:p-10 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-line pb-6">
                  <div className="max-w-2xl">
                    <span className="stempel-hijau">✓ BUKTI PEMINDAIAN RESMI</span>
                    <h2 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-ink">
                      Hasil Uji Nyata: 98% Human di GPTZero (Model 4.1m)
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-medium">
                      Tangkapan layar hasil pemindaian langsung pada naskah hukum &amp; pemasyarakatan setelah disunting manual oleh Mas Joki. Terbukti lolos detektor AI kampus dengan skor <strong>98% Human</strong>, <strong>1% AI</strong>, dan <strong>1% Mixed</strong>.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint-soft px-3 py-1 text-xs font-bold text-mint shadow-2xs">
                      <span className="size-1.5 rounded-full bg-mint animate-pulse" />
                      Entirely Human (98%)
                    </span>
                    <span className="rounded-full border border-line bg-paper-2 px-3 py-1 font-mono text-xs font-semibold text-slate-700">
                      1.085 kata · 8.109 karakter
                    </span>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-line shadow-sm bg-paper-2">
                  <Image
                    src="/bukti/bukti-humanizer-gptzero.jpg"
                    alt="Bukti Asli Scan AI Humanizer Mas Joki di GPTZero 98% Human"
                    width={1024}
                    height={463}
                    className="w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
                  />
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Dokumen uji riil: &ldquo;Sistem pemasyarakatan merupakan bagian dari sistem hukum pidana di Indonesia&rdquo;.</span>
                  <span className="font-semibold text-mint">✓ Pengerjaan manual langsung tanpa perantara</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Scope & Presets Grid */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.5fr_0.5fr] lg:gap-16">
            {/* Cakupan & Persiapan */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-2xs">
                <h2 className="font-display text-[1.35rem] font-bold text-ink">
                  Yang Sudah Termasuk:
                </h2>
                <ul className="mt-4 space-y-3">
                  {konten.cakupan.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-slate-700"
                    >
                      <span className="mt-0.5 text-base text-mint">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-line bg-paper-2/60 p-6">
                <h2 className="font-display text-[1.35rem] font-bold text-ink">
                  Yang Perlu Kamu Siapkan:
                </h2>
                <ul className="mt-4 space-y-3">
                  {konten.siapkan.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-slate-700"
                    >
                      <span className="mt-0.5 text-brand" aria-hidden>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gambaran Preset Harga */}
            <div>
              {service.customQuoteOnly ? (
                <div className="rounded-2xl border border-line bg-white p-6 shadow-2xs sm:p-8">
                  <h2 className="font-display text-[1.35rem] font-bold text-ink">
                    Penetapan Biaya Sesuai Target Skor &amp; Panjang Naskah
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Karena tingkat kesulitan penurunan skor Turnitin dan deteksi AI sangat bergantung pada panjang dokumen serta persentase skor awal, biaya dihitung personal lewat form penawaran.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/hitung?mode=penawaran&layanan=turnitin_ai"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
                    >
                      <span>Minta Penawaran Turnitin &amp; AI</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              ) : service.id === "jurnal" ? (
                <div className="rounded-2xl border border-line bg-white p-6 shadow-2xs sm:p-8">
                  <h2 className="font-display text-[1.35rem] font-bold text-ink">
                    Dua Pilihan Tingkat Layanan Artikel Jurnal
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Pilih tingkat yang sesuai tujuan naskahmu.
                  </p>

                  <div className="mt-6 space-y-4">
                    {/* Tingkat A */}
                    <div className="rounded-2xl border border-line bg-paper-2/50 p-5 transition hover:border-brand/40">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block rounded-md bg-blue-100 text-brand px-2.5 py-0.5 text-xs font-bold">
                            Tugas Kuliah
                          </span>
                          <h3 className="mt-1 font-display text-base font-bold text-ink">
                            Artikel Ilmiah
                          </h3>
                        </div>
                        <span className="font-mono text-base font-bold text-brand">
                          Rp 250.000
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <li>• <strong>Target penggunaan:</strong> Tugas kuliah, seminar, ulasan ilmiah</li>
                        <li>• <strong>Batas maksimal:</strong> 3.000 kata</li>
                        <li>• <strong>Termasuk:</strong> Struktur lengkap, sitasi &amp; daftar pustaka (APA/IEEE), 2× revisi</li>
                      </ul>
                      <div className="mt-4">
                        <Link
                          href="/hitung?layanan=artikel_ilmiah"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-brand-dark"
                        >
                          <span>Pesan Artikel Ilmiah (Rp 250.000)</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Tingkat B */}
                    <div className="rounded-2xl border-2 border-brand/35 bg-brand-soft/20 p-5 transition hover:border-brand">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block rounded-md bg-purple-100 text-purple-800 px-2.5 py-0.5 text-xs font-bold">
                            Publikasi Jurnal
                          </span>
                          <h3 className="mt-1 font-display text-base font-bold text-ink">
                            Artikel Jurnal Siap Submit
                          </h3>
                        </div>
                        <span className="font-mono text-base font-bold text-brand">
                          Rp 400.000
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <li>• <strong>Target penggunaan:</strong> Publikasi jurnal ilmiah (SINTA / Scopus)</li>
                        <li>• <strong>Batas maksimal:</strong> 6.000 kata</li>
                        <li>• <strong>Termasuk:</strong> Format IMRAD ketat sesuai template jurnal, sitasi Mendeley, cek kemiripan (no-repo), 2× revisi</li>
                      </ul>
                      <div className="mt-4">
                        <Link
                          href="/hitung?layanan=jurnal_submit"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-brand-dark"
                        >
                          <span>Pesan Jurnal Siap Submit (Rp 400.000)</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : service.id === "word" ? (
                <div className="rounded-2xl border border-line bg-white p-6 shadow-2xs sm:p-8">
                  <h2 className="font-display text-[1.35rem] font-bold text-ink">
                    Tingkat Tarif Berdasarkan Jumlah Halaman
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Tarif dihitung bertingkat berdasarkan jumlah halaman dokumen Word kamu (mulai Rp 30.000). Margin, daftar isi otomatis, heading, dan penomoran halaman dirapikan sesuai pedoman resmi kampus.
                  </p>

                  <ul className="mt-6 divide-y divide-line border-y border-line">
                    <li className="flex items-center justify-between py-3.5">
                      <div>
                        <span className="block text-sm font-semibold text-ink">1–25 Halaman</span>
                        <span className="text-xs text-slate-500">Makalah, artikel pendek, atau proposal singkat</span>
                      </div>
                      <span className="font-mono text-base font-bold tabular-nums text-brand">
                        Rp 30.000
                      </span>
                    </li>
                    <li className="flex items-center justify-between py-3.5">
                      <div>
                        <span className="block text-sm font-semibold text-ink">26–60 Halaman</span>
                        <span className="text-xs text-slate-500">Proposal skripsi, laporan magang, atau KKN</span>
                      </div>
                      <span className="font-mono text-base font-bold tabular-nums text-brand">
                        Rp 50.000
                      </span>
                    </li>
                    <li className="flex items-center justify-between py-3.5">
                      <div>
                        <span className="block text-sm font-semibold text-ink">61–120 Halaman</span>
                        <span className="text-xs text-slate-500">Naskah skripsi atau tesis lengkap</span>
                      </div>
                      <span className="font-mono text-base font-bold tabular-nums text-brand">
                        Rp 85.000
                      </span>
                    </li>
                    <li className="flex items-center justify-between py-3.5">
                      <div>
                        <span className="block text-sm font-semibold text-ink">Di atas 120 Halaman</span>
                        <span className="text-xs text-slate-500">Disertasi atau naskah sangat tebal</span>
                      </div>
                      <span className="text-xs font-bold text-brand bg-brand-soft px-2.5 py-1 rounded-lg">
                        Minta Penawaran
                      </span>
                    </li>
                  </ul>

                  <div className="mt-6">
                    <Link
                      href="/hitung?layanan=word"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
                    >
                      <span>Buka Kalkulator Rapikan Word</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-line bg-white p-6 shadow-2xs sm:p-8">
                  <h2 className="font-display text-[1.35rem] font-bold text-ink">
                    Gambaran Biaya Berdasarkan Jumlah (Tenggat Normal 4–6 Hari, +10%)
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Simulasi memakai tenggat normal (4–6 hari kerja, +10%) dan tingkat pengerjaan standar. Nominal terkunci sebelum kamu chat.
                  </p>

                  <ul className="mt-6 divide-y divide-line border-y border-line">
                    {service.presets.map((qty) => {
                      const harga = computePrice(service, qty, "normal", "standar", [], {
                        applyMinimum: false,
                      });
                      return (
                        <li
                          key={qty}
                          className="flex items-center justify-between py-4"
                        >
                          <span className="text-sm font-semibold text-ink">
                            {qty} {BASIS_LABEL[service.basis]}
                          </span>
                          <span className="font-mono text-base font-bold tabular-nums text-brand">
                            {rupiah(harga.total)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mt-3 text-[13px] text-slate-600 font-medium leading-relaxed">
                    *Total di bawah Rp 15.000 disesuaikan menjadi Rp 15.000 (minimum transaksi) saat pemesanan.
                  </p>

                  {service.id === "terjemah" && (
                    <div className="mt-6 rounded-2xl border-2 border-brand/20 bg-brand-soft/40 p-4.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block rounded-md bg-brand text-white px-2 py-0.5 text-xs font-bold">
                            Paket Hemat Flat
                          </span>
                          <h3 className="mt-1 font-display text-sm sm:text-base font-bold text-ink">
                            Paket Abstrak (ID + EN)
                          </h3>
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                            Pasangan abstrak dua versi (Indonesia + Inggris) untuk skripsi atau artikel, batas maksimal 300 kata per versi.
                          </p>
                        </div>
                        <span className="font-mono text-base font-bold text-brand shrink-0">
                          Rp 35.000
                        </span>
                      </div>
                      <div className="mt-3.5">
                        <Link
                          href="/hitung?layanan=paket_abstrak"
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-dark transition-colors"
                        >
                          <span>Pesan Paket Abstrak (Rp 35.000)</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <Link
                      href={`/jasa/${service.id}/order`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
                    >
                      <span>Lanjut ke Formulir Pemesanan</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Layanan */}
        <section className="border-t border-line bg-paper-2/60">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="mt-3 font-display text-[1.9rem] font-bold leading-tight tracking-tight text-ink sm:text-[2.2rem]">
              Pertanyaan seputar {service.name.toLowerCase()}
            </h2>

            <div className="mt-8 space-y-3">
              {konten.faq.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-line bg-white p-5 transition duration-150 hover:border-brand/40 hover:shadow-2xs [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                    <span className="font-display text-base sm:text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand">
                      {item.q}
                    </span>
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-paper-2 text-ink-soft transition-transform duration-200 group-open:rotate-45 group-open:bg-brand-soft group-open:text-brand">
                      <svg
                        aria-hidden
                        viewBox="0 0 16 16"
                        className="size-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3.5 max-w-[68ch] text-xs sm:text-sm leading-relaxed text-slate-700 border-t border-dashed border-line pt-3 font-medium">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>

            <p className="mt-8 text-xs sm:text-sm text-slate-600 font-medium">
              Masih ada hal yang ingin ditanyakan?{" "}
              <a
                href={waLink(
                  `Halo Mas Joki, saya mau tanya soal ${service.name.toLowerCase()}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
              >
                Chat Mas Joki Langsung via WhatsApp ↗
              </a>
            </p>
          </div>
        </section>

        {/* Layanan Lain */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="font-display text-[1.6rem] font-bold tracking-tight text-ink">
            Jelajahi Layanan Mas Joki Lainnya
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lain.map((item) => (
              <Link
                key={item.id}
                href={item.customQuoteOnly ? "/hitung?mode=penawaran&layanan=turnitin_ai" : `/jasa/${item.id}`}
                className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-2xs transition duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <StempelLayanan id={item.id} ukuran="kecil" />
                  <span className="font-display text-base font-bold text-ink group-hover:text-brand transition-colors">
                    {item.name}
                  </span>
                </div>
                <div className="mt-4 border-t border-dashed border-line pt-3 flex items-baseline justify-between text-xs">
                  <span className="text-slate-600 font-medium">{priceLabel(item)}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-brand group-hover:underline">
                    <span>{item.customQuoteOnly ? "Minta Penawaran" : "Buka Detail"}</span>
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Banner CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-18 sm:px-8 sm:pb-24">
          <div className="relative overflow-hidden rounded-2xl bg-[#0b1329] dark:bg-[#0c1527] dark:border dark:border-white/10 px-7 py-12 shadow-xl sm:px-12 sm:py-16">
            <div aria-hidden className="pita absolute inset-x-0 top-0 h-[4px]" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
              <div>
                <h2 className="font-display text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-[2.5rem]">
                  Siap menyelesaikan {service.name.toLowerCase()} sekarang?
                </h2>
                <p className="mt-2.5 max-w-[48ch] text-xs sm:text-sm leading-relaxed text-white/80">
                  Dikerjakan langsung oleh Mas Joki tanpa perantara. Nominal biaya, tenggat, dan nomor pembayaran resmi langsung terkunci di awal.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={service.customQuoteOnly ? "/hitung?mode=penawaran&layanan=turnitin_ai" : `/jasa/${service.id}/order`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-stabilo px-7 py-4 text-sm font-black text-slate-950 shadow-md transition hover:bg-amber-300"
                >
                  <span>{service.customQuoteOnly ? "Minta Penawaran Sekarang" : `Pesan ${service.name} Sekarang`}</span>
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href={waLink(
                    `Halo Mas Joki, saya mau pesan ${service.name.toLowerCase()}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-4 text-sm font-bold text-white backdrop-blur-xs transition-colors hover:bg-white/15"
                >
                  Chat WhatsApp
                </a>
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
