import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { site, waLink, waPesanUmum } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-2/60">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl tracking-tight text-ink">
              Mas Joki
            </p>
            <p className="mt-2 max-w-[38ch] text-[0.84rem] leading-relaxed text-muted">
              Bantuan penulisan dan penyuntingan tugas. Harga dihitung di depan,
              bukan setelah tawar-menawar.
            </p>
            <p className="mt-4 text-[0.78rem] text-muted">
              {site.kota} · {site.jamOperasional}
            </p>
          </div>

          <nav aria-label="Layanan">
            <p className="text-[0.78rem] font-semibold text-ink">Layanan</p>
            <ul className="mt-3 space-y-2">
              {SERVICES.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/jasa/${service.id}`}
                    className="text-[0.82rem] text-muted transition-colors hover:text-brand"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/jasa"
                  className="text-[0.82rem] font-semibold text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                >
                  Semua layanan
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Kontak">
            <p className="text-[0.78rem] font-semibold text-ink">Kontak</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={waLink(waPesanUmum)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.82rem] text-muted transition-colors hover:text-brand"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[0.82rem] text-muted transition-colors hover:text-brand"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${site.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.82rem] text-muted transition-colors hover:text-brand"
                >
                  Instagram
                </a>
              </li>
              <li className="pt-1 text-[0.78rem] leading-relaxed text-muted">
                Bayar via ShopeePay, GoPay, atau DANA
                <br />
                <span className="font-mono tabular-nums">089619774116</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[0.72rem] leading-relaxed text-muted sm:flex-row sm:items-start sm:justify-between">
          <p>© Mas Joki. Semua hak dilindungi.</p>
          <p className="max-w-[52ch] sm:text-right">
            Mas Joki adalah layanan bantuan penulisan dan penyuntingan. Hasil
            akhir tetap menjadi tanggung jawab pengguna.
          </p>
        </div>
      </div>
    </footer>
  );
}
