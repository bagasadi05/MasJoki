"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  FileCheck2,
  Presentation,
  Sparkles,
  X,
} from "lucide-react";

interface CaseItem {
  id: string;
  tabLabel: string;
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
  proof?: {
    title: string;
    subtitle: string;
    score: string;
    stats: string;
    image: string;
    alt: string;
    note: string;
  };
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
    id: "humanisasi",
    tabLabel: "Humanisasi AI (Bukti GPTZero 98%)",
    icon: Sparkles,
    title: "Humanisasi Teks AI — Terbukti Lolos GPTZero 98% Human",
    subtitle:
      "Mengubah kalimat kaku hasil generator AI menjadi prosa akademis alami yang lolos pemindaian detektor AI (GPTZero 98% Human) dan Turnitin.",
    proof: {
      title: "Tangkapan Layar Uji GPTZero Asli (Model 4.1m)",
      subtitle:
        "Hasil pemindaian naskah hukum & pemasyarakatan setelah diolah manual oleh Mas Joki — terverifikasi 98% Human.",
      score: "GPTZero: 98% Human (Entirely Human)",
      stats: "1.085 kata · 8.109 karakter",
      image: "/bukti/bukti-humanizer-gptzero.jpg",
      alt: "Bukti Nyata Hasil Scan AI Humanizer Mas Joki di GPTZero 98% Human",
      note: "Dokumen riil: “Sistem pemasyarakatan merupakan bagian dari sistem hukum pidana di Indonesia”. Pengerjaan manual langsung oleh Mas Joki tanpa perantara.",
    },
    before: {
      badge: "Draft AI Mentah (ChatGPT / Claude)",
      metrics: [
        { label: "Deteksi AI", value: "AI Checker 90%+", bad: true },
        { label: "Similarity", value: "Turnitin 48%", bad: true },
      ],
      heading: "Draft Kaku Robotik:",
      snippet:
        "“Dalam rangka untuk mengetahui keselamatan kerja daripada petugas lapas yang bekerja di tempat berisiko tinggi, maka penelitian ini perlu dilakukan. Bahwasanya keselamatan kerja petugas memiliki kaitan erat dengan dukungan sosial yang diberikan oleh atasan dan rekan kerja, di mana hal tersebut sangat esensial sekali bagi ketahanan mental petugas...”",
      notes: [
        "Pemborosan frasa penghubung klise (dalam rangka untuk, bahwasanya)",
        "Struktur kalimat monoton dan repetitif khas bahasa bot",
        "Terdeteksi merah pekat di sistem pemeriksa AI kampus",
      ],
    },
    after: {
      badge: "Hasil Olahan Mas Joki (Terverifikasi)",
      metrics: [
        { label: "Deteksi GPTZero", value: "98% Human (Lolos)", bad: false },
        { label: "Skor AI", value: "1% AI / 1% Mixed", bad: false },
      ],
      heading: "Naskah Mengalir Nyata (Kutipan dari Dokumen Lolos):",
      snippet:
        "“Penelitian ini dilakukan untuk mengetahui bagaimana aturan hukum tentang keselamatan kerja petugas yang bekerja di lapas berisiko tinggi. Selain itu penelitian ini juga ingin melihat bahaya apa saja yang mungkin dihadapi petugas berdasarkan buku dan penelitian yang sudah ada. Pembahasan penelitian ini menggunakan Nusakambangan sebagai tempat yang dijadikan contoh...”",
      notes: [
        "Terbukti lolos deteksi GPTZero Model 4.1m dengan skor 98% Human",
        "Diksi akademis bervariasi dengan ritme penulisan alami manusia",
        "Sitasi dan rujukan [8] tetap utuh serta terintegrasi rapi",
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
        { label: "Kepadatan Kata", value: ">120 Kata / Slide", bad: true },
        { label: "Visualisasi", value: "Nol Grafik & Ikon", bad: true },
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
        { label: "Visualisasi", value: "Kartu Bento & Ikon", bad: false },
      ],
      heading: "Tata Letak Modern & Terarah:",
      snippet:
        "Tiga kartu konsep utama berjejer rapi dengan ikon modern, statistik ditonjolkan dengan angka besar (callout data), dan kolom Speaker Notes diisi naskah narasi lengkap yang tinggal dibaca presenter saat ujian.",
      notes: [
        "Desain rasio lebar 16:9 siap proyektor kampus",
        "Animasi transisi halus tanpa efek norak",
        "Gratis speaker notes (contekan bicara presenter)",
      ],
    },
  },
];

export function BeforeAfterShowcase() {
  const [activeTab, setActiveTab] = useState<string>("humanisasi");
  const [viewMode, setViewMode] = useState<"both" | "before" | "after">("both");

  const activeCase = CASES.find((c) => c.id === activeTab) ?? CASES[0];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      {/* Header Section */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="stempel-hijau">✓ TERVERIFIKASI SISTEM</span>
        <h2 className="mt-3.5 font-display text-[2.1rem] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[2.7rem]">
          Lihat Langsung Standar Pengerjaan Mas Joki.
        </h2>
        <p className="mt-3.5 text-base leading-relaxed text-slate-600 font-medium">
          Bukan sekadar selesai, tapi terbukti memenuhi standar mutu akademik dan lolos deteksi sistem.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Contoh nyata pemindaian dan perbandingan naskah di bawah ini.
        </p>

        {/* Tab Selector */}
        <div
          role="tablist"
          aria-label="Kategori perbandingan naskah"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {CASES.map((item) => {
            const Icon = item.icon;
            const aktif = item.id === activeTab;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={aktif}
                aria-controls={`panel-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                  aktif
                    ? "border-brand bg-brand text-white shadow-md shadow-brand/20 scale-102"
                    : "border-line bg-white dark:bg-[#161f30] text-slate-600 dark:text-slate-300 hover:border-brand/40 hover:text-ink hover:bg-paper-2"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                <span>{item.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Details Header & Tabpanel */}
      <div
        id={`panel-${activeCase.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeCase.id}`}
        className="mt-10 rounded-2xl border border-line bg-white dark:bg-[#131c31] p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
              {activeCase.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 font-medium">
              {activeCase.subtitle}
            </p>
          </div>

          {/* Toggle View on Small Screens */}
          <div
            role="group"
            aria-label="Pilihan tampilan perbandingan"
            className="inline-flex rounded-xl border border-line bg-paper-2 dark:bg-[#0b1120] p-1 text-xs font-bold"
          >
            <button
              type="button"
              aria-pressed={viewMode === "both"}
              onClick={() => setViewMode("both")}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                viewMode === "both"
                  ? "bg-white dark:bg-[#182337] text-brand dark:text-blue-400 shadow-2xs"
                  : "text-slate-500 hover:text-ink"
              }`}
            >
              Keduanya
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "before"}
              onClick={() => setViewMode("before")}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                viewMode === "before"
                  ? "bg-red-600 text-white shadow-2xs"
                  : "text-slate-500 hover:text-ink"
              }`}
            >
              Sebelum
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "after"}
              onClick={() => setViewMode("after")}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                viewMode === "after"
                  ? "bg-mint text-white shadow-2xs"
                  : "text-slate-500 hover:text-ink"
              }`}
            >
              Sesudah
            </button>
          </div>
        </div>

        {/* Comparison Grid & Visual Document Presentation */}
        <div className="mt-6 flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-6">
          {/* Sisi Sebelum (Draft Awal) */}
          {(viewMode === "both" || viewMode === "before") && (
            <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-red-200/90 dark:border-red-900/50 bg-paper dark:bg-[#182337] shadow-sm">
              {/* Document Window Bar Header */}
              <div className="flex items-center justify-between gap-3 border-b border-red-100 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/40 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="ml-1 text-xs font-bold text-red-950 dark:text-red-300 uppercase tracking-wider">
                    {activeCase.before.badge}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeCase.before.metrics.map((m) => (
                    <span
                      key={m.label}
                      className="rounded-full border border-red-200 dark:border-red-800/60 bg-red-100 dark:bg-red-950/60 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:text-red-300"
                    >
                      {m.value}
                    </span>
                  ))}
                </div>
              </div>

              {/* Document Body & Excerpt */}
              <div className="p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                  {activeCase.before.heading}
                </p>
                <blockquote className="mt-2.5 rounded-xl border border-red-200/70 dark:border-red-900/50 bg-white dark:bg-[#0b1120] p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200 italic shadow-2xs line-clamp-5">
                  {activeCase.before.snippet}
                </blockquote>

                {/* Checklist Kekurangan (Lucide X) */}
                <ul className="mt-5 space-y-2.5 border-t border-dashed border-red-200/80 dark:border-red-900/40 pt-4">
                  {activeCase.before.notes.map((note) => (
                    <li
                      key={note}
                      className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      <X className="size-4 shrink-0 text-red-500 dark:text-red-400 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Visual Connector di Layar Mobile */}
          {viewMode === "both" && (
            <div className="flex justify-center md:hidden py-1" aria-hidden>
              <div className="flex items-center gap-2 rounded-full border border-line bg-paper-2 dark:bg-[#0b1120] px-3.5 py-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Diproses Mas Joki</span>
                <ArrowDown className="size-3.5 text-brand" />
              </div>
            </div>
          )}

          {/* Sisi Sesudah (Mas Joki) */}
          {(viewMode === "both" || viewMode === "after") && (
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-mint/60 dark:border-mint/50 bg-paper dark:bg-[#182337] shadow-md shadow-mint/5">
              {/* Document Window Bar Header */}
              <div className="flex items-center justify-between gap-3 border-b border-mint/20 dark:border-mint/30 bg-mint-soft/80 dark:bg-mint/15 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-mint" />
                  <span className="size-2.5 rounded-full bg-mint/50" />
                  <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="ml-1 text-xs font-bold text-mint uppercase tracking-wider">
                    {activeCase.after.badge}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeCase.after.metrics.map((m) => (
                    <span
                      key={m.label}
                      className="rounded-full border border-mint/30 dark:border-mint/40 bg-mint-soft dark:bg-mint/20 px-2.5 py-0.5 text-xs font-bold text-mint"
                    >
                      {m.value}
                    </span>
                  ))}
                </div>
              </div>

              {/* Document Body & Excerpt */}
              <div className="p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-mint">
                  {activeCase.after.heading}
                </p>
                <blockquote className="mt-2.5 rounded-xl border border-mint/30 dark:border-mint/40 bg-white dark:bg-[#0b1120] p-4 text-sm leading-relaxed text-ink dark:text-slate-100 font-medium shadow-2xs line-clamp-5">
                  {activeCase.after.snippet}
                </blockquote>

                {/* Checklist Kelebihan (Lucide Check) */}
                <ul className="mt-5 space-y-2.5 border-t border-dashed border-mint/20 dark:border-mint/30 pt-4">
                  {activeCase.after.notes.map((note) => (
                    <li
                      key={note}
                      className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      <Check className="size-4 shrink-0 text-mint mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bukti Nyata Screenshot Scan Asli (Jika Kasus Memiliki Bukti Gambar) */}
        {activeCase.proof && (
          <div className="mt-8 rounded-2xl border border-line bg-paper-2/60 dark:bg-[#182337] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-xl bg-mint text-white text-xs font-bold shadow-2xs">
                  ✓
                </span>
                <div>
                  <h4 className="font-display text-base font-bold text-ink dark:text-slate-100">
                    {activeCase.proof.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {activeCase.proof.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint-soft px-3 py-1 text-xs font-bold text-mint shadow-2xs">
                  <span className="size-1.5 rounded-full bg-mint animate-pulse" />
                  {activeCase.proof.score}
                </span>
                <span className="rounded-full border border-line bg-white dark:bg-[#0b1120] px-3 py-1 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {activeCase.proof.stats}
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-line bg-white dark:bg-[#0b1120] shadow-sm">
              <Image
                src={activeCase.proof.image}
                alt={activeCase.proof.alt}
                width={1024}
                height={463}
                className="w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
              {activeCase.proof.note}
            </p>
          </div>
        )}

        {/* Bottom Callout */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper-2 dark:bg-[#182337] p-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-medium">
            <span className="size-2 rounded-full bg-brand shrink-0" />
            <span>
              Ingin hasil tugasmu dibuat serapi ini? Dikerjakan langsung oleh Mas Joki — tanpa perantara.
            </span>
          </div>
          <Link
            href="/hitung"
            className="inline-flex items-center gap-1.5 font-bold text-brand dark:text-blue-400 hover:underline"
          >
            <span>Hitung Biaya Sekarang</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
