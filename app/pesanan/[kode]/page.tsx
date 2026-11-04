import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Nota } from "@/components/nota";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TombolBayar } from "@/components/tombol-bayar";
import {
  ALUR,
  STATUS_LABEL,
  statusPesanan,
  type StatusPesanan,
} from "@/lib/payment-status";
import { getDifficulty, getDeadline } from "@/lib/pricing";
import { BASIS_LABEL, getService } from "@/lib/services";
import { site, waLink } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Status pesanan",
  robots: { index: false, follow: false },
};

// Halaman ini selalu dirender per permintaan: datanya berubah setelah pembayaran.
export const instant = false;

interface OrderRow {
  code: string;
  customer_name: string;
  whatsapp: string;
  service_id: string;
  service_name: string;
  quantity: number;
  deadline: string;
  difficulty: string;
  subtotal: number;
  total: number;
  notes: string | null;
  file_url: string | null;
  status: string;
  created_at: string;
  snap_token: string | null;
}

const BISA_DIBAYAR: StatusPesanan[] = [
  "menunggu_konfirmasi",
  "menunggu_pembayaran",
  "kedaluwarsa",
  "gagal",
];

function tanggal(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export default async function HalamanPesanan({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  await connection();

  const { kode } = await params;
  const code = decodeURIComponent(kode).toUpperCase();

  if (!supabaseAdmin) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
          <h1 className="font-display text-3xl tracking-tight text-ink">
            Halaman pesanan belum aktif.
          </h1>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">
            Database belum terhubung. Isi{" "}
            <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em]">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            dan{" "}
            <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em]">
              SUPABASE_SERVICE_ROLE_KEY
            </code>{" "}
            di <code className="font-mono text-[0.85em]">.env.local</code>, lalu
            jalankan <code className="font-mono text-[0.85em]">supabase/schema.sql</code>.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-md border border-ink px-5 py-3 text-[0.86rem] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Kembali ke beranda
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "code, customer_name, whatsapp, service_id, service_name, quantity, deadline, difficulty, subtotal, total, notes, file_url, status, created_at, snap_token",
    )
    .eq("code", code)
    .maybeSingle<OrderRow>();

  if (error) {
    console.error("[pesanan] gagal membaca", error.message);
  }

  if (!data) {
    notFound();
  }

  const order = data;
  const status = statusPesanan(order.status);
  const service = getService(order.service_id);
  const langkahAktif = ALUR.indexOf(status);
  const bisaBayar = BISA_DIBAYAR.includes(status);

  const nota = [
    {
      label: order.service_name,
      detail: `${order.quantity} ${BASIS_LABEL[service.basis]} · ${getDeadline(
        order.deadline,
      ).label.toLowerCase()} · ${getDifficulty(order.difficulty).label.toLowerCase()}`,
      amount: order.subtotal,
    },
    ...(order.total - order.subtotal > 0
      ? [
          {
            label: "Biaya prioritas",
            detail: "Tenggat dan tingkat kesulitan",
            amount: order.total - order.subtotal,
          },
        ]
      : []),
  ];

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <Link
          href="/"
          className="text-[0.78rem] text-muted transition-colors hover:text-brand"
        >
          ← Beranda
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[1.9rem] leading-tight tracking-tight text-ink sm:text-[2.3rem]">
            {order.code}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${
              status === "dibayar" || status === "selesai"
                ? "bg-green-100 text-green-800"
                : status === "kedaluwarsa" ||
                    status === "gagal" ||
                    status === "batal"
                  ? "bg-red-50 text-red-700"
                  : "bg-brand-soft text-brand"
            }`}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>

        <p className="mt-2 text-[0.82rem] text-muted">
          Dibuat {tanggal(order.created_at)} WIB · {order.customer_name}
        </p>

        {langkahAktif >= 0 ? (
          <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-y border-line py-4">
            {ALUR.map((langkah, index) => {
              const selesai = index <= langkahAktif;
              const aktif = index === langkahAktif;
              return (
                <li key={langkah} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`inline-block size-2 rounded-full ${
                      aktif
                        ? "bg-brand ring-4 ring-brand/15"
                        : selesai
                          ? "bg-brand"
                          : "bg-line-strong"
                    }`}
                  />
                  <span
                    className={`text-[0.76rem] ${
                      selesai ? "font-medium text-ink" : "text-muted"
                    }`}
                  >
                    {STATUS_LABEL[langkah]}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="mt-6 rounded-md border border-line bg-paper-2/70 px-4 py-3 text-[0.82rem] text-ink-soft">
            Pesanan ini tidak lagi aktif. Kalau kamu merasa ini keliru, hubungi
            admin dengan menyebutkan kode di atas.
          </p>
        )}

        <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
          <Nota
            code={order.code}
            lines={nota}
            total={order.total}
            note={`Dipesan oleh ${order.customer_name}. Simpan halaman ini untuk cek status.`}
            stamp={status === "dibayar" || status === "selesai" ? "Lunas" : "Belum dibayar"}
            className="max-w-md"
          />

          <div className="sm:max-w-[16rem]">
            {bisaBayar ? (
              <TombolBayar code={order.code} />
            ) : (
              <p className="rounded-md border border-line bg-paper-2/70 px-4 py-3 text-[0.8rem] leading-relaxed text-ink-soft">
                {status === "dikerjakan" || status === "revisi"
                  ? "Pembayaran sudah masuk. Hasil dikirim lewat WhatsApp."
                  : "Tidak ada pembayaran yang perlu dilakukan."}
              </p>
            )}

            <a
              href={waLink(
                `Halo Mas Joki, saya mau tanya soal pesanan ${order.code}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-[0.8rem] font-semibold text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
            >
              Tanya admin
            </a>

            <p className="mt-4 text-[0.72rem] leading-relaxed text-muted">
              {site.jamOperasional}
            </p>
          </div>
        </div>

        {order.notes ? (
          <div className="mt-8 border-t border-line pt-5">
            <p className="text-[0.78rem] font-semibold text-ink">
              Catatanmu
            </p>
            <p className="mt-1.5 max-w-[62ch] text-[0.84rem] leading-relaxed text-muted">
              {order.notes}
            </p>
          </div>
        ) : null}
      </main>

      <SiteFooter />
    </>
  );
}
