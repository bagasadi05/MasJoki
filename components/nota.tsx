import { rupiah } from "@/lib/format";
import type { Aksen } from "@/lib/aksen";

export interface NotaLine {
  label: string;
  detail?: string;
  amount: number;
}

interface NotaProps {
  code?: string;
  lines: NotaLine[];
  total: number;
  note?: string;
  stamp?: string;
  animate?: boolean;
  className?: string;
  /** Warna layanan aktif: menggambar pita tipis di atas nota. */
  aksen?: Aksen;
}

/**
 * Nota harga. Elemen visual utama brand: semua angka diperlakukan seperti
 * yang tercetak di kertas, bukan seperti kartu harga SaaS.
 */
export function Nota({
  code = "DRAF",
  lines,
  total,
  note,
  stamp,
  animate = false,
  className = "",
  aksen,
}: NotaProps) {
  return (
    <div className={`nota ${animate ? "nota-masuk" : ""} ${className}`}>
      {aksen ? (
        <span
          aria-hidden
          className="absolute -top-px left-0 right-0 z-10 h-[5px]"
          style={{
            background: `var(${aksen.varName})`,
            borderRadius: "var(--radius-nota) var(--radius-nota) 0 0",
          }}
        />
      ) : null}
      <div className="px-5 pb-7 pt-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xl leading-none tracking-tight">
              Mas Joki
            </p>
            <p className="mt-1.5 text-[0.7rem] text-muted">
              Nota estimasi biaya
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.66rem] tracking-wide text-muted">Nomor</p>
            <p className="font-mono text-sm font-medium tabular-nums text-ink">
              {code}
            </p>
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-line" />

        <dl className="space-y-3">
          {lines.map((line, index) => (
            <div key={`${line.label}-${index}`} className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <dt className="text-[0.86rem] leading-snug text-ink">
                  {line.label}
                </dt>
                {line.detail ? (
                  <dd className="mt-0.5 text-[0.72rem] leading-snug text-muted">
                    {line.detail}
                  </dd>
                ) : null}
              </div>
              <dd className="shrink-0 font-mono text-[0.82rem] tabular-nums text-ink-soft">
                {rupiah(line.amount)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="my-4 border-t border-dashed border-line" />

        <div className="flex items-end justify-between gap-3">
          <p className="text-[0.78rem] font-semibold text-ink">Total</p>
          <p className="font-display text-[1.7rem] leading-none tracking-tight text-ink tabular-nums">
            {rupiah(total)}
          </p>
        </div>

        {note ? (
          <p className="mt-3 text-[0.72rem] leading-relaxed text-muted">{note}</p>
        ) : null}

        {stamp ? (
          <div className="mt-5 flex justify-end">
            <span className={`stempel ${animate ? "stempel-masuk" : ""}`}>
              {stamp}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
