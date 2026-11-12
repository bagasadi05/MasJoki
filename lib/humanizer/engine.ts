/**
 * engine.ts - Humanizer Engine (Production Release)
 * Standar penulisan lugas dan alami.
 * Arsitektur Zero-Synthetic-Glue + Preservasi Makna 100%
 */

import { countWords, splitSentences } from "./analyzer";
import {
  isAiEnglishGloss,
  newGlossRegex,
  isStatisticalUse,
  FORBIDDEN_WORDS_MAP,
  BAHASA_SEDERHANA_WORDS_MAP,
  BAHASA_SEDERHANA_PHRASES,
} from "./dictionary";
import type { HumanizeOptions } from "./types";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Terapkan hasil penggantian tanpa membuang capture group.
 * Sebelumnya callback hanya mengirim `$1` apa adanya ke naskah.
 */
function applyReplacement(match: string, replacement: string, captures: string[]): string {
  const expanded = replacement.replace(/\$(\d)/g, (_, index: string) => {
    return captures[Number(index) - 1] ?? "";
  });
  return matchCase(match, expanded);
}

export interface MaskedTerms {
  text: string;
  placeholders: string[];
}

/**
 * Ganti istilah kustom pengguna dengan placeholder sebelum aturan apa pun
 * dijalankan. Dipakai bersama oleh engine dan tombol aksi granular di UI.
 */
export function maskCustomTerms(text: string, terms: string[] = []): MaskedTerms {
  const placeholders: string[] = [];
  let out = text;

  terms.forEach((term) => {
    if (!term || !term.trim()) return;
    const escaped = escapeRegex(term.trim());
    const reg = new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, "gi");
    out = out.replace(reg, (match) => {
      placeholders.push(match);
      return `___CUST_TERM_${placeholders.length - 1}___`;
    });
  });

  return { text: out, placeholders };
}

export function restoreCustomTerms(text: string, placeholders: string[]): string {
  return text.replace(/___CUST_TERM_(\d+)___/g, (_, index) => {
    return placeholders[parseInt(index, 10)] ?? "";
  });
}

function capitalizeFirst(str: string): string {
  if (!str) return "";
  const trimmed = str.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function lowerFirst(str: string): string {
  if (!str) return "";
  const trimmed = str.trim();
  if (
    /^(?:UU|Undang-Undang|Pasal|Peraturan|Permenkumham|PP|UUD|K3|HAM|ASN|PTSD|SOP|PTKK|PTK|TGT|KKTP|Wordwall|Siklus|Slavin|Dewantara|Nusakambangan|Indonesia|Muladi|Arief|Rutan|Lapas|Bapas|Kemenkumham|Subroto|Wibowo|Bina|Bili|Prasetyo|Gultom|Armiwal|Suhaibah|Setiawan|UNODC)\b/.test(
      trimmed
    )
  ) {
    return trimmed;
  }
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

function ensurePeriod(str: string): string {
  const t = (str || "").trim();
  if (!t) return "";
  if (/[.!?]$/.test(t)) return t;
  return t + ".";
}

function stripTrailingPeriod(str: string): string {
  return (str || "").trim().replace(/[.!?]+$/, "");
}

/** Konjungsi pembuka yang membuat penggabungan kalimat berisiko salah makna. */
const MERGE_BLOCKER =
  /^(?:dan|atau|serta|tetapi|namun|melainkan|jadi|karena|sehingga|selain itu|oleh karena itu|dengan demikian|meskipun|walaupun|sementara|sedangkan|akan tetapi|bahkan)\b/i;

/**
 * Kata awal kalimat umum yang aman ditulis huruf kecil setelah titik koma.
 * Kata di luar daftar ini dibiarkan berkapital agar nama diri tidak rusak.
 */
const SAFE_LOWER_START = new Set<string>([
  "faktor", "metode", "hasil", "temuan", "penelitian", "kajian", "petugas",
  "aturan", "kondisi", "risiko", "perlindungan", "pengawasan", "pemerintah",
  "anggaran", "implementasi", "penerapan", "analisis", "data", "responden",
  "subjek", "objek", "tujuan", "manfaat", "kesimpulan", "saran", "dengan",
  "pada", "dalam", "untuk", "setiap", "semua", "banyak", "beberapa", "hal",
  "ini", "itu", "mereka", "ia", "dia", "namun", "tetapi", "selain", "karena",
  "sehingga", "sementara", "sedangkan", "meskipun", "walaupun", "agar",
  "supaya", "jadi", "oleh", "maka", "sebagai", "secara", "proses", "sistem",
  "kebijakan", "program", "lembaga", "unit", "lapas", "rutan", "bapas", "warga",
  "narapidana", "tahanan", "undang-undang", "pasal", "peraturan", "putusan",
  "hak", "kewajiban", "peran", "fungsi", "dampak", "upaya", "strategi",
  "pendekatan", "model", "teori", "konsep", "variabel", "uji", "nilai",
  "tingkat", "jumlah", "kualitas", "kuantitas", "waktu", "tempat", "lingkungan",
  "kesehatan", "keselamatan", "kerja", "hukum", "sanksi", "pidana", "keadilan",
  "kesejahteraan", "pemasyarakatan", "keamanan", "ketertiban", "pelayanan",
]);

function turunkanAwalAman(str: string): string {
  const trimmed = str.trim();
  const kata = trimmed.match(/^[A-Za-z][\w'’-]*/)?.[0] ?? "";
  if (!kata) return trimmed;
  if (/^[A-Z]{2,}/.test(kata)) return trimmed;

  const umum =
    SAFE_LOWER_START.has(kata.toLowerCase()) ||
    // Kata kerja pasif/berimbuhan (Diperlukan, Dilakukan, Ditemukan, ...) jelas
    // bukan nama diri, jadi aman direndahkan.
    /^(?:di|ter|ber|me|mem|men|meng|meny|pe|pem|pen|peng|per)[a-z]{3,}(?:kan|i)$/i.test(kata);

  if (!umum) return trimmed;
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

/**
 * 1. Hapus terjemahan bahasa Inggris berlebih dalam kurung khas AI
 * ISTILAH INDONESIA, SINGKATAN, SITASI HUKUM, DAN ISTILAH TEKNIS 100% AMAN.
 */
export function stripRedundantEnglishGlosses(text: string): string {
  const reg = newGlossRegex();
  return text.replace(reg, (fullMatch, inside: string) => {
    // Hanya hapus jika terbukti merupakan gloss bahasa Inggris AI dan bukan istilah yang dilindungi
    if (isAiEnglishGloss(inside)) {
      return "";
    }
    return fullMatch;
  });
}

/**
 * 1B. Pembersih Pola Koma Khas AI
 */
export function cleanAiCommaPatterns(text: string): string {
  let t = text;

  // 1. Pola "mencakup beberapa hal, seperti A, B, dan Z"
  t = t.replace(
    /\b(mencakup|meliputi|punya|memiliki|memuat|terdiri\s+dari|ada)\s+(?:beberapa|berbagai|sejumlah)\s+(\w+),\s*seperti\s+([^.!?]+?),\s+dan\s+([^,.!?]+)(?=[.!?])/gi,
    (_, verb, noun, listPart, lastItem) =>
      `${verb} berbagai ${noun} mulai dari ${listPart.trim()} sampai ${lastItem.trim()}`
  );

  // 2. Pola umum ", seperti A, B, ..., dan Z" di akhir kalimat
  t = t.replace(
    /,\s+seperti\s+([^.!?]+?),?\s+dan\s+([^,.!?]+)(?=[.!?])/gi,
    (_, listPart, lastItem) =>
      ` mulai dari ${listPart.trim()} sampai ${lastItem.trim()}`
  );

  // 3. Pola ", seperti " biasa
  t = t.replace(/,\s+seperti\s+/gi, " seperti ");

  // 4. Hilangkan Oxford Comma khas AI Inggris pada rincian "A, B, dan C"
  let prev: string;
  do {
    prev = t;
    t = t.replace(/(,\s*[^,.!?;:\n]+),\s+(dan|atau)\s+/gi, "$1 $2 ");
  } while (t !== prev);
  t = t.replace(/,\s+(dan|atau)\s+([^,.!?]{1,45})(?=[.,;!?])/gi, " $1 $2");

  return t;
}

// 2. Pengganti frasa klise AI menjadi bahasa alami.
// Entri yang sudah ada di FORBIDDEN_WORDS_MAP tidak diulang di sini agar setiap
// frasa hanya punya satu jalur penggantian (mencegah penggantian berantai).
const BASE_PHRASE_REPLACEMENTS = [
  // Pembuka era & waktu klise AI
  { regex: /\b(?:dalam|di)\s+(?:era|lanskap|dunia)\s+(?:digitalisasi|digital|globalisasi|modern|teknologi|informasi)(?:\s+saat\s+ini|\s+kini)?,\s*/gi, repl: "Saat ini, " },
  { regex: /\b(?:di|dalam)\s+(?:era|lanskap)\s+(?:digitalisasi|digital|globalisasi|modern|teknologi|informasi|yang terus berkembang)\b/gi, repl: "situasi saat ini" },
  { regex: /\bseiring\s+(?:dengan\s+)?(?:berjalannya\s+waktu|perkembangan\s+zaman),\s*/gi, repl: "Seiring waktu, " },
  { regex: /\bseiring\s+dengan\s+pesatnya\s+perkembangan\s+([^,.!?]+),\s*/gi, repl: "Dengan makin majunya $1, " },

  // Frasa peran & kepentingan
  { regex: /\bmemegang\s+(?:peranan|peran)\s+(?:yang\s+)?(?:sangat\s+)?(?:penting|krusial|strategis)\s+(?:dalam|untuk)\b/gi, repl: "sangat penting untuk" },
  { regex: /\bmemiliki\s+(?:peranan|peran)\s+(?:yang\s+)?(?:sangat\s+)?(?:penting|krusial|strategis)\s+(?:dalam|untuk)\b/gi, repl: "sangat penting untuk" },
  { regex: /\bmempunyai\s+(?:peranan|peran)\s+(?:yang\s+)?(?:sangat\s+)?(?:penting|krusial|strategis)\s+(?:dalam|untuk)\b/gi, repl: "sangat penting untuk" },
  { regex: /\bmemiliki\s+(?:peranan|peran)\s+(?:yang\s+)?(?:sangat\s+)?(?:penting|krusial|strategis)\b/gi, repl: "sangat penting" },
  { regex: /\bmemainkan\s+peran\s+(?:yang\s+)?(?:penting|krusial|strategis)\s+(?:dalam|untuk)\b/gi, repl: "berperan besar untuk" },
  { regex: /\bberperan\s+(?:sangat\s+)?(?:penting|krusial|strategis)\s+dalam\b/gi, repl: "sangat penting dalam" },
  { regex: /\bmerupakan\s+salah\s+satu\s+(?:faktor|unsur|komponen)\s+(?:penting|kunci|utama)\b/gi, repl: "menjadi kunci utama" },
  { regex: /\bmemiliki\s+pengaruh\s+(?:yang\s+)?(?:sangat\s+)?signifikan\b/gi, repl: "berpengaruh besar" },
  { regex: /\bmemberikan\s+dampak\s+(?:yang\s+)?(?:sangat\s+)?signifikan\b/gi, repl: "berdampak besar" },
  { regex: /\bmemberikan\s+kontribusi\s+(?:yang\s+)?(?:positif|besar|nyata)\b/gi, repl: "membantu banyak" },

  // Rancang, kemudahan, & akademik
  { regex: /\b(?:dirancang|didesain)\s+untuk\b/gi, repl: "dibuat untuk" },
  { regex: /\bmempermudah\s+proses\s+/gi, repl: "memudahkan " },
  { regex: /\bmempermudah\b/gi, repl: "memudahkan" },
  { regex: /\bmemfasilitasi\b/gi, repl: "membantu" },
  { regex: /\bdiharapkan\s+mampu\b/gi, repl: "diharapkan bisa" },
  { regex: /\bmampu\s+menyelesaikan\b/gi, repl: "bisa menuntaskan" },
  { regex: /\bberkembang\s+sangat\s+pesat\b/gi, repl: "maju sangat cepat" },
  { regex: /\bsangat\s+pesat\b/gi, repl: "sangat cepat" },
  { regex: /\bdalam\s+beberapa\s+tahun\s+terakhir\b/gi, repl: "beberapa tahun belakangan ini" },
  { regex: /\bbeberapa\s+tahun\s+terakhir\b/gi, repl: "beberapa tahun belakangan" },
  { regex: /\bmetodologi\s+penelitian\b/gi, repl: "metode penelitian" },
  { regex: /\bmemberikan\s+kebebasan\b/gi, repl: "memberi kebebasan" },
  { regex: /\bmemberikan\s+dampak\b/gi, repl: "memberi pengaruh" },
  { regex: /\bmemberikan\s+bantuan\b/gi, repl: "membantu" },
  { regex: /\bmemberikan\s+kemudahan\b/gi, repl: "memudahkan" },
  { regex: /\bmemberikan\s+pemahaman\b/gi, repl: "menjelaskan" },
  { regex: /\bmerancang\s+pembelajaran\b/gi, repl: "menyusun kegiatan belajar" },
  { regex: /\bkemudian\s+dianalisis\b/gi, repl: "lalu diperiksa" },
  { regex: /\bteknik\s+analisis\b/gi, repl: "cara analisis" },
  { regex: /\bkeberhasilan\s+proses\s+pembelajaran\b/gi, repl: "hasil kegiatan belajar" },
  { regex: /\bfondasi\s+penting\b/gi, repl: "dasar penting" },
  { regex: /\blingkungan\s+masyarakat\b/gi, repl: "warga sekitar" },
  { regex: /\bberintegritas\s+tinggi\b/gi, repl: "yang jujur dan bertanggung jawab" },
  { regex: /\bgenerasi\s+muda\b/gi, repl: "anak muda" },

  // Frasa usaha & tindakan
  { regex: /\bberupaya\s+(?:secara\s+maksimal\s+)?untuk\b/gi, repl: "berusaha" },
  { regex: /\bbertujuan\s+untuk\b/gi, repl: "bertujuan" },
  { regex: /\bhal\s+ini\s+(?:dilakukan\s+)?guna\s+(?:memastikan\s+)?(?:bahwa|kalau)?\b/gi, repl: "ini dilakukan agar" },
  { regex: /\bguna\s+memastikan\s+(?:bahwa|kalau)?\b/gi, repl: "supaya" },
  { regex: /\buntuk\s+memastikan\s+(?:bahwa|kalau)?\b/gi, repl: "supaya" },
  { regex: /\bsebagai\s+salah\s+satu\s+upaya\s+(?:untuk\s+)?\b/gi, repl: "sebagai langkah untuk" },
  { regex: /\bsebagai\s+salah\s+satu\s+wujud\s+(?:dari\s+)?\b/gi, repl: "sebagai bentuk" },
  { regex: /\bmampu\s+bersaing\b/gi, repl: "bisa bersaing" },
  { regex: /\bmampu\s+meningkatkan\b/gi, repl: "bisa membantu menaikkan" },
  { regex: /\bmampu\s+memberikan\b/gi, repl: "bisa memberi" },
  { regex: /\bdapat\s+memberikan\s+kontribusi\b/gi, repl: "bisa membantu" },
  { regex: /\blangkah\s+awal\s+yang\s+strategis\b/gi, repl: "langkah penting pertama" },
  { regex: /\bmewujudkan\s+tujuan\s+bersama\b/gi, repl: "mencapai tujuan bersama" },
  { regex: /\bmenghadapi\s+berbagai\s+tantangan\b/gi, repl: "menemui banyak kendala" },

  // Penegasan & transisi
  { regex: /\btidak\s+dapat\s+(?:dipungkiri|disangkal)\s+bahwa\b/gi, repl: "jelas sekali kalau" },
  { regex: /\b(?:penting\s+untuk|patut|perlu)\s+(?:dicatat|dipahami|diperhatikan|diingat|ditekankan|digarisbawahi)\s+bahwa\b/gi, repl: "perlu diingat kalau" },
  { regex: /\bmenjembatani\s+kesenjangan\b/gi, repl: "mengurangi jarak" },
  { regex: /\bpada\s+hakikatnya,?\s*/gi, repl: "sebenarnya, " },
  { regex: /\bpada\s+dasarnya,?\s*/gi, repl: "sebenarnya, " },
  { regex: /\bpada\s+kenyataannya,?\s*/gi, repl: "faktanya, " },
  { regex: /\bsecara\s+garis\s+besar,?\s*/gi, repl: "secara umum, " },
  { regex: /\bbukan\s+merupakan\s+hal\s+yang\s+mudah\b/gi, repl: "bukan hal yang gampang" },
  { regex: /\bmerupakan\s+suatu\s+hal\s+yang\b/gi, repl: "menjadi hal yang" },
  { regex: /\bterdapat\s+berbagai\s+macam\b/gi, repl: "ada banyak" },
  { regex: /\bmemiliki\s+peluang\s+(?:yang\s+)?besar\b/gi, repl: "punya peluang bagus" },
  { regex: /\bberdasarkan\s+uraian\s+di\s+atas,?\s*/gi, repl: "dari penjelasan tadi, " },
  { regex: /\bberdasarkan\s+hal\s+tersebut,?\s*/gi, repl: "dari hal itu, " },
  { regex: /\bterkait\s+dengan\s+hal\s+tersebut,?\s*/gi, repl: "soal hal ini, " },
  { regex: /\bsehubungan\s+dengan\s+hal\s+tersebut,?\s*/gi, repl: "karena hal itu, " },
  { regex: /\bdi\s+sisi\s+lain,?\s*/gi, repl: "sementara itu, " },
  { regex: /\bdi\s+mana\s+hal\s+(?:ini|tersebut)\b/gi, repl: "dan hal ini" },
  { regex: /\byang\s+mana\s+hal\s+(?:ini|tersebut)\b/gi, repl: "hal ini pun" },
  { regex: /\bsehingga\s+dapat\s+dikatakan\s+bahwa\b/gi, repl: "jadi bisa dibilang kalau" },
  { regex: /\bmemiliki\s+kecenderungan\s+untuk\b/gi, repl: "cenderung" },
  { regex: /\bsebagaimana\s+mestinya\b/gi, repl: "seperti seharusnya" },

  // Istilah akademik / pendidikan umum
  { regex: /\bpeserta\s+didik\b/gi, repl: "siswa" },
  { regex: /\btenaga\s+pendidik\b/gi, repl: "guru dan pengajar" },
  { regex: /\bproses\s+pembelajaran\s+berlangsung\b/gi, repl: "kegiatan belajar berlangsung" },
  { regex: /\bproses\s+pembelajaran\b/gi, repl: "kegiatan belajar" },
  { regex: /\bproses\s+belajar\s+mengajar\b/gi, repl: "kegiatan belajar" },
  { regex: /\bmengalami\s+peningkatan\s+signifikan\b/gi, repl: "nilainya naik cukup banyak" },
  { regex: /\bmengalami\s+peningkatan\b/gi, repl: "mengalami kenaikan" },
  { regex: /\bmengalami\s+penurunan\b/gi, repl: "mengalami penurunan" },

  { regex: /\bdari hasil pembahasan diketahui bahwa\b/gi, repl: "hasil pembahasan memperlihatkan kalau" },
  { regex: /\bdari beberapa penelitian di indonesia juga diketahui bahwa\b/gi, repl: "sejumlah penelitian di Indonesia juga mencatat kalau" },
  { regex: /\bdari beberapa penelitian tersebut dapat diketahui bahwa\b/gi, repl: "berbagai kajian tersebut membuktikan kalau" },
  { regex: /\bdari penelitian tersebut diketahui bahwa\b/gi, repl: "temuan kajian itu memperlihatkan kalau" },
  { regex: /\bdalam penelitian tersebut dijelaskan bahwa\b/gi, repl: "kajian itu menerangkan kalau" },
  { regex: /\bdalam penelitian itu dijelaskan bahwa\b/gi, repl: "penelitian itu mengungkap kalau" },
  { regex: /\bdalam aturan baru tersebut dijelaskan tentang\b/gi, repl: "aturan baru ini memuat rincian mengenai" },
  { regex: /\bhasil penelitian menunjukkan bahwa\b/gi, repl: "temuan penelitian memperlihatkan kalau" },
  { regex: /\bstudi sosiologi hukum menunjukkan bahwa\b/gi, repl: "kajian sosiologi hukum memperlihatkan kalau" },
  { regex: /\bhal ini menunjukkan bahwa\b/gi, repl: "fakta ini memperlihatkan kalau" },
  { regex: /\bdapat disimpulkan bahwa\b/gi, repl: "kesimpulannya," },
  { regex: /\bsecara eksplisit menyatakan bahwa\b/gi, repl: "secara tegas menyebutkan kalau" },
  { regex: /\bsecara tegas menyatakan bahwa\b/gi, repl: "secara tegas menyebutkan kalau" },
  {
    regex:
      /\b(menjelaskan|menunjukkan|menyatakan|diketahui|membuktikan|menegaskan|mengungkapkan|menyebutkan|mengatakan|memperlihatkan|menentukan|menjamin)\s+bahwa\b/gi,
    repl: "$1 kalau",
  },
  { regex: /\bbahwa\b/gi, repl: "kalau" },
  { regex: /\bturut\s+serta\b/gi, repl: "ikut serta" },
  { regex: /\bikutserta\b/gi, repl: "ikut serta" },
  { regex: /\bpetugas serta keluarganya\b/gi, repl: "petugas beserta keluarganya" },
  // "serta" tidak boleh menyentuh "serta-merta", "ikut serta", "di serta", atau istilah berhubung.
  { regex: /(?<!\bikut\s+)(?<![\w-])serta(?!-merta)(?![\w-])/gi, repl: "dan juga" },
  // Klausa "Secara fisik dan mental," harus diparafrase, bukan dihapus.
  { regex: /\bSecara\s+(\w+)\s+dan\s+(\w+),\s+/gi, repl: "Dari sisi $1 dan $2, " },
  { regex: /\bSecara\s+normatif,\s+/gi, repl: "Menurut aturan yang berlaku, " },
  { regex: /\bSecara\s+struktural,\s+/gi, repl: "Dari sisi kelembagaan, " },
  // Jangan hapus informasi: ubah ke bentuk yang tetap wajar dibaca.
  { regex: /\bSecara\s+umum,\s+/gi, repl: "Umumnya, " },
  { regex: /\bSecara\s+keseluruhan,\s+/gi, repl: "Umumnya, " },
  { regex: /\bSecara\s+khusus,\s+/gi, repl: "Khususnya, " },
  { regex: /\bDari\s+dimensi\s+fisik,\s+/gi, repl: "Pada sisi keselamatan badan, " },
  { regex: /\bDari\s+dimensi\s+psikologis,\s+/gi, repl: "Untuk kesehatan pikiran, " },
  { regex: /\b(?:Sementara\s+)?dari\s+dimensi\s+hukum,\s+/gi, repl: "Soal masalah hukum, " },
  { regex: /\bDari\s+dimensi\s+(\w+),\s+/gi, repl: "Pada sisi $1, " },
  { regex: /\btidak\s+hanya\s+bertugas\s+([^,]+),\s*melainkan\s+juga\s+berdiri\s+sebagai\b/gi, repl: "bukan cuma bertugas $1, tapi juga menjadi" },
  { regex: /\btidak\s+hanya\s+ditujukan\s+untuk\s+([^,]+),\s*melainkan\s+juga\s+untuk\b/gi, repl: "bukan cuma untuk $1, tapi juga untuk" },
  { regex: /\b(?:tidak|bukan)\s+hanya\s+([^,.!?]{2,75}?),?\s+(?:melainkan|tetapi)\s+juga\b/gi, repl: "bukan cuma $1, tapi juga" },
  { regex: /\bbukan\s+sekadar\s+([^,.!?]{2,75}?),?\s+(?:melainkan|tetapi)(?:\s+juga)?\b/gi, repl: "bukan cuma $1, tapi" },
  { regex: /\bmenciptakan\s+ketidakpastian\s+hukum\b/gi, repl: "membuat aturan hukumnya kurang jelas" },
  { regex: /\bmenyebabkan\s+timbulnya\s+ketidakpastian\s+hukum\b/gi, repl: "membuat kepastian hukumnya kabur" },
  { regex: /\bdihadapkan\s+pada\s+situasi\s+dilematis\s+yang\s+membenturkan(?:\s+antara)?\b/gi, repl: "sering berada di posisi sulit antara" },
  { regex: /\bmengalami\s+transformasi\s+konseptual(?:\s+dan\s+yuridis)?(?:\s+yang\s+mendasar)?\b/gi, repl: "mengalami perubahan mendasar" },
  { regex: /\bmenjadi\s+sangat\s+krusial\s+dan\s+mendesak\b/gi, repl: "sangat penting untuk segera dilakukan" },
  { regex: /\bacak kali\b|\bacap kali\b/gi, repl: "sering kali" },
  { regex: /\bsebenarnya\s+aturan\s+([^.!?]{1,50}?)\s+sudah\s+ada\b/gi, repl: "aturan $1 memang sudah ada" },
  { regex: /\baturan\s+untuk\s+melindungi\s+petugas\s+sebenarnya\s+sudah\s+ada\b/gi, repl: "aturan perlindungan petugas sebenarnya sudah ada" },
  { regex: /\bbelum\s+bisa\s+menunjukkan\s+secara\s+pasti\s+berapa\s+banyak\b/gi, repl: "belum memuat angka pasti soal jumlah" },
  { regex: /\bbelum\s+bisa\s+digunakan\s+untuk\s+menyatakan\s+kalau\s+semua\b/gi, repl: "belum cukup untuk menyimpulkan kalau seluruh" },
  { regex: /\bbelum\s+bisa\s+digunakan\s+untuk\b/gi, repl: "belum cukup untuk" },
  { regex: /\bkendati demikian,?\s*/gi, repl: "meskipun begitu, " },
  { regex: /\bnamun demikian,?\s*/gi, repl: "meskipun begitu, " },
  { regex: /\bmemainkan peran penting\b/gi, repl: "menjadi bagian penting" },
  { regex: /\bsecara komprehensif\b/gi, repl: "secara menyeluruh" },
];

/**
 * Pengganti leksikal untuk kata akademik yang sangat sering muncul di naskah
 * formal/AI. Diterapkan PALING AKHIR setelah frasa panjang agar aturan yang
 * lebih spesifik tetap menang. Tidak dimasukkan ke FORBIDDEN_WORDS_MAP supaya
 * analyzer tidak menuduh naskah hanya karena memakai kata baku.
 */
const NATURAL_WORD_REPLACEMENTS: { regex: RegExp; repl: string }[] = [
  { regex: /\bdi\s+bawah\s+naungan\b/gi, repl: "di bawah" },
  { regex: /\bpemeliharaan\s+ekstra\b/gi, repl: "perawatan tambahan" },
  { regex: /\bberusia\s+tua\b/gi, repl: "tua" },
  { regex: /\bdalam\s+kenyataannya\b/gi, repl: "kenyataannya" },
  { regex: /\byang\s+sedang\s+/gi, repl: "yang lagi " },
  { regex: /\bsekaligus\s+sebagai\b/gi, repl: "dan juga sebagai" },
  { regex: /\bbertambah\s+berat\b/gi, repl: "makin berat" },
  { regex: /\bmerupakan\b/gi, repl: "adalah" },
  { regex: /\byakni\b/gi, repl: "yaitu" },
  { regex: /\btelah\b/gi, repl: "sudah" },
  { regex: /\bapabila\b/gi, repl: "kalau" },
  { regex: /\btersebut\b/gi, repl: "itu" },
  { regex: /\bmengemban\b/gi, repl: "menjalankan" },
  { regex: /\bmenuntut\b/gi, repl: "membutuhkan" },
  { regex: /\bpemeliharaan\b/gi, repl: "perawatan" },
  { regex: /\bdibandingkan\b/gi, repl: "dibanding" },
  { regex: /\blonjakan\b/gi, repl: "kenaikan" },
  { regex: /\bmencapai\s+(?=\d)/gi, repl: "sampai " },
  { regex: /\bmemperbesar\b/gi, repl: "menambah" },
  { regex: /\bmenciptakan\b/gi, repl: "membuat" },
  { regex: /\bupaya\b/gi, repl: "usaha" },
  { regex: /\bterlarang\b/gi, repl: "yang dilarang" },
  { regex: /\bterdapat\b/gi, repl: "ada" },
  { regex: /\bmaupun\b/gi, repl: "dan juga" },
  { regex: /\bmemberikan\b/gi, repl: "memberi" },
  { regex: /\bmerancang\b/gi, repl: "membuat" },
  { regex: /\bmemperoleh\b/gi, repl: "mendapat" },
  { regex: /\bmelaksanakan\b/gi, repl: "menjalankan" },
  { regex: /\bmemerlukan\b/gi, repl: "membutuhkan" },
  { regex: /\bberkaitan\s+dengan\b/gi, repl: "terkait dengan" },
  { regex: /\bsehubungan\s+dengan\b/gi, repl: "karena" },
  { regex: /\bolehh?\s+karena\s+itu,?\s*/gi, repl: "karena itu, " },
  { regex: /\bdengan\s+demikian,?\s*/gi, repl: "jadi, " },
  { regex: /\bmaka\s+dari\s+itu,?\s*/gi, repl: "karena itu, " },
  { regex: /\bmampu\s+([a-z]+)/gi, repl: "bisa $1" },
  // "bagi" sering dipakai sebagai kata depan formal; jangan sentuh "sebagian".
  { regex: /(?<![\w-])bagi(?![\w-])/gi, repl: "untuk" },
];

function matchCase(original: string, replacement: string): string {
  if (!original || !replacement) return replacement;
  const first = original.charAt(0);
  if (first === first.toUpperCase() && first !== first.toLowerCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

export function applyPhraseReplacements(text: string): string {
  let t = text;
  BASE_PHRASE_REPLACEMENTS.forEach((item) => {
    t = t.replace(item.regex, (m, ...args) => {
      // args berisi capture group diikuti offset dan string utuh.
      const captures = args.slice(0, -2) as string[];
      return applyReplacement(m, item.repl, captures);
    });
  });

  // Terapkan kamus kosakata bahasa lugas (diurutkan panjangnya)
  const sortedSederhana = Object.keys(BAHASA_SEDERHANA_WORDS_MAP).sort((a, b) => b.length - a.length);
  for (const word of sortedSederhana) {
    const repl = BAHASA_SEDERHANA_WORDS_MAP[word];
    const reg = new RegExp(`(?<![\\w-])${escapeRegex(word)}(?![\\w-])`, "gi");
    t = t.replace(reg, (m: string, offset: number, whole: string) => {
      if (word === "signifikan" && isStatisticalUse(whole, offset, offset + m.length)) {
        return m;
      }
      return matchCase(m, repl);
    });
  }

  // Semua kata dalam FORBIDDEN_WORDS_MAP punya pengganti aktif di satu tempat.
  Object.entries(FORBIDDEN_WORDS_MAP).forEach(([forb, repl]) => {
    const reg = new RegExp(`(?<![\\w-])${escapeRegex(forb)}(?![\\w-])`, "gi");
    t = t.replace(reg, (m: string, offset: number, whole: string) => {
      // Jangan sentuh istilah statistik: "berbeda signifikan" tetap signifikan.
      if (forb === "signifikan" && isStatisticalUse(whole, offset, offset + m.length)) {
        return m;
      }
      // Jangan sentuh "serta" jika didahului "ikut" atau "turut"
      if (forb === "serta" && /(?:ikut|turut)\s+$/i.test(whole.slice(Math.max(0, offset - 10), offset))) {
        return m;
      }
      return matchCase(m, repl);
    });
  });

  // Kata baku/akademik yang jarang dipakai percakapan sehari-hari.
  NATURAL_WORD_REPLACEMENTS.forEach((item) => {
    t = t.replace(item.regex, (m, ...args) => {
      const captures = args.slice(0, -2) as string[];
      return applyReplacement(m, item.repl, captures);
    });
  });

  return t;
}

/**
 * 3. Pembalik awalan kalimat monoton (Inversion Engine)
 */
export function invertMonotonousSentence(sentence: string): string {
  const s = (sentence || "").trim();
  if (!s) return s;

  // Pola 1: "Tetapi/Namun, aturan yang ada..."
  if (/^(?:Tetapi|Namun),?\s+/i.test(s)) {
    const rest = s.replace(/^(?:Tetapi|Namun),?\s+/i, "");
    return capitalizeFirst(rest);
  }

  // Pola 2: "Jadi, masalahnya..."
  if (/^Jadi,?\s+/i.test(s)) {
    const rest = s.replace(/^Jadi,?\s+/i, "");
    return capitalizeFirst(rest);
  }

  // Pola 3: "Selain itu, ada/terdapat [X]..."
  const mSelain = s.match(/^Selain itu,?\s+(ada|terdapat)\s+([^,.]+?)\s+yang\s+(.+)$/i);
  if (mSelain) {
    const noun = mSelain[2].trim();
    const verbClause = mSelain[3].trim();
    return capitalizeFirst(`${noun} juga ${verbClause}`);
  }
  if (/^Selain itu,?\s+/i.test(s)) {
    const rest = s.replace(/^Selain itu,?\s+/i, "");
    return capitalizeFirst(rest);
  }

  // Pola 4: "Oleh sebab itu / Oleh karena itu, pemerintah perlu..."
  if (/^(?:Oleh sebab itu|Oleh karena itu|Dengan demikian|Maka dari itu),?\s+/i.test(s)) {
    const rest = s.replace(/^(?:Oleh sebab itu|Oleh karena itu|Dengan demikian|Maka dari itu),?\s+/i, "");
    return capitalizeFirst(rest);
  }

  // Pola 5: "Dalam Pasal X UU Y dijelaskan bahwa..."
  const mPasal = s.match(
    /^Dalam\s+(Pasal\s+\d+[^,.]+?),?\s*(?:dijelaskan|diatur|ditegaskan)\s+(?:bahwa|kalau)\s+(.+)$/i
  );
  if (mPasal) {
    const pasal = mPasal[1].trim();
    const isi = mPasal[2].trim();
    return capitalizeFirst(`${pasal} menegaskan kalau ${lowerFirst(isi)}`);
  }

  // Pola 6: "Untuk itu / Karena itu, ..."
  if (/^(?:Untuk itu|Karena itu),?\s+/i.test(s)) {
    const rest = s.replace(/^(?:Untuk itu|Karena itu),?\s+/i, "");
    return capitalizeFirst(rest);
  }

  return s;
}

/**
 * Konjungsi yang aman dijadikan awal kalimat baru meski tanpa koma sebelumnya.
 * "sementara" tidak masuk daftar ini karena sering berfungsi sebagai adjektiva
 * ("penahanan sementara"), bukan penghubung antarklausa.
 */
const SPLIT_CONJUNCTION_NO_COMMA =
  /^(.{20,}?)\s+(namun|tetapi|sedangkan|karena|sehingga|walaupun|meskipun)\s+(.{15,})$/i;

/** Konjungsi yang hanya dipecah bila didahului koma agar tidak salah klausa. */
const SPLIT_CONJUNCTION_WITH_COMMA =
  /^(.{20,}?),\s+(namun|tetapi|sedangkan|sementara|karena|sehingga|walaupun|meskipun|agar|supaya|lalu|kemudian|setelah itu|selain itu|dan juga|serta)\s+(.{15,})$/i;

/** Ubah konjungsi menjadi pembuka kalimat yang tetap wajar dibaca. */
function conjunctionIntro(conj: string): string {
  switch (conj) {
    case "sehingga":
      return "Jadi,";
    case "karena":
      return "Sebab,";
    case "sedangkan":
    case "sementara":
      return "Sementara itu,";
    case "serta":
    case "dan juga":
      return "Selain itu,";
    case "tetapi":
    case "namun":
      return "Tapi,";
    case "walaupun":
    case "meskipun":
      return "Walau begitu,";
    case "agar":
    case "supaya":
      return "Supaya,";
    case "lalu":
      return "Lalu,";
    case "kemudian":
    case "setelah itu":
      return "Setelah itu,";
    case "selain itu":
      return "Selain itu,";
    default:
      return capitalizeFirst(conj);
  }
}

/**
 * Pecah satu kalimat panjang di depan konjungsi. Mengembalikan null bila
 * kalimat tidak memenuhi syarat, sehingga pemanggil bisa memakai kalimat asli.
 */
function splitLongSentence(sentence: string): string[] | null {
  if (countWords(sentence) < 12) return null;

  const splitMatch =
    sentence.match(SPLIT_CONJUNCTION_WITH_COMMA) ||
    sentence.match(SPLIT_CONJUNCTION_NO_COMMA);
  if (!splitMatch) return null;

  const kiri = splitMatch[1].trim();
  const conj = splitMatch[2].toLowerCase();
  const kananRaw = splitMatch[3].trim();
  const kanan = `${conjunctionIntro(conj)} ${kananRaw}`;

  // Pastikan kedua pecahan tetap utuh dan bermakna mandiri.
  if (countWords(kiri) < 5 || countWords(kanan) < 5) return null;

  return [ensurePeriod(kiri), ensurePeriod(kanan)];
}

/**
 * 4. Pemecah Kalimat (Burstiness Balancer)
 *
 * Memecah kalimat panjang di depan konjungsi ke dalam kalimat pendek dengan
 * penghubung alami Indonesia (misal: "..., sehingga" -> ". Jadi, ..."),
 * mendongkrak standar deviasi irama kalimat (Burstiness) dan keterbacaan manusia.
 */
export function rebalanceParagraphBurstiness(
  sentences: string[],
  options: { merge?: boolean } = {}
): string[] {
  if (sentences.length === 0) return sentences;

  const allowMerge = options.merge !== false;
  const result: string[] = [];
  let i = 0;

  while (i < sentences.length) {
    const cur = sentences[i];
    const words = countWords(cur);

    if (words >= 12) {
      const split = splitLongSentence(cur);
      if (split) {
        result.push(...split);
        i++;
        continue;
      }
    }

    // Gabungkan dua kalimat sedang agar variasi panjang tetap muncul. Titik
    // koma tidak mengarang relasi makna, dan huruf pertama hanya direndahkan
    // bila kata itu kata umum (nama diri tidak pernah diubah).
    if (allowMerge && i + 1 < sentences.length) {
      const next = sentences[i + 1];
      const wNext = countWords(next);
      const bisaDigabung =
        words >= 9 && words <= 17 && wNext >= 8 && wNext <= 15 && !MERGE_BLOCKER.test(next.trim());

      if (bisaDigabung) {
        result.push(ensurePeriod(`${stripTrailingPeriod(cur)}; ${turunkanAwalAman(next)}`));
        i += 2;
        continue;
      }
    }

    result.push(ensurePeriod(cur));
    i++;
  }

  return result;
}

/** Kalimat yang merujuk kalimat sebelumnya tidak boleh dipindah posisinya. */
const ANAPHORIC_STARTER =
  /^(?:ini|itu|hal ini|hal tersebut|tersebut|kondisi ini|akibatnya|oleh karena itu|dengan demikian|namun|tetapi|selain itu|sementara itu|di sisi lain|karena itu|maka dari itu|sebaliknya)\b/i;

/**
 * 5. Pengacak Hirarki Kalimat Tengah (Hierarchy Shuffling)
 * Hanya aktif bila tidak ada rujukan anaforis, agar alur argumen tidak rusak.
 */
export function shuffleParagraphHierarchy(sentences: string[]): string[] {
  if (sentences.length < 5) return sentences;

  const middle = sentences.slice(1, -1);
  if (middle.some((sentence) => ANAPHORIC_STARTER.test(sentence.trim()))) {
    return sentences;
  }

  return [sentences[0], ...middle.slice().reverse(), sentences[sentences.length - 1]];
}

/**
 * 6. Normalisasi Paragraf Cerdas
 * Mempertahankan heading, subbab, dan format naskah tanpa menggabungkannya ke isi teks
 */
/**
 * Baris daftar (bullet / bernomor) tidak boleh digabung ke paragraf.
 */
function isListLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  return /^(?:[-*•–—]\s+|\d+[.)]\s+|[a-zA-Z][.)]\s+|\(\d+\)\s+|\([a-zA-Z]\)\s+)/.test(trimmed);
}

const TITLE_CASE_FUNCTION_WORDS = new Set<string>([
  "dan", "atau", "di", "ke", "dari", "untuk", "pada", "yang", "dalam",
  "dengan", "serta", "the", "of", "and", "for",
]);

/** Judul Title Case: "Pembahasan", "Hasil dan Pembahasan", ... */
function isTitleCaseHeading(trimmed: string): boolean {
  if (trimmed.length > 60 || /[.!?]$/.test(trimmed)) return false;
  const words = trimmed.split(/\s+/);
  if (words.length === 0 || words.length > 8) return false;

  let contentWords = 0;
  for (const word of words) {
    const bare = word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
    if (!bare) return false;
    if (TITLE_CASE_FUNCTION_WORDS.has(bare.toLowerCase())) continue;
    if (!/^\p{Lu}/u.test(bare)) return false;
    contentWords++;
  }
  return contentWords > 0;
}

function isHeadingLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;

  // Judul baku artikel ilmiah
  if (
    /^(?:(?:BAB\s+[I|V|X\d]+|[I|V|X]+\.|\d+\.\d+(?:\.\d+)*|\b[A-Z]\.|\b[a-z]\.)\s+|ABSTRAK|ABSTRACT|KESIMPULAN|SARAN|PENDAHULUAN|METODE|HASIL DAN PEMBAHASAN|DAFTAR PUSTAKA|Tabel\s+\d+|Gambar\s+\d+|Kata Kunci:|Keywords:|Sumber:)/i.test(
      trimmed
    )
  ) {
    return true;
  }

  // Baris pendek tanpa tanda titik akhir berhuruf kapital penuh, tetapi hanya
  // jika benar-benar pendek (judul), bukan kalimat isi yang ditulis kapital.
  if (trimmed.length <= 60 && !/[.!?]$/.test(trimmed)) {
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount <= 10 && /[A-Z]/.test(trimmed) && trimmed === trimmed.toUpperCase()) {
      return true;
    }
  }

  return isTitleCaseHeading(trimmed);
}

/**
 * Entri daftar pustaka tidak boleh disentuh: penulisan ulang akan merusak sitasi.
 * Contoh yang dikenali: "Arief, B. N. (2014). ...", "Muladi. (2015). ...",
 * "Slavin, R. E., & Setyorini, D. (2015). ...".
 */
function isReferenceEntry(paragraph: string): boolean {
  const trimmed = paragraph.trim();
  if (!trimmed) return false;

  const year = trimmed.match(/\((\d{4})[a-z]?\)(?=\s*[.,:;]|\s*$)/);
  if (!year || year.index === undefined || year.index > 120) return false;

  const before = trimmed.slice(0, year.index);
  if (!/^[A-Z]/.test(before)) return false;

  const words = before.split(/[\s,.;:]+/).filter(Boolean);
  if (words.length === 0) return false;
  if (words.length === 1) return true;

  // Nama penulis: kata berhuruf kapital, inisial ("B."), atau penanda ringkas.
  return words.every(
    (word) =>
      /^[A-Z]$/.test(word) ||
      /^[A-Z][\p{L}'’\-]*$/u.test(word) ||
      /^(?:&|et|al|dkk)$/i.test(word)
  );
}

const PROTECTED_BLOCK_RE = /^___PROTECTED_BLOCK_(\d+)___$/;

/** Pola sitasi dalam kurung yang harus utuh: (Slavin, 2015), (Sugiyono, 2016: 45). */
const CITATION_PATTERN =
  /\(([A-Z][\w'’.-]+(?:\s+(?:et\s+al\.|dkk\.|dan\s+[A-Z][\w'’.-]+))?,\s*\d{4}(?::\s*\d+|,\s*(?:hlm|hal)\.?\s*\d+)?)\)/g;

/**
 * Sembunyikan heading, entri daftar pustaka, dan baris daftar SEBELUM semua
 * penggantian leksikal agar isinya tidak ikut berubah.
 */
function maskProtectedBlocks(text: string): { text: string; blocks: string[] } {
  const blocks: string[] = [];
  const masked = text
    .split(/\n{2,}/)
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return "";

      const lines = trimmed.split("\n");
      const protectedBlock =
        isHeadingLine(trimmed) ||
        isReferenceEntry(trimmed) ||
        lines.every((line) => isListLine(line));

      if (!protectedBlock) return trimmed;
      blocks.push(trimmed);
      return `___PROTECTED_BLOCK_${blocks.length - 1}___`;
    })
    .join("\n\n");

  return { text: masked, blocks };
}

function restoreProtectedBlocks(text: string, blocks: string[]): string {
  return text.replace(/___PROTECTED_BLOCK_(\d+)___/g, (_, index) => {
    return blocks[parseInt(index, 10)] ?? "";
  });
}

function restoreCitations(text: string, placeholders: string[]): string {
  return text.replace(/___CIT_TERM_(\d+)___/g, (_, index) => {
    return placeholders[parseInt(index, 10)] ?? "";
  });
}

function protectCitations(text: string, placeholders: string[]): string {
  return text.replace(CITATION_PATTERN, (match) => {
    placeholders.push(match);
    return `___CIT_TERM_${placeholders.length - 1}___`;
  });
}

/**
 * Baris hasil copy-paste PDF terpotong di tengah kalimat. Hanya baris seperti
 * itu yang digabung; entri daftar pustaka dan paragraf baru tetap terpisah.
 */
function continuesPreviousLine(previous: string, next: string): boolean {
  if (/[a-z0-9,;:\-–—]$/.test(previous)) return true;
  if (/^[a-z(]/.test(next)) return true;
  return false;
}

function normalizeParagraphs(text: string): string {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const paragraphs: string[] = [];
  let buffer = "";
  let bufferIsList = false;

  const flush = () => {
    if (buffer) {
      paragraphs.push(buffer);
      buffer = "";
      bufferIsList = false;
    }
  };

  for (const line of lines) {
    if (!line) {
      flush();
      continue;
    }

    if (isHeadingLine(line)) {
      flush();
      // Judul dijadikan paragraf mandiri agar tidak menempel
      paragraphs.push(line);
      continue;
    }

    if (isListLine(line)) {
      if (buffer && !bufferIsList) flush();
      buffer = buffer ? `${buffer}\n${line}` : line;
      bufferIsList = true;
      continue;
    }

    if (bufferIsList) flush();

    if (!buffer) {
      buffer = line;
      continue;
    }

    if (continuesPreviousLine(buffer, line)) {
      buffer += " " + line;
    } else {
      flush();
      buffer = line;
    }
  }

  flush();

  return paragraphs.join("\n\n");
}

function repairGlue(text: string): string {
  let t = text;
  t = t.replace(/,\s+sedangkan\s+kondisi\s+itu\s+/gi, ". Kondisi tersebut ");
  t = t.replace(/\bmengingat\s+kondisi\s+itu\b/gi, "karena hal itu");
  t = t.replace(/,\s+sedangkan\s+/gi, ", sementara ");
  t = t.replace(/^penyebabnya,\s+/gim, "Alasan utamanya, ");
  t = t.replace(/\bnamun\s+turut\b/gi, "tapi juga");
  t = t.replace(/\bguna\s+([^.!?]{5,60})\bguna\s+/gi, "guna $1 untuk ");
  return t;
}

function tidy(text: string): string {
  let t = text;
  t = t.replace(/[ \t]+/g, " ");
  t = t.replace(/[ \t]+([.,;:!?])/g, "$1");
  // Hanya menyisipkan spasi setelah tanda baca bila diikuti huruf kapital.
  // Versi lama juga memecah angka ("0.05" -> "0. 05", "15.000" -> "15. 000").
  t = t.replace(/([.,;:!?])(?=[A-Z])/g, "$1 ");
  t = t.replace(/\([ \t]+/g, "(");
  t = t.replace(/[ \t]+\)/g, ")");
  t = t.replace(/\n[ \t]+/g, "\n");
  t = t.replace(/[ \t]+\n/g, "\n");
  t = t.replace(/\n{3,}/g, "\n\n");
  return t.trim();
}

/**
 * Gaya penulisan lugas dan alami.
 * Mengubah teks akademik/formal menjadi bahasa sehari-hari yang sangat sederhana,
 * agak polos, dan mudah dipahami, tanpa mengubah fakta, angka, sitasi, atau data penting.
 */
export function applyBahasaSederhana(
  text: string,
  options: HumanizeOptions = {}
): string {
  if (!text || !text.trim()) return "";

  // 1. Proteksi Istilah Kustom Pengguna
  const maskedTerms = maskCustomTerms(text, options.customTerms);
  let protectedText = maskedTerms.text;

  // 2. Normalisasi Paragraf & Struktur
  const normalized = normalizeParagraphs(protectedText);

  // 3. Sembunyikan heading/referensi/daftar SEBELUM penggantian leksikal
  const maskedBlocks = maskProtectedBlocks(normalized);
  protectedText = maskedBlocks.text;

  // Lindungi sitasi & istilah wajib (Aturan 2, 3, & 7 SKILL.md)
  const citationPlaceholders: string[] = [];
  const protectItem = (match: string) => {
    citationPlaceholders.push(match);
    return `___SED_CIT_${citationPlaceholders.length - 1}___`;
  };

  // Lindungi sitasi dalam kurung: e.g. (Slavin, 2015), (Dewantara, 2013), (Sudjana, 2016: 45)
  protectedText = protectedText.replace(CITATION_PATTERN, protectItem);

  // Lindungi istilah teknis yang wajib akurat (PTKK, PTK, TGT, Wordwall, KKTP, dsb.)
  protectedText = protectedText.replace(/\b(PTKK|PTK|TGT|Wordwall|KKTP)\b/g, protectItem);

  let processed = cleanAiCommaPatterns(stripRedundantEnglishGlosses(repairGlue(protectedText)));

  // 4. Terapkan frasa khusus penulisan lugas
  BAHASA_SEDERHANA_PHRASES.forEach((item) => {
    processed = processed.replace(item.regex, item.repl);
  });

  // 5. Terapkan Penggantian Kosakata Sederhana (diurutkan panjangnya agar frasa panjang didahulukan)
  const sortedWords = Object.keys(BAHASA_SEDERHANA_WORDS_MAP).sort((a, b) => b.length - a.length);
  for (const word of sortedWords) {
    const repl = BAHASA_SEDERHANA_WORDS_MAP[word];
    const reg = new RegExp(`\\b${escapeRegex(word)}\\b`, "gi");
    processed = processed.replace(reg, (m, offset, whole) => {
      // Istilah statistik tidak diganti
      if (word === "signifikan" && isStatisticalUse(whole, offset, offset + m.length)) {
        return m;
      }
      return matchCase(m, repl);
    });
  }

  // Bersihkan frasa klise AI umum
  BASE_PHRASE_REPLACEMENTS.forEach((item) => {
    processed = processed.replace(item.regex, (m, ...args) => {
      const captures = args.slice(0, -2) as string[];
      return applyReplacement(m, item.repl, captures);
    });
  });

  // Terapkan pengganti leksikal alami (telah -> sudah, merupakan -> adalah, tersebut -> itu, dll.)
  NATURAL_WORD_REPLACEMENTS.forEach((item) => {
    processed = processed.replace(item.regex, (m, ...args) => {
      const captures = args.slice(0, -2) as string[];
      return applyReplacement(m, item.repl, captures);
    });
  });

  // 6. Pemecahan Kalimat Padat Menjadi Kalimat Sederhana Pendek (Aturan 5 & 6 SKILL.md)
  // Penghubung dasar: 'jadi', 'karena', 'tetapi', 'lalu', 'kalau', 'setelah itu', 'selain itu'
  const blocks = processed.split(/\n\n+/).map((para) => {
    const trimmed = para.trim();
    if (
      !trimmed ||
      PROTECTED_BLOCK_RE.test(trimmed) ||
      isHeadingLine(trimmed) ||
      isReferenceEntry(trimmed)
    ) {
      return trimmed;
    }

    const sents = splitSentences(trimmed);
    const brokenSents: string[] = [];

    for (let s of sents) {
      s = invertMonotonousSentence(s);

      // Pecah kalimat panjang di depan penghubung dengan konjungsi sederhana
      if (countWords(s) >= 12) {
        s = s.replace(/,\s+sehingga\s+([^.!?]+)/gi, ". Jadi, $1");
        s = s.replace(/,\s+karena\s+([^.!?]+)/gi, ". Karena $1");
        s = s.replace(/,\s+(?:tetapi|namun)\s+([^.!?]+)/gi, ". Tetapi $1");
        s = s.replace(/,\s+lalu\s+([^.!?]+)/gi, ". Lalu $1");
        s = s.replace(/,\s+(?:setelah itu|kemudian)\s+([^.!?]+)/gi, ". Setelah itu, $1");
        s = s.replace(/,\s+selain itu\s+([^.!?]+)/gi, ". Di samping itu, $1");
      }

      // Pisahkan lagi jika ada titik yang baru dibuat
      const subSents = s.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).map((ss) => ss.trim()).filter(Boolean);
      brokenSents.push(...subSents);
    }

    return brokenSents.join(" ");
  });

  processed = tidy(cleanAiCommaPatterns(blocks.join("\n\n")));

  // 7. Pulihkan blok yang dilindungi, sitasi, dan istilah kustom
  processed = restoreProtectedBlocks(processed, maskedBlocks.blocks);

  processed = processed.replace(/___SED_CIT_(\d+)___/g, (_, idx) => {
    return citationPlaceholders[parseInt(idx, 10)] || "";
  });

  processed = restoreCustomTerms(processed, maskedTerms.placeholders);

  return processed;
}

/**
 * Aksi granular UI: bersihkan kata/gloss saja tanpa mengubah struktur kalimat.
 * Heading, daftar pustaka, baris daftar, sitasi, dan istilah kustom tetap utuh.
 */
export function cleanAiWords(text: string, options: HumanizeOptions = {}): string {
  if (!text || !text.trim()) return "";

  const maskedTerms = maskCustomTerms(text, options.customTerms);
  const normalized = normalizeParagraphs(maskedTerms.text);
  const maskedBlocks = maskProtectedBlocks(normalized);
  const citations: string[] = [];
  const working = protectCitations(maskedBlocks.text, citations);

  let processed = tidy(
    applyPhraseReplacements(cleanAiCommaPatterns(stripRedundantEnglishGlosses(repairGlue(working))))
  );

  processed = restoreProtectedBlocks(processed, maskedBlocks.blocks);
  processed = restoreCitations(processed, citations);
  return restoreCustomTerms(processed, maskedTerms.placeholders);
}

/**
 * Aksi granular UI: pecah & gabung irama tanpa penggantian kosakata.
 */
export function rebalanceText(text: string, options: HumanizeOptions = {}): string {
  if (!text || !text.trim()) return "";

  const maskedTerms = maskCustomTerms(text, options.customTerms);
  const normalized = normalizeParagraphs(maskedTerms.text);
  const maskedBlocks = maskProtectedBlocks(normalized);

  const out = maskedBlocks.text.split(/\n\n+/).map((para) => {
    const trimmed = para.trim();
    if (!trimmed || PROTECTED_BLOCK_RE.test(trimmed)) return trimmed;

    let sentences = splitSentences(trimmed);
    if (sentences.length < 2) return trimmed;
    sentences = rebalanceParagraphBurstiness(sentences, {
      merge: options.aggressiveBurstiness !== false,
    });

    if (options.shuffleHierarchy && sentences.length >= 5) {
      sentences = shuffleParagraphHierarchy(sentences);
    }
    return sentences.join(" ");
  });

  const processed = tidy(out.join("\n\n"));
  const restoredBlocks = restoreProtectedBlocks(processed, maskedBlocks.blocks);
  return restoreCustomTerms(restoredBlocks, maskedTerms.placeholders);
}

/**
 * Aksi granular UI: rapikan awalan monoton tanpa penggantian kosakata.
 */
export function fixStartersText(text: string, options: HumanizeOptions = {}): string {
  if (!text || !text.trim()) return "";

  const maskedTerms = maskCustomTerms(text, options.customTerms);
  const normalized = normalizeParagraphs(maskedTerms.text);
  const maskedBlocks = maskProtectedBlocks(normalized);

  const out = maskedBlocks.text.split(/\n\n+/).map((para) => {
    const trimmed = para.trim();
    if (!trimmed || PROTECTED_BLOCK_RE.test(trimmed)) return trimmed;

    return splitSentences(trimmed)
      .map((sentence) => invertMonotonousSentence(sentence))
      .join(" ");
  });

  const processed = tidy(out.join("\n\n"));
  const restoredBlocks = restoreProtectedBlocks(processed, maskedBlocks.blocks);
  return restoreCustomTerms(restoredBlocks, maskedTerms.placeholders);
}

/**
 * Main Humanize Function
 */
export function humanize(text: string, options: HumanizeOptions = {}): string {
  if (!text || !text.trim()) return "";

  const intensity = (options.intensity || "aggressive").toLowerCase();
  if (intensity === "sederhana" || options.bahasaSederhana) {
    return applyBahasaSederhana(text, options);
  }

  const enableBurstiness =
    intensity === "light" ? false : options.aggressiveBurstiness !== false;
  // "balanced" memecah kalimat panjang tetapi tidak menggabungkan kalimat,
  // sehingga hasilnya berbeda dari "aggressive".
  const allowMerge = intensity !== "balanced";
  // Perbaikan bug: checkbox shuffleHierarchy dihormati langsung dari opsi
  const shuffleHierarchy = Boolean(options.shuffleHierarchy);

  // 1. Lindungi Istilah Kustom (Proteksi Istilah Pengguna)
  const maskedTerms = maskCustomTerms(text, options.customTerms);

  // 2. Normalisasi Paragraf & Sembunyikan Blok yang Tidak Boleh Diubah
  const normalized = normalizeParagraphs(maskedTerms.text);
  const maskedBlocks = maskProtectedBlocks(normalized);

  // Sitasi dalam kurung juga dilindungi agar nama penulis tidak ikut diganti.
  const citationPlaceholders: string[] = [];
  const workingText = maskedBlocks.text.replace(CITATION_PATTERN, (match) => {
    citationPlaceholders.push(match);
    return `___CIT_TERM_${citationPlaceholders.length - 1}___`;
  });

  const unglued = repairGlue(workingText);
  const noGlosses = stripRedundantEnglishGlosses(unglued);
  const noAiCommas = cleanAiCommaPatterns(noGlosses);
  const replaced = applyPhraseReplacements(noAiCommas);

  // 3. Pemrosesan Kalimat per Paragraf
  const blocks = replaced.split(/\n\n+/).map((para) => {
    const trimmed = para.trim();
    if (!trimmed) return { raw: para };

    // Heading, entri daftar pustaka, dan baris daftar sudah berbentuk placeholder.
    if (PROTECTED_BLOCK_RE.test(trimmed)) {
      return { raw: trimmed };
    }

    let sentences = splitSentences(trimmed);
    if (sentences.length === 0) return { raw: trimmed };

    sentences = sentences.map((s) => invertMonotonousSentence(s));

    // Pecah kalimat panjang di depan konjungsi (bahkan jika hanya 1 kalimat dalam paragraf)
    if (enableBurstiness) {
      const splitSents: string[] = [];
      for (const s of sentences) {
        if (countWords(s) >= 12) {
          const split = splitLongSentence(s);
          if (split) {
            splitSents.push(...split);
            continue;
          }
        }
        splitSents.push(s);
      }
      sentences = splitSents;
    }

    if (enableBurstiness && sentences.length >= 2) {
      sentences = rebalanceParagraphBurstiness(sentences, { merge: allowMerge });
    }
    return { sents: sentences };
  });

  const out = blocks.map((b) => {
    if (b.raw !== undefined) return b.raw;
    let sentences = b.sents;
    if (shuffleHierarchy && sentences.length >= 5) {
      sentences = shuffleParagraphHierarchy(sentences);
    }
    return sentences.join(" ");
  });

  const processed = tidy(cleanAiCommaPatterns(out.join("\n\n")));

  // 4. Pulihkan blok terproteksi, sitasi dalam kurung, dan istilah kustom
  const restoredBlocks = restoreProtectedBlocks(processed, maskedBlocks.blocks);
  const restoredCitations = restoredBlocks.replace(/___CIT_TERM_(\d+)___/g, (_, index) => {
    return citationPlaceholders[parseInt(index, 10)] ?? "";
  });
  return restoreCustomTerms(restoredCitations, maskedTerms.placeholders);
}
