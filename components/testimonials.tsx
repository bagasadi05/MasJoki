import Image from "next/image";
import { Star, MessageSquareQuote } from "lucide-react";
import {
  TESTIMONIALS_ENABLED,
  TESTIMONIALS_DATA,
  SCREENSHOTS_BUKTI,
} from "@/data/testimonials";

export function Testimonials() {
  if (!TESTIMONIALS_ENABLED) {
    return null;
  }

  return (
    <section
      id="kata-mereka"
      aria-label="Ulasan dan Testimoni Pelanggan"
      className="relative overflow-hidden border-t border-line bg-gradient-to-b from-paper via-paper-2/40 to-paper py-16 sm:py-24 scroll-mt-20"
    >
      <div
        aria-hidden
        className="kertas-titik pointer-events-none absolute inset-0 opacity-40"
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="stempel-hijau">
            ✓ KATA MEREKA
          </span>
          <h2 className="mt-3 font-display text-[2.1rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.7rem]">
            Ulasan Pengguna Nyata Mas Joki.
          </h2>
          <p className="mt-3.5 text-[0.98rem] leading-relaxed text-slate-600">
            Komentar transparan dari mahasiswa yang telah mempercayakan tugas kuliahnya langsung kepada Mas Joki tanpa perantara.
          </p>
        </div>

        {/* Grid Kartu Testimoni */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                {/* Bintang */}
                <div className="flex items-center gap-1 text-amber">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber text-amber"
                      aria-hidden
                    />
                  ))}
                </div>

                {/* Kutipan */}
                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-ink-soft italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 border-t border-dashed border-line pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand font-mono text-xs font-bold">
                    {t.initial}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-ink">
                      {t.initial}
                    </span>
                    <span className="block text-xs text-slate-500 font-medium">
                      {t.service}
                    </span>
                  </div>
                </div>
                {t.roleOrCity ? (
                  <p className="mt-2 text-xs text-slate-500">
                    {t.roleOrCity}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Galeri Screenshot Bukti Chat / Hasil */}
        {SCREENSHOTS_BUKTI.length > 0 ? (
          <div className="mt-14 border-t border-line pt-10">
            <h3 className="text-center font-display text-lg font-bold text-ink sm:text-xl">
              Tangkapan Layar Bukti Kepuasan &amp; Hasil
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {SCREENSHOTS_BUKTI.map((s) => (
                <div
                  key={s.id}
                  className="overflow-hidden rounded-2xl border border-line bg-paper-2 p-3 shadow-xs"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-white">
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-slate-600 font-medium">
                    {s.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
