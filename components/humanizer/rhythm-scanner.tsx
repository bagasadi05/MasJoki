"use client";

import type { AnalysisResult } from "@/lib/humanizer/types";
import { FLAG_MEDIUM_RATIO, LOCAL_SD_MIN, LOCAL_WINDOW_SIZE } from "@/lib/humanizer/analyzer";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface RhythmScannerProps {
  analysis: AnalysisResult | null;
}

export function RhythmScanner({ analysis }: RhythmScannerProps) {
  if (!analysis || analysis.burstiness.totalSentences === 0) {
    return (
      <section className="rounded-xl border border-line bg-card p-5 shadow-xs">
        <p className="text-xs text-muted">
          Masukkan teks untuk memeriksa Local Burstiness per blok kalimat.
        </p>
      </section>
    );
  }

  const sents = analysis.sentences;
  const lens = sents.map((s) => s.wordCount);
  const total = analysis.burstiness.totalSentences;
  const windowSize = Math.min(LOCAL_WINDOW_SIZE, total);

  // Generate sliding windows
  interface WindowData {
    order: number;
    start: number;
    end: number;
    sd: number;
    shortCount: number;
    medCount: number;
    longCount: number;
    isFlagged: boolean;
    reason: string;
  }

  const windows: WindowData[] = [];
  // Samakan dengan analyzer: minimal 5 kalimat dan geser per 1 kalimat.
  if (total >= 5) {
    const step = 1;
    for (let start = 0; start <= total - windowSize; start += step) {
      const end = start + windowSize;
      const slice = lens.slice(start, end);
      const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
      const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / slice.length;
      const sd = Math.sqrt(variance);

      let shortC = 0;
      let medC = 0;
      let longC = 0;
      slice.forEach((w) => {
        if (w <= 9) shortC++;
        else if (w <= 21) medC++;
        else longC++;
      });

      const isFlagged =
        sd < LOCAL_SD_MIN || (medC / slice.length >= FLAG_MEDIUM_RATIO && shortC === 0);
      let reason = "Variasi ritme sehat";
      if (sd < LOCAL_SD_MIN) reason = `SD lokal rendah (${sd.toFixed(1)} < ${LOCAL_SD_MIN})`;
      else if (isFlagged) reason = "Didominasi kalimat sedang tanpa jeda pendek";

      windows.push({
        order: windows.length,
        start: start + 1,
        end,
        sd,
        shortCount: shortC,
        medCount: medC,
        longCount: longC,
        isFlagged,
        reason,
      });
    }
  }

  // Detect consecutive uniform runs (>= 3 sentences)
  interface UniformRun {
    start: number;
    end: number;
    type: string;
  }
  const runs: UniformRun[] = [];

  let startMed = -1;
  for (let i = 0; i <= lens.length; i++) {
    const isMed = i < lens.length && lens[i] >= 10 && lens[i] <= 21;
    if (isMed && startMed === -1) startMed = i;
    if (!isMed && startMed !== -1) {
      if (i - startMed >= 3) {
        runs.push({
          start: startMed,
          end: i - 1,
          type: "sedang berturut-turut (10–21 kata)",
        });
      }
      startMed = -1;
    }
  }

  let startLong = -1;
  for (let i = 0; i <= lens.length; i++) {
    const isLong = i < lens.length && lens[i] >= 22;
    if (isLong && startLong === -1) startLong = i;
    if (!isLong && startLong !== -1) {
      if (i - startLong >= 3) {
        runs.push({
          start: startLong,
          end: i - 1,
          type: "panjang terus-menerus (≥ 22 kata tanpa jeda)",
        });
      }
      startLong = -1;
    }
  }

  const flaggedCount = windows.filter((w) => w.isFlagged).length;
  const RENDER_LIMIT = 24;
  const displayWindows = [...windows]
    .sort((a, b) => Number(b.isFlagged) - Number(a.isFlagged) || a.order - b.order)
    .slice(0, RENDER_LIMIT);

  return (
    <section className="rounded-xl border border-line bg-card p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dashed border-line pb-3">
        <div>
          <h3 className="font-display font-bold text-xs sm:text-sm text-ink">
            Pemindaian Local Burstiness (Jendela Geser {windowSize} Kalimat)
          </h3>
          <p className="text-[11px] text-muted">
            Skor AI sering dinilai per blok kalimat berurutan. Pastikan setiap blok berstatus Hijau
            (SD Lokal ≥ {LOCAL_SD_MIN.toFixed(1)}).
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold text-brand self-start sm:self-auto">
          {total < 5 ? (
            <span className="text-muted flex items-center gap-1">
              <AlertTriangle className="size-3.5" /> Butuh ≥ 5 kalimat
            </span>
          ) : flaggedCount === 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Semua Blok Lokal Aman
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertTriangle className="size-3.5" /> {flaggedCount} Blok Perlu Variasi
            </span>
          )}
        </span>
      </div>

      {windows.length === 0 && (
        <p className="text-xs text-muted bg-paper-2/60 border border-line rounded-xl p-3">
          Naskah masih terlalu pendek untuk penilaian per blok. Tambahkan kalimat hingga minimal 5
          kalimat agar jendela Local Burstiness bisa dihitung.
        </p>
      )}

      {displayWindows.length > 0 && (
        <div className="space-y-2">
          {windows.length > RENDER_LIMIT && (
            <p className="text-[11px] text-muted">
              Menampilkan {RENDER_LIMIT} blok prioritas dari {windows.length} blok. Blok bermasalah
              ditampilkan lebih dulu.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {displayWindows.map((w) => (
              <div
                key={w.order}
                className={`p-3 rounded-xl border text-xs space-y-1 transition ${
                  w.isFlagged
                    ? "border-amber-300 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200"
                    : "border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>
                    Blok #{w.order + 1} (Klm {w.start}–{w.end})
                  </span>
                  <span className="font-mono text-[11px]">
                    {w.isFlagged ? "⚠️" : "✓"} SD: {w.sd.toFixed(1)}
                  </span>
                </div>
                <div className="text-[11px] opacity-80">
                  P: {w.shortCount} · S: {w.medCount} · L: {w.longCount}
                </div>
                <div className="text-[10px] font-medium">{w.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uniform Runs List */}
      {runs.length === 0 ? (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            {total < 3
              ? "Naskah masih terlalu pendek untuk menilai deretan kalimat seragam. Tambahkan beberapa kalimat lagi."
              : "Tidak ditemukan deretan ≥ 3 kalimat berukuran seragam. Variasi panjang kalimat sudah cukup beragam."}
          </span>
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {runs.map((r, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-xs space-y-1.5"
            >
              <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
                <span>
                  Deretan Seragam #{idx + 1}: {r.end - r.start + 1} kalimat {r.type} (kalimat #{r.start + 1}–#{r.end + 1})
                </span>
              </div>
              <ol className="text-xs font-academic text-ink-soft space-y-1 pl-4 list-decimal">
                {sents.slice(r.start, r.end + 1).map((item, k) => (
                  <li key={k}>
                    <span className="font-mono text-[10px] text-muted">[{item.wordCount}k]</span>{" "}
                    {item.text}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
