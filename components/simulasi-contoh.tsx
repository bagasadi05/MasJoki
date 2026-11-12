import { Lightbulb, Sparkles } from "lucide-react";
import { TombolContoh } from "@/components/tombol-contoh";
import { aksenLayanan } from "@/lib/aksen";
import { rupiah } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { getService } from "@/lib/services";

const CONTOH_DATA = [
  {
    judul: "Makalah 20 Halaman",
    serviceId: "makalah" as const,
    qty: 20,
    deadlineId: "cepat" as const,
    difficultyId: "standar" as const,
    keterangan:
      "Tenggat 2–3 hari, 8+ referensi jurnal valid, format daftar pustaka APA 7.",
  },
  {
    judul: "PowerPoint 15 Slide",
    serviceId: "powerpoint" as const,
    qty: 15,
    deadlineId: "kilat" as const,
    difficultyId: "standar" as const,
    keterangan:
      "Tenggat hari ini, visual slide rapi, lengkap catatan pembicara presenter.",
  },
  {
    judul: "Artikel Ilmiah (Tugas Kuliah)",
    serviceId: "artikel_ilmiah" as const,
    qty: 2000,
    deadlineId: "normal" as const,
    difficultyId: "standar" as const,
    keterangan:
      "Tenggat 4–6 hari (+10%), struktur naskah lengkap dengan sitasi dan daftar pustaka.",
  },
];

export function SimulasiContoh({
  tanpaBorderAtas = false,
}: {
  tanpaBorderAtas?: boolean;
} = {}) {
  const contoh = CONTOH_DATA.map((item) => {
    const service = getService(item.serviceId);
    const price = computePrice(
      service,
      item.qty,
      item.deadlineId,
      item.difficultyId,
    );
    return { ...item, service, price };
  });

  return (
    <div className={tanpaBorderAtas ? "" : "border-t border-dashed border-line pt-14"}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold text-purple-900 shadow-2xs">
            <Lightbulb className="size-3.5 text-purple-700" />
            <span>Simulasi Contoh Nyata</span>
          </span>
          <h3 className="mt-3 font-display text-[1.8rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.2rem]">
            Tiga Contoh Hitungan Biaya Nyata.
          </h3>
        </div>
        <p className="text-sm font-medium text-slate-600">
          Angka riil langsung dari mesin hitung Mas Joki tanpa estimasi fiktif.
        </p>
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-3">
        {contoh.map((item) => {
          const aksen = aksenLayanan(item.service.id);

          return (
            <li
              key={item.judul}
              className="flex flex-col justify-between rounded-3xl border border-line bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${aksen.chip}`}
                  >
                    <Sparkles className="size-3" />
                    {item.service.name}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Simulasi
                  </span>
                </div>

                <h4 className="mt-5 font-display text-[1.25rem] font-extrabold leading-snug tracking-tight text-ink">
                  {item.judul}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.keterangan}
                </p>
              </div>

              <div className="mt-8 border-t border-dashed border-line pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Total Estimasi
                  </span>
                  <span className="font-display text-[1.55rem] font-black tracking-tight text-brand tabular-nums">
                    {rupiah(item.price.total)}
                  </span>
                </div>

                <TombolContoh
                  serviceId={item.service.id}
                  qty={item.qty}
                  deadlineId={item.deadlineId}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
