"use client";

import type { AnalysisResult } from "@/lib/humanizer/types";
import { MEDIUM_SAFE_PERCENTAGE, SD_TARGET } from "@/lib/humanizer/analyzer";

interface KpiCardsProps {
  analysis: AnalysisResult | null;
}

/**
 * Lembar periksa naskah: satu strip dengan garis pemisah, bukan lima kartu
 * statistik. Angka memakai mono supaya bisa dibandingkan sekilas.
 */
export function KpiCards({ analysis }: KpiCardsProps) {
  const hasData = Boolean(analysis && analysis.burstiness.totalSentences > 0);
  const sampelPendek = Boolean(
    analysis && analysis.burstiness.totalSentences > 0 && analysis.burstiness.totalSentences < 5,
  );
  const adaAngka = hasData && !sampelPendek;

  const score = hasData && analysis ? analysis.risk.score : 0;
  const verdict = hasData && analysis ? analysis.risk.verdict : "Siap analisis";
  const barWidth = hasData ? Math.min(100, Math.max(4, score)) : 0;

  const barColor =
    score <= 15
      ? "bg-mint"
      : score <= 30
        ? "bg-amber"
        : "bg-koral";

  const sd = hasData && analysis ? analysis.burstiness.sd.toFixed(2) : "0.0";
  const isLongEnough = Boolean(hasData && analysis && analysis.burstiness.totalSentences >= 5);
  const minLocalSd =
    hasData && analysis
      ? isLongEnough
        ? analysis.burstiness.minLocalSd.toFixed(2)
        : "—"
      : "0.0";
  const flaggedCount = hasData && analysis ? analysis.burstiness.flaggedWindows : 0;

  const isBurstSafe = Boolean(
    analysis && isLongEnough && analysis.burstiness.sd >= SD_TARGET && flaggedCount === 0,
  );
  const burstStatus =
    hasData && analysis
      ? !isLongEnough
        ? "Sampel < 5 kalimat"
        : isBurstSafe
          ? "Global & lokal aman"
          : analysis.burstiness.sd >= SD_TARGET && flaggedCount > 0
            ? `${flaggedCount} blok lokal rendah`
            : "Kalimat terlalu seragam"
      : "Menunggu naskah";

  const medPct = hasData && analysis ? analysis.burstiness.mediumPercentage : 0;
  const medSafe = medPct <= MEDIUM_SAFE_PERCENTAGE;
  const medStatus =
    hasData && analysis
      ? medSafe
        ? `${analysis.burstiness.shortCount} pendek · ${analysis.burstiness.longCount} panjang`
        : "Terlalu banyak kalimat sedang"
      : `Aman jika ≤ ${MEDIUM_SAFE_PERCENTAGE}%`;

  const starterPct = hasData && analysis ? analysis.starters.percentage : 0;
  const forbiddenTotal =
    hasData && analysis ? analysis.scan.forbiddenCount + analysis.scan.totalGlosses : 0;

  const sel = (aktif: boolean, netral = "text-muted") => (aktif ? "text-mint" : netral);

  return (
    <section aria-label="Indikator Diagnostik AI" className="border-y border-line bg-card">
      {/* Kepala lembar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-5">
        <p className="font-mono text-[0.66rem] font-bold text-muted">
          Lembar periksa naskah
        </p>
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-[0.66rem] font-bold ${
            sampelPendek ? "text-muted" : hasData ? "text-ink-soft" : "text-muted"
          }`}
        >
          <span
            aria-hidden
            className={`size-1.5 rounded-full ${sampelPendek ? "bg-amber" : hasData ? "bg-mint" : "bg-line-strong"}`}
          />
          {sampelPendek ? "Sampel pendek" : verdict}
        </span>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-line border-t border-line sm:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:divide-y-0">
        {/* Risiko AI: satu-satunya sel yang diberi bobot lebih */}
        <div className="col-span-2 p-4 sm:col-span-1 lg:col-span-1">
          <p className="font-mono text-[0.64rem] font-bold tracking-wide text-muted">
            Risiko AI · estimasi internal
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-[1.9rem] font-bold leading-none tabular-nums text-ink">
              {adaAngka ? `${score.toFixed(1)}%` : "—"}
            </span>
            <span className="text-[0.68rem] font-medium text-muted">
              {!hasData ? "menunggu naskah" : sampelPendek ? "butuh ≥5 kalimat" : "batas aman < 15%"}
            </span>
          </div>

          {adaAngka ? (
            <div className="mt-3 h-1 w-full overflow-hidden bg-paper-2">
              <div
                className={`h-full ${barColor} transition-[width] duration-500 motion-reduce:transition-none`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          ) : (
            <div className="mt-3 w-full border-t border-dashed border-line-strong" aria-hidden />
          )}

          <p className="mt-1.5 text-[0.66rem] text-muted">
            {sampelPendek && analysis
              ? `Sampel ${analysis.burstiness.totalSentences} kalimat · skor ritme belum dinilai`
              : hasData && analysis
                ? `${analysis.risk.humanScore.toFixed(0)}% pola natural`
                : "Belum ada naskah"}
          </p>
        </div>

        {/* Burstiness */}
        <div className="p-4">
          <p className="font-mono text-[0.64rem] font-bold tracking-wide text-muted">
            Burstiness · SD
          </p>
          <p className="mt-2 font-mono text-[1.45rem] font-bold leading-none tabular-nums text-ink">
            {sd}
          </p>
          <p className="mt-1 text-[0.66rem] text-muted">
            min lokal {minLocalSd} · target ≥ {SD_TARGET.toFixed(1)}
          </p>
          <p className={`mt-2 text-[0.68rem] font-semibold ${sel(isBurstSafe)}`}>
            {burstStatus}
          </p>
        </div>

        {/* Kalimat sedang */}
        <div className="p-4">
          <p className="font-mono text-[0.64rem] font-bold tracking-wide text-muted">
            Kalimat sedang
          </p>
          <p className="mt-2 font-mono text-[1.45rem] font-bold leading-none tabular-nums text-ink">
            {medPct}%
          </p>
          <p className="mt-1 text-[0.66rem] text-muted">rentang 10–21 kata</p>
          <p className={`mt-2 text-[0.68rem] font-semibold ${sel(hasData && medSafe)}`}>
            {medStatus}
          </p>
        </div>

        {/* Awalan monoton */}
        <div className="p-4">
          <p className="font-mono text-[0.64rem] font-bold tracking-wide text-muted">
            Awalan monoton
          </p>
          <p className="mt-2 font-mono text-[1.45rem] font-bold leading-none tabular-nums text-ink">
            {starterPct}%
          </p>
          <p className="mt-1 text-[0.66rem] text-muted">target ≤ 15%</p>
          <p className="mt-2 text-[0.68rem] font-semibold text-muted">
            {hasData ? "Gunakan subjek langsung" : "Pengulangan konjungsi"}
          </p>
        </div>

        {/* Kata & gloss AI */}
        <div className="p-4">
          <p className="font-mono text-[0.64rem] font-bold tracking-wide text-muted">
            Kata &amp; gloss AI
          </p>
          <p
            className={`mt-2 font-mono text-[1.45rem] font-bold leading-none tabular-nums ${
              forbiddenTotal === 0 ? "text-ink" : "text-koral"
            }`}
          >
            {forbiddenTotal}
          </p>
          <p className="mt-1 text-[0.66rem] text-muted">
            &ldquo;bahwa&rdquo;, &ldquo;serta&rdquo;, kurung Inggris
          </p>
          <p className={`mt-2 text-[0.68rem] font-semibold ${sel(forbiddenTotal === 0)}`}>
            {forbiddenTotal === 0 ? "Bersih dari pemicu" : "Perlu dibersihkan"}
          </p>
        </div>
      </div>
    </section>
  );
}
