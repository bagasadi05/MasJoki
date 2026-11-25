import { computePrice, type PriceResult } from "./pricing";
import { getService, type Service } from "./services";
import { fieldErrors, firstIssue, orderSchema, type OrderInput } from "./validation";

/**
 * Satu-satunya evaluasi pesanan berbasis harga: validasi zod + harga dihitung
 * ulang dari serviceId & qty. Dipakai server action order DAN route kwitansi,
 * sehingga angka di kwitansi PDF selalu sama dengan yang dihitung server.
 */
export type HasilHitungOrder =
  | { ok: true; data: OrderInput; service: Service; price: PriceResult }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export function hitungOrder(input: unknown): HasilHitungOrder {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: firstIssue(parsed.error),
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const service = getService(data.serviceId);
  // Harga dihitung ulang di server; angka dari browser tidak dipercaya.
  const price = computePrice(
    service,
    data.qty,
    data.deadlineId,
    data.difficultyId,
    data.addons,
  );

  if (service.customQuoteOnly || price.isOverLimit) {
    return {
      ok: false,
      message:
        price.overLimitMessage ??
        "Jumlah pesanan melebihi batas hitungan otomatis. Silakan gunakan mode Minta Penawaran.",
    };
  }

  return { ok: true, data, service, price };
}
