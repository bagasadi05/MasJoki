import type { DiffChunk } from "./types";

/**
 * Tokenize text into words, punctuation, and whitespace sequences.
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text.match(/[\w'-]+|[^\w\s]|\s+/g) || [];
}

/**
 * Batas token agar matriks LCS tetap ringan di perangkat seluler.
 * Di atas batas ini diff ditampilkan sebagai satu blok "sebelum" dan "sesudah"
 * (dengan pemberitahuan di UI, bukan diam-diam).
 */
export const DIFF_TOKEN_LIMIT = 2000;

export interface DiffResult {
  chunks: DiffChunk[];
  /** True bila naskah melebihi batas dan perbandingan disederhanakan. */
  truncated: boolean;
}

/**
 * Compute word-level diff using LCS (Longest Common Subsequence).
 */
export function diffWordsWithMeta(oldText: string, newText: string): DiffResult {
  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);

  const m = oldTokens.length;
  const n = newTokens.length;

  // Fast-path for empty or identical text
  if (m === 0 && n === 0) return { chunks: [], truncated: false };
  if (oldText === newText) {
    return { chunks: [{ type: "equal", value: oldText }], truncated: false };
  }

  // Optimization: limit matrix size for huge texts to prevent browser freeze
  if (m > DIFF_TOKEN_LIMIT || n > DIFF_TOKEN_LIMIT) {
    return {
      chunks: [
        { type: "delete", value: oldText },
        { type: "insert", value: newText },
      ],
      truncated: true,
    };
  }

  // Matriks LCS datar (satu Int32Array) jauh lebih hemat memori daripada
  // array-of-arrays, dan tetap O(m*n).
  const width = n + 1;
  const dp = new Int32Array((m + 1) * width);

  for (let i = 1; i <= m; i++) {
    const row = i * width;
    const prevRow = (i - 1) * width;
    const token = oldTokens[i - 1];
    for (let j = 1; j <= n; j++) {
      if (token === newTokens[j - 1]) {
        dp[row + j] = dp[prevRow + j - 1] + 1;
      } else {
        dp[row + j] = Math.max(dp[prevRow + j], dp[row + j - 1]);
      }
    }
  }

  // Backtrack to find diff chunks (push + reverse, bukan unshift O(n^2))
  let i = m;
  let j = n;
  const reversed: DiffChunk[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
      reversed.push({ type: "equal", value: oldTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i * width + j - 1] >= dp[(i - 1) * width + j])) {
      reversed.push({ type: "insert", value: newTokens[j - 1] });
      j--;
    } else if (i > 0) {
      reversed.push({ type: "delete", value: oldTokens[i - 1] });
      i--;
    }
  }

  const rawChunks = reversed.reverse();

  // Merge adjacent chunks of identical type
  const merged: DiffChunk[] = [];
  for (const chunk of rawChunks) {
    if (merged.length > 0 && merged[merged.length - 1].type === chunk.type) {
      merged[merged.length - 1].value += chunk.value;
    } else {
      merged.push({ type: chunk.type, value: chunk.value });
    }
  }

  return { chunks: merged, truncated: false };
}
