"use client";

import type { AnalysisResult } from "@/lib/humanizer/types";
import { SD_TARGET } from "@/lib/humanizer/analyzer";

interface KpiCardsProps {
  analysis: AnalysisResult | null;
}

export function KpiCards({ analysis }: KpiCardsProps) {
  const hasData = analysis && analysis.burstiness.totalSentences > 0;

  const score = hasData ? analysis.risk.score : 0;
  const verdict = hasData ? analysis.risk.verdict : "SIAP ANALISIS";
  const badgeClass = hasData
    ? analysis.risk.badgeClass
    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";
  const scoreColor = hasData ? analysis.risk.color : "text-emerald-600 dark:text-emerald-400";
  const barWidth = hasData ? Math.min(100, Math.max(5, score)) : 0;

  const barColor =
    score <= 15
      ? "bg-emerald-500"
      : score <= 30
        ? "bg-amber-500"
        : "bg-rose-500";

  const sd = hasData ? analysis.burstiness.sd.toFixed(2) : "0.0";
  const isLongEnough = hasData && analysis.burstiness.totalSentences >= 5;
  const minLocalSd = !hasData
    ? "0.0"
    : isLongEnough
      ? analysis.burstiness.minLocalSd.toFixed(2)
      : "—";
  const flaggedCount = hasData ? analysis.burstiness.flaggedWindows : 0;

  const isBurstSafe = isLongEnough && analysis.burstiness.sd >= SD_TARGET && flaggedCount === 0;
  const burstStatus = !hasData
    ? "Menunggu naskah..."
    : !isLongEnough
      ? "Sampel < 5 kalimat"
      : isBurstSafe
        ? "✓ Global & Local SD Aman"
        : analysis.burstiness.sd >= SD_TARGET && flaggedCount > 0
          ? `⚠️ ${flaggedCount} Blok Lokal Rendah`
          : "⚠️ Rendah (Kalimat Seragam)";

  const burstStatusColor = !hasData
    ? "text-slate-500"
    : isBurstSafe
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-amber-600 dark:text-amber-400";

  const medPct = hasData ? analysis.burstiness.mediumPercentage : 0;
  const medSafe = medPct <= 55;
  const medStatus = !hasData
    ? "Aman jika ≤ 55%"
    : medSafe
      ? `✓ Aman (${analysis.burstiness.shortCount} pendek · ${analysis.burstiness.longCount} panjang)`
      : "⚠️ Terlalu Banyak Kalimat Sedang";
  const medStatusColor = !hasData
    ? "text-slate-500"
    : medSafe
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-amber-600 dark:text-amber-400";

  const starterPct = hasData ? analysis.starters.percentage : 0;
  const forbiddenTotal = hasData
    ? analysis.scan.forbiddenCount + analysis.scan.totalGlosses
    : 0;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-12 gap-3" aria-label="Indikator Diagnostik AI">
      {/* Card 1: Estimasi Risiko AI (4 Cols Desktop) */}
      <div className="col-span-2 lg:col-span-4 bg-white dark:bg-card rounded-2xl border border-line p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-brand" />
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Risiko AI (Estimasi Internal)
            </span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${badgeClass}`}>
            {verdict}
          </span>
        </div>

        <div className="my-2.5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2.5">
            <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${scoreColor}`}>
              {hasData ? `${score.toFixed(1)}%` : "0.0%"}
            </span>
            <span className="text-xs text-muted font-medium">Batas Aman: &lt; 15%</span>
          </div>
          {hasData && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {analysis.risk.humanScore.toFixed(0)}% Human
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`${barColor} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>Variasi ritme, sintaksis & struktur leksikal</span>
            <span className="font-mono font-semibold text-ink-soft">Target: Hijau</span>
          </div>
        </div>
      </div>

      {/* Card 2: Burstiness SD (2 Cols) */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-card rounded-2xl border border-line p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Burstiness (SD)
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paper-2 text-ink-soft">
            &ge; {SD_TARGET.toFixed(1)}
          </span>
        </div>
        <div className="my-1.5">
          <div className="text-2xl sm:text-3xl font-extrabold text-ink font-mono">{sd}</div>
          <p className="text-[11px] text-muted mt-0.5 truncate">Min Lokal: {minLocalSd}</p>
        </div>
        <div className={`text-[11px] font-semibold truncate ${burstStatusColor}`}>
          {burstStatus}
        </div>
      </div>

      {/* Card 3: Kalimat Sedang (2 Cols) */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-card rounded-2xl border border-line p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Kalimat Sedang
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paper-2 text-ink-soft">
            &le; 55%
          </span>
        </div>
        <div className="my-1.5">
          <div className="text-2xl sm:text-3xl font-extrabold text-ink font-mono">
            {medPct}%
          </div>
          <p className="text-[11px] text-muted mt-0.5">Rentang 10–21 kata</p>
        </div>
        <div className={`text-[11px] font-semibold truncate ${medStatusColor}`}>
          {medStatus}
        </div>
      </div>

      {/* Card 4: Awalan Monoton (2 Cols) */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-card rounded-2xl border border-line p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Awalan Monoton
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paper-2 text-ink-soft">
            &le; 15%
          </span>
        </div>
        <div className="my-1.5">
          <div className="text-2xl sm:text-3xl font-extrabold text-ink font-mono">
            {starterPct}%
          </div>
          <p className="text-[11px] text-muted mt-0.5">Pengulangan konjungsi</p>
        </div>
        <div className="text-[11px] font-semibold text-muted truncate">
          Target: Subjek langsung
        </div>
      </div>

      {/* Card 5: Kata & Gloss AI (2 Cols) */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-card rounded-2xl border border-line p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Kata & Gloss AI
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paper-2 text-ink-soft">
            Target 0
          </span>
        </div>
        <div className="my-1.5">
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${forbiddenTotal === 0 ? "text-ink" : "text-rose-600 dark:text-rose-400"}`}>
            {forbiddenTotal}
          </div>
          <p className="text-[11px] text-muted mt-0.5 truncate">&ldquo;bahwa&rdquo;, &ldquo;serta&rdquo;, kurung Inggris</p>
        </div>
        <div className="text-[11px] font-semibold text-muted truncate">
          {forbiddenTotal === 0 ? "✓ Bersih dari pemicu" : "Perlu dibersihkan"}
        </div>
      </div>
    </section>
  );
}
