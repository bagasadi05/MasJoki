import { GoogleGenAI } from "@google/genai";

if (typeof window !== "undefined") {
  throw new Error("gemini.server.ts hanya boleh diimpor di server.");
}

export interface GeminiHumanizeOptions {
  customTerms?: string[];
  intensity?: "aggressive" | "sederhana" | "balanced" | "light";
}

export interface GeminiHumanizeResult {
  ok: boolean;
  text?: string;
  error?: string;
  modelUsed?: string;
}

const SYSTEM_INSTRUCTION_BASE = `Kamu adalah ahli penulisan ulang naskah bahasa Indonesia dengan spesialisasi tunggal: "Skill Bahasa Sederhana Alami (Natural Human Writing)".

TUJUAN:
Tulis ulang naskah akademik/formal menjadi bahasa Indonesia yang SANGAT SEDERHANA, POLOS, dan MENGALIR NATURAL seperti ditulis oleh manusia asli (mahasiswa atau penulis awam yang menjelaskan fakta apa adanya, tanpa susunan kalimat yang terlalu rapi atau kaku, dan bebas dari pola klise AI).

ATURAN WAJIB INTEGRITAS DATA & REFERENSI (100% HARUS UTUH):
1. DATA & FAKTA MUTLAK:
   - JANGAN PERNAH mengubah angka, desimal (misal 75,05), persentase (misal 80%, 150-180%), rentang, tanggal, nama orang, sekolah/tempat, teori, atau lembaga.
   - JANGAN menambah fakta baru, spekulasi, atau kesimpulan baru yang tidak ada pada naskah asal.
2. SITASI AKADEMIK HARUS 100% PERSIS:
   - Sitasi seperti (Slavin, 2015), (Dewantara, 2013), (Sugiyono, 2016: 45) harus tetap utuh pada posisinya.
3. ISTILAH TEKNIS TETAP AKURAT:
   - Singkatan dan istilah resmi (seperti Rutan Kelas IIB Purworejo, PTK, TGT, KKTP, overkapasitas) dipertahankan.

ATURAN ANTI-AI & GAYA MANUSIA ASLI (SUPAYA 100% LOLOS DETEKSI AI / GPTZERO):
1. HINDARI POLA ENUMERASI SIMETRIS AI:
   - DILARANG membuat enumerasi robotik seperti: "Tugas pertama, jadi... Tugas kedua, jadi..." atau "Langkah satu... Langkah dua...".
   - Jelaskan langsung dalam kalimat mengalir yang wajar.
2. LARANGAN AWALAN KALIMAT KLISE AI:
   - DILARANG memulai kalimat dengan: "Selain itu,", "Oleh karena itu,", "Dengan demikian,", "Hal ini menunjukkan bahwa", "Tidak hanya itu,", "Maka dari itu,".
   - Mulailah langsung dengan subjeknya (misal: "Gedungnya...", "Kamar jadi...", "Penghuni...", "Barang terlarang...", "Risiko...").
3. VARIASI IRAMA KALIMAT TINGGI (BURSTINESS):
   - AI cenderung membuat kalimat seragam (15-20 kata). Manusia asli menulis dengan irama bervariasi:
   - Selingi kalimat pendek (3-6 kata, misal: "Kamar jadi padat sekali." atau "Gedungnya peninggalan Belanda.") dengan kalimat sedang (8-14 kata).
4. KATA UMUM & POLOS:
   - Gunakan kata umum: 'melihat', 'membantu', 'membuat', 'dilakukan', 'masalah', 'aturan', 'naik', 'turun'.
   - Ganti kata rumit/kaku:
     * 'mengimplementasikan' -> 'menjalankan' / 'memakai'
     * 'mengalami peningkatan' -> 'naik'
     * 'peserta didik' -> 'siswa'
     * 'tenaga pendidik' -> 'guru'
     * 'dalam rangka' -> 'untuk'
     * 'merupakan salah satu' -> 'termasuk' / 'adalah'

CONTOH PENULISAN ULANG:
- Masukan: Penerapan model pembelajaran kooperatif mampu meningkatkan partisipasi aktif peserta didik selama proses pembelajaran berlangsung.
  Hasil: Kalau siswa belajar dengan kelompok, mereka bisa lebih banyak ikut belajar. Karena siswa tidak hanya duduk dan mendengarkan guru saja. Mereka juga bisa berbicara dengan teman dan mengerjakan tugas bersama. Jadi siswa bisa lebih aktif saat belajar.
- Masukan: Nilai rata-rata kelas naik dari 75,05 pada prasiklus menjadi 80,65 pada Siklus I dan 87,80 pada Siklus II (Slavin, 2015).
  Hasil: Sebelum kegiatan dilakukan, nilai rata-rata kelas masih 75,05. Setelah Siklus I naik menjadi 80,65. Lalu pada Siklus II nilainya naik lagi menjadi 87,80 (Slavin, 2015).
- Masukan: Rumah Tahanan Negara (Rutan) Kelas IIB Purworejo memiliki dua fungsi utama, yaitu pelayanan tahanan dan pembinaan narapidana. Kapasitas hunian sejatinya dirancang untuk 100 orang, namun faktualnya dihuni 150 hingga 180 orang (overcrowding mencapai 150-180%).
  Hasil: Rutan Kelas IIB Purworejo punya dua tugas pokok, yaitu melayani tahanan dan membina narapidana. Rutan ini aslinya cuma dibuat untuk 100 orang. Sekarang penghuninya ada 150 sampai 180 orang, atau sekitar 150-180% dari kapasitas aslinya. Kamar-kamar jadi sangat sempit.

OUTPUT:
Kembalikan HANYA teks hasil penulisan ulang naskah, tanpa kata pengantar dan tanpa blok markdown.`;

function ambilApiKey(): string {
  return (process.env.GEMINI_API_KEY || "").trim();
}

/**
 * Bersihkan output dari respons AI (hapus pembungkus markdown & awalan AI klise).
 */
function cleanAiResponse(raw: string): string {
  let text = raw.trim();
  // Hapus pembungkus ```markdown atau ``` jika model membungkusnya dalam code block
  if (text.startsWith("```") && text.endsWith("```")) {
    text = text.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
  }
  // Hapus kata pengantar tipikal AI jika lolos
  text = text.replace(/^(?:Tentu,?\s+)?(?:berikut|ini|di bawah ini)\s+adalah\s+(?:hasil|naskah|teks)[^:\n]*:\s*\n+/i, "");

  // Bersihkan awalan klise AI di awal kalimat yang memicu detektor AI (GPTZero/Turnitin)
  text = text.replace(/(?<=[.!?]|^)\s*Selain itu,\s*/gi, (m, offset) => {
    return offset === 0 ? "" : " ";
  });
  text = text.replace(/(?<=[.!?]|^)\s*Oleh karena itu,\s*/gi, (m, offset) => {
    return offset === 0 ? "Jadi, " : " Jadi, ";
  });
  text = text.replace(/(?<=[.!?]|^)\s*Dengan demikian,\s*/gi, (m, offset) => {
    return offset === 0 ? "Artinya, " : " Artinya, ";
  });

  return text.trim();
}

/**
 * Eksekusi Humanize naskah menggunakan Google Gemini API resmi.
 */
export async function humanizeWithGemini(
  text: string,
  options: GeminiHumanizeOptions = {}
): Promise<GeminiHumanizeResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: "Naskah teks tidak boleh kosong." };
  }

  const apiKey = ambilApiKey();
  if (!apiKey) {
    return {
      ok: false,
      error:
        "Kunci GEMINI_API_KEY belum dikonfigurasi di server (.env.local). Silakan masukkan API key gratis dari Google AI Studio (https://aistudio.google.com/) ke file .env.local untuk mengaktifkan fitur AI ini.",
    };
  }

  // Buat instruksi sistem yang diperkaya dengan istilah kustom jika ada
  let systemInstruction = SYSTEM_INSTRUCTION_BASE;
  if (options.customTerms && options.customTerms.length > 0) {
    const termList = options.customTerms.join(", ");
    systemInstruction += `\n\nISTILAH KUSTOM TAMBAHAN YANG HARUS 100% DIPERTAHANKAN: ${termList}`;
  }

  if (options.intensity === "sederhana") {
    systemInstruction += `\n\nMODE SPESIFIK: BAHASA SEDERHANA ALAMI
Gunakan bahasa Indonesia sehari-hari yang sangat polos, bersahaja, dan mudah dipahami oleh siapa saja, seperti seseorang menjelaskan langsung secara lisan tanpa pretensi akademik, namun tetap akurat terhadap fakta dan data.`;
  }

  // Inisialisasi GoogleGenAI dengan apiVersion 'v1beta' agar mendukung model modern
  // (gemini-2.5-flash) dan systemInstruction tanpa error 400 'Developer instruction not enabled'
  const ai = new GoogleGenAI({
    apiKey,
    apiVersion: "v1beta",
  } as ConstructorParameters<typeof GoogleGenAI>[0]);

  // Model yang didukung pada endpoint v1beta: gemini-2.5-flash (utama), gemini-3.5-flash (cadangan)
  const candidateModels = ["gemini-2.5-flash", "gemini-3.5-flash"];

  let lastError: unknown = null;
  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: trimmed,
        config: {
          systemInstruction,
          temperature: 0.85,
        },
      });

      const responseText = response.text;
      if (responseText && responseText.trim()) {
        const cleaned = cleanAiResponse(responseText);
        return {
          ok: true,
          text: cleaned,
          modelUsed: modelName,
        };
      }
    } catch (err: unknown) {
      lastError = err;
      // Jika terjadi error pada systemInstruction, coba sekali lagi dengan instruksi disatukan ke prompt
      try {
        const promptFallback = `[ATURAN KHUSUS HUMANIZER]\n${systemInstruction}\n\n[NASKAH SUMBER]\n${trimmed}`;
        const fallbackRes = await ai.models.generateContent({
          model: modelName,
          contents: promptFallback,
          config: {
            temperature: 0.85,
          },
        });
        if (fallbackRes.text && fallbackRes.text.trim()) {
          return {
            ok: true,
            text: cleanAiResponse(fallbackRes.text),
            modelUsed: modelName,
          };
        }
      } catch {
        // Lanjut ke model kandidat berikutnya jika fallback prompt juga gagal
      }
      continue;
    }
  }

  const errorMessage =
    lastError instanceof Error ? lastError.message : "Gagal memanggil Google Gemini API.";
  return {
    ok: false,
    error: `Gemini API Error: ${errorMessage}`,
  };
}
