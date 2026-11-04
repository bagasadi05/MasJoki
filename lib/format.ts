/**
 * Formatter rupiah yang deterministik.
 *
 * Sengaja tidak memakai Intl supaya hasil di server dan browser selalu sama
 * (menghindari hydration mismatch kalau ICU di server berbeda).
 */
export function rupiah(value: number): string {
  const n = Math.round(value);
  const sign = n < 0 ? "-" : "";
  const digits = Math.abs(n).toString();
  return `${sign}Rp ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** 500 -> "500", 1500 -> "1.500" */
export function angka(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
