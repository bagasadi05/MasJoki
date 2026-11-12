import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { faqRingkas } from "@/content/faq";

/**
 * FAQ ringkas di beranda: menutup keberatan terakhir sebelum CTA tanpa
 * menduplikasi teks. Sumbernya subset dari content/faq.ts.
 *
 * Memakai <details> natif supaya tetap bisa dibuka tanpa JavaScript dan
 * sudah punya semantik serta perilaku keyboard bawaan.
 */
export function FaqRingkas() {
  return (
    <section
      id="faq-ringkas"
      className="border-b border-line bg-paper-2 py-14 sm:py-20 scroll-mt-16"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="stempel">SEBELUM PESAN</span>
            <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.4rem]">
              Lima hal yang paling sering ditanyakan.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 font-medium">
              Ringkas saja. Kalau pertanyaanmu belum ada di sini, daftar lengkapnya
              ada di halaman FAQ.
            </p>
          </div>

          <Link
            href="/faq"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            <span>Semua pertanyaan</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {faqRingkas.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-line bg-card p-5 transition-colors open:border-line-strong"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-bold leading-snug text-ink [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <ChevronDown
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="mt-3 border-t border-dashed border-line pt-3 text-sm leading-relaxed text-slate-600 font-medium">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
