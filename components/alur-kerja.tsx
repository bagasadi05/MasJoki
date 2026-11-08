import { Calculator, MessageSquare, CreditCard, Sparkles } from "lucide-react";

export const LANGKAH_PEMESANAN = [
  {
    nomor: "01",
    tahap: "LANGKAH 01",
    judul: "Pilih layanan & hitung",
    isi: "Pilih jenis tugas dan lihat estimasi biaya di kalkulator.",
    icon: Calculator,
  },
  {
    nomor: "02",
    tahap: "LANGKAH 02",
    judul: "Kirim pesanan via WhatsApp",
    isi: "Rincian tugas tersusun rapi otomatis, langsung kirim ke Mas Joki.",
    icon: MessageSquare,
  },
  {
    nomor: "03",
    tahap: "LANGKAH 03",
    judul: "Bayar DP 50%",
    isi: "Cukup bayar uang muka 50% di awal untuk mulai pengerjaan.",
    icon: CreditCard,
  },
  {
    nomor: "04",
    tahap: "LANGKAH 04",
    judul: "Terima hasil & revisi",
    isi: "File sumber (.docx/.pptx) diserahkan, termasuk 2× revisi gratis.",
    icon: Sparkles,
  },
];

export function AlurKerja() {
  return (
    <section id="cara-pesan" className="border-b border-line bg-paper-2/40 py-14 sm:py-20 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display text-[2rem] leading-tight tracking-tight text-ink sm:text-[2.5rem]">
            Empat Langkah Pesan Tugas.
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Proses ringkas tanpa perlu bikin akun, langsung terhubung ke WhatsApp Mas Joki.
          </p>
        </div>

        {/* 4 Kartu Bernomor Horizontal, Masing-masing HANYA Satu Baris Teks Pendek */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANGKAH_PEMESANAN.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.nomor}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand bg-brand-soft border border-brand/20 px-2 py-0.5 rounded-md">
                      {item.nomor}
                    </span>
                    <div className="grid size-9 place-items-center rounded-xl bg-paper-2 text-ink group-hover:bg-brand group-hover:text-white transition-colors">
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <h3 className="mt-3 font-display text-[1.05rem] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
                    {item.judul}
                  </h3>

                  <p className="mt-1.5 text-xs text-slate-600 font-medium leading-relaxed">
                    {item.isi}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
