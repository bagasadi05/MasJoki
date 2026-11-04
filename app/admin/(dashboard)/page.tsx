import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { rupiah } from "@/lib/format";
import { STATUS_LABEL, statusPesanan } from "@/lib/payment-status";
import { supabaseAdmin } from "@/lib/supabase";
import { waLink } from "@/lib/site";
import { keluar } from "../login/actions";
import { TombolCekBayar } from "./tombol-cek-bayar";
import { ubahStatus } from "./actions";

export const metadata: Metadata = {
  title: "Dashboard admin",
  robots: { index: false, follow: false },
};

export const instant = false;

interface BarisPesanan {
  code: string;
  customer_name: string;
  whatsapp: string;
  service_name: string;
  total: number;
  status: string;
  created_at: string;
}

interface BarisKutipan {
  code: string;
  customer_name: string;
  whatsapp: string;
  service_id: string;
  detail: string;
  deadline: string;
  status: string;
  created_at: string;
}

const LABEL_KUTIPAN: Record<string, string> = {
  baru: "Baru",
  dibalas: "Sudah dibalas",
  deal: "Deal",
  ditutup: "Ditutup",
};

function waktu(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export default async function Dashboard() {
  await connection();

  if (!supabaseAdmin) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
        <h1 className="font-display text-2xl tracking-tight text-ink">
          Database belum terhubung
        </h1>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">
          Isi <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code>, dan{" "}
          <code className="font-mono">ADMIN_PASSWORD</code> di{" "}
          <code className="font-mono">.env.local</code>, lalu jalankan ulang
          server.
        </p>
      </main>
    );
  }

  const [{ data: pesanan }, { data: kutipan }] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select(
        "code, customer_name, whatsapp, service_name, total, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<BarisPesanan[]>(),
    supabaseAdmin
      .from("quote_requests")
      .select(
        "code, customer_name, whatsapp, service_id, detail, deadline, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(50)
      .returns<BarisKutipan[]>(),
  ]);

  const daftarPesanan = pesanan ?? [];
  const daftarKutipan = kutipan ?? [];

  const hitung = (status: string) =>
    daftarPesanan.filter((row) => statusPesanan(row.status) === status).length;

  const statistik = [
    { label: "Perlu konfirmasi", nilai: hitung("menunggu_konfirmasi") },
    { label: "Menunggu bayar", nilai: hitung("menunggu_pembayaran") },
    { label: "Sudah dibayar", nilai: hitung("dibayar") + hitung("dikerjakan") },
    { label: "Selesai", nilai: hitung("selesai") },
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <span className="grid size-8 -rotate-3 place-items-center rounded-[3px] border-2 border-brand bg-brand-soft font-display text-[0.8rem] font-bold text-brand">
            MJ
          </span>
          <div>
            <p className="font-display text-lg leading-none tracking-tight text-ink">
              Admin
            </p>
            <p className="mt-1 text-[0.72rem] text-muted">
              {daftarPesanan.length} pesanan · {daftarKutipan.length} penawaran
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[0.8rem] text-muted transition-colors hover:text-brand"
          >
            Lihat situs
          </Link>
          <form action={keluar}>
            <button
              type="submit"
              className="rounded-md border border-line px-3 py-1.5 text-[0.78rem] font-semibold text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
            >
              Keluar
            </button>
          </form>
        </div>
      </header>

      <section
        aria-label="Ringkasan"
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {statistik.map((item) => (
          <div
            key={item.label}
            className="rounded-md border border-line bg-white px-4 py-3"
          >
            <p className="font-display text-2xl leading-none tracking-tight text-ink tabular-nums">
              {item.nilai}
            </p>
            <p className="mt-1.5 text-[0.72rem] text-muted">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl tracking-tight text-ink">
          Pesanan terbaru
        </h2>

        {daftarPesanan.length === 0 ? (
          <p className="mt-3 rounded-md border border-dashed border-line py-10 text-center text-[0.84rem] text-muted">
            Belum ada pesanan.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-md border border-line bg-white">
            <table className="w-full min-w-[54rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[0.7rem] text-muted">
                  <th className="px-4 py-2.5 font-medium">Kode</th>
                  <th className="px-4 py-2.5 font-medium">Pelanggan</th>
                  <th className="px-4 py-2.5 font-medium">Layanan</th>
                  <th className="px-4 py-2.5 text-right font-medium">Total</th>
                  <th className="px-4 py-2.5 font-medium">Dibuat</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {daftarPesanan.map((row) => (
                  <tr
                    key={row.code}
                    className="border-b border-line/70 align-middle last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[0.76rem] tabular-nums text-ink">
                      {row.code}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[0.82rem] text-ink">{row.customer_name}</p>
                      <a
                        href={waLink(
                          `Halo ${row.customer_name}, soal pesanan ${row.code} di Mas Joki.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.72rem] text-muted transition-colors hover:text-brand"
                      >
                        {row.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[0.8rem] text-ink-soft">
                      {row.service_name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-[0.78rem] tabular-nums text-ink-soft">
                      {rupiah(row.total)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[0.74rem] text-muted">
                      {waktu(row.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <form
                        action={ubahStatus}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="jenis" value="pesanan" />
                        <input type="hidden" name="kode" value={row.code} />
                        <select
                          name="status"
                          defaultValue={statusPesanan(row.status)}
                          className="rounded border border-line bg-white px-2 py-1.5 text-[0.74rem] text-ink"
                          aria-label={`Status pesanan ${row.code}`}
                        >
                          {Object.entries(STATUS_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded border border-line px-2.5 py-1.5 text-[0.72rem] font-semibold text-ink-soft transition-colors hover:border-brand hover:text-brand"
                        >
                          Simpan
                        </button>
                      </form>
                      <TombolCekBayar code={row.code} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl tracking-tight text-ink">
          Permintaan penawaran
        </h2>

        {daftarKutipan.length === 0 ? (
          <p className="mt-3 rounded-md border border-dashed border-line py-10 text-center text-[0.84rem] text-muted">
            Belum ada permintaan penawaran.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {daftarKutipan.map((row) => (
              <li
                key={row.code}
                className="rounded-md border border-line bg-white p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-mono text-[0.76rem] tabular-nums text-ink">
                    {row.code}
                  </p>
                  <p className="text-[0.72rem] text-muted">
                    {waktu(row.created_at)}
                  </p>
                </div>

                <p className="mt-2 max-w-[70ch] text-[0.84rem] leading-relaxed text-ink-soft">
                  {row.detail}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.74rem] text-muted">
                  <span className="text-ink">{row.customer_name}</span>
                  <a
                    href={waLink(
                      `Halo ${row.customer_name}, soal permintaan penawaran ${row.code} di Mas Joki.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-brand"
                  >
                    {row.whatsapp}
                  </a>
                  <span>Tenggat: {row.deadline}</span>

                  <form action={ubahStatus} className="ml-auto flex items-center gap-2">
                    <input type="hidden" name="jenis" value="kutipan" />
                    <input type="hidden" name="kode" value={row.code} />
                    <select
                      name="status"
                      defaultValue={row.status}
                      className="rounded border border-line bg-white px-2 py-1.5 text-[0.74rem] text-ink"
                      aria-label={`Status penawaran ${row.code}`}
                    >
                      {Object.entries(LABEL_KUTIPAN).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded border border-line px-2.5 py-1.5 text-[0.72rem] font-semibold text-ink-soft transition-colors hover:border-brand hover:text-brand"
                    >
                      Simpan
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
