import { BASIS_LABEL, type Service } from "./services";

export type DeadlineId = "santai" | "normal" | "cepat" | "kilat";
export type DifficultyId = "standar" | "menengah" | "riset";

export interface Deadline {
  id: DeadlineId;
  label: string;
  note: string;
  mult: number;
}

export interface Difficulty {
  id: DifficultyId;
  label: string;
  note: string;
  mult: number;
}

export const DEADLINES: Deadline[] = [
  { id: "santai", label: "7 hari atau lebih", note: "Harga normal", mult: 1 },
  { id: "normal", label: "4–6 hari", note: "+10%", mult: 1.1 },
  { id: "cepat", label: "2–3 hari", note: "+30%", mult: 1.3 },
  { id: "kilat", label: "Kurang dari 24 jam", note: "+60%", mult: 1.6 },
];

export const DIFFICULTIES: Difficulty[] = [
  { id: "standar", label: "Standar", note: "Tugas harian", mult: 1 },
  { id: "menengah", label: "Menengah", note: "Perlu referensi", mult: 1.2 },
  {
    id: "riset",
    label: "Riset",
    note: "Analisis data",
    mult: 1.45,
  },
];

export function getDeadline(id: string): Deadline {
  return DEADLINES.find((d) => d.id === id) ?? DEADLINES[0];
}

export function getDifficulty(id: string): Difficulty {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[0];
}

export interface PriceLine {
  label: string;
  detail: string;
  amount: number;
}

export interface PriceResult {
  units: number;
  unitPrice: number;
  subtotal: number;
  deadlineFee: number;
  difficultyFee: number;
  minimumFee: number;
  total: number;
  lines: PriceLine[];
  deadline: Deadline;
  difficulty: Difficulty;
  qty: number;
}

/** Semua harga dibulatkan ke 500 rupiah terdekat. */
export function bulatkan(value: number): number {
  return Math.round(value / 500) * 500;
}

export function clampQty(service: Service, qty: number): number {
  if (!Number.isFinite(qty)) return service.defaultQty;
  return Math.max(service.minQty, Math.round(qty));
}

export function computePrice(
  service: Service,
  rawQty: number,
  deadlineId: string,
  difficultyId: string,
): PriceResult {
  const qty = clampQty(service, rawQty);
  const deadline = getDeadline(deadlineId);
  const difficulty = getDifficulty(difficultyId);

  const units = Math.ceil(qty / service.chunk);
  const unitPrice = service.pricePerChunk;
  const rawSubtotal = units * unitPrice;

  // Batas minimum berlaku pada harga dasar, bukan pada total setelah biaya
  // prioritas. Dengan begitu pesanan kecil tetap kena tambahan tenggat.
  const subtotal = Math.max(service.minPrice, rawSubtotal);
  const minimumFee = subtotal - rawSubtotal;

  const afterDeadline = subtotal * deadline.mult;
  const afterDifficulty = afterDeadline * difficulty.mult;

  const deadlineFee = bulatkan(afterDeadline - subtotal);
  const difficultyFee = bulatkan(afterDifficulty - afterDeadline);

  const total = bulatkan(afterDifficulty);

  const unitDetail =
    service.chunk === 1
      ? `${qty} ${BASIS_LABEL[service.basis]}`
      : `${qty} ${BASIS_LABEL[service.basis]} (${units} × ${service.chunk})`;

  const lines: PriceLine[] = [
    {
      label: service.name,
      detail: unitDetail,
      amount: subtotal,
    },
  ];

  if (deadlineFee > 0) {
    lines.push({
      label: `Tenggat ${deadline.label.toLowerCase()}`,
      detail: `Biaya prioritas ${deadline.note}`,
      amount: deadlineFee,
    });
  }

  if (difficultyFee > 0) {
    lines.push({
      label: `Tingkat ${difficulty.label.toLowerCase()}`,
      detail: difficulty.note,
      amount: difficultyFee,
    });
  }

  if (minimumFee > 0) {
    lines.push({
      label: "Penyesuaian minimum",
      detail: "Batas bawah per pesanan",
      amount: minimumFee,
    });
  }

  return {
    units,
    unitPrice,
    subtotal,
    deadlineFee,
    difficultyFee,
    minimumFee,
    total,
    lines,
    deadline,
    difficulty,
    qty,
  };
}
