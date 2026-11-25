import assert from "node:assert/strict";
import { test } from "node:test";

import { buatKodeKwitansi, formatTanggalWib, kodeKwitansiValid } from "../kwitansi";
import { hitungOrder } from "../order-hitung";
import { POST } from "../../app/kwitansi/route";

const PAYLOAD_VALID = {
  serviceId: "parafrase",
  qty: 500,
  deadlineId: "normal",
  difficultyId: "standar",
  addons: [],
  name: "Budi",
  whatsapp: "081234567890",
};

function buatRequest(body: unknown): Request {
  return new Request("http://localhost/kwitansi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("kode kwitansi: format MJ-YYYYMMDD-XXXX dan lolos validasi", () => {
  const kode = buatKodeKwitansi(new Date("2026-11-14T10:00:00Z"));
  assert.match(kode, /^MJ-\d{8}-[A-Z0-9]{4}$/);
  assert.ok(kode.startsWith("MJ-20261114-"));
  assert.equal(kodeKwitansiValid(kode), true);
  assert.equal(kodeKwitansiValid("MJ-20261114-XXXX; DROP TABLE"), false);
  assert.equal(kodeKwitansiValid("../../etc/passwd"), false);
  assert.equal(kodeKwitansiValid(undefined), false);
});

test("formatTanggalWib memakai zona WIB (UTC+7)", () => {
  // 10.00 UTC = 17.00 WIB
  assert.equal(formatTanggalWib(new Date("2026-11-14T10:00:00Z")), "14/11/2026, 17.00 WIB");
});

test("hitungOrder: validasi ulang + harga dihitung ulang di server", () => {
  const hasil = hitungOrder({ ...PAYLOAD_VALID, qty: "500" });
  assert.equal(hasil.ok, true);
  if (hasil.ok) {
    // 500 kata parafrase = 5 chunk × Rp 3.000 = 15.000; tenggat normal +10% = 16.500
    assert.equal(hasil.price.total, 16_500);
    assert.equal(hasil.service.id, "parafrase");
  }
});

test("hitungOrder: qty hasil edit browser tidak dipercaya mentah — over-limit ditolak", () => {
  const hasil = hitungOrder({ ...PAYLOAD_VALID, serviceId: "word", qty: 500 });
  assert.equal(hasil.ok, false);
});

test("POST /kwitansi: body bukan JSON ditolak 400", async () => {
  const res = await POST(buatRequest("{bukan json"));
  assert.equal(res.status, 400);
});

test("POST /kwitansi: serviceId tidak dikenal ditolak 400", async () => {
  const res = await POST(buatRequest({ ...PAYLOAD_VALID, serviceId: "hack" }));
  assert.equal(res.status, 400);
});

test("POST /kwitansi: over-limit ditolak 422", async () => {
  const res = await POST(buatRequest({ ...PAYLOAD_VALID, serviceId: "word", qty: 500 }));
  assert.equal(res.status, 422);
  const data = (await res.json()) as { error: string };
  assert.ok(data.error.length > 0);
});

test("POST /kwitansi: pesanan valid mengembalikan PDF", async () => {
  const res = await POST(buatRequest(PAYLOAD_VALID));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type"), "application/pdf");
  const kode = res.headers.get("x-kode-kwitansi");
  assert.ok(kode && kodeKwitansiValid(kode), `header kode tidak valid: ${kode}`);
  assert.match(
    res.headers.get("content-disposition") ?? "",
    new RegExp(`attachment; filename="kwitansi-${kode}.pdf"`),
  );
  const buffer = Buffer.from(await res.arrayBuffer());
  assert.ok(buffer.length > 1000, "PDF terlalu kecil");
  assert.equal(buffer.subarray(0, 5).toString("latin1"), "%PDF-");
});
