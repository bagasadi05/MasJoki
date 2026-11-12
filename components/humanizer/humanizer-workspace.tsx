"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Sparkles,
  Upload,
  Copy,
  Download,
  Trash2,
  FileText,
  ShieldCheck,
  Coins,
  Plus,
  X,
  RotateCcw,
  Gift,
  Loader2,
} from "lucide-react";
import { getHumanizerWalletAction, humanizeWithGeminiAction } from "@/app/actions";
import { analyze, countWords } from "@/lib/humanizer/analyzer";
import { applyBahasaSederhana } from "@/lib/humanizer/engine";
import { lacak } from "@/lib/analytics";
import type { AnalysisResult } from "@/lib/humanizer/types";

import { KpiCards } from "./kpi-cards";
import { DiffViewer } from "./diff-viewer";
import { ClientAudit } from "./client-audit";
import { RhythmScanner } from "./rhythm-scanner";
import { TokenModal } from "./token-modal";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function HumanizerWorkspace() {
  const [inputText, setInputText] = useState("");
  const [historyBeforeHumanize, setHistoryBeforeHumanize] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"studio" | "diff" | "audit" | "settings">("studio");
  const [customTerms, setCustomTerms] = useState<string[]>([]);
  const [newTermInput, setNewTermInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<"buy" | "voucher">("buy");
  const [toast, setToast] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getHumanizerWalletAction()
      .then((result) => {
        if (cancelled) return;
        if (result.ok) {
          setTokenBalance(result.remainingWords);
          setWalletError(null);
        } else {
          setWalletError(result.error);
        }
        setWalletLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setWalletError("Saldo token tidak bisa dimuat. Silakan muat ulang halaman.");
        setWalletLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced text for smooth typing without lag
  const [debouncedText, setDebouncedText] = useState(inputText);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(inputText);
    }, 150);
    return () => clearTimeout(timer);
  }, [inputText]);

  // Compute live analysis on debounced text
  const analysis: AnalysisResult | null = useMemo(() => {
    if (!debouncedText.trim()) return null;
    return analyze(debouncedText);
  }, [debouncedText]);

  // Word count di editor memakai definisi yang sama dengan analyzer, supaya
  // jumlah kata yang ditagih identik dengan angka di panel diagnostik.
  const wordCount = useMemo(() => countWords(inputText), [inputText]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Naskah hanya hidup di editor: cegah tab tertutup tanpa peringatan.
  useEffect(() => {
    if (!inputText.trim()) return;

    const peringatan = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", peringatan);
    return () => window.removeEventListener("beforeunload", peringatan);
  }, [inputText]);

  const handleBalanceChange = (newBal: number) => {
    setTokenBalance(newBal);
  };

  // Aksi utama untuk menulis ulang naskah.
  const handleHumanize = async () => {
    if (!inputText.trim()) {
      showToast("Tempelkan teks naskah kamu terlebih dahulu!");
      return;
    }

    if (walletLoading || walletError) {
      showToast(walletError ?? "Saldo token sedang dimuat. Coba lagi sebentar.");
      return;
    }

    if (wordCount === 0 || isProcessing) return;

    setIsProcessing(true);

    try {
      const originalText = historyBeforeHumanize ?? inputText;

      let humanized = "";
      let usedServerAi = false;
      let usedLocalFallback = false;
      let ditolakIntegritas = false;
      const res = await humanizeWithGeminiAction(inputText, {
        intensity: "sederhana",
        customTerms,
      });
      lacak("humanize_mulai", { kata: wordCount });

      const serverText = res.text?.trim() ?? "";
      if (res.ok && serverText && serverText !== inputText.trim()) {
        humanized = serverText;
        usedServerAi = true;
        if (typeof res.remainingWords === "number") setTokenBalance(res.remainingWords);
      } else if (!res.ok && res.errorCode === "integrity") {
        // AI mengubah angka/sitasi: server sudah mengembalikan saldo. Jangan
        // berhenti di galat — sederhanakan dengan mesin lokal yang menjaga
        // angka secara konstruktif, tanpa memanggil AI lagi.
        ditolakIntegritas = true;
        usedLocalFallback = true;
        humanized = applyBahasaSederhana(inputText, {
          intensity: "sederhana",
          bahasaSederhana: true,
          customTerms,
        });
      } else if (!res.ok && res.errorCode !== "ai") {
        showToast(res.error ?? "Naskah tidak bisa diproses.");
        return;
      } else {
        // Gemini bisa mengembalikan salinan yang sama tanpa error. Tetap coba
        // mesin lokal agar tombol Humanize tidak berakhir sebagai no-op.
        usedLocalFallback = true;
        humanized = applyBahasaSederhana(inputText, {
          intensity: "sederhana",
          bahasaSederhana: true,
          customTerms,
        });
      }

      if (humanized.trim() === inputText.trim()) {
        showToast(
          usedLocalFallback
            ? "Layanan AI di server gagal dan mesin lokal belum menemukan pola yang bisa disederhanakan. Coba lagi sebentar atau hubungi Mas Joki."
            : "Naskah belum berubah. AI dan mesin lokal tidak menemukan pola yang bisa disederhanakan."
        );
        return;
      }

      setHistoryBeforeHumanize(originalText);
      setInputText(humanized);

      const newAnalysis = analyze(humanized);
      lacak("humanize_sukses", {
        kata: wordCount,
        sumber: res.cached ? "cache" : usedServerAi ? "ai" : "lokal",
      });
      const skorTeks =
        newAnalysis.burstiness.totalSentences < 5
          ? "Skor ritme belum dinilai karena sampel di bawah 5 kalimat"
          : `Estimasi internal ${newAnalysis.risk.score.toFixed(1)}%`;
      showToast(
        res.cached
          ? `Naskah ini sudah pernah diproses dengan pengaturan yang sama. Hasil diambil dari cache — token tidak dipotong. ${skorTeks}.`
          : ditolakIntegritas
            ? `Hasil AI ditolak karena mengubah angka atau sitasi. Naskah disederhanakan dengan mesin lokal, token tidak dipotong. ${skorTeks}.`
            : usedServerAi
              ? `Naskah disederhanakan! ${skorTeks}. Terpakai ${wordCount.toLocaleString("id-ID")} kata.`
              : usedLocalFallback
                ? `Layanan AI sedang sibuk; naskah disederhanakan dengan mesin lokal. ${skorTeks}.`
                : `Naskah disederhanakan dengan mesin lokal. ${skorTeks}.`
      );
    } catch {
      try {
        const wallet = await getHumanizerWalletAction();
        if (wallet.ok) setTokenBalance(wallet.remainingWords);
      } catch {
        // Status saldo tetap tidak diketahui jika sinkronisasi kedua juga gagal.
      }
      showToast("Koneksi terputus. Saldo disinkronkan jika server sempat memproses; cek hasil sebelum mencoba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = () => {
    if (!historyBeforeHumanize) {
      showToast("Belum ada riwayat naskah sebelumnya yang tersimpan.");
      return;
    }

    const prev = historyBeforeHumanize;
    setHistoryBeforeHumanize(null);
    setInputText(prev);
    showToast("Naskah dikembalikan ke versi sebelumnya. Token yang sudah dipakai tidak dibatalkan.");
  };

  // Process raw file
  const processFile = async (file: File) => {
    if (isProcessing) return;
    const fileNameLower = file.name.toLowerCase();
    const MAX_FILE_BYTES = 2 * 1024 * 1024;

    if (file.size > MAX_FILE_BYTES) {
      showToast("Ukuran file maksimal 2 MB.");
      return;
    }

    if (!fileNameLower.endsWith(".docx") && !fileNameLower.endsWith(".txt")) {
      showToast("Format belum didukung. Gunakan file .docx atau .txt.");
      return;
    }

    if (fileNameLower.endsWith(".docx")) {
      try {
        const mammothModule = await import("mammoth");
        const mammoth = mammothModule.default || mammothModule;
        const arrayBuffer = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer });
        setInputText(res.value);
        setHistoryBeforeHumanize(null);
        showToast(`File Word "${file.name}" berhasil dimuat!`);
      } catch (err: unknown) {
        showToast(
          `Gagal membaca DOCX: ${err instanceof Error ? err.message : "Format tidak terbaca"}`
        );
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputText(content);
        setHistoryBeforeHumanize(null);
        showToast(`File "${file.name}" berhasil dimuat!`);
      };
      reader.onerror = () => showToast("Gagal membaca file teks.");
      reader.readAsText(file);
    }
  };

  // File Upload via button
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and Drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  // Copy to clipboard with fallback
  const handleCopy = async () => {
    if (!inputText.trim()) {
      showToast("Teks kosong!");
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inputText);
      } else {
        const ta = document.createElement("textarea");
        ta.value = inputText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      showToast("Teks berhasil disalin ke clipboard!");
    } catch {
      showToast("Gagal menyalin otomatis. Silakan blok dan salin naskah secara manual.");
    }
  };

  // Download .TXT
  const handleDownloadTxt = () => {
    if (!inputText.trim()) return;
    const blob = new Blob([inputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Naskah_Humanized_MasJoki.txt";
    a.click();
    // Jangan revoke langsung: Safari/Firefox bisa membatalkan unduhan.
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    showToast("File TXT berhasil diunduh!");
  };

  // Download .DOC with safe XML escaping and object URL revoke
  const handleDownloadDoc = () => {
    if (!inputText.trim()) return;

    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Naskah Humanized Mas Joki</title><style>body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; text-align: justify; }</style></head><body>";
    const footer = "</body></html>";

    const formatted = inputText
      .split("\n\n")
      .map(
        (p) =>
          `<p style='text-align: justify; text-indent: 1cm; margin-bottom: 8pt;'>${escapeXml(p).replace(/\n/g, "<br>")}</p>`
      )
      .join("");

    const blob = new Blob(["\ufeff" + header + formatted + footer], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Naskah_Humanized_MasJoki.doc";
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    showToast("Dokumen Word (.doc) berhasil diunduh!");
  };

  // Add custom term
  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    const t = newTermInput.trim();
    if (!t) return;
    if (customTerms.some((item) => item.toLowerCase() === t.toLowerCase())) {
      showToast("Istilah ini sudah ada di daftar.");
      return;
    }
    setCustomTerms([...customTerms, t]);
    setNewTermInput("");
    showToast(`Istilah "${t}" berhasil ditambahkan ke daftar proteksi!`);
  };

  // Remove custom term
  const handleRemoveTerm = (termToRemove: string) => {
    setCustomTerms(customTerms.filter((item) => item !== termToRemove));
  };

  const tabOrder = ["studio", "diff", "audit", "settings"] as const;
  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + tabOrder.length) % tabOrder.length;
    const nextTab = tabOrder[nextIndex];
    setActiveTab(nextTab);
    document.getElementById(`humanizer-tab-${nextTab}`)?.focus();
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-ink text-white dark:bg-card dark:text-ink dark:border dark:border-line text-xs font-bold shadow-2xl flex items-center gap-2 animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <Sparkles className="size-4 text-stabilo shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Banner & Token Bar */}
      <section className="flex flex-col flex-wrap items-start justify-between gap-4 border-y border-line bg-card px-4 py-4 sm:px-5 md:flex-row md:items-center">
        <div className="flex items-center gap-3.5">
          <div className="grid size-9 shrink-0 place-items-center rounded-md border border-line bg-paper-2 text-ink-soft">
            <ShieldCheck className="size-4" aria-hidden />
          </div>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-ink">
              Humanizer AI — Penulisan Lugas
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Mengubah naskah akademik & formal menjadi bahasa Indonesia yang sangat sederhana, agak polos,
              dan mengalir apa adanya, dengan pemeriksaan angka, persentase, dan sitasi referensi.
              <span className="mt-1 block text-[11px] font-medium text-muted/90">
                Naskah dikirim ke server Mas Joki untuk diolah, lalu hasilnya dikembalikan ke editor ini. Naskah tidak disimpan di server setelah diproses.
              </span>
              <span className="mt-1 block text-[11px] font-medium text-muted/90">
                Mengikuti standar Skill Humanisasi Akademik: variasi panjang kalimat,
                pelaku jelas, dan istilah serta sitasi tetap utuh.
              </span>
            </p>
          </div>
        </div>

        {/* Token Balance & CTAs */}
        <div className="flex items-center flex-wrap gap-2.5 self-stretch md:self-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-line bg-paper-2/70 font-mono text-[0.7rem] font-bold text-ink" data-tour="token">
            <Coins className="size-4 text-amber-500" />
            <span>
              Saldo Token:{" "}
              <span className="font-mono text-brand">
                {walletLoading
                  ? "Memuat…"
                  : walletError
                    ? "Tidak tersedia"
                    : tokenBalance.toLocaleString("id-ID")}
              </span>{" "}
              kata
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalInitialTab("voucher");
              setIsModalOpen(true);
              lacak("token_modal", { tab: "voucher" });
            }}
            disabled={walletLoading || Boolean(walletError)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-line bg-card hover:border-brand/40 text-ink text-xs font-bold transition"
          >
            <Gift className="size-3.5 text-brand" />
            <span>Klaim Voucher</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setModalInitialTab("buy");
              setIsModalOpen(true);
              lacak("token_modal", { tab: "buy" });
            }}
            disabled={walletLoading || Boolean(walletError)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-brand hover:bg-brand-dark text-white text-xs font-bold transition active:scale-98"
          >
            <Sparkles className="size-3.5" />
            <span>Isi Ulang Token</span>
          </button>
        </div>
        {walletError && (
          <p className="basis-full text-xs font-semibold text-rose-700" role="alert">
            {walletError}
          </p>
        )}
      </section>

      {/* 5 KPI Diagnostic Cards */}
      <KpiCards analysis={analysis} />

      {/* Tab Navigation */}
      <div className="flex items-center gap-5 overflow-x-auto border-b border-line" role="tablist" data-tour="tabs">
        <button
          type="button"
          id="humanizer-tab-studio"
          role="tab"
          aria-selected={activeTab === "studio"}
          aria-controls="humanizer-panel-studio"
          tabIndex={activeTab === "studio" ? 0 : -1}
          onKeyDown={(event) => handleTabKeyDown(event, 0)}
          onClick={() => setActiveTab("studio")}
          className={`-mb-px cursor-pointer border-b-2 px-1 py-2.5 text-xs font-bold transition whitespace-nowrap ${
            activeTab === "studio"
              ? "border-brand text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          Studio Editor
        </button>
        <button
          type="button"
          id="humanizer-tab-diff"
          role="tab"
          aria-selected={activeTab === "diff"}
          aria-controls="humanizer-panel-diff"
          tabIndex={activeTab === "diff" ? 0 : -1}
          onKeyDown={(event) => handleTabKeyDown(event, 1)}
          onClick={() => setActiveTab("diff")}
          data-tour="diff"
          className={`-mb-px cursor-pointer border-b-2 px-1 py-2.5 text-xs font-bold transition whitespace-nowrap ${
            activeTab === "diff"
              ? "border-brand text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          Diff Perbandingan
        </button>
        <button
          type="button"
          id="humanizer-tab-audit"
          role="tab"
          aria-selected={activeTab === "audit"}
          aria-controls="humanizer-panel-audit"
          tabIndex={activeTab === "audit" ? 0 : -1}
          onKeyDown={(event) => handleTabKeyDown(event, 2)}
          onClick={() => setActiveTab("audit")}
          data-tour="audit"
          className={`-mb-px cursor-pointer border-b-2 px-1 py-2.5 text-xs font-bold transition whitespace-nowrap ${
            activeTab === "audit"
              ? "border-brand text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          Sertifikat Audit Klien
        </button>
        <button
          type="button"
          id="humanizer-tab-settings"
          role="tab"
          aria-selected={activeTab === "settings"}
          aria-controls="humanizer-panel-settings"
          tabIndex={activeTab === "settings" ? 0 : -1}
          onKeyDown={(event) => handleTabKeyDown(event, 3)}
          onClick={() => setActiveTab("settings")}
          data-tour="proteksi"
          className={`-mb-px cursor-pointer border-b-2 px-1 py-2.5 text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "settings"
              ? "border-brand text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <span>Proteksi Istilah</span>
          <span className="size-4 rounded-full bg-brand-soft text-brand text-[10px] grid place-items-center font-bold">
            {customTerms.length}
          </span>
        </button>
      </div>

      {/* Tab Content 1: Studio */}
      {activeTab === "studio" && (
        <div
          id="humanizer-panel-studio"
          role="tabpanel"
          aria-labelledby="humanizer-tab-studio"
          tabIndex={0}
          className="space-y-4"
        >
          {/* Command Bar */}
          <section className="flex flex-col items-stretch justify-between gap-3 border-b border-line bg-card px-3 py-3 sm:flex-row sm:items-center sm:px-4">
            {/* Primary Action Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHumanize}
                data-tour="proses"
                disabled={isProcessing || walletLoading || Boolean(walletError)}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-dark text-white font-bold text-xs sm:text-sm active:scale-98 transition disabled:opacity-60 disabled:cursor-wait"
                title="Tulis ulang naskah tanpa merusak sitasi atau angka data"
              >
                {isProcessing ? (
                  <Loader2 className="size-4 animate-spin text-stabilo" />
                ) : (
                  <Sparkles className="size-4 text-stabilo" />
                )}
                <span>{isProcessing ? "Menulis Ulang Naskah…" : "Humanize Naskah"}</span>
              </button>
            </div>

            {/* Actions: Upload & Downloads */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-line">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.docx"
                onChange={handleFileUpload}
                aria-label="Pilih file TXT atau DOCX"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-white dark:bg-slate-800 hover:bg-paper text-ink text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="size-3.5 text-brand" />
                <span>Upload DOCX/TXT</span>
              </button>

              {historyBeforeHumanize && (
                <button
                  type="button"
                  onClick={handleRestore}
                  disabled={isProcessing}
                  className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-brand hover:bg-brand-soft text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Kembalikan ke versi sebelum humanize"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset Asli</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-white dark:bg-slate-800 text-ink text-xs font-semibold hover:bg-paper transition"
              >
                <Copy className="size-3.5 text-muted" />
                <span>Salin</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadDoc}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink text-white dark:bg-slate-800 dark:border dark:border-line text-xs font-semibold hover:bg-slate-800 transition"
              >
                <Download className="size-3.5 text-stabilo" />
                <span>Word (.doc)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="cursor-pointer px-2.5 py-1.5 rounded-xl border border-line bg-white dark:bg-slate-800 text-muted hover:text-ink text-xs font-medium transition"
              >
                .TXT
              </button>
            </div>
          </section>

          {/* Symmetrical Dual-Pane Workspace */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            {/* Left Pane: Textarea Editor with Drag-and-Drop */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative bg-white dark:bg-card rounded-2xl border border-line shadow-xs flex flex-col h-[520px] overflow-hidden"
            >
              {/* Prominent Loading Overlay saat memproses Humanize */}
              {isProcessing && (
                <div className="absolute inset-0 z-30 backdrop-blur-xs bg-white/85 dark:bg-card/90 flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none">
                  <div className="size-14 rounded-2xl bg-brand/10 dark:bg-brand/20 border border-brand/20 flex items-center justify-center mb-3.5 shadow-inner">
                    <Loader2 className="size-7 text-brand animate-spin" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-ink">
                    Sedang Menulis Ulang Naskah…
                  </h4>
                  <p className="text-xs text-muted max-w-sm mt-1.5 leading-relaxed">
                    Menerapkan aturan penulisan lugas, memecah kalimat padat, dan merapikan irama kalimat.
                  </p>
                  <div className="w-52 h-1.5 bg-paper-2 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-brand rounded-full animate-indeterminate" />
                  </div>
                  <span className="text-[11px] text-muted/80 mt-2 font-mono">
                    Memproses {wordCount.toLocaleString("id-ID")} kata…
                  </span>
                </div>
              )}

              <div className="px-5 py-3 border-b border-line bg-paper/70 flex items-center justify-between h-12 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <h3 className="font-bold text-xs sm:text-sm text-ink">
                    Editor Naskah Klien (Input / Hasil)
                  </h3>
                </div>
                <div className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-paper-2 text-ink-soft">
                  {wordCount.toLocaleString("id-ID")} kata ·{" "}
                  {analysis?.burstiness.totalSentences || 0} kalimat
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isProcessing}
                id="humanizer-editor"
                data-tour="editor"
                aria-label="Naskah yang ingin di-humanize"
                placeholder="Tempelkan atau drag & drop naskah (.docx/.txt) di sini untuk dipindai…"
                className="w-full flex-1 p-5 font-academic text-base sm:text-[17px] leading-relaxed text-ink bg-transparent focus:outline-none resize-none overflow-y-auto placeholder:text-muted/60 disabled:opacity-60"
              />

              <div className="px-5 py-2.5 border-t border-line bg-paper/60 flex items-center justify-between text-[11px] text-muted h-10 shrink-0">
                <span>Sitasi dan nomor pasal dipertahankan.</span>
                {inputText && !isProcessing && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Kosongkan editor teks?")) {
                        setInputText("");
                        setHistoryBeforeHumanize(null);
                      }
                    }}
                    className="cursor-pointer text-muted hover:text-rose-600 transition font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="size-3" />
                    <span>Kosongkan</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Pane: X-Ray Heatmap & Sparkline */}
            <div className="relative bg-white dark:bg-card rounded-2xl border border-line shadow-xs flex flex-col h-[520px] overflow-hidden">
              {isProcessing && (
                <div className="absolute inset-0 z-20 backdrop-blur-xs bg-white/60 dark:bg-card/70 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-semibold text-brand flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-soft border border-brand/20 shadow-xs">
                    <Loader2 className="size-3.5 animate-spin" />
                    Memperbarui Peta X-Ray…
                  </span>
                </div>
              )}
              <div className="px-5 py-3 border-b border-line bg-paper/70 flex flex-wrap items-center justify-between gap-2 min-h-[48px] shrink-0">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-brand" />
                  <h3 className="font-bold text-xs sm:text-sm text-ink">
                    Peta X-Ray Deteksi Blok AI
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-1 text-[10px] font-semibold">
                  <span className="hl-forbidden">Merah: AI Gloss</span>
                  <span className="hl-starter">Kuning: Awalan Monoton</span>
                  <span className="hl-template">Biru: Template</span>
                  <span className="hl-short">Hijau: Pendek</span>
                </div>
              </div>

              {/* Sparklines Rhythm Chart */}
              <div className="px-5 py-2 bg-paper/40 border-b border-line shrink-0">
                <div className="flex items-center justify-between text-[11px] text-muted mb-1 font-medium">
                  <span>Ritme Panjang Kalimat:</span>
                  {analysis && analysis.burstiness.totalSentences > 0 && (
                    <span className="font-mono text-[10px] text-ink-soft">
                      P: {Math.round((analysis.burstiness.shortCount / analysis.burstiness.totalSentences) * 100)}% | S: {analysis.burstiness.mediumPercentage}% | L: {Math.round((analysis.burstiness.longCount / analysis.burstiness.totalSentences) * 100)}%
                    </span>
                  )}
                </div>
                <div className="h-9 flex items-end gap-[3px] overflow-x-auto pb-1 bg-white dark:bg-slate-900 border border-line rounded-lg px-2">
                  {analysis && analysis.sentences.length > 0 ? (
                    analysis.sentences.map((s, idx) => {
                      const len = s.wordCount;
                      const heightPct = Math.min(100, Math.max(12, Math.round((len / 42) * 100)));
                      const barColor =
                        len <= 9
                          ? "bg-emerald-500"
                          : len <= 21
                            ? "bg-amber-400"
                            : "bg-purple-600";
                      return (
                        <div
                          key={idx}
                          className={`w-1.5 shrink-0 rounded-t ${barColor} transition duration-300`}
                          style={{ height: `${heightPct}%` }}
                          title={`Kalimat #${idx + 1}: ${len} kata`}
                        />
                      );
                    })
                  ) : (
                    <div className="text-[10px] text-muted self-center mx-auto">
                      Belum ada kalimat
                    </div>
                  )}
                </div>
              </div>

              {/* X-Ray Text Preview */}
              <div className="p-5 font-academic text-base sm:text-[17px] leading-relaxed text-ink overflow-y-auto flex-1 select-text">
                {!analysis || analysis.burstiness.totalSentences === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-muted text-sm">
                    <FileText className="size-10 text-muted/50 mb-2" />
                    <p className="font-sans font-bold text-ink-soft text-xs">
                      Belum Ada Naskah yang Dipindai
                    </p>
                    <p className="font-sans text-xs text-muted mt-0.5 max-w-xs">
                      Tempelkan teks di editor kiri atau unggah file DOCX untuk memindai sinyal AI.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {analysis.sentences.map((st, idx) => {
                      let tagCls = "";
                      let title = "";

                      if (st.hasForbiddenWord) {
                        tagCls = "hl-forbidden";
                        title = `Kata pantangan AI: ${st.forbiddenWords.join(", ")}`;
                      } else if (st.isMonoStarter) {
                        tagCls = "hl-starter";
                        title = `Awalan monoton: "${st.starter}"`;
                      } else if (st.wordCount <= 9) {
                        tagCls = "hl-short";
                        title = `Kalimat pendek penyeimbang SD (${st.wordCount} kata)`;
                      }

                      return (
                        <span key={idx} className="inline leading-relaxed mr-1.5">
                          {tagCls ? (
                            <span className={tagCls} title={title}>
                              {st.text}
                            </span>
                          ) : (
                            <span>{st.text}</span>
                          )}{" "}
                          <sub className="text-[10px] text-muted font-mono select-none">
                            [{st.wordCount}k]
                          </sub>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="px-5 py-2.5 border-t border-line bg-paper/60 flex items-center justify-between text-[11px] text-muted h-10 shrink-0">
                <span>
                  {analysis?.burstiness.totalSentences || 0} kalimat · Global SD:{" "}
                  {analysis?.burstiness.sd.toFixed(2) || "0.0"} · Min Lokal:{" "}
                  {analysis?.burstiness.minLocalSd.toFixed(2) || "0.0"}
                </span>
                <span className="font-mono text-[10px] font-bold text-brand">
                  Engine Mas Joki
                </span>
              </div>
            </div>
          </section>

          {/* Rhythm Scanner Panel */}
          <RhythmScanner analysis={analysis} />
        </div>
      )}

      {/* Tab Content 2: Diff */}
      {activeTab === "diff" && (
        <div id="humanizer-panel-diff" role="tabpanel" aria-labelledby="humanizer-tab-diff" tabIndex={0}>
          <DiffViewer
            oldText={historyBeforeHumanize || inputText}
            newText={inputText}
            onRefresh={() => showToast("Perbandingan diperbarui")}
          />
        </div>
      )}

      {/* Tab Content 3: Audit */}
      {activeTab === "audit" && (
        <div id="humanizer-panel-audit" role="tabpanel" aria-labelledby="humanizer-tab-audit" tabIndex={0}>
          <ClientAudit analysis={analysis} />
        </div>
      )}

      {/* Tab Content 4: Settings & Protected Terms (Interactive) */}
      {activeTab === "settings" && (
        <div
          id="humanizer-panel-settings"
          role="tabpanel"
          aria-labelledby="humanizer-tab-settings"
          tabIndex={0}
          className="bg-white dark:bg-card rounded-2xl border border-line p-6 shadow-xs space-y-6"
        >
          <div>
            <h3 className="font-display font-bold text-lg text-ink">
              Kamus Proteksi Istilah Ilmiah & Hukum
            </h3>
            <p className="text-xs text-muted mt-1">
              Daftar istilah baku, pasal undang-undang, dan nama institusi yang tidak diubah saat
              naskah diproses.
            </p>
          </div>

          {/* Add custom term form */}
          <form onSubmit={handleAddTerm} className="flex gap-2">
            <input
              type="text"
              value={newTermInput}
              onChange={(e) => setNewTermInput(e.target.value)}
              id="humanizer-custom-term"
              aria-label="Istilah khusus yang ingin dilindungi"
              placeholder="Ketik istilah khusus yang ingin dilindungi (misal: konsep, singkatan, metodologi)…"
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-line bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Tambah Istilah</span>
            </button>
          </form>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider">
                Istilah yang Dilindungi Saat Ini ({customTerms.length}):
              </label>
              {customTerms.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCustomTerms([])}
                  className="cursor-pointer text-[11px] text-rose-600 hover:underline font-semibold"
                >
                  Hapus Semua Istilah
                </button>
              )}
            </div>

            {customTerms.length === 0 ? (
              <p className="text-xs text-muted italic bg-paper-2/60 p-3 rounded-xl border border-line">
                Belum ada istilah khusus yang dilindungi. Tambahkan istilah teknis, nama institusi, atau singkatan pada kolom di atas jika tidak ingin diubah oleh mesin AI.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {customTerms.map((term, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-brand-soft text-brand border border-brand/20 group"
                  >
                    <span>{term}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTerm(term)}
                      className="cursor-pointer text-brand/60 hover:text-rose-600 transition"
                      title={`Hapus ${term}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-line pt-4 space-y-2 text-xs text-muted leading-relaxed">
            <h4 className="font-bold text-sm text-ink mb-1">Standar Kualitas Mas Joki:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <b>Global &amp; Local Burstiness:</b> Memvariasikan panjang kalimat agar ritme tidak
                seragam. Angka SD dipakai sebagai indikator internal, bukan jaminan lolos detektor.
              </li>
              <li>
                <b>Zero-Synthetic-Glue:</b> Mengurangi konjungsi artifisial (&ldquo;bahwa&rdquo;, &ldquo;serta&rdquo;, &ldquo;dalam rangka&rdquo;) dan
                menggantinya dengan pola bahasa natural Indonesia.
              </li>
              <li>
                <b>Preservasi Makna:</b> Istilah Indonesia dalam kurung, nomor undang-undang, serta sitasi akademik tidak dihapus.
              </li>
              <li>
                <b>Mode Penulisan Lugas:</b> Mengubah teks kaku/akademik menjadi bahasa sehari-hari yang sederhana dan polos tanpa merusak angka desimal, persentase, atau sitasi referensi (misal: Slavin 2015).
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Token Modal */}
      <TokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentBalance={tokenBalance}
        onBalanceChange={handleBalanceChange}
        initialTab={modalInitialTab}
      />
    </div>
  );
}
