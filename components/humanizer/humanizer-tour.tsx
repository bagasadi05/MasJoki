"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowLeft, ArrowRight, Check, HelpCircle, Sparkles, X } from "lucide-react";

const KUNCI_SIMPAN = "masjoki-humanizer-tour-v1";

interface Langkah {
  target: string | null;
  judul: string;
  isi: string;
  tips?: string[];
  aksi?: string;
}

const LANGKAH: Langkah[] = [
  {
    target: null,
    judul: "Selamat datang di Humanizer",
    isi: "Tur singkat ini mengikuti urutan kerja yang sebenarnya: tempel naskah, jalankan, lalu bandingkan hasilnya. Bisa dilewati kapan saja.",
    tips: [
      "Naskah tidak disimpan di server Mas Joki.",
      "Angka, persentase, dan sitasi diperiksa ulang setelah ditulis.",
    ],
  },
  {
    target: '[data-tour="token"]',
    judul: "Cek saldo kata dulu",
    isi: "Setiap humanisasi memotong saldo sesuai jumlah kata naskah. Klaim voucher atau isi ulang dari sini sebelum mulai.",
  },
  {
    target: '[data-tour="editor"]',
    judul: "Tempel naskahmu",
    isi: "Tempel teks langsung di editor, atau seret file .docx/.txt ke sini. Format akademik dan sitasi ikut terbaca.",
  },
  {
    target: '[data-tour="proses"]',
    judul: "Jalankan humanisasi",
    isi: "Tombol ini mengirim naskah ke server Mas Joki untuk diolah. Hasilnya muncul di editor yang sama, siap diperiksa sebelum diunduh.",
  },
  {
    target: '[data-tour="diff"]',
    judul: "Bandingkan sebelum–sesudah",
    isi: "Tab Diff menampilkan perubahan per kalimat: kata klise yang dibuang dan kalimat yang dipecah.",
  },
  {
    target: '[data-tour="audit"]',
    judul: "Periksa & unduh audit",
    isi: "Tab Audit merangkum skor keterbacaan, angka yang dijaga, dan sitasi yang tetap utuh. Bisa dicetak sebagai bukti.",
  },
  {
    target: '[data-tour="proteksi"]',
    judul: "Kunci istilah penting",
    isi: "Daftarkan istilah, singkatan, atau nama teori yang tidak boleh berubah. Berlaku untuk pemrosesan berikutnya.",
  },
  {
    target: null,
    judul: "Siap dipakai",
    isi: "Mulai dari naskah pertama. Kalau lupa alurnya, tombol Panduan di kiri bawah bisa membuka tur ini lagi.",
    aksi: "Tempel naskah pertama",
  },
];

export function HumanizerTour() {
  const [siap, setSiap] = useState(false);
  const [buka, setBuka] = useState(false);
  const [indeks, setIndeks] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const kartuRef = useRef<HTMLDivElement>(null);
  const pemicuRef = useRef<HTMLButtonElement>(null);
  const terakhirUkur = useRef(0);

  /* Buka otomatis sekali untuk pengunjung baru. */
  useEffect(() => {
    setSiap(true);
    let sudah = false;
    try {
      sudah = Boolean(localStorage.getItem(KUNCI_SIMPAN));
    } catch {
      sudah = false;
    }
    if (sudah) return;

    const timer = window.setTimeout(() => setBuka(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const tutup = useCallback((tandaiSelesai = true) => {
    if (tandaiSelesai) {
      try {
        localStorage.setItem(KUNCI_SIMPAN, "selesai");
      } catch {
        /* penyimpanan diblokir: biarkan tur tetap bisa dibuka manual */
      }
    }
    setBuka(false);
    setIndeks(0);
    setRect(null);
    setPos(null);
    pemicuRef.current?.focus();
  }, []);

  /* Ukur target tiap langkah, sekaligus gulirkan ke tengah. */
  useEffect(() => {
    if (!buka) return;
    const langkah = LANGKAH[indeks];
    const kurangGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = langkah.target ? document.querySelector<HTMLElement>(langkah.target) : null;

    if (el) {
      el.scrollIntoView({
        behavior: kurangGerak ? "auto" : "smooth",
        block: "center",
      });
    }

    const ukur = () => {
      const kini = langkah.target
        ? document.querySelector<HTMLElement>(langkah.target)
        : null;
      const baru = kini ? kini.getBoundingClientRect() : null;
      setRect((lama) => {
        if (!baru && !lama) return lama;
        if (
          baru &&
          lama &&
          Math.round(baru.top) === Math.round(lama.top) &&
          Math.round(baru.left) === Math.round(lama.left) &&
          Math.round(baru.width) === Math.round(lama.width) &&
          Math.round(baru.height) === Math.round(lama.height)
        ) {
          return lama;
        }
        return baru;
      });
    };

    const timer = window.setTimeout(ukur, el ? 340 : 0);
    return () => window.clearTimeout(timer);
  }, [buka, indeks]);

  /* Ikuti posisi target saat halaman digulir atau jendela diubah. */
  useEffect(() => {
    if (!buka) return;

    const ikuti = () => {
      const sekarang = performance.now();
      if (sekarang - terakhirUkur.current < 80) return;
      terakhirUkur.current = sekarang;
      const target = LANGKAH[indeks].target;
      const el = target ? document.querySelector<HTMLElement>(target) : null;
      const baru = el ? el.getBoundingClientRect() : null;
      setRect((lama) => {
        if (!baru && !lama) return lama;
        if (
          baru &&
          lama &&
          Math.round(baru.top) === Math.round(lama.top) &&
          Math.round(baru.left) === Math.round(lama.left)
        ) {
          return lama;
        }
        return baru;
      });
    };

    window.addEventListener("scroll", ikuti, { passive: true });
    window.addEventListener("resize", ikuti);
    return () => {
      window.removeEventListener("scroll", ikuti);
      window.removeEventListener("resize", ikuti);
    };
  }, [buka, indeks]);

  /* Hitung posisi kartu setelah tinggi kartu diketahui. */
  useEffect(() => {
    if (!buka) return;

    const hitung = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const lebar = Math.min(360, vw - 28);
      const tinggi = kartuRef.current?.offsetHeight ?? 260;

      if (!rect) {
        setPos({
          top: Math.round(Math.max(16, (vh - tinggi) / 2)),
          left: Math.round((vw - lebar) / 2),
          width: lebar,
        });
        return;
      }

      const jarak = 14;
      let top = rect.bottom + jarak;
      if (top + tinggi > vh - 16) top = rect.top - jarak - tinggi;
      if (top < 16) top = Math.max(16, vh - tinggi - 16);
      // Jaga kartu tetap di dalam layar walau target berada di luar viewport.
      top = Math.max(16, Math.min(top, vh - tinggi - 16));

      setPos({
        top: Math.round(top),
        left: Math.round(Math.min(Math.max(12, rect.left), vw - lebar - 12)),
        width: lebar,
      });
    };

    hitung();
  }, [buka, indeks, rect]);

  /* Esc menutup, Tab berputar di dalam kartu. */
  useEffect(() => {
    if (!buka) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        tutup();
      }
      if (e.key === "Tab" && kartuRef.current) {
        const fokus = kartuRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (fokus.length === 0) return;
        const pertama = fokus[0];
        const akhir = fokus[fokus.length - 1];
        if (e.shiftKey && document.activeElement === pertama) {
          e.preventDefault();
          akhir.focus();
        } else if (!e.shiftKey && document.activeElement === akhir) {
          e.preventDefault();
          pertama.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    kartuRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [buka, tutup]);

  const langkah = LANGKAH[indeks];
  const terakhir = indeks === LANGKAH.length - 1;

  const lanjut = () => {
    if (terakhir) {
      tutup();
      window.setTimeout(() => {
        document.querySelector<HTMLTextAreaElement>('[data-tour="editor"]')?.focus();
      }, 220);
      return;
    }
    setIndeks((n) => Math.min(n + 1, LANGKAH.length - 1));
  };

  if (!siap) return null;

  return (
    <>
      {!buka && (
        <button
          ref={pemicuRef}
          type="button"
          onClick={() => setBuka(true)}
          className="fixed bottom-24 left-4 z-30 inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-paper/95 px-3.5 py-2 text-[0.72rem] font-bold text-ink-soft shadow-md backdrop-blur transition-colors hover:border-brand hover:text-brand lg:bottom-6 lg:left-6 print:hidden"
          aria-label="Buka panduan penggunaan Humanizer"
        >
          <HelpCircle className="size-4" aria-hidden />
          Panduan
        </button>
      )}

      {buka && (
        <div className="fixed inset-0 z-[80] h-dvh" role="presentation">
          {/* Penangkap klik; sekaligus scrim gelap saat tidak ada target */}
          <div
            className={`absolute inset-0 transition-colors duration-300 motion-reduce:transition-none ${
              rect ? "bg-transparent" : "bg-[#0b1120]/60"
            }`}
            onClick={() => tutup()}
            aria-hidden
          />

          {/* Sorotan target: bayangan raksasa jadi lapisan gelap */}
          {rect && (
            <div
              aria-hidden
              className="tour-sorot pointer-events-none absolute rounded-xl"
              style={{
                top: Math.max(6, rect.top - 8),
                left: Math.max(6, rect.left - 8),
                width: rect.width + 16,
                height: Math.max(40, rect.height + 16),
              }}
            />
          )}

          <div
            key={indeks}
            ref={kartuRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-judul"
            aria-describedby="tour-isi"
            tabIndex={-1}
            className="tour-kartu absolute rounded-2xl border border-line-strong bg-card p-5 shadow-[0_28px_70px_-24px_rgba(11,17,32,0.6)] ring-1 ring-black/5 outline-none"
            style={{
              top: pos?.top ?? 16,
              left: pos?.left ?? 16,
              width: pos?.width ?? 340,
              visibility: pos ? "visible" : "hidden",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand">
                  {terakhir ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    <Sparkles className="size-4" aria-hidden />
                  )}
                </span>
                <span className="font-mono text-[0.66rem] font-bold tracking-wide text-muted">
                  Langkah {indeks + 1} dari {LANGKAH.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => tutup()}
                aria-label="Tutup panduan"
                className="-mr-1 -mt-1 grid size-7 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-paper-2 hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <h2
              id="tour-judul"
              className="mt-3 font-display text-[1.15rem] font-bold leading-snug tracking-tight text-ink"
            >
              {langkah.judul}
            </h2>
            <p id="tour-isi" className="mt-1.5 text-[0.82rem] leading-relaxed text-ink-soft">
              {langkah.isi}
            </p>

            {langkah.tips && (
              <ul className="mt-3 space-y-1.5">
                {langkah.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-[0.75rem] text-muted">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-mint" aria-hidden />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-line pt-3">
              <div className="flex items-center gap-1.5" aria-hidden>
                {LANGKAH.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                      i === indeks ? "w-5 bg-brand" : "w-1.5 bg-line-strong"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                {indeks > 0 && (
                  <button
                    type="button"
                    onClick={() => setIndeks((n) => Math.max(0, n - 1))}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-2 text-[0.75rem] font-bold text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
                  >
                    <ArrowLeft className="size-3.5" aria-hidden />
                    <span>Kembali</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={lanjut}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[0.75rem] font-bold text-white transition-colors hover:bg-brand-dark"
                >
                  <span>{terakhir ? langkah.aksi ?? "Selesai" : "Lanjut"}</span>
                  <ArrowRight className="size-3.5" aria-hidden />
                </button>
              </div>
            </div>

            {!terakhir && (
              <button
                type="button"
                onClick={() => tutup()}
                className="mt-3 cursor-pointer text-[0.7rem] font-semibold text-muted underline-offset-2 hover:text-ink hover:underline"
              >
                Lewati tur
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
