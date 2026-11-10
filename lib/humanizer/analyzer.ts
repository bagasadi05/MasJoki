/**
 * analyzer.ts - GPTZero & Turnitin Statistical Diagnostic Engine
 * Kalibrasi Empiris Laporan GPTZero & Turnitin Mas Joki
 */

import {
  FORBIDDEN_WORDS,
  MONO_STARTERS,
  ALWAYS_BAD_STARTERS,
  TEMPLATE_PATTERNS,
  isAiEnglishGloss,
  isStatisticalUse,
  newGlossRegex,
} from "./dictionary";

import type {
  AnalysisResult,
  BurstinessMetrics,
  RiskMetrics,
  ScanMetrics,
  SentenceStats,
  StarterMetrics,
} from "./types";

/**
 * Ambang ritme internal yang konservatif. SD bukan bukti AI dengan sendirinya,
 * jadi nilainya dipakai sebagai sinyal ringan, bukan hukuman besar.
 */
export const SD_TARGET = 5.0;
/** Batas minimal SD lokal agar blok dianggap aman. */
export const LOCAL_SD_MIN = 4.5;
/** Ukuran jendela geser untuk local burstiness. */
export const LOCAL_WINDOW_SIZE = 8;
/** Rasio kalimat sedang yang baru memicu flag pada satu jendela. */
export const FLAG_MEDIUM_RATIO = 0.85;
/** Kalimat sedang masih wajar bila tidak melebihi proporsi ini. */
export const MEDIUM_SAFE_PERCENTAGE = 75;

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Regex dikompilasi sekali di module scope. Sebelumnya setiap kalimat membuat
// ulang puluhan RegExp pada setiap ketikan, yang membebani browser.
const FORBIDDEN_REGEXES = FORBIDDEN_WORDS.map((word) => ({
  word,
  // Lookaround, bukan \b, supaya "serta-merta" tidak dihitung sebagai "serta".
  regex: new RegExp(`(?<![\\w-])${escapeRegex(word)}(?![\\w-])`, "gi"),
}));

const TEMPLATE_REGEXES = TEMPLATE_PATTERNS.map((pattern) => ({
  name: pattern.name,
  regex: new RegExp(pattern.regex.source, "gi"),
}));

/**
 * Temukan terjemahan kurung bahasa Inggris khas AI yang tidak masuk whitelist
 */
export function findParentheticalGlosses(text: string): string[] {
  if (!text) return [];
  const hits: string[] = [];
  const reg = newGlossRegex();
  let match: RegExpExecArray | null;
  while ((match = reg.exec(text)) !== null) {
    if (isAiEnglishGloss(match[1])) {
      hits.push(match[0]);
    }
  }
  return hits;
}

/**
 * Pemecah kalimat cerdas dengan proteksi sitasi dan gelar akademik
 */
export function splitSentences(text: string): string[] {
  if (!text) return [];
  let cleaned = text.replace(/\r\n/g, "\n");

  // Rapikan soft-breaks dari copy-paste PDF:
  // Jika baris berakhir huruf kecil/koma dan baris berikutnya diawali huruf kecil, gabungkan dengan spasi
  cleaned = cleaned.replace(/([a-zA-Z0-9,;])\n([a-z])/g, "$1 $2");

  const placeholders: string[] = [];
  const protect = (match: string) => {
    placeholders.push(match);
    return `___CIT_${placeholders.length - 1}___`;
  };

  // 1. Lindungi sitasi (Nama, Tahun) dan et al.
  cleaned = cleaned.replace(/\b([A-Z][a-z]+)\s+et\s+al\.,\s*(\d{4})/g, protect);
  cleaned = cleaned.replace(/\b([A-Z][a-z]+)\s+dan\s+([A-Z][a-z]+),\s*(\d{4})/g, protect);
  cleaned = cleaned.replace(/\(([A-Z][a-z]+(?:,\s*\d{4}|;\s*[A-Z][a-z]+,\s*\d{4})*)\)/g, protect);

  // 2. Lindungi singkatan umum dan gelar
  cleaned = cleaned.replace(/\b(dkk|dsb|dst|hlm|hal|no|vol|ed|art|sec|uu|pp|kuhp|dr|prof|ir|drs|apt)\./gi, protect);
  cleaned = cleaned.replace(/(?<=\s|^)\d+\./g, protect);
  cleaned = cleaned.replace(/\b(\d+)\.(\d+)\b/g, protect);
  // Inisial nama pada daftar pustaka ("Arief, B. N.") agar tidak terpecah
  cleaned = cleaned.replace(/\b([A-Z])\.(?=\s*[A-Z]\.)/g, protect);

  // 3. Pecah berdasarkan titik, tanda seru, atau tanda tanya yang diikuti spasi dan huruf kapital
  const rawSentences = cleaned.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/);

  const unprotect = (str: string) => {
    return str.replace(/___CIT_(\d+)___/g, (_, idx) => placeholders[parseInt(idx, 10)] || "");
  };

  const finalSentences: string[] = [];
  rawSentences.forEach((s) => {
    // Pisahkan bila ada enter ganda (paragraf)
    const lines = s.split(/\n\s*\n/);
    lines.forEach((l) => {
      const restored = unprotect(l.trim());
      if (restored.length > 0) {
        finalSentences.push(restored);
      }
    });
  });

  return finalSentences;
}

export function countWords(s: string): number {
  if (!s) return 0;
  const m = s.match(/\b[\w'-]+\b/g);
  return m ? m.length : 0;
}

export function calculateLocalBurstiness(wordsArray: number[]): {
  minSd: number;
  flaggedCount: number;
} {
  const N = wordsArray.length;
  if (N < 5) return { minSd: 99.0, flaggedCount: 0 };

  // Jendela menyesuaikan panjang naskah: naskah 5–7 kalimat tetap dihitung,
  // tidak lagi dianggap "SD lokal 0" (paling buruk) hanya karena kurang dari 8
  // kalimat.
  const WINDOW_SIZE = Math.min(LOCAL_WINDOW_SIZE, N);
  let minSd = 99.0;
  let flaggedCount = 0;

  for (let start = 0; start <= N - WINDOW_SIZE; start++) {
    const window = wordsArray.slice(start, start + WINDOW_SIZE);
    const mean = window.reduce((a, b) => a + b, 0) / WINDOW_SIZE;
    const variance = window.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / WINDOW_SIZE;
    const sd = Math.sqrt(variance);

    if (sd < minSd) {
      minSd = sd;
    }

    const medCount = window.filter((w) => w >= 10 && w <= 21).length;
    const medRatio = medCount / WINDOW_SIZE;
    const shortCount = window.filter((w) => w <= 9).length;

    if (sd < LOCAL_SD_MIN || (medRatio >= FLAG_MEDIUM_RATIO && shortCount === 0)) {
      flaggedCount++;
    }
  }

  return {
    minSd: Math.round(minSd * 100) / 100,
    flaggedCount,
  };
}

export function calculateBurstiness(sentences: string[]): BurstinessMetrics {
  const totalSentences = sentences.length;
  if (totalSentences === 0) {
    return {
      totalSentences: 0,
      totalWords: 0,
      mean: 0,
      sd: 0,
      minLocalSd: 0,
      flaggedWindows: 0,
      shortCount: 0,
      mediumCount: 0,
      longCount: 0,
      mediumPercentage: 0,
    };
  }

  const lengths = sentences.map((s) => countWords(s));
  const totalWords = lengths.reduce((acc, cur) => acc + cur, 0);
  const mean = totalWords / totalSentences;

  const variance =
    lengths.reduce((acc, cur) => acc + Math.pow(cur - mean, 2), 0) / totalSentences;
  const sd = Math.sqrt(variance);

  let shortCount = 0;
  let mediumCount = 0;
  let longCount = 0;

  lengths.forEach((len) => {
    if (len < 10) shortCount++;
    else if (len <= 21) mediumCount++;
    else longCount++;
  });

  const mediumPercentage = Math.round((mediumCount / totalSentences) * 100);
  const localMetrics = calculateLocalBurstiness(lengths);

  return {
    totalSentences,
    totalWords,
    mean: Math.round(mean * 10) / 10,
    sd: Math.round(sd * 100) / 100,
    minLocalSd: localMetrics.minSd === 99.0 ? 0 : localMetrics.minSd,
    flaggedWindows: localMetrics.flaggedCount,
    shortCount,
    mediumCount,
    longCount,
    mediumPercentage,
  };
}

export function extractStarter(sentence: string): string {
  const words = sentence
    .trim()
    .toLowerCase()
    .replace(/^["'(\[]+/, "")
    // Buang tanda baca di tepi kata: "jadi," harus sama dengan "jadi" dan
    // "selain itu," harus sama dengan "selain itu".
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter(Boolean);
  if (words.length === 0) return "";

  const twoWords = `${words[0]} ${words[1] || ""}`.trim();
  const threeWords = `${words[0]} ${words[1] || ""} ${words[2] || ""}`.trim();

  for (const starter of MONO_STARTERS) {
    if (starter === threeWords || starter === twoWords || starter === words[0]) {
      return starter;
    }
  }

  return words[0] || "";
}

/**
 * Awalan yang memang penanda wacana. Hanya awalan ini yang boleh dihitung
 * sebagai pengulangan; subjek biasa seperti "penelitian" tidak.
 */
const TRACKED_STARTERS: Set<string> = new Set<string>([
  ...MONO_STARTERS,
  ...ALWAYS_BAD_STARTERS,
]);

export function analyzeStarters(sentences: string[]): StarterMetrics {
  const total = sentences.length;
  if (total === 0) {
    return { repeatedCount: 0, percentage: 0, details: {} };
  }

  const details: Record<string, number> = {};
  let repeatedCount = 0;

  sentences.forEach((s) => {
    const starter = extractStarter(s);
    if (!starter) return;

    details[starter] = (details[starter] || 0) + 1;
    if (ALWAYS_BAD_STARTERS.has(starter)) {
      repeatedCount++;
    }
  });

  Object.entries(details).forEach(([starter, count]) => {
    if (!ALWAYS_BAD_STARTERS.has(starter) && TRACKED_STARTERS.has(starter) && count >= 3) {
      repeatedCount += count - 1;
    }
  });

  const percentage = Math.round((repeatedCount / total) * 100);
  return { repeatedCount, percentage, details };
}

/**
 * Hitung kemunculan kata pantangan, dengan pengecualian istilah statistik
 * ("berbeda signifikan") yang sah dipakai di laporan penelitian.
 */
export function scanTriggers(text: string): ScanMetrics {
  const lowerText = text.toLowerCase();
  let forbiddenCount = 0;
  const forbiddenWordsFound: string[] = [];

  for (const { word, regex } of FORBIDDEN_REGEXES) {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    let jumlah = 0;

    while ((match = regex.exec(lowerText)) !== null) {
      if (word === "signifikan" && isStatisticalUse(lowerText, match.index, match.index + match[0].length)) {
        continue;
      }
      jumlah++;
    }

    if (jumlah > 0) {
      forbiddenCount += jumlah;
      forbiddenWordsFound.push(`${word} (${jumlah}x)`);
    }
  }

  const glossesFound = findParentheticalGlosses(text);

  const templatesFound: string[] = [];
  let totalTemplates = 0;
  for (const { name, regex } of TEMPLATE_REGEXES) {
    regex.lastIndex = 0;
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      totalTemplates += matches.length;
      templatesFound.push(`${name} (${matches.length}x)`);
    }
  }

  return {
    forbiddenCount,
    forbiddenWordsFound,
    totalGlosses: glossesFound.length,
    glossesFound,
    totalTemplates,
    templatesFound,
  };
}

export function estimateRisk(
  burstiness: BurstinessMetrics,
  starters: StarterMetrics,
  scan: ScanMetrics
): RiskMetrics {
  let risk = 0.0;
  const isSnippet = burstiness.totalSentences < 5;

  // Hanya evaluasi variasi statistik kalimat jika naskah >= 5 kalimat.
  // Snippet 1-4 kalimat tidak boleh dihukum SD rendah karena secara matematis sampelnya terlalu kecil.
  if (!isSnippet) {
    // 1. Burstiness Global (sinyal lemah, max 14 poin)
    // Naskah alami tidak harus mencapai SD 6.8; nilai sekitar 5 masih umum.
    if (burstiness.sd < 3.5) risk += 14;
    else if (burstiness.sd < 4.5) risk += 8;
    else if (burstiness.sd < SD_TARGET) risk += 3;

    // 2. Local Burstiness (sinyal lemah, max 10 poin)
    if (burstiness.minLocalSd < 3.5) risk += 10;
    else if (burstiness.minLocalSd < 4.0) risk += 6;
    else if (burstiness.minLocalSd < LOCAL_SD_MIN) risk += 3;
    else if (burstiness.flaggedWindows > 0) risk += Math.min(4, burstiness.flaggedWindows);

    // 3. Persentase Kalimat Sedang (sinyal lemah, max 8 poin)
    // Proporsi 60-75% masih normal untuk tulisan akademik yang rapi.
    if (burstiness.mediumPercentage > 85) risk += 8;
    else if (burstiness.mediumPercentage > MEDIUM_SAFE_PERCENTAGE) risk += 4;
    else if (burstiness.mediumPercentage > 65) risk += 1;

    // 4. Awalan Monoton (Max 20 poin)
    // Snippet < 5 kalimat tidak dihukum karena sampelnya terlalu kecil.
    if (starters.percentage > 35) risk += 20;
    else if (starters.percentage > 25) risk += 14;
    else if (starters.percentage > 15) risk += 8;
    else if (starters.percentage > 8) risk += 3;
  }

  // 5. Kata Pantangan (Max 35 poin)
  risk += Math.min(35, scan.forbiddenCount * 3.5);

  // 6. Terjemahan Kurung AI (Max 20 poin)
  risk += Math.min(20, scan.totalGlosses * 2.5);

  // 7. Pola Template AI (Max 15 poin)
  risk += Math.min(15, scan.totalTemplates * 2.5);

  const finalScore = Math.min(99.0, Math.max(0.0, Math.round(risk * 10) / 10));
  const humanScore = Math.round((100.0 - finalScore) * 10) / 10;

  // Label sengaja netral: ini estimasi internal Mas Joki, bukan keluaran resmi
  // GPTZero/Turnitin, jadi tidak boleh mengklaim "lolos" alat tertentu.
  let verdict = "RISIKO RENDAH (< 15%)";
  let color = "text-emerald-600 dark:text-emerald-400";
  let badgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";

  if (finalScore > 30) {
    verdict = "RISIKO TINGGI (> 30%)";
    color = "text-rose-600 dark:text-rose-400";
    badgeClass = "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300";
  } else if (finalScore > 15) {
    verdict = "RISIKO SEDANG (15% - 30%)";
    color = "text-amber-600 dark:text-amber-400";
    badgeClass = "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300";
  }

  return {
    score: finalScore,
    humanScore,
    verdict,
    color,
    badgeClass,
  };
}

function kataPantanganDalam(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const { word, regex } of FORBIDDEN_REGEXES) {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    let ada = false;

    while ((match = regex.exec(lower)) !== null) {
      if (word === "signifikan" && isStatisticalUse(lower, match.index, match.index + match[0].length)) {
        continue;
      }
      ada = true;
      break;
    }

    if (ada) found.push(word);
  }

  return found;
}

export function analyze(text: string): AnalysisResult {
  const rawSentences = splitSentences(text);
  const burstiness = calculateBurstiness(rawSentences);
  const starters = analyzeStarters(rawSentences);
  const scan = scanTriggers(text);
  const risk = estimateRisk(burstiness, starters, scan);

  const sentences: SentenceStats[] = rawSentences.map((s) => {
    const starter = extractStarter(s);
    const wc = countWords(s);
    const foundForb = kataPantanganDalam(s);
    return {
      text: s,
      wordCount: wc,
      starter,
      isMonoStarter:
        ALWAYS_BAD_STARTERS.has(starter) ||
        (MONO_STARTERS.includes(starter as (typeof MONO_STARTERS)[number]) &&
          (starters.details[starter] || 0) >= 2),
      hasForbiddenWord: foundForb.length > 0,
      forbiddenWords: foundForb,
    };
  });

  return {
    text,
    sentences,
    burstiness,
    starters,
    scan,
    risk,
  };
}
