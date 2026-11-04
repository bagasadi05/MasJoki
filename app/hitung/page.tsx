import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Lightbulb, Sparkles } from "lucide-react";
import { CalculatorProvider } from "@/components/calculator-context";
import { PriceCalculator } from "@/components/price-calculator";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TombolContoh } from "@/components/tombol-contoh";
import { aksenLayanan } from "@/lib/aksen";
import { rupiah } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { getService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Kalkulator Biaya Tugas Kuliah & Cek Nota Transparan",
  description:
    "Hitung estimasi biaya tugas kuliahmu secara mandiri. Pilih layanan, atur jumlah kata/halaman dan tenggat waktu. Total harga langsung terkunci di nota resmi.",
  alternates: { canonical: "/hitung" },
};

const contoh = [
  {
    judul: "Makalah 20 Halaman",
    serviceId: "makalah" as const,
    qty: 20,
    deadlineId: "cepat" as const,
    difficultyId: "standar" as const,
    keterangan:
      "Tenggat 2–3 hari, 8+ referensi jurnal valid, format daftar pustaka APA 7",
  },
  {
    judul: "PowerPoint 15 Slide",
    serviceId: "powerpoint" as const,
    qty: 15,
    deadlineId: "kilat" as const,
    difficultyId: "standar" as const,
    keterangan:
      "Tenggat hari ini, desain visual rapi, lengkap catatan presenter tiap slide",
  },
  {
    judul: "Artikel Jurnal 1 Judul",
    serviceId: "jurnal" as const,
    qty: 1,
    deadlineId: "normal" as const,
    difficultyId: "standar" as const,
    keterangan:
      "Tenggat 4–6 hari, format baku IMRAD + struktur naskah siap submit",
  },
].map((item) => {
  const service = getService(item.serviceId);
  const price = computePrice(
    service,
    item.qty,
    item.deadlineId,
    item.difficultyId,
  );
  return { ...item, service, price };
});

export default function HalamanKalkulator() {
  return (
    <CalculatorProvider>
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
          <span className="font-bold text-ink">Kalkulator Biaya</span>
        </nav>

        {/* Heading */}
        <div className="mt-6 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-[0.74rem] font-bold text-brand">
            <Calculator className="size-3.5" />
            <span>Kalkulator Estimasi Biaya</span>
          </span>
          <h1 className="mt-3 font-display text-[2.3rem] leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3rem]">
            Hitung Biaya Tugasmu Secara Mandiri.
          </h1>
          <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-relaxed text-ink-soft">
            Pilih jenis tugas, geser jumlah kata atau halaman, dan pilih tenggat yang kamu butuhkan.
            Total biaya dan rincian nota kwitansi langsung keluar seketika tanpa perlu nunggu chat admin dibalas.
          </p>
        </div>

        {/* Main Calculator */}
        <div className="mt-10">
          <PriceCalculator />
        </div>

        {/* 3 Simulasi Contoh Nyata */}
        <section className="mt-20 border-t border-dashed border-line pt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold text-purple-900 shadow-2xs">
                <Lightbulb className="size-3.5 text-purple-700" />
                <span>Simulasi Contoh Nyata</span>
              </span>
              <h2 className="mt-3 font-display text-[1.8rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.2rem]">
                Tiga Contoh Hitungan Biaya Nyata.
              </h2>
            </div>
            <p className="text-[0.84rem] font-semibold text-muted">
              Angka riil langsung dari mesin hitung Mas Joki.
            </p>
          </div>

          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {contoh.map((item) => {
              const aksen = aksenLayanan(item.service.id);

              return (
                <li
                  key={item.judul}
                  className="flex flex-col justify-between rounded-3xl border border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.72rem] font-bold ${aksen.chip}`}
                      >
                        <Sparkles className="size-3" />
                        {item.service.name}
                      </span>
                      <span className="text-[0.74rem] font-bold text-muted">
                        Simulasi
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-[1.25rem] font-extrabold leading-snug tracking-tight text-ink">
                      {item.judul}
                    </h3>
                    <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
                      {item.keterangan}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-dashed border-line pt-5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[0.72rem] font-bold uppercase tracking-wider text-muted">
                        Total Estimasi
                      </span>
                      <span className="font-display text-[1.55rem] font-black tracking-tight text-brand tabular-nums">
                        {rupiah(item.price.total)}
                      </span>
                    </div>

                    <TombolContoh serviceId={item.service.id} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </CalculatorProvider>
  );
}
