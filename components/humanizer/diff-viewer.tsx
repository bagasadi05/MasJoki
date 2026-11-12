"use client";

import { useMemo } from "react";
import { DIFF_TOKEN_LIMIT, diffWordsWithMeta } from "@/lib/humanizer/diff";
import { RefreshCw, FileText } from "lucide-react";

interface DiffViewerProps {
  oldText: string;
  newText: string;
  onRefresh?: () => void;
}

export function DiffViewer({ oldText, newText, onRefresh }: DiffViewerProps) {
  const { chunks, truncated } = useMemo(() => {
    if (!oldText && !newText) return { chunks: [], truncated: false };
    return diffWordsWithMeta(oldText, newText);
  }, [oldText, newText]);

  const hasChanges = chunks.some((c) => c.type !== "equal");

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-line p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-ink">
            Diff Inspector: Bukti Perubahan Sebelum vs Sesudah
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Kata pemicu AI & sintaks monoton ditandai{" "}
            <span className="text-rose-600 font-semibold line-through">merah coret</span>, dan
            struktur alami baru ditandai{" "}
            <span className="text-emerald-600 font-semibold">hijau tebal</span>.
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-line bg-paper-2 hover:bg-paper text-xs font-bold text-ink-soft transition cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            <span>Segarkan Diff</span>
          </button>
        )}
      </div>

      {truncated && (
        <p className="rounded-xl border border-amber-300 bg-amber-50/70 dark:bg-amber-950/30 px-4 py-3 text-xs font-semibold text-amber-900 dark:text-amber-200">
          Naskah lebih dari {DIFF_TOKEN_LIMIT.toLocaleString("id-ID")} token, jadi perbandingan
          per kata tidak ditampilkan. Seluruh naskah sebelum dan sesudah ditampilkan sebagai dua
          blok utuh di bawah.
        </p>
      )}

      <div className="p-5 font-academic text-base sm:text-[17px] leading-relaxed text-ink bg-paper/60 border border-line rounded-xl overflow-y-auto max-h-[600px] whitespace-pre-wrap select-text">
        {!hasChanges ? (
          <div className="text-muted text-center py-16 text-sm font-sans flex flex-col items-center gap-2">
            <FileText className="size-8 text-muted/60" />
            <p className="font-bold text-ink-soft">Belum Ada Perubahan</p>
            <p className="text-xs text-muted max-w-sm">
              Klik tombol <b>Humanize Naskah</b> pada editor terlebih dahulu untuk melihat
              perbandingan detail sebelum dan sesudah.
            </p>
          </div>
        ) : (
          chunks.map((chunk, idx) => {
            if (chunk.type === "delete") {
              return (
                <span
                  key={idx}
                  className="diff-del"
                  title="Dihapus / Sinyal AI"
                >
                  {chunk.value}
                </span>
              );
            }
            if (chunk.type === "insert") {
              return (
                <span
                  key={idx}
                  className="diff-ins"
                  title="Diubah / Hasil Humanize"
                >
                  {chunk.value}
                </span>
              );
            }
            return <span key={idx}>{chunk.value}</span>;
          })
        )}
      </div>
    </div>
  );
}
