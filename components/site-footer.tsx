import Link from "next/link";
import { ArrowRight, Clock, ExternalLink, Mail, MapPin, MessageCircle } from "lucide-react";
import { THREADS_URL } from "@/lib/config";
import { aksenLayanan } from "@/lib/aksen";
import { SERVICES } from "@/lib/services";
import { pembayaran, site, waLink, waPesanUmum } from "@/lib/site";

function ThreadsIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 192 192"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.4619 44.745C97.1643 44.7431 96.8665 44.7431 96.5686 44.745C77.4116 44.745 62.4907 55.4573 55.617 74.0045L74.8878 81.365C79.8055 68.1065 90.3168 64.6738 96.5686 64.6738C96.7725 64.6738 96.9765 64.675 97.1802 64.6775C108.974 64.7575 117.892 70.9387 119.537 83.1873C112.597 82.525 105.297 82.3787 97.7121 82.7537C64.9125 84.3725 44.6063 101.449 45.4184 125.688C46.1983 148.974 65.654 163.535 91.8016 163.535C114.739 163.535 128.784 153.298 135.253 138.835C140.702 148.513 149.273 153.535 161.42 153.535C173.839 153.535 183.085 146.42 188.082 133.003L169.589 125.568C167.337 131.625 164.382 133.606 161.42 133.606C153.078 133.606 149.636 123.01 149.636 109.117V108.528C147.253 101.378 144.389 94.6748 141.537 88.9883ZM94.2255 143.606C78.435 143.606 66.8665 135.334 66.3888 122.257C65.8675 108.007 77.4988 98.4237 98.6946 97.3737C105.158 97.0525 111.393 97.3512 117.303 98.2437C114.723 129.539 104.912 143.606 94.2255 143.606Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-2/70">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8 sm:pb-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.8fr_1fr]">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 -rotate-3 place-items-center rounded-xl border border-brand/25 bg-brand-soft font-display text-[0.85rem] font-bold text-brand shadow-2xs">
                MJ
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                Mas Joki
              </span>
            </div>

            <p className="mt-3 max-w-[34ch] text-xs sm:text-sm leading-relaxed text-slate-600">
              Layanan bantuan penulisan, perapian format, dan penyuntingan tugas akademik langsung oleh Mas Joki tanpa perantara.
              Hitung biaya sendiri di awal tanpa tawar-menawar berbelit.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted" aria-hidden />
                {site.kota}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted" aria-hidden />
                {site.jamOperasional}
              </span>
            </div>
          </div>

          {/* Nav Layanan */}
          <nav aria-label="Layanan Cepat">
            <p className="font-display text-sm font-bold text-ink">
              Layanan Utama
            </p>
            <ul className="mt-3.5 space-y-2.5">
              {SERVICES.map((service) => {
                const aksen = aksenLayanan(service.id);

                return (
                  <li key={service.id}>
                    <Link
                      href={`/jasa/${service.id}`}
                      className="group inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600 transition-colors hover:text-brand"
                    >
                      <span
                        aria-hidden
                        className={`inline-block size-2 rounded-full ${aksen.dot} transition-transform group-hover:scale-125`}
                      />
                      <span>{service.name}</span>
                    </Link>
                  </li>
                );
              })}
              <li className="pt-1">
                <Link
                  href="/jasa"
                  className="font-display text-xs sm:text-sm font-bold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand inline-flex items-center gap-1"
                >
                  <span>Katalog Semua Layanan</span>
                  <ArrowRight className="size-3" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Navigasi Menu */}
          <nav aria-label="Halaman Menu">
            <p className="font-display text-sm font-bold text-ink">
              Menu Situs
            </p>
            <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-slate-600 transition-colors hover:text-brand">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/jasa" className="text-slate-600 transition-colors hover:text-brand">
                  Daftar Layanan
                </Link>
              </li>
              <li>
                <Link href="/humanizer" className="text-slate-600 transition-colors hover:text-brand">
                  Humanizer AI Mandiri
                </Link>
              </li>
              <li>
                <Link href="/hitung" className="text-slate-600 transition-colors hover:text-brand">
                  Kalkulator Biaya
                </Link>
              </li>
              <li>
                <Link href="/cara-kerja" className="text-slate-600 transition-colors hover:text-brand">
                  Cara Kerja &amp; FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-600 transition-colors hover:text-brand">
                  Pusat Bantuan (FAQ)
                </Link>
              </li>
            </ul>
          </nav>

          {/* Kontak & Bayar */}
          <nav aria-label="Bantuan dan Pembayaran">
            <p className="font-display text-sm font-bold text-ink">
              Hubungi Mas Joki
            </p>
            <ul className="mt-3.5 space-y-2.5">
              <li>
                <a
                  href={waLink(waPesanUmum)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 transition-colors hover:text-brand font-medium"
                >
                  <MessageCircle className="size-3.5 text-mint" />
                  <span>WhatsApp: {pembayaran.nomor}</span>
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 transition-colors hover:text-brand"
                >
                  <Mail className="size-3.5" />
                  <span>{site.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={THREADS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 transition-colors hover:text-brand font-medium"
                >
                  <ThreadsIcon className="size-3.5" />
                  <span>Threads: @adis.shop29</span>
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-line bg-white p-3.5 shadow-2xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Dukungan Pembayaran Resmi
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-ink">
                {pembayaran.nomor}
              </p>
              <p className="mt-0.5 text-xs text-slate-600 font-medium">
                {pembayaran.metode.join(" · ")} (a.n. Mas Joki)
              </p>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs leading-relaxed text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© Mas Joki — Madiun, Jawa Timur. Hak cipta dilindungi.</p>
          <p className="max-w-[50ch] sm:text-right">
            Dikerjakan langsung oleh Mas Joki tanpa perantara untuk asistensi penulisan dan penyuntingan naskah akademik.
          </p>
        </div>
      </div>
    </footer>
  );
}
