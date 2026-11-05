"use client";

import { CheckCircle2, Clock, Flame, ShieldCheck, Sparkles, Zap } from "lucide-react";

const JAMINAN = [
  { text: "Harga Pasti Terbuka di Awal", badge: "Transparan", ikon: Zap },
  { text: "Pengerjaan Mulai dari 6 Jam", badge: "Kilat", ikon: Clock },
  { text: "Garansi 2× Revisi Gratis", badge: "Bebas Cemas", ikon: Sparkles },
  { text: "File Mentah Word (.docx) & PPT (.pptx)", badge: "Siap Edit", ikon: CheckCircle2 },
  { text: "Data & Naskah Mahasiswa 100% Privat", badge: "Kerahasiaan", ikon: ShieldCheck },
  { text: "Pembayaran Resmi ShopeePay · GoPay · DANA", badge: "E-Wallet", ikon: Zap },
  { text: "Lolos Turnitin Natural & Human Score Tinggi", badge: "Mutu Akademik", ikon: CheckCircle2 },
  { text: "Langsung Chat WhatsApp Tanpa Buat Akun", badge: "Praktis", ikon: Flame },
];

const AKTIVITAS_LIVE = [
  { status: "selesai", teks: "Parafrase Bab 4 Skripsi (Turnitin 8%)", waktu: "5 mnt lalu" },
  { status: "proses", teks: "Makalah Hukum Tata Negara 18 Halaman", waktu: "Tenggat 24 Jam" },
  { status: "selesai", teks: "PPT Sidang Seminar Proposal 15 Slide", waktu: "12 mnt lalu" },
  { status: "proses", teks: "Humanisasi Naskah AI Jurnal Sinta 2 (2.400 Kata)", waktu: "Sedang Dikerjakan" },
  { status: "selesai", teks: "Rapikan Format Word & Sitasi APA 7th (72 Hal)", waktu: "20 mnt lalu" },
  { status: "proses", teks: "Terjemahan Abstrak Jurnal Bahasa Inggris", waktu: "Dalam Antrean" },
  { status: "selesai", teks: "Makalah Manajemen Bisnis 20 Hal + Rujukan Jurnal", waktu: "35 mnt lalu" },
];

export function MarqueeTicker() {
  return (
    <div className="relative overflow-hidden border-y border-line bg-paper-2/90 select-none py-2.5 space-y-2">
      {/* Track 1: Jaminan & Standar Layanan (Bergerak ke Kiri) */}
      <div className="relative flex overflow-hidden">
        <div className="animate-marquee flex items-center gap-4 whitespace-nowrap">
          {JAMINAN.map((item, index) => {
            const Ikon = item.ikon;
            return (
              <div
                key={`j1-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/90 px-3.5 py-1.5 shadow-2xs backdrop-blur-xs transition-colors hover:border-brand/40"
              >
                <span className="grid size-5 place-items-center rounded-full bg-brand-soft text-brand">
                  <Ikon className="size-3" />
                </span>
                <span className="font-display text-[0.78rem] font-bold text-ink">
                  {item.text}
                </span>
                <span className="rounded-md bg-paper-2 px-1.5 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider text-muted">
                  {item.badge}
                </span>
              </div>
            );
          })}
        </div>

        {/* Duplikat untuk seamless loop */}
        <div aria-hidden className="animate-marquee flex items-center gap-4 whitespace-nowrap">
          {JAMINAN.map((item, index) => {
            const Ikon = item.ikon;
            return (
              <div
                key={`j2-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/90 px-3.5 py-1.5 shadow-2xs backdrop-blur-xs transition-colors hover:border-brand/40"
              >
                <span className="grid size-5 place-items-center rounded-full bg-brand-soft text-brand">
                  <Ikon className="size-3" />
                </span>
                <span className="font-display text-[0.78rem] font-bold text-ink">
                  {item.text}
                </span>
                <span className="rounded-md bg-paper-2 px-1.5 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider text-muted">
                  {item.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Track 2: Live Activity / Simulasi Riil Pengerjaan (Bergerak ke Kanan) */}
      <div className="relative flex overflow-hidden">
        <div className="animate-marquee-reverse flex items-center gap-4 whitespace-nowrap">
          {AKTIVITAS_LIVE.map((item, index) => {
            const isSelesai = item.status === "selesai";
            return (
              <div
                key={`a1-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-paper/95 px-3 py-1 shadow-2xs text-[0.74rem]"
              >
                <span className="relative flex size-2">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                      isSelesai ? "bg-mint" : "bg-brand"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full size-2 ${
                      isSelesai ? "bg-mint" : "bg-brand"
                    }`}
                  />
                </span>
                <span
                  className={`font-bold ${
                    isSelesai ? "text-mint" : "text-brand"
                  }`}
                >
                  {isSelesai ? "Selesai" : "Diproses"}:
                </span>
                <span className="font-medium text-ink-soft">{item.teks}</span>
                <span className="font-mono text-[0.66rem] text-muted font-semibold">
                  · {item.waktu}
                </span>
              </div>
            );
          })}
        </div>

        {/* Duplikat untuk seamless loop */}
        <div aria-hidden className="animate-marquee-reverse flex items-center gap-4 whitespace-nowrap">
          {AKTIVITAS_LIVE.map((item, index) => {
            const isSelesai = item.status === "selesai";
            return (
              <div
                key={`a2-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-paper/95 px-3 py-1 shadow-2xs text-[0.74rem]"
              >
                <span className="relative flex size-2">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                      isSelesai ? "bg-mint" : "bg-brand"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full size-2 ${
                      isSelesai ? "bg-mint" : "bg-brand"
                    }`}
                  />
                </span>
                <span
                  className={`font-bold ${
                    isSelesai ? "text-mint" : "text-brand"
                  }`}
                >
                  {isSelesai ? "Selesai" : "Diproses"}:
                </span>
                <span className="font-medium text-ink-soft">{item.teks}</span>
                <span className="font-mono text-[0.66rem] text-muted font-semibold">
                  · {item.waktu}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
