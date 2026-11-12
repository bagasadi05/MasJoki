/**
 * dictionary.ts - Single Source of Truth untuk AI Humanizer & Diagnostic Mas Joki
 * Berisi kamus istilah dilindungi, kata pantangan AI, pengganti alami, dan akronim.
 */

// 1. Daftar putih istilah asing / kurung yang TIDAK BOLEH dihapus atau ditandai AI
export const ALLOWED_ENGLISH_GLOSSES: Set<string> = new Set([
  "retributive justice",
  "restorative justice",
  "use of force",
  "chilling effect",
  "pains of imprisonment",
  "mixed methods",
  "purposive sampling",
  "snowball sampling",
  "focus group discussion",
  "high risk",
  "burnout",
  "job strain",
  "job stress",
  "emotional exhaustion",
  "peer support",
  "overcrowding",
  "due process of law",
  "ratio decidendi",
  "mens rea",
  "actus reus",
  "good governance",
  "corporate governance",
  "standard operating procedure",
  "human rights",
  "civil law",
  "common law",
]);

// 2. Kata pantangan AI (pemicu deteksi) dengan padanan pengganti alami.
// Catatan: "signifikan" hanya diganti bila dipakai sebagai gaya bahasa, bukan
// sebagai istilah statistik (lihat isStatisticalUse di bawah).
export const FORBIDDEN_WORDS_MAP: Record<string, string> = {
  // Frasa penghubung artifisial & transisi klise AI
  "kendati demikian": "meskipun begitu",
  "namun demikian": "walaupun begitu",
  "adapun": "sementara itu",
  "dalam kaitannya dengan": "terkait dengan",
  "terkait dengan hal tersebut": "soal hal ini",
  "sehubungan dengan hal tersebut": "karena hal itu",
  "berdasarkan hal tersebut": "dari hal itu",
  "berdasarkan uraian di atas": "dari penjelasan tadi",
  "memiliki signifikansi": "berpengaruh besar",
  "berperan krusial": "sangat penting",
  "berperan penting": "sangat penting",
  "tidak dapat dipungkiri": "jelas terlihat",
  "tidak dapat disangkal": "jelas sekali",
  "konsekuensi yuridis": "akibat hukum",
  "pada hakikatnya": "sebenarnya",
  "pada dasarnya": "sebenarnya",
  "pada kenyataannya": "faktanya",
  "secara garis besar": "secara umum",
  "secara keseluruhan": "secara umum",
  "bukan merupakan hal yang mudah": "bukan hal yang gampang",
  "merupakan suatu hal yang": "menjadi hal yang",
  "langkah awal yang strategis": "langkah awal yang penting",
  "mewujudkan tujuan bersama": "mencapai tujuan bersama",
  "menghadapi berbagai tantangan": "menemui banyak kendala",
  "faktor-faktor yang mempengaruhi": "hal-hal yang mempengaruhi",
  "terdapat berbagai macam": "ada banyak",
  "memiliki peluang yang besar": "punya peluang bagus",
  "mampu bersaing": "bisa bersaing",
  "mampu meningkatkan": "bisa membantu menaikkan",
  "berupaya untuk": "berusaha",
  "bertujuan untuk": "bertujuan",
  "guna memastikan": "supaya",
  "guna mencapai": "supaya bisa mencapai",
  "dalam rangka untuk": "untuk",
  "dalam rangka": "untuk",
  "sebagai salah satu upaya": "sebagai langkah",

  // Kata leksikal & kalke klise AI
  "mengimplementasikan": "menerapkan",
  "mengidentifikasi": "mencari tahu",
  "komprehensif": "menyeluruh",
  "holistik": "secara utuh",
  "optimalisasi": "peningkatan",
  "mengeksplorasi": "menelaah",
  "manifestasi": "wujud nyata",
  "reorientasi": "penataan ulang",
  "senantiasa": "selalu",
  "pelbagai": "berbagai",
  "eksistensi": "keberadaan",
  "signifikan": "nyata",
  "dalam lanskap": "dalam situasi",
  "di era modern": "saat ini",
  "di era digital": "saat ini",
  "patut dicatat": "perlu diingat",
  "perlu ditekankan": "perlu diingat",
  "menjembatani kesenjangan": "mengurangi jarak",
  "lebih lanjut lagi": "berikutnya",
  "di sisi lainnya": "sebaliknya",

  // Kata penghubung yang paling sering dipakai generator AI. Dua kata ini
  // sebelumnya diganti oleh engine tetapi tidak dihitung analyzer/UI.
  "bahwa": "kalau",
  "serta": "dan juga",
};

// Daftar kata pantangan untuk analyzer (array string)
export const FORBIDDEN_WORDS: string[] = Object.keys(FORBIDDEN_WORDS_MAP);

/**
 * Kamus khusus gaya penulisan lugas dan alami.
 * Menulis ulang teks akademik/formal menjadi bahasa sehari-hari yang sangat sederhana,
 * agak polos, dan mudah dipahami, tanpa mengubah fakta, angka, sitasi, atau data.
 */
export const BAHASA_SEDERHANA_WORDS_MAP: Record<string, string> = {
  // Istilah inti dari SKILL.md
  "mengimplementasikan": "menggunakan",
  "mengidentifikasi": "mengetahui",
  "berdasarkan temuan": "dari hasil yang ditemukan",
  "berdasarkan hasil temuan": "dari hasil yang didapat",
  "berdasarkan hasil penelitian": "dari hasil penelitian",
  "partisipasi aktif peserta didik": "siswa yang aktif ikut kegiatan",
  "partisipasi peserta didik": "siswa yang ikut kegiatan",
  "partisipasi aktif": "keaktifan",
  "partisipasi siswa": "siswa yang ikut kegiatan",
  "peserta didik": "siswa",
  "pendidik": "guru",
  "proses pembelajaran berlangsung": "kegiatan belajar berlangsung",
  "proses pembelajaran": "kegiatan belajar",
  "proses belajar mengajar": "kegiatan belajar",
  "mengalami peningkatan signifikan": "nilainya naik cukup banyak",
  "mengalami peningkatan": "nilainya naik",
  "mengalami penurunan signifikan": "nilainya turun cukup banyak",
  "mengalami penurunan": "nilainya turun",
  "instrumen diagnostik nonkognitif": "angket awal tentang cara dan minat belajar",
  "instrumen diagnostik": "angket penilaian awal",
  "berlandaskan pada": "sesuai dengan",
  "berlandaskan": "mengikuti",
  "pada prasiklus": "sebelum kegiatan dilakukan",
  "pada tahap prasiklus": "sebelum kegiatan dimulai",
  "hasil belajar meningkat": "nilai belajar siswa naik",
  "mampu meningkatkan": "bisa membantu menaikkan",
  "dapat meningkatkan": "bisa membuat nilai naik",
  "ketuntasan belajar": "ketuntasan siswa",
  "penyelenggaraan": "pengelolaan",
  "dihadapkan pada": "menghadapi",
  "gangguan keamanan dan ketertiban": "masalah keamanan dan ketertiban",
  "berupa": "seperti",
  "praktik pungutan liar": "pungutan liar",
  "penyalahgunaan narkotika": "pemakaian narkotika secara ilegal",
  "pembayaran nontunai": "pembayaran tanpa uang tunai",
  "penjatuhan sanksi": "pemberian sanksi",
  "efektivitas": "keefektifan",
  "terkendala": "terhambat",
  "kelebihan penghuni": "jumlah penghuni yang berlebih",
  "timpangnya": "tidak seimbangnya",

  // Kosakata akademik formal -> bahasa polos & sederhana
  "optimalisasi": "usaha perbaikan",
  "komprehensif": "menyeluruh",
  "holistik": "secara utuh",
  "mengeksplorasi": "melihat lebih jauh",
  "manifestasi": "bukti nyata",
  "senantiasa": "selalu",
  "pelbagai": "bermacam-macam",
  "eksistensi": "keberadaan",
  "kendati demikian": "walaupun begitu",
  "adapun": "sementara itu",
  "dalam kaitannya dengan": "terkait hal ini",
  "memiliki signifikansi": "punya pengaruh besar",
  "berperan krusial": "sangat penting",
  "tidak dapat dipungkiri": "jelas sekali",
  "konsekuensi yuridis": "akibat hukum",
  "dalam rangka untuk": "untuk",
  "dalam rangka": "untuk",
  "guna mencapai": "supaya bisa mencapai",
  "guna": "untuk",
  "sehubungan dengan hal tersebut": "soal hal itu",
  "sehubungan dengan": "karena",
  "memberikan kontribusi": "membantu",
  "merupakan salah satu": "menjadi salah satu",
  "hal tersebut disebabkan oleh": "hal itu terjadi karena",
  "hal ini disebabkan oleh": "ini terjadi karena",
  "dapat dipahami bahwa": "bisa dilihat kalau",
  "terdapat indikasi bahwa": "terlihat kalau",
  "pada dasarnya": "sebenarnya",
  "secara keseluruhan": "secara umum",
  "melakukan evaluasi": "memeriksa kembali",
  "memberikan pemahaman": "menjelaskan",
  "perlu digarisbawahi": "perlu diingat",
  "sebagaimana mestinya": "seperti seharusnya",
  "memiliki kecenderungan": "cenderung",
  "implementasi": "penerapan",
  "dirancang untuk": "dibuat untuk",
  "dirancang": "dibuat",
  "mempermudah": "memudahkan",
  "proses evaluasi": "penilaian",
  "evaluasi": "penilaian",
  "metodologi penelitian": "metode penelitian",
  "metodologi": "metode",
  "sangat pesat": "sangat cepat",
  "dalam beberapa tahun terakhir": "beberapa tahun belakangan ini",
  "beberapa tahun terakhir": "beberapa tahun belakangan",
  "diharapkan mampu": "diharapkan bisa",
  "memberikan": "memberi",
  "merancang": "menyusun",
  "kemudian": "lalu",
  "teknik analisis": "cara analisis",
  "fondasi penting": "dasar penting",
  "fondasi": "dasar",
  "lingkungan masyarakat": "warga sekitar",
  "berintegritas tinggi": "yang jujur dan bertanggung jawab",
  "generasi muda": "anak muda",
  "terdapat": "ada",
  "maupun": "dan juga",
};

export const BAHASA_SEDERHANA_PHRASES = [
  {
    regex: /\bpenerapan model pembelajaran ([^,.!?]+) mampu meningkatkan partisipasi aktif peserta didik selama proses pembelajaran berlangsung\b/gi,
    repl: "Kalau siswa belajar menggunakan model $1, siswa bisa lebih banyak ikut belajar dan lebih aktif saat kegiatan belajar berlangsung",
  },
  {
    regex: /\bpenerapan model pembelajaran ([^,.!?]+) dapat meningkatkan\b/gi,
    repl: "Saat siswa belajar menggunakan model $1, hal itu bisa membantu menaikkan",
  },
  {
    regex: /\bpenerapan model pembelajaran\b/gi,
    repl: "penggunaan cara belajar",
  },
  {
    regex: /\bmampu meningkatkan partisipasi aktif peserta didik\b/gi,
    repl: "bisa membuat siswa lebih aktif ikut belajar",
  },
  {
    regex: /\bpartisipasi aktif peserta didik selama proses pembelajaran berlangsung\b/gi,
    repl: "keaktifan siswa saat kegiatan belajar berlangsung",
  },
  {
    regex: /\brata-rata hasil belajar meningkat dari ([\d,.]+) menjadi ([\d,.]+) dengan ketuntasan ([\d,.]+%?)\b/gi,
    repl: "nilai rata-rata siswa naik dari $1 menjadi $2 dengan siswa yang tuntas mencapai $3",
  },
  {
    regex: /\bnaik dari ([\d,.]+) pada prasiklus menjadi ([\d,.]+) pada Siklus I dan ([\d,.]+) pada Siklus II\b/gi,
    repl: "sebelum kegiatan dilakukan nilainya masih $1, setelah Siklus I naik jadi $2, dan pada Siklus II naik lagi jadi $3",
  },
  {
    regex: /\bpada siklus i,?\s*rata-rata hasil belajar meningkat dari ([\d,.]+) menjadi ([\d,.]+) dengan ketuntasan ([\d,.]+%?)\b/gi,
    repl: "Setelah kegiatan Siklus I dilakukan, nilai rata-rata siswa naik dari $1 menjadi $2 dengan ketuntasan mencapai $3",
  },
];

/**
 * Istilah yang muncul sah di laporan statistik. Penggantian otomatis pada
 * istilah ini akan mengubah makna ("berbeda signifikan" bukan "berbeda nyata").
 */
const STAT_BEFORE =
  /\b(?:berbeda|perbedaan|pengaruh|hubungan|uji|nilai\s*p|taraf|level|secara|sangat|cukup|tidak|kurang|semakin|makin|hasil)\s*$/i;
const STAT_AFTER = /^\s*(?:terhadap|antara|pada|bagi|dalam|antar|dengan)\b/i;
const P_VALUE_BEFORE = /\bp\s*[=<>≤≥]\s*$/i;

/**
 * Deteksi apakah sebuah kata (biasanya "signifikan"/"signifikansi") dipakai
 * dalam konteks statistik sehingga harus dibiarkan apa adanya.
 */
export function isStatisticalUse(
  text: string,
  start: number,
  end: number,
): boolean {
  const before = text.slice(Math.max(0, start - 48), start);
  const after = text.slice(end, end + 32);
  return (
    P_VALUE_BEFORE.test(before) ||
    STAT_BEFORE.test(before) ||
    STAT_AFTER.test(after)
  );
}

// 3. Awalan kalimat monoton yang sering diulang AI.
// Hanya penanda wacana; kata fungsi biasa seperti "dalam" tidak dihitung agar
// persentase awalan monoton tidak menggelembung.
export const MONO_STARTERS = [
  "tetapi",
  "jadi",
  "selain itu",
  "karena",
  "hal ini",
  "sebenarnya",
  "namun",
  "oleh sebab itu",
  "oleh karena itu",
  "dengan demikian",
  "sehingga",
  "kemudian",
  "selanjutnya",
  "untuk itu",
  "pada dasarnya",
  "secara umum",
  "bahkan",
  "alhasil",
  "di sisi lain",
  "adapun",
  "terkait hal tersebut",
  "berdasarkan hal tersebut",
  "maka dari itu",
  "kendati demikian",
  "meskipun demikian",
  "walaupun demikian",
  "sebagai hasilnya",
  "tentu saja",
  "tentunya",
] as const;

export const ALWAYS_BAD_STARTERS: Set<string> = new Set([
  "tetapi",
  "jadi",
  "karena",
  "sehingga",
  "adapun",
]);

// 4. Pola template kalimat khas AI
export const TEMPLATE_PATTERNS = [
  {
    name: "Hal ini menunjukkan bahwa",
    regex: /\bhal ini (?:menunjukkan|membuktikan|menegaskan|mengindikasikan|menggambarkan)\s+bahwa\b/gi,
  },
  {
    name: "Bukan/Tidak hanya X tetapi/melainkan juga Y",
    regex: /\b(?:bukan|tidak) hanya\s+[^,.!?]+,?\s+(?:tetapi|melainkan|namun) juga\b/gi,
  },
  {
    name: "Dalam konteks ini",
    regex: /\bdalam konteks (?:ini|tersebut|penelitian ini)\b/gi,
  },
  {
    name: "Sebagai salah satu upaya",
    regex: /\bsebagai salah satu upaya\b/gi,
  },
  {
    name: "Dalam lanskap / era modern",
    regex: /\b(?:di|dalam)\s+(?:era|lanskap|dunia)\s+(?:digital|modern|teknologi|globalisasi|yang terus berkembang)\b/gi,
  },
  {
    name: "Patut/Perlu dicatat bahwa",
    regex: /\b(?:penting untuk|patut|perlu)\s+(?:dicatat|diperhatikan|diingat|ditekankan|digarisbawahi)\s+bahwa\b/gi,
  },
  {
    name: "Dapat disimpulkan bahwa",
    regex: /\bdapat disimpulkan\s+bahwa\b/gi,
  },
  {
    name: "Memiliki peran penting dalam",
    regex: /\bmemiliki peran (?:penting|krusial|strategis)\s+dalam\b/gi,
  },
];

// 5. Deteksi cerdas: terjemahan kurung bahasa Inggris khas AI vs kurung bahasa Indonesia
export function newGlossRegex(): RegExp {
  return /\(([a-zA-Z][a-zA-Z\s/-]{3,45})\)/g;
}

const ENGLISH_FUNCTION_WORDS = new Set([
  "the",
  "of",
  "and",
  "in",
  "to",
  "for",
  "with",
  "on",
  "by",
  "at",
  "from",
  "as",
  "into",
  "through",
  "between",
  "during",
  "without",
  "under",
  "within",
  "along",
  "across",
  "behind",
  "beyond",
  "plus",
  "except",
  "but",
  "up",
  "out",
  "around",
  "down",
  "off",
  "above",
  "near",
  "a",
  "an",
  "or",
  "per",
]);

const ENGLISH_GLOSS_TERMS = new Set([
  "justice",
  "force",
  "effect",
  "support",
  "strain",
  "stress",
  "exhaustion",
  "burnout",
  "rights",
  "system",
  "method",
  "methods",
  "study",
  "review",
  "sampling",
  "punishment",
  "imprisonment",
  "policy",
  "framework",
  "law",
  "assessment",
  "treatment",
  "management",
  "security",
  "facility",
  "officer",
  "staff",
  "inmate",
  "prisoner",
  "crime",
  "criminal",
  "high",
  "risk",
  "overcrowding",
  "purposive",
  "snowball",
  "peer",
  "wellbeing",
  "well-being",
  "self-efficacy",
  "coping",
  "locus",
  "control",
  "workload",
  "turnover",
  "engagement",
  "performance",
  "compliance",
  "deterrence",
  "job",
  "demand",
  "demands",
  "resources",
  "emotional",
  "social",
  "human",
  "capital",
  "governance",
  "good",
  "corporate",
  "operating",
  "procedure",
  "standard",
  "civil",
  "common",
  "due",
  "process",
  "decision",
  "reasoning",
  "principle",
  "balance",
  "equality",
  "before",
  "after",
]);

const INDONESIAN_MARKERS = new Set([
  "yang",
  "di",
  "ke",
  "dari",
  "pada",
  "untuk",
  "dengan",
  "dan",
  "atau",
  "ini",
  "itu",
  "oleh",
  "adalah",
  "sebagai",
  "dalam",
  "pasal",
  "uu",
  "nomor",
  "no",
  "permen",
  "hukum",
  "lapas",
  "petugas",
  "warga",
  "binaan",
  "narapidana",
  "blok",
  "hunian",
  "tahanan",
  "kejahatan",
  "sanksi",
  "pidana",
  "kesehatan",
  "mental",
  "badan",
  "fisik",
  "jiwa",
  "aturan",
  "kerja",
  "kasus",
  "substansi",
  "penelitian",
  "kebijakan",
  "negara",
  "pemerintah",
  "pengawasan",
  "evaluasi",
]);

/**
 * True hanya jika isi kurung benar-benar terjemahan bahasa Inggris khas AI.
 * Sengaja konservatif: semua kata isi harus dikenali sebagai istilah Inggris
 * umum dan tidak ada penanda bahasa Indonesia. Istilah teknis yang tidak
 * dikenal (mis. "self-determination") akan dipertahankan.
 */
export function isAiEnglishGloss(inside: string): boolean {
  if (!inside) return false;
  const clean = inside.trim();
  const lower = clean.toLowerCase();

  // 1. Jika memuat angka (sitasi tahun, nomor pasal, lampiran), 100% pertahankan
  if (/\d/.test(clean)) return false;

  // 2. Jika singkatan pendek kapital (HAM, ASN, SOP, K3, PTSD, KUHP), pertahankan
  if (clean === clean.toUpperCase() && clean.length <= 8) return false;

  // 3. Jika istilah ada di daftar putih yang sengaja dipertahankan, pertahankan
  if (ALLOWED_ENGLISH_GLOSSES.has(lower)) return false;

  // 4. Pisah menjadi kata-kata
  const words = lower.split(/[\s/-]+/).filter(Boolean);
  if (words.length === 0) return false;

  // 5. Cek apakah ada penanda bahasa Indonesia (kata dasar atau morfologi)
  for (const w of words) {
    if (INDONESIAN_MARKERS.has(w)) return false;
    // Awalan me-, ber-, di-, ter-, pe-, per-
    if (/^(ber|mem|men|meng|meny|ter|di|pe|pem|pen|peng|per)[a-z]{3,}/.test(w)) {
      return false;
    }
    // Akhiran -kan, -an, -nya, -pun, -lah
    if (/[a-z]{3,}(kan|an|nya|pun|lah|kah)$/.test(w)) return false;
  }

  // 6. Semua kata isi harus dikenali sebagai istilah Inggris umum.
  const contentWords = words.filter((w) => !ENGLISH_FUNCTION_WORDS.has(w));
  if (contentWords.length === 0) return false;
  return contentWords.every((w) => ENGLISH_GLOSS_TERMS.has(w));
}
