import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  ExternalLink,
  MessageCircle,
  Send,
  SlidersHorizontal,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { Pembayaran } from "@/components/pembayaran";
import { PerbandinganJoki } from "@/components/perbandingan-joki";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { waLink, waPesanUmum } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cara Kerja, Alur Pemesanan & Pembayaran E-Wallet Resmi",
  description:
    "Pelajari alur pemesanan tugas di Mas Joki yang cepat, tanpa akun, bergaransi 2x revisi gratis, dan didukung metode pembayaran resmi e-wallet.",
  alternates: { canonical: "/cara-kerja" },
};

const langkah = [
  {
    nomor: "01",
    judul: "Atur Jumlah & Tenggat",
    isi: "Pilih jenis tugas, tentukan jumlah halaman atau kata, dan pilih tenggat yang kamu butuhkan. Total biaya keluar seketika di nota tanpa nunggu dibalas.",
    icon: SlidersHorizontal,
    badge: "from-ink to-ink",
  },
  {
    nomor: "02",
    judul: "Kirim ke WhatsApp",
    isi: "Tempelkan tautan file tugasmu (Google Drive / OneDrive) dan nomor WhatsApp. Format pesanan langsung terisi otomatis di chat admin Mas Joki.",
    icon: Send,
    badge: "from-ink to-ink",
  },
  {
    nomor: "03",
    judul: "Bayar Lewat E-Wallet",
    isi: "Admin konfirmasi instruksi tugas dan mengunci harga total. Transfer via ShopeePay, GoPay, atau DANA, lalu kirim bukti di chat yang sama.",
    icon: Wallet,
    badge: "from-ink to-ink",
  },
  {
    nomor: "04",
    judul: "Terima Hasil Jadi",
    isi: "Hasil dikirim tepat waktu dalam file yang bisa kamu edit (Word / PPT). Ada garansi 2× revisi gratis jika ada instruksi yang belum terpenuhi.",
    icon: Sparkles,
    badge: "from-ink to-ink",
  },
];

export default function HalamanCaraKerja() {
  return (
    <>
      <SiteHeader />

      <main id="konten">
        {/* Header Section */}
        <section className="mx-auto max-w-6xl px-5 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-20">
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
            <span className="font-bold text-ink">Cara Kerja &amp; Pembayaran</span>
          </nav>

          <div className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[0.74rem] font-bold text-amber-900 shadow-2xs">
              <Zap className="size-3.5 text-amber-600 fill-amber-500" />
              <span>Alur Pemesanan Cepat</span>
            </span>
            <h1 className="mt-3 font-display text-[2.3rem] leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3.1rem]">
              Empat langkah mudah, tugasmu langsung beres.
            </h1>
            <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-relaxed text-ink-soft">
              Tanpa ribet bikin akun atau mengisi biodata panjang. Cukup hitung di kalkulator,
              kirimkan brief tugas ke WhatsApp resmi kami, dan pantau progresnya dengan tenang.
            </p>
          </div>

          {/* 4 Steps Grid */}
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {langkah.map((item) => {
              const IconComponent = item.icon;
              return (
                <li
                  key={item.nomor}
                  className="group relative flex flex-col justify-between rounded-3xl border border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r ${item.badge} px-3 py-1 font-mono text-xs font-black text-white shadow-xs`}
                      >
                        {item.nomor}
                      </span>
                      <div className="grid size-11 place-items-center rounded-2xl bg-paper-2 text-ink-soft group-hover:bg-brand-soft group-hover:text-brand transition-colors">
                        <IconComponent className="size-5.5" />
                      </div>
                    </div>

                    <h2 className="mt-6 font-display text-[1.25rem] font-bold leading-snug tracking-tight text-ink group-hover:text-brand transition-colors">
                      {item.judul}
                    </h2>
                    <p className="mt-2.5 text-[0.86rem] leading-relaxed text-muted">
                      {item.isi}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Komparasi: Mas Joki vs Joki Medsos Liar */}
        <div className="border-t border-line bg-paper-2/40">
          <PerbandinganJoki />
        </div>

        {/* Pembayaran E-Wallet Resmi */}
        <Pembayaran />

        {/* CTA Bottom Banner */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="rounded-3xl border border-line bg-white p-8 sm:p-12 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                Siap pesan tugasmu sekarang?
              </h2>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                Gunakan kalkulator kami untuk menghitung nominal pasti sebelum chat admin.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/hitung"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-extrabold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-dark"
              >
                <Calculator className="size-4" />
                <span>Buka Kalkulator Biaya</span>
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={waLink(waPesanUmum)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-paper-2"
              >
                <MessageCircle className="size-4" />
                <span>Chat Admin</span>
                <ExternalLink className="size-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
