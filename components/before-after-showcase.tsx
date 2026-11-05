"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Layers,
  Presentation,
  Sparkles,
  XCircle,
} from "lucide-react";

interface CaseItem {
  id: string;
  tabLabel: string;
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
  before: {
    badge: string;
    metrics: { label: string; value: string; bad: boolean }[];
    heading: string;
    snippet: string;
    notes: string[];
  };
  after: {
    badge: string;
    metrics: { label: string; value: string; bad: boolean }[];
    heading: string;
    snippet: string;
    notes: string[];
  };
}

const CASES: CaseItem[] = [
  {
    id: "parafrase",
    tabLabel: "Parafrase & Turnitin",
    icon: Sparkles,
    title: "Parafrase Natural & Bebas Deteksi AI Kaku",
    subtitle:
      "Mengubah kalimat pasif berulang hasil generator mentah menjadi prosa akademik yang elegan, logis, dan berbobot.",
    before: {
      badge: "Draft Awal / AI Mentah",
      metrics: [
        { label: "Similarity Turnitin", value: "48% (Tinggi)", bad: true },
        { label: "Deteksi AI Checker", value: "82% Terdeteksi", bad: true },
      ],
      heading: "Draft Kaku Berulang:",
      snippet:
        "“Dalam rangka untuk mencapai tujuan daripada penelitian tersebut, maka dapat dikemukakan bahwasanya implementasi daripada kecerdasan buatan memiliki peranan yang sangat esensial sekali dalam ranah dunia pendidikan modern pada era sekarang ini...”",
      notes: [
        "Pemborosan kata sambung (dalam rangka untuk, daripada)",
        "Struktur kalimat robotik yang langsung dicurigai dosen",
        "Tanpa sitasi terintegrasi ke kalimat utama",
      ],
    },
    after: {
      badge: "Hasil Olahan Mas Joki",
      metrics: [
        { label: "Similarity Turnitin", value: "8% (Sangat Aman)", bad: false },
        { label: "Deteksi AI Checker", value: "Wajar & natural", bad: false },
      ],
      heading: "Naskah Akademik Mengalir:",
      snippet:
        "“Integrasi kecerdasan buatan terbukti mentransformasi efisiensi evaluasi pembelajaran di perguruan tinggi (Rahman & Pratama, 2024). Kendati demikian, efektivitasnya tetap bertumpu pada kesiapan literasi digital pengajar dalam mengolah umpan balik analitis...”",
      notes: [
        "Kosakata akademis presisi dan hemat kata",
        "Alur penalaran logis khas tulisan mahasiswa teladan",
        "Sitasi rujukan terbaru disisipkan sesuai kaidah APA 7",
      ],
    },
  },
  {
    id: "word",
    tabLabel: "Rapikan Format Word",
    icon: FileCheck2,
    title: "Standarisasi Format Dokumen Siap Ujian",
    subtitle:
      "Perapian menyeluruh margin 4-4-3-3, penomoran Romawi & Arab otomatis, serta daftar isi satu klik.",
    before: {
      badge: "Format Berantakan",
      metrics: [
        { label: "Daftar Isi", value: "Titik Manual", bad: true },
        { label: "Nomor Halaman", value: "Tembus ke Cover", bad: true },
      ],
      heading: "Masalah Umum Format:",
      snippet:
        "Cover terpasang nomor halaman '1'. Halaman kata pengantar bernomor angka biasa (bukan Romawi). Daftar isi dibuat dengan mengetik titik-titik secara manual di keyboard sehingga batas nomor halaman kanan bergelombang tidak rata saat dicetak.",
      notes: [
        "Tidak menggunakan Style Heading bawaan Word",
        "Spasi paragraf tidak konsisten (campur 1.15, 1.5, dan 2.0)",
        "Gambar dan tabel terpotong di tepi kertas",
      ],
    },
    after: {
      badge: "Standar Kampus Mas Joki",
      metrics: [
        { label: "Daftar Isi", value: "TOC Otomatis 1-Klik", bad: false },
        { label: "Nomor Halaman", value: "Section Break Rapi", bad: false },
      ],
      heading: "Struktur Dokumen Profesional:",
      snippet:
        "Dokumen dibagi menggunakan Section Break yang tepat: Cover bersih tanpa nomor, bagian Pengantar bernomor Romawi kecil (i–iv) di bawah tengah, dan Bab Utama bernomor angka Arab (1–45) di kanan atas. Daftar isi, gambar, dan tabel terhubung dinamis.",
      notes: [
        "Navigation Pane Word aktif: loncat ke sub-bab dalam 1 klik",
        "Margin presisi 4-4-3-3 cm standar jilid skripsi",
        "Daftar pustaka otomatis tersortir abjad A–Z",
      ],
    },
  },
  {
    id: "powerpoint",
    tabLabel: "Desain Slide PPT",
    icon: Presentation,
    title: "Slide Visual Interaktif + Naskah Presenter",
    subtitle:
      "Ubah dinding teks yang membosankan menjadi presentasi visual modern yang memukau dosen penguji.",
    before: {
      badge: "Slide Teks Penuh",
      metrics: [
        { label: "Kepadatan Kata", value: ">120 Kata/Slide", bad: true },
        { label: "Visualisasi", value: "Nol Grafik/Ikon", bad: true },
      ],
      heading: "Slide Membosankan Dosen:",
      snippet:
        "Satu slide dipenuhi copy-paste paragraf makalah font 12pt rapat. Presenter hanya membaca teks di layar, audiens tidak fokus, dan tidak ada hierarki visual antara judul utama dan poin pembuktian.",
      notes: [
        "Audiens lelah membaca teks yang terlalu kecil",
        "Warna latar belakang menyilaukan dan kontras buruk",
        "Presenter bingung menentukan poin yang harus dibahas",
      ],
    },
    after: {
      badge: "Slide Presentasi Mas Joki",
      metrics: [
        { label: "Kepadatan Kata", value: "Maks. 25 Kata Kunci", bad: false },
        { label: "Visualisasi", value: "Kartu Bento + Ikon", bad: false },
      ],
      heading: "Tata Letak Modern & Terarah:",
      snippet:
        "Tiga kartu konsep utama berjejer rapi dengan ikon modern, statistik ditonjolkan dengan angka besar (callout data), dan kolom Speaker Notes diisi naskah narasi lengkap yang tinggal dibaca presenter saat ujian.",
      notes: [
        "Desain rasio lebar 16:9 siap proyektor kampus",
        "Animasi transisi halus (Fade/Push) tanpa efek norak",
        "Gratis speaker notes (contekan bicara presenter)",
      ],
    },
  },
];

export function BeforeAfterShowcase() {
  const [activeTab, setActiveTab] = useState<string>("parafrase");
  const [viewMode, setViewMode] = useState<"both" | "before" | "after">("both");

  const activeCase = CASES.find((c) => c.id === activeTab) ?? CASES[0];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      {/* Header Section */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand shadow-2xs">
          <Layers className="size-3.5" />
          <span>Bukti Nyata Kualitas</span>
        </span>
        <h2 className="mt-3.5 font-display text-[2.1rem] font-black leading-tight tracking-[-0.02em] text-ink sm:text-[2.7rem]">
          Lihat Langsung Standar Pengerjaan Mas Joki.
        </h2>
        <p className="mt-3.5 text-[0.98rem] leading-relaxed text-ink-soft">
          Bukan sekadar selesai, tapi memenuhi standar mutu akademik. Geser atau pilih contoh perbandingan di bawah ini.
        </p>

        {/* Tab Selector */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {CASES.map((item) => {
            const Icon = item.icon;
            const aktif = item.id === activeTab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-[0.86rem] font-extrabold transition-all duration-200 ${
                  aktif
                    ? "border-brand bg-brand text-white shadow-md shadow-brand/20 scale-102"
                    : "border-line bg-white text-ink-soft hover:border-brand/40 hover:text-ink hover:bg-paper-2"
                }`}
              >
                <Icon className="size-4" />
                <span>{item.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Details Header */}
      <div className="mt-10 rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <h3 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
              {activeCase.title}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {activeCase.subtitle}
            </p>
          </div>

          {/* Toggle View on Small Screens */}
          <div className="inline-flex rounded-xl border border-line bg-paper-2 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("both")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                viewMode === "both"
                  ? "bg-white text-brand shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              Keduanya
            </button>
            <button
              type="button"
              onClick={() => setViewMode("before")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                viewMode === "before"
                  ? "bg-red-500 text-white shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              Sebelum
            </button>
            <button
              type="button"
              onClick={() => setViewMode("after")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                viewMode === "after"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              Sesudah
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Sisi Sebelum (Draft Awal) */}
          {(viewMode === "both" || viewMode === "before") && (
            <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-6 flex flex-col justify-between">
              <div>
                {/* Badge & Metrics */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-200 pb-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-[0.72rem] font-bold text-red-800">
                    <XCircle className="size-3.5 text-red-600" />
                    <span>{activeCase.before.badge}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {activeCase.before.metrics.map((m) => (
                      <span
                        key={m.label}
                        className="rounded-md border border-red-200 bg-white px-2 py-0.5 font-mono text-[0.68rem] font-bold text-red-700"
                      >
                        {m.value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Snippet */}
                <div className="mt-4">
                  <p className="text-[0.78rem] font-bold uppercase tracking-wider text-red-900">
                    {activeCase.before.heading}
                  </p>
                  <blockquote className="mt-2 rounded-xl border border-red-200 bg-white/90 p-4 font-mono text-[0.82rem] leading-relaxed text-red-950/80 italic">
                    {activeCase.before.snippet}
                  </blockquote>
                </div>
              </div>

              {/* Weak Points Notes */}
              <ul className="mt-5 space-y-2 border-t border-dashed border-red-200 pt-3.5">
                {activeCase.before.notes.map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-2 text-[0.78rem] text-red-900"
                  >
                    <AlertTriangle className="size-3.5 shrink-0 text-red-500 mt-0.5" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sisi Sesudah (Mas Joki) */}
          {(viewMode === "both" || viewMode === "after") && (
            <div className="relative rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/50 p-6 shadow-md shadow-emerald-500/5 flex flex-col justify-between">
              <span className="absolute -top-3 right-5 rounded-full bg-emerald-600 px-3 py-0.5 text-[0.66rem] font-black uppercase tracking-wider text-white shadow-xs">
                Standar Mas Joki ✓
              </span>

              <div>
                {/* Badge & Metrics */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[0.72rem] font-bold text-emerald-800">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>{activeCase.after.badge}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {activeCase.after.metrics.map((m) => (
                      <span
                        key={m.label}
                        className="rounded-md border border-emerald-200 bg-white px-2 py-0.5 font-mono text-[0.68rem] font-bold text-emerald-800"
                      >
                        {m.value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Snippet */}
                <div className="mt-4">
                  <p className="text-[0.78rem] font-bold uppercase tracking-wider text-emerald-950">
                    {activeCase.after.heading}
                  </p>
                  <blockquote className="mt-2 rounded-xl border border-emerald-200 bg-white p-4 font-mono text-[0.82rem] leading-relaxed text-ink">
                    {activeCase.after.snippet}
                  </blockquote>
                </div>
              </div>

              {/* Superior Points Notes */}
              <ul className="mt-5 space-y-2 border-t border-dashed border-emerald-200 pt-3.5">
                {activeCase.after.notes.map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-2 text-[0.78rem] font-medium text-emerald-950"
                  >
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Callout */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper-2 p-4 text-[0.82rem]">
          <div className="flex items-center gap-2.5 text-ink-soft">
            <span className="size-2 rounded-full bg-brand " />
            <span>
              Ingin hasil tugasmu dibuat serapi ini? Dikerjakan cermat oleh tim profesional.
            </span>
          </div>
          <a
            href="#hitung"
            className="inline-flex items-center gap-1.5 font-bold text-brand hover:underline"
          >
            <span>Hitung Sekarang</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
