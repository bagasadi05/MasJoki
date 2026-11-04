import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nota } from "@/components/nota";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StempelLayanan } from "@/components/stempel-layanan";
import { KONTEN_LAYANAN } from "@/content/layanan";
import { aksenLayanan } from "@/lib/aksen";
import { rupiah } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import {
  BASIS_LABEL,
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

// Halaman SEO statis: blocking lebih sederhana daripada memecah Suspense.
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

  const judul = `Jasa ${service.name.toLowerCase()}`;

  return {
    title: `${judul} — mulai ${rupiah(service.minPrice)}`,
    description: `${service.promise} Harga ${priceLabel(service)}, total dihitung di depan sebelum kamu memesan.`,
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

  // Contoh harga: jumlah bawaan, tenggat 4–6 hari, tingkat standar.
  const contoh = computePrice(service, service.defaultQty, "normal", "standar");

  const lain = SERVICES.filter((item) => item.id !== service.id);

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
          price: service.minPrice,
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

      <main id="konten">
        {/* Hero Section Layanan */}
        <section className={`border-b border-line bg-gradient-to-b from-paper via-white to-paper-2/40`}>
          <div className="mx-auto max-w-6xl px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
            <nav aria-label="Remah roti" className="flex items-center gap-2 text-[0.8rem] font-medium text-muted">
              <Link href="/" className="transition-colors hover:text-brand">
                Beranda
              </Link>
              <span aria-hidden className="text-muted/40">/</span>
              <Link href="/jasa" className="transition-colors hover:text-brand">
                Layanan
              </Link>
              <span aria-hidden className="text-muted/40">/</span>
              <span className="font-bold text-ink">{service.name}</span>
            </nav>

            <div className="mt-8 grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <StempelLayanan id={service.id} ukuran="sedang" />
                  <span className="text-2xl" aria-hidden>{aksen.ikon}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${aksen.chip}`}>
                    <span>⚡</span> {priceLabel(service)}
                  </span>
                </div>

                <h1 className="mt-4 font-display text-[2.4rem] leading-[1.06] tracking-[-0.03em] text-ink sm:text-[3.2rem]">
                  Jasa {service.name.toLowerCase()}
                </h1>

                <p className="mt-4 max-w-[54ch] text-[1.02rem] leading-relaxed text-ink-soft">
                  {konten.intro}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.78rem] text-muted">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1">
                    ⏱️ Estimasi pengerjaan: <strong className="text-ink">{service.turnaround}</strong>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1">
                    🔄 Termasuk <strong>2× revisi</strong>
                  </span>
                </div>

                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                  <Link
                    href={`/jasa/${service.id}/order`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-4 text-[0.94rem] font-extrabold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/35"
                  >
                    <span>Pesan {service.name} Sekarang</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <Link
                    href={`/hitung?layanan=${service.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-4 text-[0.92rem] font-bold text-ink hover:bg-paper-2 transition-colors"
                  >
                    <span>Simulasi Kalkulator</span>
                  </Link>
                </div>
              </div>

              <div>
                <Nota
                  lines={contoh.lines}
                  total={contoh.total}
                  note={`Contoh simulasi ${contoh.qty} ${BASIS_LABEL[service.basis]} dengan tenggat normal (4–6 hari).`}
                  stamp="Harga Transparan"
                  code="SIM-DETAIL"
                  aksen={aksen}
                  className="mx-auto max-w-md"
                />
              </div>
            </div>
          </div>
        </section>

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
                      className="flex items-start gap-3 text-[0.88rem] leading-relaxed text-ink-soft"
                    >
                      <span className="mt-0.5 text-base text-emerald-600">✓</span>
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
                      className="flex items-start gap-3 text-[0.88rem] leading-relaxed text-ink-soft"
                    >
                      <span className="mt-0.5 text-base text-brand">📋</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gambaran Preset Harga */}
            <div>
              <div className="rounded-2xl border border-line bg-white p-6 shadow-2xs sm:p-8">
                <h2 className="font-display text-[1.35rem] font-bold text-ink">
                  Gambaran Biaya Berdasarkan Jumlah
                </h2>
                <p className="mt-2 text-[0.86rem] leading-relaxed text-muted">
                  Simulasi dengan tenggat normal 4–6 hari dan tingkat standar.
                  Kamu bisa sesuaikan jumlah persisnya di kalkulator interaktif.
                </p>

                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {service.presets.map((qty) => {
                    const harga = computePrice(service, qty, "normal", "standar");
                    return (
                      <li
                        key={qty}
                        className="flex items-center justify-between py-4"
                      >
                        <span className="text-[0.92rem] font-semibold text-ink">
                          {qty} {BASIS_LABEL[service.basis]}
                        </span>
                        <span className="font-mono text-[1rem] font-extrabold tabular-nums text-brand">
                          {rupiah(harga.total)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6">
                  <Link
                    href={`/jasa/${service.id}/order`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-[0.88rem] font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
                  >
                    <span>Lanjut ke Formulir Pemesanan</span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Layanan */}
        <section className="border-t border-line bg-paper-2/60">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-[0.74rem] font-bold text-brand">
              <span>❓</span> FAQ Layanan
            </span>
            <h2 className="mt-3 font-display text-[1.9rem] font-bold leading-tight tracking-tight text-ink sm:text-[2.2rem]">
              Pertanyaan seputar {service.name.toLowerCase()}
            </h2>

            <div className="mt-8 space-y-3">
              {konten.faq.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-line bg-white p-5 transition-all duration-150 hover:border-brand/40 hover:shadow-2xs [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                    <span className="font-display text-[1.02rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand">
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
                  <p className="mt-3.5 max-w-[68ch] text-[0.88rem] leading-relaxed text-ink-soft border-t border-dashed border-line pt-3">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>

            <p className="mt-8 text-[0.86rem] text-muted">
              Masih ada hal yang ingin ditanyakan?{" "}
              <a
                href={waLink(
                  `Halo Mas Joki, saya mau tanya soal ${service.name.toLowerCase()}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
              >
                Chat Admin Langsung via WhatsApp ↗
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
                href={`/jasa/${item.id}`}
                className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <StempelLayanan id={item.id} ukuran="kecil" />
                  <span className="font-display text-[1.05rem] font-bold text-ink group-hover:text-brand transition-colors">
                    {item.name}
                  </span>
                </div>
                <div className="mt-4 border-t border-dashed border-line pt-3 flex items-baseline justify-between text-[0.76rem]">
                  <span className="text-muted">{priceLabel(item)}</span>
                  <span className="font-bold text-brand group-hover:underline">Buka →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Banner CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-18 sm:px-8 sm:pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-slate-900 to-indigo-950 px-7 py-12 shadow-xl sm:px-12 sm:py-16">
            <div aria-hidden className="pita absolute inset-x-0 top-0 h-[4px]" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
              <div>
                <h2 className="font-display text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-[2.5rem]">
                  Siap menyelesaikan {service.name.toLowerCase()} sekarang?
                </h2>
                <p className="mt-2.5 max-w-[48ch] text-[0.92rem] leading-relaxed text-white/80">
                  Masukkan jumlah di kalkulator. Rincian biaya, tenggat, dan nomor pembayaran
                  langsung terlihat detik ini juga.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/jasa/${service.id}/order`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-stabilo px-7 py-4 text-[0.94rem] font-extrabold text-ink shadow-md transition-all hover:bg-white"
                >
                  <span>Pesan {service.name} Sekarang</span>
                  <span aria-hidden>→</span>
                </Link>
                <a
                  href={waLink(
                    `Halo Mas Joki, saya mau pesan ${service.name.toLowerCase()}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-4 text-[0.92rem] font-bold text-white backdrop-blur-xs transition-colors hover:bg-white/15"
                >
                  Chat Admin
                </a>
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
