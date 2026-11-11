/**
 * Penjaga parameter `?next=` pada alur auth.
 *
 * Pemeriksaan "diawali / dan bukan //" tidak cukup: parser URL memperlakukan
 * backslash sebagai slash, sehingga `/\evil.com` dan `/\t/evil.com` tetap
 * berakhir di domain lain. Karena itu hasilnya selalu dibandingkan origin-nya.
 */
const FALLBACK = "/humanizer";

export function safeNextPath(
  value: string | null | undefined,
  origin: string,
): string {
  if (!value) return FALLBACK;

  try {
    const tujuan = new URL(value, origin);
    if (tujuan.origin !== origin) return FALLBACK;
    return `${tujuan.pathname}${tujuan.search}${tujuan.hash}`;
  } catch {
    return FALLBACK;
  }
}
