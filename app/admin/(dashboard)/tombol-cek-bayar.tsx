"use client";

import { useState, useTransition } from "react";
import { cekStatusPembayaran } from "./actions";

export function TombolCekBayar({ code }: { code: string }) {
  const [pending, startTransisi] = useTransition();
  const [hasil, setHasil] = useState<{ ok: boolean; pesan: string } | null>(null);

  return (
    <span className="mt-1.5 block">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransisi(async () => {
            setHasil(null);
            setHasil(await cekStatusPembayaran(code));
          })
        }
        className="text-[0.72rem] font-semibold text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-brand"
      >
        {pending ? "Mengecek…" : "Cek status Midtrans"}
      </button>
      {hasil ? (
        <span
          className={`mt-1 block max-w-[15rem] text-[0.68rem] leading-snug ${
            hasil.ok ? "text-green-700" : "text-red-700"
          }`}
        >
          {hasil.pesan}
        </span>
      ) : null}
    </span>
  );
}
