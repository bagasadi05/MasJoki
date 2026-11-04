import { CalculatorProvider } from "@/components/calculator-context";
import { FaqList } from "@/components/faq-list";
import { ModeCta } from "@/components/mode-cta";
import { Nota } from "@/components/nota";
import { Pembayaran } from "@/components/pembayaran";
import { PriceCalculator } from "@/components/price-calculator";
import { ServiceList } from "@/components/service-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { faq } from "@/content/faq";
import { rupiah } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { getService } from "@/lib/services";
import { site, waLink, waPesanUmum } from "@/lib/site";

const heroLines = [
  {
    label: "Parafrase",
    detail: "1.000 kata · 10 × Rp 3.000",
    amount: 30000,
  },
  {
    label: "Tenggat kurang dari 24 jam",
    detail: "Biaya prioritas +60%",
    amount: 18000,
  },
];

const contoh = [
  {
    judul: "Makalah 20 halaman",
    serviceId: "makalah",
    qty: 20,
    deadlineId: "cepat",
    difficultyId: "standar",
    keterangan: "Tenggat 2–3 hari, tingkat standar",
  },
  {
    judul: "PowerPoint 15 slide",
    serviceId: "powerpoint",
    qty: 15,
    deadlineId: "kilat",
    difficultyId: "standar",
    keterangan: "Tenggat hari ini, tingkat standar",
  },
  {
    judul: "Artikel jurnal 1 judul",
    serviceId: "jurnal",
    qty: 1,
    deadlineId: "normal",
    difficultyId: "riset",
    keterangan: "Tenggat 4–6 hari, butuh analisis data",
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

const langkah = [
  {
    nomor: "01",
    judul: "Atur jumlah dan tenggat",
    isi: "Pilih layanan, masukkan jumlah halaman atau kata, lalu tentukan kapan kamu butuh. Total langsung muncul di nota.",
  },
  {
    nomor: "02",
    judul: "Kirim ke WhatsApp",
    isi: "Tempel tautan file dan data kontakmu. Satu klik, ringkasan pesanan langsung masuk ke chat admin.",
  },
  {
    nomor: "03",
    judul: "Bayar lewat e-wallet",
    isi: "Admin konfirmasi total akhir. Transfer lewat ShopeePay, GoPay, atau DANA, lalu kirim bukti di chat yang sama.",
  },
  {
    nomor: "04",
    judul: "Terima hasil",
    isi: "Hasil dikirim dalam format yang bisa diedit. Ada dua kali revisi kalau ada yang menyimpang dari brief.",
  },
];

const alasan = [
  {
    judul: "Harga tidak naik diam-diam",
    isi: "Angka di nota dikunci setelah file dicek. Kalau ada perubahan lingkup, kamu yang memutuskan, bukan admin.",
  },
  {
    judul: "Dua kali revisi, tanpa biaya",
    isi: "Berlaku untuk bagian yang memang tidak sesuai brief atau pedoman kampusmu. Bukan untuk ganti topik.",
  },
  {
    judul: "File bisa kamu edit lagi",
    isi: "Word, PowerPoint, dan file desain sumber ikut dikirim. Kamu tidak berhenti di PDF yang terkunci.",
  },
  {
    judul: "Satu pintu, satu admin",
    isi: "Semua lewat WhatsApp dengan kode pesanan. Tidak perlu mengulang cerita ke orang yang berbeda.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      name: site.name,
      description:
        "Bantuan penulisan dan penyuntingan tugas: parafrase, humanisasi teks, makalah, PowerPoint, artikel jurnal, terjemahan, dan perapian format Word.",
      areaServed: "ID",
      priceRange: "Rp15.000–Rp250.000",
      email: site.email,
      address: { "@type": "PostalAddress", addressLocality: site.kota },
      openingHours: "Mo-Su 07:00-23:00",
      makesOffer: [
        "Parafrase",
        "Humanisasi teks",
        "Makalah & laporan",
        "Artikel jurnal",
        "PowerPoint",
        "Rapikan Word",
        "Terjemahan",
        "Desain visual",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <CalculatorProvider>
      <SiteHeader />

      <main>
        {/* ---------------------------------------------------------- *
         * Hero
         * ---------------------------------------------------------- */}
        <section className="relative overflow-hidden border-b border-line">
          <div
            aria-hidden
            className="kertas-titik pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]"
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
            <div>
              <h1 className="font-display text-[2.45rem] leading-[1.04] tracking-[-0.03em] text-ink sm:text-[3.1rem] lg:text-[3.35rem]">
                Harga tugasmu kelihatan sebelum kamu chat.
              </h1>

              <p className="mt-5 max-w-[46ch] text-[0.98rem] leading-relaxed text-ink-soft sm:text-[1.03rem]">
                Parafrase, humanisasi teks, makalah, PowerPoint, sampai rapikan
                Word. Atur jumlah dan tenggatnya, total keluar seketika — tanpa
                menunggu dibalas.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ModeCta
                  mode="hitung"
                  className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  Hitung biaya tugasku
                </ModeCta>
                <ModeCta
                  mode="penawaran"
                  className="inline-flex items-center justify-center rounded-md border border-ink px-6 py-3.5 text-[0.9rem] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Minta penawaran
                </ModeCta>
              </div>

              <p className="mt-5 text-[0.78rem] leading-relaxed text-muted">
                Dua kali revisi · ShopeePay, GoPay, DANA · file sumber
                diserahkan
              </p>

              <p className="mt-6 text-[0.8rem] text-muted">
                Masih ragu?{" "}
                <a
                  href={waLink(waPesanUmum)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                >
                  Tanya langsung ke admin
                </a>
              </p>
            </div>

            <div className="relative">
              <Nota
                lines={heroLines}
                total={48000}
                note="Contoh: 1.000 kata, dikerjakan hari ini."
                stamp="Contoh hitungan"
                animate
                className="mx-auto max-w-md"
              />
              <p className="mx-auto mt-5 max-w-md text-[0.72rem] leading-relaxed text-muted">
                Angka ini keluar dari kalkulator yang sama dengan yang ada di
                bawah, bukan karangan.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- *
         * Janji singkat
         * ---------------------------------------------------------- */}
        <section aria-label="Yang selalu kamu dapat" className="border-b border-line bg-paper-2/50">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-4 px-5 py-6 text-[0.78rem] text-ink-soft sm:grid-cols-4 sm:px-8">
            {[
              "Harga dihitung di depan",
              "Revisi 2× termasuk",
              "File sumber diserahkan",
              "ShopeePay, GoPay, DANA",
            ].map((item) => (
              <p key={item} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-[0.42rem] inline-block size-1.5 shrink-0 rounded-full bg-brand"
                />
                {item}
              </p>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- *
         * Layanan
         * ---------------------------------------------------------- */}
        <section id="layanan" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
              Daftar harga, bukan tebakan.
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
              Harga per satuan di bawah sudah termasuk pengerjaan. Total akhir
              menyesuaikan tenggat dan tingkat kesulitan — semuanya terlihat
              sebelum kamu memesan.
            </p>
          </div>

          <div className="mt-10">
            <ServiceList />
          </div>

          <p className="mt-5 text-[0.8rem] text-muted">
            Tugasnya kombinasi atau tidak ada di daftar?{" "}
            <ModeCta
              mode="penawaran"
              className="font-semibold text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
            >
              Minta penawaran
            </ModeCta>
            .
          </p>
        </section>

        {/* ---------------------------------------------------------- *
         * Cara kerja
         * ---------------------------------------------------------- */}
        <section
          id="cara-kerja"
          className="border-y border-line bg-paper-2/50"
        >
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="max-w-xl font-display text-[1.9rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
              Empat langkah, tanpa drama.
            </h2>

            <ol className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
              {langkah.map((item) => (
                <li key={item.nomor} className="border-t border-line-strong pt-5">
                  <p className="font-mono text-[0.72rem] tabular-nums text-brand">
                    {item.nomor}
                  </p>
                  <h3 className="mt-3 font-display text-[1.15rem] leading-snug tracking-tight text-ink">
                    {item.judul}
                  </h3>
                  <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
                    {item.isi}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Pembayaran />

        {/* ---------------------------------------------------------- *
         * Kalkulator
         * ---------------------------------------------------------- */}
        <section id="hitung" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
              Hitung sendiri, sekarang.
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
              Ubah jumlah atau tenggat, totalnya ikut berubah. Kalau tugasmu
              tidak masuk pola di bawah, pindah ke mode penawaran.
            </p>
          </div>

          <div className="mt-10">
            <PriceCalculator />
          </div>
        </section>

        {/* ---------------------------------------------------------- *
         * Contoh hitungan
         * ---------------------------------------------------------- */}
        <section className="border-y border-line bg-paper-2/50">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-xl font-display text-[1.9rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
                Tiga contoh, biar ada gambaran.
              </h2>
              <p className="text-[0.78rem] text-muted">
                Dihitung dari daftar harga di atas.
              </p>
            </div>

            <ul className="mt-10 grid gap-5 sm:grid-cols-3">
              {contoh.map((item) => (
                <li
                  key={item.judul}
                  className="flex flex-col justify-between rounded-md border border-line bg-white p-5"
                >
                  <div>
                    <p className="text-[0.72rem] text-muted">
                      {item.service.name}
                    </p>
                    <h3 className="mt-1 font-display text-[1.1rem] leading-snug tracking-tight text-ink">
                      {item.judul}
                    </h3>
                    <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                      {item.keterangan}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-dashed border-line pt-3">
                    <p className="text-[0.7rem] tracking-wide text-muted">
                      Total
                    </p>
                    <p className="font-display text-[1.35rem] tracking-tight text-ink tabular-nums">
                      {rupiah(item.price.total)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------------------- *
         * Alasan
         * ---------------------------------------------------------- */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <h2 className="max-w-xl font-display text-[1.9rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
            Yang bikin orang balik lagi.
          </h2>

          <dl className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {alasan.map((item) => (
              <div key={item.judul} className="border-t border-line pt-5">
                <dt className="font-display text-[1.1rem] leading-snug tracking-tight text-ink">
                  {item.judul}
                </dt>
                <dd className="mt-2 max-w-[46ch] text-[0.85rem] leading-relaxed text-muted">
                  {item.isi}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------------------------------------------------------- *
         * FAQ
         * ---------------------------------------------------------- */}
        <section id="tanya" className="border-t border-line bg-paper-2/50">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
            <div>
              <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.2rem]">
                Pertanyaan yang sering masuk.
              </h2>
              <p className="mt-4 max-w-[34ch] text-[0.9rem] leading-relaxed text-muted">
                Kalau yang kamu cari tidak ada di sini, tanya langsung. Admin
                menjawab di jam operasional.
              </p>
              <a
                href={waLink(waPesanUmum)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-[0.84rem] font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                Tanya lewat WhatsApp
                <span aria-hidden>↗</span>
              </a>
            </div>

            <FaqList />
          </div>
        </section>

        {/* ---------------------------------------------------------- *
         * CTA akhir
         * ---------------------------------------------------------- */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="relative overflow-hidden rounded-lg bg-ink px-6 py-12 sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border border-white/10"
            />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-[1.95rem] leading-[1.1] tracking-[-0.02em] text-paper sm:text-[2.6rem]">
                Masukkan jumlah halaman.
                <br />
                <span className="bg-stabilo px-1.5 text-ink">
                  Lihat harganya.
                </span>
              </h2>
              <p className="mt-5 max-w-[44ch] text-[0.9rem] leading-relaxed text-paper/70">
                Tidak perlu daftar akun. Tidak ada biaya konsultasi. Total
                muncul sebelum kamu menulis satu pesan pun.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ModeCta
                  mode="hitung"
                  className="inline-flex items-center justify-center rounded-md bg-stabilo px-6 py-3.5 text-[0.9rem] font-semibold text-ink transition-colors hover:bg-white"
                >
                  Hitung biaya tugasku
                </ModeCta>
                <ModeCta
                  mode="penawaran"
                  className="inline-flex items-center justify-center rounded-md border border-white/25 px-6 py-3.5 text-[0.9rem] font-semibold text-paper transition-colors hover:border-white/60 hover:bg-white/5"
                >
                  Minta penawaran
                </ModeCta>
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
