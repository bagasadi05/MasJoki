/**
 * Tipe data untuk AI Humanizer & Diagnostic Engine Mas Joki
 */

export interface SentenceStats {
  text: string;
  wordCount: number;
  starter: string;
  isMonoStarter: boolean;
  hasForbiddenWord: boolean;
  forbiddenWords: string[];
}

export interface BurstinessMetrics {
  totalSentences: number;
  totalWords: number;
  mean: number;
  sd: number; // Standar deviasi panjang kalimat (global)
  minLocalSd: number; // Min SD pada sliding window (local burstiness)
  flaggedWindows: number; // Jumlah jendela dengan SD di bawah ambang lokal
  shortCount: number; // < 10 kata
  mediumCount: number; // 10–21 kata
  longCount: number; // > 21 kata
  mediumPercentage: number;
}

export interface StarterMetrics {
  repeatedCount: number;
  percentage: number;
  details: Record<string, number>;
}

export interface ScanMetrics {
  forbiddenCount: number;
  forbiddenWordsFound: string[];
  totalGlosses: number;
  glossesFound: string[];
  totalTemplates: number;
  templatesFound: string[];
}

export interface RiskMetrics {
  score: number; // 0.0 - 99.0%
  humanScore: number; // Pelengkap skor internal, bukan hasil detektor eksternal
  verdict: string;
  color: string;
  badgeClass: string;
}

export interface AnalysisResult {
  text: string;
  sentences: SentenceStats[];
  burstiness: BurstinessMetrics;
  starters: StarterMetrics;
  scan: ScanMetrics;
  risk: RiskMetrics;
}

export type HumanizeIntensity = "aggressive" | "sederhana" | "balanced" | "light";

export interface HumanizeOptions {
  intensity?: HumanizeIntensity;
  aggressiveBurstiness?: boolean;
  shuffleHierarchy?: boolean;
  customTerms?: string[];
  bahasaSederhana?: boolean;
}

export interface DiffChunk {
  type: "equal" | "delete" | "insert";
  value: string;
}

export interface TokenPackage {
  id: string;
  name: string;
  words: number;
  price: number;
  badge?: string;
  description: string;
  popular?: boolean;
}

export interface VoucherRedeemResult {
  ok: boolean;
  tokens?: number;
  remainingWords?: number;
  /** true bila saldo sudah ditambahkan di dalam transaksi database (RPC). */
  credited?: boolean;
  message?: string;
  error?: string;
}
