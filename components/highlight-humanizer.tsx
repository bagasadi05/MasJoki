import Link from "next/link";
import { ArrowRight, CheckCircle2, Coins, Sparkles } from "lucide-react";
import { TOKEN_PACKAGES, INITIAL_FREE_TOKENS } from "@/lib/humanizer/tokens";
import { rupiah } from "@/lib/format";
import { LacakKlik } from "./lacak-klik";

/**
 * Highlight Humanizer mandiri di beranda: menampilkan tarif token yang
 * benar-benar dipakai aplikasi, bukan angka tempelan.
 */
export function HighlightHumanizer() {
  const paket = TOKEN_PACKAGES.filter((p) => ["pkt-1k", "pkt-3k", "pkt-7k"].includes(p.id));

  return (
    <section
      id="humanizer-mandiri"
      className="border-b border-line bg-paper py-14 scroll-mt-16 sm:py-16"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div>
          <span className="stempel text-[0.6rem]">Humanizer mandiri</span>

          <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
            Naskahmu, kamu humanize sendiri.
          </h2>

          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-soft font-medium">
            Tempel naskah, jalankan, lalu bandingkan hasilnya per kalimat. Saldo
            token dipotong sesuai jumlah kata — tanpa antre chat dan tanpa
            mengirim file ke siapa pun.
          </p>

          <ul className="mt-5 space-y-2.5">
            <li className="flex items-start gap-2.5 text-sm font-medium text-ink-soft">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
              <span>
                <strong className="font-bold text-ink">
                  {INITIAL_FREE_TOKENS.toLocaleString("id-ID")} kata gratis
                </strong>{" "}
                untuk akun baru, tanpa kartu kredit.
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-sm font-medium text-ink-soft">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <span>
                Paket token mulai{" "}
                <strong className="font-bold text-ink">{rupiah(15000)}</strong>{" "}
                untuk 1.000 kata naskah.
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-sm font-medium text-ink-soft">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
              <span>Naskah tidak disimpan di server setelah diproses.</span>
            </li>
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <LacakKlik nama="cta_humanizer" data={{ lokasi: "highlight" }}>
              <Link
                href="/humanizer"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg active:translate-y-0"
              >
                <Sparkles className="size-4" aria-hidden />
                <span>Buka Humanizer</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
              </Link>
            </LacakKlik>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-card px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:border-ink hover:bg-paper-2"
            >
              <span>Masuk &amp; klaim 300 kata</span>
            </Link>
          </div>

          <p className="mt-3 text-[0.72rem] text-muted">
            Butuh akun untuk memproses. Tanpa masuk, naskah hanya bisa dianalisis.
          </p>
        </div>

        {/* Nota tarif token */}
        <div className="nota p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 border-b border-dashed border-line pb-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 -rotate-3 place-items-center rounded-md border border-brand/25 bg-brand-soft font-display text-[0.7rem] font-bold text-brand">
                MJ
              </span>
              <div>
                <p className="font-display text-[0.95rem] font-bold leading-none tracking-tight text-ink">
                  Tarif token
                </p>
                <p className="mt-1 text-[0.7rem] font-medium text-muted">
                  Dipotong per kata yang diproses
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md border border-line bg-paper-2 px-2 py-1 font-mono text-[0.62rem] font-bold text-muted">
              <Coins className="size-3" aria-hidden />
              TOKEN
            </span>
          </div>

          <ul className="divide-y divide-dashed divide-line">
            {paket.map((p) => (
              <li key={p.id} className="flex items-baseline justify-between gap-3 py-3.5">
                <div>
                  <p className="font-display text-[0.92rem] font-bold text-ink">
                    {p.name}
                    {p.popular && (
                      <span className="ml-2 rounded-full border border-brand/20 bg-brand-soft px-1.5 py-0.5 align-middle text-[0.58rem] font-bold text-brand">
                        Paling laris
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[0.72rem] text-muted">
                    {p.words.toLocaleString("id-ID")} kata naskah ·{" "}
                    {rupiah(Math.round(((p.price / p.words) * 1000) / 100) * 100)} / 1.000 kata
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[0.9rem] font-bold tabular-nums text-ink">
                  {rupiah(p.price)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-line pt-4">
            <p className="max-w-[15rem] text-[0.72rem] leading-relaxed text-muted">
              Sisa saldo tersimpan di akun dan bisa dipakai untuk naskah
              berikutnya.
            </p>
            <span className="stempel shrink-0 text-[0.58rem]">
              {INITIAL_FREE_TOKENS} kata gratis
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
