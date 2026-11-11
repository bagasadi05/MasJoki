import { ImageResponse } from "next/og";
import { aksenLayanan } from "@/lib/aksen";
import { rupiah } from "@/lib/format";
import type { ServiceId } from "@/lib/services";
import { pembayaran } from "@/lib/site";

export const size = { width: 1080, height: 1350 };
export const contentType = "image/png";
export const alt = "Poster daftar harga Mas Joki — bantuan tugas kuliah";

const PAPER = "#fcfbf7";
const INK = "#101a33";
const INK_SOFT = "#3c465c";
const MUTED = "#686e79";
const LINE = "#ded9c8";
const BRAND = "#1f3be0";
const STABILO = "#ffe44d";
const MINT = "#2a6b55";
const MINT_SOFT = "#e6f1ea";

const PITA = [
  "#1f3be0",
  "#2a6b55",
  "#9e4e42",
  "#6556a3",
  "#8a5d12",
  "#2b6a97",
  "#5f6f2a",
  "#9d4d6b",
];

interface Baris {
  id: ServiceId;
  label: string;
  satuan: string;
  harga: string;
}

const KIRI: Baris[] = [
  { id: "humanisasi", label: "Humanisasi teks AI", satuan: "per 100 kata", harga: rupiah(4000) },
  { id: "parafrase", label: "Parafrase", satuan: "per 100 kata", harga: rupiah(3000) },
  { id: "makalah", label: "Makalah & laporan", satuan: "per halaman", harga: rupiah(12000) },
  { id: "jurnal", label: "Artikel jurnal", satuan: "per artikel", harga: rupiah(250000) },
];

const KANAN: Baris[] = [
  { id: "powerpoint", label: "PowerPoint", satuan: "per slide", harga: rupiah(7500) },
  { id: "word", label: "Rapikan Word", satuan: "per dokumen (maks. 25 hal)", harga: rupiah(30000) },
  { id: "terjemah", label: "Terjemahan", satuan: "per 100 kata", harga: rupiah(10000) },
  { id: "desain", label: "Desain visual", satuan: "per desain", harga: rupiah(45000) },
];

const FAKTA = [
  { judul: "Dikerjakan langsung", isi: "oleh Mas Joki, tanpa perantara", warna: BRAND },
  { judul: "File sumber diserahkan", isi: ".docx / .pptx, bebas kamu edit", warna: MINT },
  { judul: "Revisi 2× gratis", isi: "tanpa biaya tambahan", warna: "#8a5d12" },
];

type FontSpec = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700 | 800;
  style: "normal";
};

/** Font disimpan setelah pemuatan pertama; request berikutnya tidak fetch ulang. */
let simpananFont: FontSpec[] | null = null;

/**
 * Satori hanya menerima ttf/otf/woff (bukan woff2). Google Fonts mengirim
 * berkas .woff bila diminta dengan user-agent lama. Kalau gagal, poster tetap
 * dirender dengan font sistem — build tidak ikut gagal.
 */
async function muatFont(family: string, weight: 400 | 700 | 800): Promise<FontSpec | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css?family=${family}:${weight}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36",
      },
    }).then((r) => r.text());

    const cocok = css.match(/url\((https:\/\/[^)]+)\)/);
    if (!cocok) return null;

    const data = await fetch(cocok[1]).then((r) => r.arrayBuffer());
    return { name: family.replace(/\+/g, " "), data, weight, style: "normal" };
  } catch {
    return null;
  }
}

export async function GET() {
  if (!simpananFont) {
    const [display, teks, teksTebal] = await Promise.all([
      muatFont("Bricolage+Grotesque", 800),
      muatFont("Plus+Jakarta+Sans", 400),
      muatFont("Plus+Jakarta+Sans", 700),
    ]);

    simpananFont = [display, teks, teksTebal].filter((f): f is FontSpec => f !== null);
  }

  const fonts = simpananFont;
  const DISPLAY = fonts.some((f) => f.name === "Bricolage Grotesque")
    ? "Bricolage Grotesque"
    : "sans-serif";
  const BODY = fonts.some((f) => f.name === "Plus Jakarta Sans")
    ? "Plus Jakarta Sans"
    : "sans-serif";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: PAPER,
        padding: "22px",
        fontFamily: BODY,
      }}
    >
      {/* Bingkai nota */}
      <div
        style={{
          position: "absolute",
          top: "22px",
          left: "22px",
          right: "22px",
          bottom: "22px",
          display: "flex",
          border: `3px solid ${INK}`,
          borderRadius: "26px",
        }}
      />

      {/* Pita delapan warna layanan, tanda tangan visual Mas Joki */}
      <div
        style={{
          position: "absolute",
          top: "23px",
          left: "23px",
          right: "23px",
          height: "10px",
          display: "flex",
          overflow: "hidden",
          borderRadius: "23px 23px 0 0",
        }}
      >
        {PITA.map((warna) => (
          <div key={warna} style={{ flex: 1, height: "100%", backgroundColor: warna }} />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "46px 58px 40px",
        }}
      >
        {/* Kepala */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: "26px",
                fontWeight: 800,
                letterSpacing: "0.3em",
                color: BRAND,
              }}
            >
              MAS JOKI
            </div>
            <div style={{ marginTop: "8px", fontSize: "13px", fontWeight: 400, color: MUTED }}>
              Bantuan tugas kuliah · Madiun
            </div>
          </div>

          <div
            style={{
              display: "flex",
              border: `2px dashed ${MINT}`,
              borderRadius: "8px",
              padding: "9px 15px",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: MINT,
              backgroundColor: MINT_SOFT,
              transform: "rotate(-6deg)",
            }}
          >
            HARGA TERBUKA
          </div>
        </div>

        {/* Judul */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "30px",
            fontFamily: DISPLAY,
            fontSize: "66px",
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            color: INK,
          }}
        >
          <div style={{ display: "flex" }}>Tugas kuliah beres,</div>
          <div style={{ display: "flex", marginTop: "2px" }}>
            <span
              style={{
                display: "flex",
                backgroundColor: STABILO,
                padding: "2px 12px",
                borderRadius: "10px",
              }}
            >
              harga kelihatan di awal.
            </span>
          </div>
        </div>

        <div style={{ marginTop: "16px", fontSize: "18px", fontWeight: 400, color: INK_SOFT }}>
          Hitung sendiri sebelum chat — tanpa akun, tanpa tawar-menawar.
        </div>

        {/* Fakta + nota contoh */}
        <div style={{ display: "flex", gap: "30px", marginTop: "30px", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "14px" }}>
            {FAKTA.map((f) => (
              <div
                key={f.judul}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderLeft: `3px solid ${f.warna}`,
                  paddingLeft: "12px",
                }}
              >
                <div style={{ fontSize: "15px", fontWeight: 700, color: INK }}>{f.judul}</div>
                <div style={{ marginTop: "2px", fontSize: "12.5px", color: MUTED }}>{f.isi}</div>
              </div>
            ))}
          </div>

          {/* Nota contoh: meniru tampilan nota di situs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "322px",
              padding: "16px 18px",
              backgroundColor: "#ffffff",
              border: `1px solid ${LINE}`,
              borderRadius: "12px",
              boxShadow: "0 18px 30px -18px rgba(16, 26, 51, 0.5)",
              transform: "rotate(1.5deg)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.22em", color: MUTED }}>
                NOTA PESANAN
              </div>
              <div
                style={{
                  display: "flex",
                  border: `1px solid ${LINE}`,
                  borderRadius: "4px",
                  padding: "2px 5px",
                  fontSize: "9px",
                  fontWeight: 800,
                  color: INK_SOFT,
                }}
              >
                MJ
              </div>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "10px",
                marginBottom: "10px",
                borderTop: `1px dashed ${LINE}`,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: INK }}>Parafrase</div>
              <div style={{ marginTop: "2px", fontSize: "11px", color: MUTED }}>
                1.000 kata · tenggat 4–6 hari
              </div>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "10px",
                marginBottom: "10px",
                borderTop: `1px dashed ${LINE}`,
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", color: MUTED }}>
                TOTAL
              </div>
              <div style={{ fontSize: "19px", fontWeight: 800, color: INK }}>Rp 30.000</div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginTop: "4px",
              }}
            >
              <div style={{ fontSize: "10px", color: MUTED }}>DP 50%</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: INK_SOFT }}>Rp 15.000</div>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "10px",
                paddingTop: "8px",
                borderTop: `1px dashed ${LINE}`,
                fontSize: "10px",
                fontWeight: 700,
                color: MINT,
              }}
            >
              Termasuk 2× revisi · file sumber
            </div>
          </div>
        </div>

        {/* Daftar harga */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "34px",
            paddingBottom: "10px",
            borderBottom: `2px solid ${INK}`,
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.2em", color: INK }}>
            DAFTAR HARGA
          </div>
          <div style={{ fontSize: "12px", color: MUTED }}>selalu dengan satuan</div>
        </div>

        <div style={{ display: "flex", gap: "38px", flex: 1, marginTop: "6px" }}>
          {[KIRI, KANAN].map((kolom, index) => (
            <div
              key={index}
              style={{ display: "flex", flexDirection: "column", flex: 1 }}
            >
              {kolom.map((baris) => (
                <div
                  key={baris.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    flex: 1,
                    padding: "21px 0",
                    borderBottom: `1px dashed ${LINE}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        width: "8px",
                        height: "8px",
                        borderRadius: "999px",
                        backgroundColor: aksenLayanan(baris.id).hex,
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ fontSize: "20px", fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>
                        {baris.label}
                      </div>
                      <div style={{ fontSize: "12px", color: MUTED }}>{baris.satuan}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", fontSize: "20px", fontWeight: 800, color: INK }}>
                    {baris.harga}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Catatan kecil: menjawab keraguan yang biasanya muncul sebelum chat */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
            marginTop: "20px",
            padding: "16px 18px",
            backgroundColor: "#f4f1e8",
            borderRadius: "10px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", color: INK_SOFT }}>
              TOTAL DIBULATKAN
            </div>
            <div style={{ marginTop: "3px", fontSize: "12px", color: MUTED }}>
              ke kelipatan Rp 500 terdekat
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", color: INK_SOFT }}>
              HARGA TERKUNCI
            </div>
            <div style={{ marginTop: "3px", fontSize: "12px", color: MUTED }}>
              setelah file kamu dicek
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", color: INK_SOFT }}>
              TANPA BIAYA ADMIN
            </div>
            <div style={{ marginTop: "3px", fontSize: "12px", color: MUTED }}>
              bayar sesuai nominal nota
            </div>
          </div>
        </div>

        {/* Alur ringkas: satu baris, bisa dibaca dari jauh */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "18px",
          }}
        >
          {["Hitung biaya", "Kirim ke WhatsApp", "Bayar DP 50%", "Terima file"].map((tahap, index) => (
            <div key={tahap} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "22px",
                  height: "22px",
                  borderRadius: "999px",
                  backgroundColor: "#e7eaff",
                  color: BRAND,
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                {index + 1}
              </div>
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: INK_SOFT }}>{tahap}</div>
            </div>
          ))}
        </div>

        {/* Kaki */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "22px",
            paddingTop: "20px",
            borderTop: `2px solid ${INK}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: MUTED }}>
              HITUNG SENDIRI
            </div>
            <div style={{ marginTop: "4px", fontSize: "20px", fontWeight: 700, color: INK }}>
              masjoki.vercel.app/hitung
            </div>
            <div style={{ marginTop: "6px", fontSize: "16px", fontWeight: 800, color: MINT }}>
              {`WhatsApp ${pembayaran.nomor}`}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: INK_SOFT }}>
              ShopeePay · GoPay · DANA
            </div>
            <div style={{ marginTop: "4px", fontSize: "12px", color: MUTED }}>
              DP 50% dulu, lunas setelah selesai
            </div>
            <div style={{ marginTop: "4px", fontSize: "12px", color: MUTED }}>
              File sumber .docx / .pptx
            </div>
          </div>
        </div>
      </div>
    </div>,
    { ...size, fonts: fonts.length > 0 ? fonts : undefined, headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" } }
  );
}
