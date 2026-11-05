import { CheckCircle2, Send, SlidersHorizontal, Sparkles, Wallet } from "lucide-react";

export const LANGKAH_PEMESANAN = [
  {
    nomor: "01",
    tahap: "TAHAP 01",
    judul: "Atur Jumlah & Tenggat",
    isi: "Pilih jenis tugas, tentukan jumlah halaman atau kata, dan pilih tenggat yang kamu kejar. Rincian nota langsung keluar otomatis.",
    deliverable: "Estimasi biaya terkunci seketika",
    icon: SlidersHorizontal,
  },
  {
    nomor: "02",
    tahap: "TAHAP 02",
    judul: "Kirim Ringkasan ke WhatsApp",
    isi: "Tempelkan tautan materi atau panduan tugasmu. Format pesanan langsung terisi rapi di chat WhatsApp resmi admin Mas Joki.",
    deliverable: "Brief terverifikasi tanpa formulir ribet",
    icon: Send,
  },
  {
    nomor: "03",
    tahap: "TAHAP 03",
    judul: "Bayar Lewat E-Wallet Resmi",
    isi: "Admin mengonfirmasi instruksi tugas dan mengunci nominal total. Transfer via ShopeePay, GoPay, atau DANA ke satu nomor resmi.",
    deliverable: "Tanpa biaya admin tersembunyi",
    icon: Wallet,
  },
  {
    nomor: "04",
    tahap: "TAHAP 04",
    judul: "Terima File Jadi & Garansi 2×",
    isi: "Hasil diserahkan tepat waktu dalam file sumber mentah (.docx/.pptx) yang siap kamu edit, lengkap dengan hak 2× revisi gratis.",
    deliverable: "File mentah asli + garansi 2× revisi",
    icon: Sparkles,
  },
];

export function AlurKerja() {
  return (
    <section className="border-t border-line bg-paper-2/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="stempel-hijau">
            ✓ ALUR RESMI TRANSPARAN
          </span>
          <h2 className="mt-3 font-display text-[2.1rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.7rem]">
            Empat Tahap Kerja, Tanpa Bikin Akun.
          </h2>
          <p className="mt-3.5 text-[0.98rem] leading-relaxed text-ink-soft">
            Transparansi penuh dari detik pertama kamu membuka kalkulator hingga dokumen tugas siap dikumpulkan ke dosen.
          </p>
        </div>

        {/* 4-Step Academic Routing Slip Grid */}
        <div className="relative mt-14">
          {/* Subtle connecting dotted line on desktop */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-12 inset-x-8 h-0.5 border-t-2 border-dashed border-line-strong -z-0"
          />

          <ol className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LANGKAH_PEMESANAN.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.nomor}
                  className="group relative flex flex-col justify-between rounded-3xl border border-line bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-lg"
                >
                  <div>
                    {/* Step badge & icon */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.72rem] font-bold text-muted bg-paper-2 border border-line px-2.5 py-1 rounded-lg">
                        {item.tahap}
                      </span>
                      <div className="grid size-11 place-items-center rounded-2xl border border-line bg-paper text-ink transition-transform group-hover:scale-105 group-hover:bg-brand group-hover:text-white group-hover:border-brand">
                        <Icon className="size-5" />
                      </div>
                    </div>

                    <h3 className="mt-5 font-display text-[1.18rem] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
                      {item.judul}
                    </h3>

                    <p className="mt-2.5 text-[0.86rem] leading-relaxed text-ink-soft/85">
                      {item.isi}
                    </p>
                  </div>

                  {/* Deliverable info tag */}
                  <div className="mt-6 border-t border-dashed border-line pt-3.5">
                    <span className="flex items-center gap-1.5 text-[0.74rem] font-semibold text-emerald-800">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      <span>{item.deliverable}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
