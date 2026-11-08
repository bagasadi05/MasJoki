/**
 * Buat kode voucher bertanda tangan untuk pembeli.
 *
 * Pemakaian (bash):
 *   HUMANIZER_VOUCHER_SECRET=rahasia-kamu npm run voucher -- 3000
 */
import { generateSignedVoucher } from "../lib/humanizer/vouchers.server";

const words = Number(process.argv[2]);

if (!Number.isInteger(words) || words <= 0) {
  console.error("Pemakaian: HUMANIZER_VOUCHER_SECRET=<secret> npm run voucher -- <jumlah-kata>");
  process.exit(1);
}

try {
  console.log(generateSignedVoucher(words));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
