import { test } from "node:test";
import assert from "node:assert/strict";

import {
  generateSignedVoucher,
  verifyVoucherCode,
  resetVoucherLedger,
} from "../vouchers.server";

process.env.HUMANIZER_VOUCHER_SECRET = "rahasia-uji-123";

test("Voucher: kode bertanda tangan valid dan hanya bisa dipakai sekali", async () => {
  resetVoucherLedger();
  const code = generateSignedVoucher(3000);

  const pertama = await verifyVoucherCode(code, "1.1.1.1");
  assert.equal(pertama.ok, true, pertama.error);
  assert.equal(pertama.tokens, 3000);

  const kedua = await verifyVoucherCode(code, "2.2.2.2");
  assert.equal(kedua.ok, false, "voucher yang sama tidak boleh dipakai dua kali");
});

test("Voucher: kode palsu atau tanpa kunci ditolak", async () => {
  resetVoucherLedger();

  // Pola lama 6 karakter dan jumlah kata 7 digit tidak lagi diterima.
  const lama = await verifyVoucherCode("MJ-1000000-DD0697", "1.1.1.1");
  assert.equal(lama.ok, false);

  const salahTangan = await verifyVoucherCode("MJ-3000-AAAAAAAAAAAA", "1.1.1.1");
  assert.equal(salahTangan.ok, false);
});

test("Voucher: promo dibatasi sekali per pemakai", async () => {
  resetVoucherLedger();

  const pertama = await verifyVoucherCode("MASJOKIBARU", "3.3.3.3");
  const kedua = await verifyVoucherCode("MASJOKIBARU", "3.3.3.3");
  const penggunaLain = await verifyVoucherCode("MASJOKIBARU", "4.4.4.4");

  assert.equal(pertama.ok, true);
  assert.equal(kedua.ok, false);
  assert.equal(penggunaLain.ok, true, "voucher promo harus tetap bisa dipakai pengguna lain");
});

test("Voucher: tanpa secret server, voucher bertanda tangan ditolak", async () => {
  resetVoucherLedger();
  delete process.env.HUMANIZER_VOUCHER_SECRET;

  assert.throws(() => generateSignedVoucher(3000), /HUMANIZER_VOUCHER_SECRET/);
  process.env.HUMANIZER_VOUCHER_SECRET = "rahasia-uji-123";
});
