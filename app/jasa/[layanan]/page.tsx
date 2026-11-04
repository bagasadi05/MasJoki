import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nota } from "@/components/nota";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { KONTEN_LAYANAN } from "@/content/layanan";
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

      <main>
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
            <nav aria-label="Remah roti" className="text-[0.76rem] text-muted">
              <Link href="/" className="transition-colors hover:text-brand">
                Beranda
              </Link>
              <span aria-hidden className="mx-1.5">
                /
              </span>
              <Link href="/jasa" className="transition-colors hover:text-brand">
                Layanan
              </Link>
              <span aria-hidden className="mx-1.5">
                /
              </span>
              <span className="text-ink-soft">{service.name}</span>
            </nav>

            <div className="mt-6 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
              <div>
                <h1 className="font-display text-[2.2rem] leading-[1.06] tracking-[-0.03em] text-ink sm:text-[2.9rem]">
                  Jasa {service.name.toLowerCase()}
                </h1>

                <p className="mt-4 max-w-[52ch] text-[0.98rem] leading-relaxed text-ink-soft">
                  {konten.intro}
                </p>

                <p className="mt-5 inline-flex items-center gap-2 rounded-md border border-line bg-paper-2/70 px-3.5 py-2 text-[0.8rem] text-ink-soft">
                  <span aria-hidden className="inline-block size-1.5 rounded-full bg-brand" />
                  {priceLabel(service)} · pengerjaan {service.turnaround}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/?layanan=${service.id}#hitung`}
                    className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-dark"
                  >
                    Hitung biaya persisnya
                  </Link>
                  <a
                    href={waLink(
                      `Halo Mas Joki, saya mau tanya soal ${service.name.toLowerCase()}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-ink px-6 py-3.5 text-[0.9rem] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    Tanya admin
                  </a>
                </div>
              </div>

              <div>
                <Nota
                  lines={contoh.lines}
                  total={contoh.total}
                  note={`Contoh ${contoh.qty} ${BASIS_LABEL[service.basis]} dengan tenggat 4–6 hari dan tingkat standar.`}
                  stamp="Contoh hitungan"
                  className="mx-auto max-w-md"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.44fr_0.56fr] lg:gap-16">
            <div>
              <h2 className="font-display text-[1.6rem] leading-tight tracking-tight text-ink">
                Yang termasuk
              </h2>
              <ul className="mt-5 space-y-3.5">
                {konten.cakupan.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.88rem] leading-relaxed text-ink-soft"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.5rem] inline-block size-1.5 shrink-0 rounded-full bg-brand"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-[1.6rem] leading-tight tracking-tight text-ink">
                Yang perlu kamu siapkan
              </h2>
              <ul className="mt-5 space-y-3.5">
                {konten.siapkan.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.88rem] leading-relaxed text-ink-soft"
                  >
                    <span
                      aria-hidden
                      className="mt-1 inline-block size-1.5 shrink-0 rounded-full border border-line-strong"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-[1.6rem] leading-tight tracking-tight text-ink">
                Gambaran harga
              </h2>
              <p className="mt-3 max-w-[54ch] text-[0.86rem] leading-relaxed text-muted">
                Dihitung dengan tenggat 4–6 hari dan tingkat standar. Total
                akhirnya berubah kalau kamu butuh lebih cepat atau butuh
                referensi tambahan.
              </p>

              <ul className="mt-5 divide-y divide-line border-y border-line">
                {service.presets.map((qty) => {
                  const harga = computePrice(service, qty, "normal", "standar");
                  return (
                    <li
                      key={qty}
                      className="flex items-baseline justify-between gap-4 py-3.5"
                    >
                      <span className="text-[0.88rem] text-ink-soft">
                        {qty} {BASIS_LABEL[service.basis]}
                      </span>
                      <span className="font-mono text-[0.86rem] tabular-nums text-ink">
                        {rupiah(harga.total)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 text-[0.78rem] leading-relaxed text-muted">
                Butuh jumlah di luar daftar, atau tugasnya gabungan beberapa
                layanan?{" "}
                <Link
                  href={`/?layanan=${service.id}&mode=penawaran#hitung`}
                  className="font-semibold text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                >
                  Minta penawaran
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2/50">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
            <h2 className="font-display text-[1.7rem] leading-tight tracking-tight text-ink">
              Pertanyaan soal {service.name.toLowerCase()}
            </h2>

            <div className="mt-6 border-t border-line">
              {konten.faq.map((item) => (
                <details
                  key={item.q}
                  className="group border-b border-line [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left">
                    <span className="text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-brand">
                      {item.q}
                    </span>
                    <svg
                      aria-hidden
                      viewBox="0 0 16 16"
                      className="mt-0.5 size-3.5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <path d="M8 2v12M2 8h12" />
                    </svg>
                  </summary>
                  <p className="max-w-[68ch] pb-5 pr-10 text-[0.86rem] leading-relaxed text-ink-soft">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>

            <p className="mt-6 text-[0.84rem] leading-relaxed text-muted">
              Belum terjawab?{" "}
              <a
                href={waLink(
                  `Halo Mas Joki, saya mau tanya soal ${service.name.toLowerCase()}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
              >
                Tanya lewat WhatsApp
              </a>
              . Admin menjawab di jam operasional.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <h2 className="font-display text-[1.4rem] tracking-tight text-ink">
            Layanan lain
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lain.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/jasa/${item.id}`}
                  className="flex h-full flex-col justify-between rounded-md border border-line bg-white p-4 transition-colors hover:border-line-strong"
                >
                  <span className="text-[0.9rem] font-medium leading-snug text-ink">
                    {item.name}
                  </span>
                  <span className="mt-3 font-mono text-[0.76rem] tabular-nums text-muted">
                    {priceLabel(item)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
