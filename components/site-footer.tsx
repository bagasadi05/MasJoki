import Link from "next/link";
import { ArrowRight, ExternalLink, Mail, MessageCircle } from "lucide-react";
import { aksenLayanan } from "@/lib/aksen";
import { SERVICES } from "@/lib/services";
import { pembayaran, site, waLink, waPesanUmum } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-2/70">
      <div aria-hidden className="pita h-[4px]" />
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pb-16">
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

            <p className="mt-3 max-w-[34ch] text-[0.86rem] leading-relaxed text-ink-soft">
              Layanan bantuan penulisan, perapian format, dan penyuntingan tugas akademik.
              Hitung biaya sendiri di awal tanpa tawar-menawar berbelit.
            </p>

            <div className="mt-4 flex items-center gap-2 text-[0.78rem] text-muted">
              <span>{site.kota}</span>
              <span>·</span>
              <span>⏰ {site.jamOperasional}</span>
            </div>
          </div>

          {/* Nav Layanan */}
          <nav aria-label="Layanan Cepat">
            <p className="font-display text-[0.92rem] font-bold text-ink">
              Layanan Utama
            </p>
            <ul className="mt-3.5 space-y-2.5">
              {SERVICES.map((service) => {
                const aksen = aksenLayanan(service.id);

                return (
                  <li key={service.id}>
                    <Link
                      href={`/jasa/${service.id}`}
                      className="group inline-flex items-center gap-2 text-[0.84rem] text-muted transition-colors hover:text-brand"
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
                  className="font-display text-[0.84rem] font-bold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand inline-flex items-center gap-1"
                >
                  <span>Katalog Semua Layanan</span>
                  <ArrowRight className="size-3" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Navigasi Menu */}
          <nav aria-label="Halaman Menu">
            <p className="font-display text-[0.92rem] font-bold text-ink">
              Menu Situs
            </p>
            <ul className="mt-3.5 space-y-2.5 text-[0.84rem]">
              <li>
                <Link href="/" className="text-muted transition-colors hover:text-brand">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/jasa" className="text-muted transition-colors hover:text-brand">
                  Daftar Layanan
                </Link>
              </li>
              <li>
                <Link href="/hitung" className="text-muted transition-colors hover:text-brand">
                  Kalkulator Biaya
                </Link>
              </li>
              <li>
                <Link href="/cara-kerja" className="text-muted transition-colors hover:text-brand">
                  Cara Kerja &amp; Alur
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted transition-colors hover:text-brand">
                  FAQ &amp; Bantuan
                </Link>
              </li>
            </ul>
          </nav>

          {/* Kontak & Bayar */}
          <nav aria-label="Bantuan dan Pembayaran">
            <p className="font-display text-[0.92rem] font-bold text-ink">
              Hubungi Kami
            </p>
            <ul className="mt-3.5 space-y-2.5">
              <li>
                <a
                  href={waLink(waPesanUmum)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[0.84rem] text-muted transition-colors hover:text-brand font-medium"
                >
                  <MessageCircle className="size-3.5 text-mint" />
                  <span>WhatsApp Official</span>
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-1.5 text-[0.84rem] text-muted transition-colors hover:text-brand"
                >
                  <Mail className="size-3.5" />
                  <span>{site.email}</span>
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-line bg-white p-3.5 shadow-2xs">
              <p className="text-[0.72rem] font-bold uppercase tracking-wider text-muted">
                Dukungan Pembayaran Resmi
              </p>
              <p className="mt-1 font-mono text-[0.88rem] font-bold text-ink">
                {pembayaran.nomor}
              </p>
              <p className="mt-0.5 text-[0.72rem] text-muted">
                {pembayaran.metode.join(" · ")}
              </p>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[0.76rem] leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© Mas Joki. Hak cipta dilindungi undang-undang.</p>
          <p className="max-w-[50ch] sm:text-right">
            Mas Joki adalah pendamping akademik untuk asistensi teknis, penulisan, dan penyuntingan naskah.
          </p>
        </div>
      </div>
    </footer>
  );
}
