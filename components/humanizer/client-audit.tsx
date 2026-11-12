"use client";

import { useState } from "react";
import { Printer, ShieldCheck, CheckCircle2, AlertTriangle, FileText, User } from "lucide-react";
import type { AnalysisResult } from "@/lib/humanizer/types";
import { LOCAL_SD_MIN, MEDIUM_SAFE_PERCENTAGE, SD_TARGET } from "@/lib/humanizer/analyzer";

interface ClientAuditProps {
  analysis: AnalysisResult | null;
}

export function ClientAudit({ analysis }: ClientAuditProps) {
  const [clientName, setClientName] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");

  if (!analysis || analysis.burstiness.totalSentences === 0) {
    return (
      <div className="rounded-xl border border-line bg-card p-10 text-center shadow-xs">
        <ShieldCheck className="size-10 text-muted mx-auto mb-3" />
        <h4 className="font-display font-bold text-base text-ink">Belum Ada Naskah yang Dianalisis</h4>
        <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
          Silakan masukkan naskah tugas atau skripsi di tab Studio Editor untuk membuat Lembar Audit
          Diagnostik Internal.
        </p>
      </div>
    );
  }

  const b = analysis.burstiness;
  const s = analysis.starters;
  const sc = analysis.scan;
  const r = analysis.risk;

  const shortPct = Math.round((b.shortCount / (b.totalSentences || 1)) * 100);
  const medPct = b.mediumPercentage;
  const longPct = Math.round((b.longCount / (b.totalSentences || 1)) * 100);
  const isLongEnough = b.totalSentences >= 5;

  return (
    <div className="print-area space-y-4">
      {/* Meta Input for Client Printing (hidden in print) */}
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-paper-2/60 p-4 sm:flex-row print:hidden">
        <div className="flex-1">
          <label htmlFor="auditClientName" className="block text-[11px] font-bold text-muted uppercase mb-1">
            Nama Klien / Penulis (Opsional)
          </label>
          <div className="relative">
            <User className="size-3.5 text-muted absolute left-3 top-3" />
            <input
              id="auditClientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Contoh: Deni Wahyu S. / Universitas Terbuka…"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line bg-card text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
        <div className="flex-1">
          <label htmlFor="auditDocTitle" className="block text-[11px] font-bold text-muted uppercase mb-1">
            Judul Naskah (Opsional)
          </label>
          <div className="relative">
            <FileText className="size-3.5 text-muted absolute left-3 top-3" />
            <input
              id="auditDocTitle"
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Contoh: Tinjauan Hukum Perlindungan Petugas Lapas…"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line bg-card text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
      </div>

      {/* Lembar Sertifikat / Nota Audit Internal */}
      <div className="relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-xl border border-line bg-card p-6 shadow-xs md:flex-row md:items-center">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand" />
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-brand/25 bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-widest text-brand">
              Mas Joki · Lembar Audit Internal
            </span>
            <span className="font-mono text-xs text-muted">Estimasi internal · bukan keluaran resmi</span>
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-ink">
            {r.verdict}
          </h3>
          {(clientName || documentTitle) && (
            <p className="text-xs font-medium text-ink-soft">
              {clientName && <span>Penulis: <b className="text-ink">{clientName}</b> </span>}
              {documentTitle && <span>· Naskah: <i>&ldquo;{documentTitle}&rdquo;</i></span>}
            </p>
          )}
          <p className="text-xs text-ink-soft">
            Estimasi Risiko AI:{" "}
            <span
              className={`font-bold font-mono text-sm tabular-nums ${
                r.score <= 15
                  ? "text-mint"
                  : r.score <= 30
                    ? "text-amber"
                    : "text-koral"
              }`}
            >
              {r.score.toFixed(1)}% AI
            </span>
            {" · "}
            Indeks Keaslian Manusia:{" "}
            <span className="font-bold font-mono text-mint text-sm tabular-nums">
              {r.humanScore.toFixed(0)}% Pola Natural
            </span>
            {" · "}
            Total Naskah:{" "}
            <span className="font-mono font-semibold text-ink tabular-nums">
              {b.totalWords} kata ({b.totalSentences} kalimat)
            </span>
          </p>
          <p className="text-[11px] leading-relaxed text-muted max-w-xl">
            Angka di atas adalah estimasi heuristik internal Mas Joki (variasi ritme, awalan,
            kata pemicu, dan kurung Inggris), bukan hasil resmi GPTZero, Turnitin, atau alat
            deteksi lain.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="cursor-pointer px-4 py-2.5 rounded-lg border border-line-strong bg-paper-2 hover:bg-paper text-ink text-xs font-bold transition flex items-center gap-2 shrink-0 active:scale-95 print:hidden"
        >
          <Printer className="size-4 text-brand" />
          <span>Cetak Bukti Audit / PDF</span>
        </button>
      </div>

      {/* Detail Metrik Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kolom 1: Analisis Global & Local Burstiness */}
        <div className="p-5 rounded-xl border border-line bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-dashed border-line pb-2.5">
            <h4 className="font-display font-bold text-sm text-ink">
              1. Analisis Global & Local Burstiness
            </h4>
            <span className="text-[10px] font-mono font-bold text-brand uppercase">Ritme Kalimat</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-line/50">
              <span className="text-muted">Global Standar Deviasi (SD):</span>
              <span className="font-bold font-mono text-ink tabular-nums">
                {b.sd.toFixed(2)} kata (Target: ≥ {SD_TARGET.toFixed(1)})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/50">
              <span className="text-muted">Local Min SD (jendela geser minimal):</span>
              <span
                className={`font-bold font-mono tabular-nums ${
                  !isLongEnough
                    ? "text-muted"
                    : b.minLocalSd >= LOCAL_SD_MIN
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {isLongEnough ? `${b.minLocalSd.toFixed(2)} kata` : "— (butuh ≥ 5 kalimat)"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/50">
              <span className="text-muted">Blok Berisiko Rendah (Local Window):</span>
              <span
                className={`font-bold font-mono tabular-nums ${
                  !isLongEnough
                    ? "text-muted"
                    : b.flaggedWindows === 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {!isLongEnough
                  ? "— (sampel terlalu pendek)"
                  : b.flaggedWindows === 0
                    ? "0 blok (Aman)"
                    : `${b.flaggedWindows} blok seragam`}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/50">
              <span className="text-muted">Kalimat Pendek (≤ 9 kata):</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {shortPct}% ({b.shortCount} kalimat)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/50">
              <span className="text-muted">Kalimat Sedang (10–21 kata):</span>
              <span
                className={`font-bold font-mono tabular-nums ${
                  medPct <= MEDIUM_SAFE_PERCENTAGE
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {medPct}% ({b.mediumCount} kalimat)
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Kalimat Panjang (≥ 22 kata):</span>
              <span className="font-bold font-mono text-ink tabular-nums">
                {longPct}% ({b.longCount} kalimat)
              </span>
            </div>
          </div>
        </div>

        {/* Kolom 2: Analisis Stylometric & Kata Pemicu */}
        <div className="p-5 rounded-xl border border-line bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-dashed border-line pb-2.5">
            <h4 className="font-display font-bold text-sm text-ink">
              2. Analisis Stylometric & Kata Pemicu AI
            </h4>
            <span className="text-[10px] font-mono font-bold text-brand uppercase">Leksikal</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-line/50">
              <span className="text-muted">Awalan Kalimat Monoton:</span>
              <span
                className={`font-bold font-mono tabular-nums ${
                  s.percentage <= 15
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {s.percentage}% ({s.repeatedCount} kali berulang)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/50">
              <span className="text-muted">Kata Pantangan (&ldquo;bahwa&rdquo;, &ldquo;serta&rdquo;):</span>
              <span
                className={`font-bold font-mono tabular-nums ${
                  sc.forbiddenCount === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {sc.forbiddenCount} kata ditemukan
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/50">
              <span className="text-muted">Terjemahan Inggris Kurung AI:</span>
              <span
                className={`font-bold font-mono tabular-nums ${
                  sc.totalGlosses === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {sc.totalGlosses} istilah tempelan
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/50">
              <span className="text-muted">Pola Kalimat Template AI:</span>
              <span
                className={`font-bold font-mono tabular-nums ${
                  sc.totalTemplates === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {sc.totalTemplates} pola berulang
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Status Ambang Internal:</span>
              <span
                className={`font-bold font-mono flex items-center gap-1 ${
                  r.score <= 15
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {r.score <= 15 ? (
                  <>
                    <CheckCircle2 className="size-3.5" /> Lolos Ambang Internal
                  </>
                ) : (
                  <>
                    <AlertTriangle className="size-3.5" /> Perlu Humanize Ulang
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
