function sorted(values: string[]): string[] {
  return values.map((value) => value.replace(/\s+/g, " ").trim().toLowerCase()).sort();
}

function occurrences(text: string, term: string): number {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (text.match(new RegExp(escaped, "giu")) ?? []).length;
}

function numbers(text: string): string[] {
  return text.match(/\d+(?:[.,]\d+)*/g) ?? [];
}

function citations(text: string): string[] {
  return text.match(/\([^()\n]{0,240}\b(?:19|20)\d{2}\b[^()\n]*\)/g) ?? [];
}

export function validateHumanizerIntegrity(
  source: string,
  output: string,
  customTerms: string[] = [],
): { ok: true } | { ok: false; error: string } {
  if (sorted(numbers(source)).join("|") !== sorted(numbers(output)).join("|")) {
    return { ok: false, error: "Hasil AI mengubah angka atau data numerik. Hasil tidak ditampilkan." };
  }

  if (sorted(citations(source)).join("|") !== sorted(citations(output)).join("|")) {
    return { ok: false, error: "Hasil AI mengubah sitasi referensi. Hasil tidak ditampilkan." };
  }

  for (const term of customTerms) {
    if (occurrences(source, term) !== occurrences(output, term)) {
      return { ok: false, error: `Istilah proteksi "${term}" berubah pada hasil AI.` };
    }
  }

  return { ok: true };
}
