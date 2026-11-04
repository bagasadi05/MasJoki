import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { aksenLayanan } from "@/lib/aksen";
import { rupiah } from "@/lib/format";
import { SERVICES, priceLabel } from "@/lib/services";
import { site, waLink, waPesanUmum } from "@/lib/site";

export const metadata: Metadata = {
  title: "Layanan & harga",
  description:
    "Delapan layanan Mas Joki dengan harga per satuan yang jelas: parafrase, humanisasi teks, makalah, artikel jurnal, PowerPoint, rapikan Word, terjemahan, dan desain visual.",
  alternates: { canonical: "/jasa" },
};

export default function HalamanDaftarLayanan() {
  return (
    <>
      <SiteHeader />

      <main id="konten" className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <nav aria-label="Remah roti" className="text-[0.76rem] text-muted">
          <Link href="/" className="transition-colors hover:text-brand">
            Beranda
          </Link>
          <span aria-hidden className="mx-1.5">
            /
          </span>
          <span className="text-ink-soft">Layanan</span>
        </nav>

        <h1 className="mt-5 max-w-2xl font-display text-[2.2rem] leading-[1.06] tracking-[-0.03em] text-ink sm:text-[2.9rem]">
          Delapan layanan, satu daftar harga.
        </h1>
        <p className="mt-4 max-w-[58ch] text-[0.96rem] leading-relaxed text-ink-soft">
          Angka di bawah adalah harga dasar per satuan. Total akhir menyesuaikan
          jumlah, tenggat, dan tingkat kesulitan — dan selalu muncul sebelum
          kamu memesan.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/#hitung"
            className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Hitung biaya tugasku
          </Link>
          <a
            href={waLink(waPesanUmum)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-ink px-6 py-3.5 text-[0.9rem] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Tanya admin
          </a>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((service) => {
            const aksen = aksenLayanan(service.id);

            return (
              <li key={service.id}>
                <Link
                  href={`/jasa/${service.id}`}
                  className={`group flex h-full flex-col justify-between rounded-md border border-line border-t-4 ${aksen.top} bg-white p-5 pt-4 transition-colors hover:bg-paper-2/40`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="flex items-center gap-2.5 font-display text-[1.2rem] leading-snug tracking-tight text-ink group-hover:text-brand">
                        <span
                          aria-hidden
                          className={`inline-block size-2 shrink-0 rounded-full ${aksen.dot}`}
                        />
                        {service.name}
                      </h2>
                      {service.popular ? (
                        <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-[0.68rem] font-semibold text-brand">
                          Sering dipesan
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 max-w-[44ch] text-[0.86rem] leading-relaxed text-muted">
                      {service.promise}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2 border-t border-dashed border-line pt-3">
                    <p className="font-mono text-[0.8rem] tabular-nums text-ink-soft">
                      {priceLabel(service)}
                    </p>
                    <p className="text-[0.74rem] text-muted">
                      mulai {rupiah(service.minPrice)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-[0.84rem] leading-relaxed text-muted">
          Tidak menemukan yang cocok?{" "}
          <Link
            href="/?mode=penawaran#hitung"
            className="font-semibold text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
          >
            Minta penawaran
          </Link>{" "}
          untuk tugas gabungan atau jumlah besar. Admin di {site.kota},{" "}
          {site.jamOperasional}.
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
