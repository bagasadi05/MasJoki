import { z } from "zod";

const SERVICE_IDS = [
  "parafrase",
  "humanisasi",
  "makalah",
  "jurnal",
  "powerpoint",
  "word",
  "terjemah",
  "desain",
] as const;

const DEADLINE_IDS = ["santai", "normal", "cepat", "kilat"] as const;
const DIFFICULTY_IDS = ["standar", "menengah", "riset"] as const;

/**
 * Nomor Indonesia: 08xx, 628xx, atau +628xx.
 * Spasi, titik, dan tanda hubung dibuang dulu supaya orang bebas menulis.
 */
export const whatsappSchema = z
  .string()
  .transform((value) => value.replace(/[\s.\-()]/g, ""))
  .refine((value) => /^(?:\+62|62|0)8\d{7,12}$/.test(value), {
    message: "Nomor WhatsApp belum benar. Contoh: 0812 3456 7890",
  });

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Nama minimal 2 karakter")
  .max(80, "Nama terlalu panjang");

const fileUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => value === "" || /^https?:\/\/\S+$/i.test(value),
    "Tautan file harus diawali https://",
  );

export const orderSchema = z.object({
  serviceId: z.enum(SERVICE_IDS),
  qty: z.coerce
    .number()
    .int("Jumlah harus bilangan bulat")
    .min(1, "Jumlah minimal 1")
    .max(100000, "Jumlah terlalu besar, minta penawaran manual"),
  deadlineId: z.enum(DEADLINE_IDS),
  difficultyId: z.enum(DIFFICULTY_IDS),
  name: nameSchema,
  whatsapp: whatsappSchema,
  fileUrl: fileUrlSchema.optional().default(""),
  notes: z.string().trim().max(1000, "Catatan maksimal 1000 karakter").optional().default(""),
});

export const quoteSchema = z.object({
  name: nameSchema,
  whatsapp: whatsappSchema,
  serviceId: z.enum([...SERVICE_IDS, "lainnya"]),
  detail: z
    .string()
    .trim()
    .min(20, "Ceritakan tugasnya minimal 20 karakter")
    .max(2000, "Detail maksimal 2000 karakter"),
  deadlineId: z.enum(DEADLINE_IDS),
  budget: z.string().trim().max(40).optional().default(""),
  fileUrl: fileUrlSchema.optional().default(""),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;

/** Ambil pesan error pertama yang layak ditampilkan ke pengguna. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Data belum lengkap";
}
